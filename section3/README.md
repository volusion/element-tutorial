# Block UI and configuration

In the [previous section][section2] we fetched some data that is ready to be used
in our block.

In this part of the tutorial, we are adding a more compelling UI to our block. For
this, we are focusing our work in the `render` method of the React component and 
we will see how we can split our code internally for better organization.

Let's start reviewing what we ended up with in the last section:

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

The Product Details block we are building contains a carousel of images, a product title, 
a description and a price, plus some actions (increment and decrease quantity, add 
to cart).

Let's modify our render function to start accommodating all the pieces:

```js
render() {
    const { productLayout, data } = this.props;
    const { name, price, description, images } = data.product;
    return (
        <section
            className={`cf pa4 ph6-l ${css(classes.productDetails)}`}
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
                        productId={this.state.product.id}
                    />
                </React.Fragment>
            </div>
        </section>
    );
}
``` 

Let's see what's going on in our new render method:

```js
const { productLayout, data } = this.props;
```

Here we are getting a new `prop` called `productLayout`. This prop is a configuration
object to let the user show the images to the right or left of the block. We should not
forget to add this prop into the `configSpec` object:

```js
const configSpec = {
    productId: VolusionPropTypes.string.isRequired,
    productLayout: VolusionPropTypes.oneOf(['left', 'right']).isRequired,
    color: VolusionPropTypes.shape({
        background: VolusionPropTypes.color.isRequired
    }).isRequired,
};
```

We are using `VolusionPropType.oneOf` that lets us specify an array of options. In the 
Site Designer, users will see a dropdown list with the provided options.

We also added a color property as a shape to control the background color of the block.

Next, we have our opening block wrapping tag:

```js
<section className={`cf pa4 ph6-l ${css(classes.productDetails)}`}>
```

The funny-looking class names are Tachyons classes. Remember to check the [docs][tachyons] 
to understand more about how Tachyons works. We are concatenating them to the result 
of calling the `css` function with a `classes` variable that we haven't defined yet.

Let's define the classes variable now:

```
import styles from './styles';
 
const factory = (
    { React, VolusionPropTypes, Components },
    utils,
    { StyleSheet, css },
    globalStyles,
    blockConfig
) => {
    const classes = StyleSheet.create(styles(globalStyles, blockConfig));
```

We are importing the `styles` function and calling the `StyleSheet.create` function to generate
the class names based on `globalStyles` and `blockConfig`.

The styles function should be defined in the **src/Block/styles.js** file:

```js
export default (global, block) => {
    return {
        productDetails: {
            fontFamily: global.typography.fontFamily,
            color: global.color.text,
            background: block.color.background
        }
    };
};
```

We are defining a `productDetails` property with some CSS properties. Some of them depend
on the `global` parameter and others on the `block` parameter. You can see that `block.color.background`
is the configuration defined in our `configSpec`.

Back in our render method, we have more to analyze:

```js
<div
    className={`${this.getLayoutClasses(
        productLayout
    )} w-50-l pa2`}
>
```

A method named `this.getLayoutClasses` is called with the `productLayout` configuration. We need
to define that method inside our React component:

```js
getLayoutClasses = layout => {
    const base = 'fn';
    const layouts = {
        left: 'fl-l',
        right: 'fr-l'
    };

    return `${base} ${layouts[layout]}`;
};
```

Based on the layout (`productLayout`) we just picked the right Tachyons class name to return a string
and use it in the `className` attribute.

Next we have a component that we haven't defined yet:

```js
<ImageSlider
    images={images}
/>
```

This is interesting. We decided to divide our main block render method into smaller components,
just to keep our code cleaner. You can adopt any coding convention you want. For educational purposes,
let's define this component. First, let's create the folder **src/Block/components/ImageSlider**. We are
not including the full code of each component, but you can take a look at the source [here][block].

Once we define the component, we can import it and create an instance of it:

```js
import styles from './styles';
import { ImageSliderFactory } from './components/ImageSlider';

// Code omitted

const configSpec = {
    productId: VolusionPropTypes.string.isRequired,
    productLayout: VolusionPropTypes.oneOf(['left', 'right']).isRequired,
};

const ImageSlider = ImageSliderFactory(
    React,
    utils,
    { StyleSheet, css },
    globalStyles,
    blockConfig
);

const block = class extends React.Component {
```

Please note that the `ImageSliderFactory` has the same signature as our main Block. In this way, we 
can use the same arguments from the internal components.

Let's keep exploring our `render` method:

```
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
        productId={this.state.product.id}
    />
</React.Fragment>
```

Basically, we are using some new components: `Name`, `Price`, `Description` and `Controls`. There is
nothing special about them, we just decided to divide up our block by these components. We can
encapsulate, for example, some formatting logic in the `Price` component and so on. Remember that the
code for all of them is available [here][components].

To start using them, we just need to import them and call the factory function they expose:

```js
import { NameFactory } from './components/Name';
import { PriceFactory } from './components/Price';
import { DescriptionFactory } from './components/Description';
import { ControlsFactory } from './components/Controls';
import { ImageSliderFactory } from './components/ImageSlider';


const factory = (
    { React, VolusionPropTypes, Components },
    utils,
    { StyleSheet, css },
    globalStyles,
    blockConfig
) => {
    const classes = StyleSheet.create(styles(globalStyles, blockConfig));
    const Name = NameFactory(React);
    const Price = PriceFactory(React);
    const Description = DescriptionFactory(
        React,
        { StyleSheet, css },
        globalStyles
    );
    const Controls = ControlsFactory(
        { React, VolusionPropTypes, Components },
        utils,
        { StyleSheet, css },
        globalStyles
    );
    const ImageSlider = ImageSliderFactory(
        React,
        utils,
        { StyleSheet, css },
        globalStyles,
        blockConfig
    );
```

As you can see, in the case of `Name` and `Price` we are only sending the `React` argument. Our component
definition doesn't need any more than that, so there is no need to send all of the arguments.

Lastly, let's update our `defaultConfig` to reflect the default value we want for our configuration:

```js
const defaultConfig = {
    productLayout: 'left',
    color: {
        background: 'transparent'
    }
};
```

You should be able to see in your browser a nice looking product details block.

If you open the file **local/index.html** you can change the default value of `productLayout` and see
how our product layout changes in the browser window:

```js
props: {
    productId: "5b35041787f326037c49f87d",
    productLayout: 'right'
}
```

Before we move to our next section, please take a moment to check how we use a button component
in the **src/Block/components/Controls/index.js**:

```js
export const ControlsFactory = (
    { React, VolusionPropTypes, Components },
    utils,
    { StyleSheet, css },
    globalStyles
) => {
    const classes = StyleSheet.create(styles());
    const Button = Components.Button.factory(
        { React, VolusionPropTypes },
        { StyleSheet, css },
        globalStyles
    );
```

There, we are using the `Components` parameter to create an instance of a button component by
running `Components.Button.factory`. The signature of this function is the same as we are used to seeing.

Lastly, we can use the button in the render method of the component by calling the returned
component:

```js
<Button.component ...></Button.component>
```

Remember that the components can be configured across all the pages in a theme using a single
form. This lets users customize the look and feel of components across multiple Blocks.


## Next section

In the [next section][section4], we will see how to publish and use our block from the Site Designer
to be used in a storefront. 

 
[section2]: ../section2/README.md
[section4]: ../section4/README.md
[tachyons]: https://tachyons.io/docs/table-of-properties/
[block]: ../code/src/Block/components/ImageSlider/index.js
[components]: ../code/src/Block/components
