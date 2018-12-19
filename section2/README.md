# Communicating with the Volusion API

In this section, we are adding custom code to our starter block to make it
more interesting. Before we start, let's see a picture of what we are trying to
build:

![Product details block][product-details]

This block covers a very common use case of an e-commerce store. The block, let's
name it Product Details block, shows the information of the product, some images
and the option to change the quantity we want to add to the cart.

Before considering the UI, we need to think about how are we getting the information we
need to display the content in the block. 

As you might have already noticed, this block is capable of showing the info of any
product. We just need to receive as a configuration some identifier of the product
we want to show. Fortunately for us, we have a mechanism to do just that. So
let's start by modifying our `configSpec` to look like this:

**src/Block/index.js**

```js
const configSpec = {
    productId: VolusionPropTypes.string.isRequired,
};
```

Nice. This makes sense. The block needs to have the id of the product that we want
to show. We need to let the user specify that product as a configuration parameter. 

But something is missing. We don't want the user to specify a fixed value for the
`productId`, we want that configuration to vary somehow. Well, it turns out that even
with that fact, we can still specify the `productId` as a normal string value. We will
see how this is done later on in this tutorial. For now, we don't need to worry about
that.

So now that we have the productId, let's see how can we use it to get the data we need.

## The `getDataProps` function

In the previous [section][section1], we explored the shape of the `getDataProps` function. 
Let's see it again:

**src/Block/data/index.js**

```js
const getDataProps = (utils, props) => {
    return Promise.resolve({});
};
```

The function returns a promise with an empty object by default. Now we need to return the 
product data from this function. To do that, we are going to use the `utils` object
that the function receives as parameter. 

```js
const getDataProps = (utils, props) => {
    return utils.client.products.getById(props.productId).then(product => {
        console.log(product);
        return {
            product
        };
    });
};
```

We are accessing the `utils.client.products` object to call the `getById` function and pass in
the `props.productId`. As you see, we have in the `props` parameter a populated object with
the configuration we defined in `configSpec`. We also added a temporary `console.log` statement
for debugging purposes.

In order to test our progress locally, let's open the `local/index.html` file to provide
our block with the new `productId` configuration.

**local/index.html**

Let's change this:

```js
props: {
    queryParams: {},
    color: {
        background: 'yellow'
    },
    text: "My text"
}
```

To this:

```js
props: {
    productId: "5b35041787f326037c49f87d"
}
```

If you check your running service (generally at `http://localhost:4000`) and open the console tools,
you should see a log with an object containing the information of the product. The id we chose is from a
product available in the configured `tenantId`, as seen in the `index.html` file:

```js
window.ElementSdk.client.configure({
    tenant: "5b328aba89ed0900015acbcc"
});
```

If you want to test your local block with your own store, just replace the `tenant` with your store's ID.

We still have something to deal with. When the block users are installing the block on their themes, they
won't have a `productId` to use, and even if they do, it would be bad UX asking users to provide
the `productId`. It would be nice, if in the `Site Designer`, we could show one of the products that
the user has configured in the store. Let's do that:


**src/Block/data/index.js**

```js
const getDataProps = (utils, props) => {
    if (utils.isRendering && props.productId) {
        return utils.client.products.getById(props.productId).then(product => {
            return {
                product
            };
        });
    } else {
        return utils.client.products.search({}).then(response => {
            return { product: response.items[0] };
        });
    }
};
```

In the previous snippet, we added a condition checking if the block `isRendering` and
we have a `productId` defined. Remember that we haven't set a default value for
`productId` in our block, so when the user installs the block, that configuration will be
empty. With this condition we are only searching for a particular `productId` if we received
the `prop`. In the `else`, we are just searching for all products and getting the first one. In
this way, we have something to show in our block even when the `productId` is not defined.

If you want to test this, edit your **local/index.html** and remove the `productId` prop we
added a moment ago. You should see the block working.

Great, we have some data that we can use in our block. Let's remove the component boilerplate and display
some product information.

**src/Block/index.js**

This is our current `React` component definition:

```js
const block = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    static defaultProps = defaultConfig;

    click = () => {
        this.setState({ count: ++this.state.count });
    };

    render() {
        return (
            <div className={css(classes.div)}>
                {this.props.text}{' '}
                <Button.component onClick={this.click}>
                    Click me {this.state.count}{' '}
                </Button.component>
            </div>
        );
    }
};
```

We can remove things like `state` as we don't need it yet. So our basic implementation will look like
this:

```js
const block = class extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
    }

    static defaultProps = defaultConfig;

    render() {
        const { product } = this.props.data;
        return (
            <div>
                <p>{product.name}</p>
                <p>{product.price}</p>
            </div>
        );
    }
};
```

You should see the product name and price in the browser.

You might be wondering, what is that magic `data` prop that we have in the `this.props`
class attribute. Well, everything you return from the `getDataProps` function is available for
you to use in the `this.props.data` object. Similar to React's PropTypes validation, you can 
define the shape of the object you are returning from the `getDataProps` function.

```js
const configSpec = {
    productId: VolusionPropTypes.string.isRequired,
    data: PropTypes.shape({
      product: PropTypes.shape({
        name: PropTypes.string,
        price: PropTypes.number
      })
    })
};
```

Remember that this is entirely optional. We are mixing `VolusionPropTypes` and `PropTypes` inside
of the `configSpec`. Be careful, though, as only `data` and `queryParams` objects are allowed to
be `PropTypes` inside the `configSpec` object. The `data` and `queryParams` properties  won't be presented
to the user as configurable options.


## Next section

In the [next section][section3], we will add more UI elements to our new block and will
add more configurations to the `configSpec` object. 



[product-details]: ./images/product-details.jpg "Product details block"
[section1]: ../section1
[section3]: ../section3
