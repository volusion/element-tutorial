# AMP considerations for block development

Before you start with this section, please complete the main [four sections][main] of
our tutorial.

## AMP support

By default, all our storefront pages have an AMP representation. If you inspect the code
of a storefront page, search for a link tag with `rel="amphtml"` and you will find the link of the
AMP representation of the page you are in.

## Google AMP considerations

In order to make a webpage AMP friendly, we need to sacrifice some conventions that we
normally use. For example, we can't include external CSS resources, we can't use any
external JavaScript and the `img` tag is prohibited. 

With those restrictions, it seems impossible to develop useful webpages. In order to
address these impositions, the AMP technology offers you a set of [curated scripts][amp-scripts] that
you are allowed to use.

As we have shown you, our blocks are built with JavaScript, but with AMP, we are not
allowed to use any third-party JavaScript code, including our own! This means that we
need to build two versions of our blocks or think of an easier solution.


## The solution

For the CSS constraint, we analyze all the blocks in a particular page, extract the used
CSS classes and inline them in a `style` tag, just as the AMP specification requires. There is
another restriction that the inlined CSS should be less than 50Kb. That's why we encourage you
to use the [Tachyons][tachyons] framework to reuse as much CSS as we can.

Additionally, we can't include any JavaScript files, so we can't run the block's JavaScript
files or frameworks. When an AMP pages is requested, we return just the markup plus the
valid AMP scripts. Right now we support the base AMP script, `amp-bind`, `amp-form` and 
`amp-analytics` scripts. In the end, the AMP version is basically an static
site without JavaScript behavior. We will see next how we handle the lack of interactivity
in our AMP storefronts.

## Adding interactivity without JavaScript

In our tutorial, we developed a `Product Details Block`. We created a control to increment or
decrement the quantity of the product we want to add to the cart. To do that, we created two buttons
with `+` and `-` labels. The problem is that with the AMP version we are not allowed to add any
JavaScript code, so our `onClick` functions won't work here.

What we will do then, is encode the action as a query parameter, and from the responsible block,
we will read that query parameter and act accordingly. The interesting part is that we will
redirect the user to the full version of the page, instead of the AMP one. Then we are again fully
interactive with the action we want applied.

Something like this will happen:

1. The user clicks on the `+` button.
1. The user is redirected to `http://canoncialurl/product/id?incrementQty`.
1. The `ProductDetailsBlock` will see the `incrementQty` parameter and perform the right action.


## The code

In the accompanying code of this tutorial we already have this implemented. Let's see how
that is done.

**code/Block/components/Controls/index**


```js
<a
    {...(utils.isAmpRequest
        ? {
              href: utils.canonicalUrl({
                  incrementQty: true
              })
          }
        : {
              onClick: this.incrementQty
          })}
    className={`outline-0 pointer f3 pv2 ph3 dib bt br bb bl-0 ${css(
        classes.qtyInputButton
    )}`}
>
    +
</a>
```

The snippet above shows the code of the `+` link. By reading the code we can see how we check
if the current request is AMP (`utils.isAmpRequest`). If it's AMP, we provide an `href` prop to
the link. This link redirects the user to the `canonical` site, using the `utils.canonicalUrl` function
which receives the action we want to encode in the query string. If it's not AMP, we use our
known `onClick` handler pointing to a method of the React Component.

What we want to do next is to read that query parameter from the same `Controls` component and
increment the quantity when we receive the parameter.

We can see that in the code:

```js
const component = class extends React.Component {
    state = {
        qty: this.setQuantity()
    };

    setQuantity() {
        if (this.props.decrementQty) {
            return 0;
        }

        if (this.props.incrementQty) {
            return 2;
        }

        return 1;
    }
```

You will notice that when we create the component, we call the `this.setQuantity` method to set the
right value of the input field, depending on whether or not we have the expected props (`incrementQty`).

We know which hardcoded values to send along to the interactive version of the page, because the AMP
version of the page will always start with a quantity of one. `incrementQty` will set the value to `2`, and
`decrementQty` to `0`.

The final piece we need to understand, is how the `Controls` component receives the `incrementQty` prop. We
can see that by looking at the main block file:

**code/Block/index.js**

```js
render() {
    const { productLayout, data, queryParams } = this.props;
    const { id, name, price, description, images } = data.product;
    const { incrementQty, decrementQty } = queryParams;
    return (
        <section
            className={`cf pa4 ph6-l ${css(classes.div)}`}
        >
            <div
                className={`${this.getLayoutClasses(
                    productLayout
                )} w-50-l pa2`}
            >
                <ImageSlider
                    images={images}
                />
            </div>
            <div
                className={`${this.getLayoutClasses(
                    productLayout
                )} w-50-l pa2`}
            >
                <React.Fragment>
                    <Name name={name} />
                    <Price price={price} />
                </React.Fragment>
               
                <React.Fragment>
                    <Description
                        description={description}
                    />
                    <Controls
                        onAddToCart={this.onAddToCart}
                        incrementQty={incrementQty}
                        decrementQty={decrementQty}
                        productId={id}
                    />
                </React.Fragment>
            </div>
        </section>
    );
}
```

In the `props` object, we are receiving a `queryParams` object. All blocks will receive this prop by 
default, populated with all the query parameters. In this case, we are just interested in
`incrementQty` and `decrementQty`. Finally, we pass those props to the `Controls` component.

If you want to test the full solution, go to your store domain, navigate to the product details page,
inspect the source code and follow the link with `rel=amphtml`. Then, click the `+` link and you will
see how you are redirected to the non-AMP version of the site with the quantity set to two. From there we
have the full storefront experience.


## Images

We already mentioned that the `img` tag is also prohibited with AMP. If you need to use images in your
blocks you should use the `amp-img` tag. You can find an example of this in the following file:

**code/Block/components/ImageSlider/ImageAlternates/index.js**

Particularly, focus your attention on the `getImage` function. Here we are again asking if we are in the
middle of an AMP request. If we are, we use the `amp-img` tag, but if we are not, we can use the known `img` tag:

```js
getImage = (image, index) => {
    if (!utils.isAmpRequest) {
        return (
            <img
                className={this.isSelected(index)}
                alt="Alternate"
                src={this.altImageUrl(
                    image.imagePath,
                    image.uriBase,
                    image.fullUri
                )}
            />
        );
    }

    return (
        <amp-img
            width="128"
            height="128"
            layout="responsive"
            class={this.isSelected(index)}
            src={this.altImageUrl(
                image.imagePath,
                image.uriBase,
                image.fullUri
            )}
        />
    );
};
```

## Validating AMP sites

In order to make sure that your site is valid for AMP, we can validate each page. To do that, follow the
next steps:

1. Access an AMP page of your store.
1. Append the string `#development=1` to the URL.
1. Open the Dev-tools (Chrome or Firefox).
1. Refresh the page.

You should see a message like the following in the browser console if your page is AMP validated:


![amp-validation][ampok]



[main]: ../README.md
[amp-scripts]: https://www.ampproject.org/docs/reference/components
[ampok]: images/ampok.png
[tachyons]: https://tachyons.io/
