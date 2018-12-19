# The Block Starter

We have created a starting point to develop blocks, so you don't have to start from
scratch. Our block starter project creates all the boilerplate needed so you can
focus on the fun parts. In order to use the block starter project and other features,
we need to install the `element` cli. We will explain how to obtain the
CLI in the next section.


## The CLI

To obtain the CLI, run the following commands in your terminal:

```bash
npm install -g @volusion/element-cli
```

Once you are done, you should be able to see the CLI installed in your system. Let's
verify that everything is ok by running:

```bash
element --version
```

You should see the version of the cli displayed in your terminal. You can also pass
the `--help` option to see the available options. For now, we are just interested in 
the following commands:

```
  Commands:

    login              Log in using your Volusion credentials
    new <name>         Creates the block boilerplate
```

Let's start by authenticating your system using your Volusion credentials. Remember to
use the same credentials you use to access [Volusion Store Admin][admin]. To authenticate,
just run `element login`. The system will ask for your username and password.


## Creating the block starter

To use the block starter, we need to run `element new <name>`, where `<name>` is the name
of the folder where your block will live in. We recommend to use a nonexistent folder. The
cli will create the folder for you.

Let's try it out:

```bash
element new MyFirstBlock
```

Now, you will see a folder called `MyFirstBlock`. In the following section, we will study the
structure of the Block starter project.


## The block starter structure

Let's examine the structure of the [block starter][starter].

```
MyFirstBlock/
├── README.md
├── jest-runner-eslint.config.js
├── jest.config.js
├── local
│   └── index.html
├── package-lock.json
├── package.json
├── rollup.config.dev.js
├── rollup.config.js
├── rollup.config.prod.js
├── src
│   ├── Block
│   │   ├── data
│   │   │   └── index.js
│   │   ├── index.js
│   │   └── styles.js
│   └── index.js
└── test
    ├── Block.spec.js
    └── __snapshots__
        └── Block.spec.js.snap
```

This may seem like a lot, but many of the files you see there are just boilerplate to build and test
your block. You won't need to deal with the boilerplate, so let's focus on the main folder:

```
├── src
│   ├── Block
│   │   ├── data
│   │   │   └── index.js      -- A great location to add API calls and other goodies.
│   │   ├── index.js          -- The main block file. You will be adding lots of code here.
│   │   └── styles.js         -- Contains the block styles as a javascript object.
│   └── index.js              -- This is the block entrypoint. You don't need to modify it.
```

Let's review the files one by one, to give a bit more context:

### src/index.js

You don't need to modify this file, but understanding it will give a better idea of what 
you are building. Let's take a look:

```js
import { factory, defaultConfig } from './Block';
import { getDataProps } from './Block/data';

export { factory, getDataProps, defaultConfig };
```

As you can see, we are just importing the `src/Block/index.js` and the `src/Block/data/index.js`
to export from them the important parts. So a block is basically a `factory` function that
will build your block both in the server and in the browser (Yes, blocks are Server side rendered,
too), a `defaultConfig` object, specifying the default configuration of your block and a 
`getDataProps` function that will be executed before we create the Block to provide it with the 
required data to render itself.

### src/Block/index.js

This is the main Block file. Most of your development will be placed here, but you don't need to.
You can create other files and folders and import them from this file.

Let's analyze the important bits of this file.

**The factory function signature**

The factory function looks like a scary function, but it's actually very simple:

```js
const factory = (
    { React, VolusionPropTypes, Components },
    utils,
    { StyleSheet, css },
    globalStyles,
    blockConfig
) => {
```

Let look at each parameter one by one:

**React: The framework we use to build the block**

Right now we are using React, but we can inject any framework in the future.

**VolusionPropTypes: A handy object to specify block configuration**

An object similar to React's Proptypes that let you easily specify what
configurations your block receives. After you determine the properties you want to 
allow your users to customize, Site Designer will automatically build a form for your 
users to be able to configure your block. 

**Components: Components that we can use inside our blocks, like Buttons & Inputs**

In a store theme, it's natural to have elements shared between blocks. A button is
a good example of this. A user might want to have buttons look the same across
all blocks. The user can configure globally how all buttons look.

**utils: Utilities for retrieving data and connecting blocks together**

The `utils` object provides access to the Volusion API, to a transport function to make
HTTP requests in a universal way (server and browser), a PubSub mechanism for intrablock 
communication and many others. Follow [Utils documentation][utils] for more info.       

**StyleSheet: The main Aphrodite CSS framework object**

In general, you will only use `StyleSheet.create` to generate CSS that works both on 
the server and in the browser. More info [here][aphro].

**css: Aphrodite utility function**

Used to create the class names of the styles you are applying to your DOM elements.

**globalStyles: Styles defined at the Theme level that can be used in all blocks**

Examples: Font families, heading size, background color, font color.

**blockConfig: The fully populated config object as specified with VolusionPropTypes**

If a user does not configure your block, then this will be your `defaultConfig`.


**Block configuration schema**

Another important part of the block file, is the block configuration schema. This is an
object that you define to let the users of your block configure aspects of its
appearance and behavior. 

Let's see how this object looks in our block starter:

```js
const configSpec = {
  color: VolusionPropTypes.shape({
    background: VolusionPropTypes.color
  }),
  text: VolusionPropTypes.string
};
```

If you are familiar with React, you can immediately notice the similarity with React's 
PropTypes package. The syntax is similar but we extended the available props. For example,
the `color` prop is introduced by our package to indicate that we want to let the user
pick a color for that particular configuration object.

When a user selects your block from the Site Designer (SD), we will let them configure it according to the
configuration schema you specified for your block. In the block starter example, the SD will
show a form with a section (`VolusionPropTypes.shape`) called `Color` with a color 
picker (`VolusionPropTypes.color`). As it is a shape, you can specify more configuration options 
wrapped in the `color` category or shape.

Additionally, the user will see a text input with the name `Text` where they can type in the
value they want for that particular configuration. 

To see all the available props we have, please visit [ElementPropTypes repo][element-proptypes].

**Block default configuration**

The idea of the `configSpec` is to let users configure their blocks. As a natural consequence,
you get to specify default values for those configurations to have a working (or close to working) block.
To express this default configuration, let's take a look at the following object, which is  present in 
the main block file:

```js
const defaultConfig = {
    color: {
        background: 'transparent'
    },
    text: 'Default prop'
};
```

The `defaultConfig` object has the same shape of the `configSpec`. Think of the `defaultConfig` as
the default values of the form generated to configure the block.

**The block itself**

As we saw in the factory function, the framework we are using to create blocks is React, but
we haven't talked a lot about it yet. The reason is that the use of React is very simple. Let's take
a look:

```js
const block = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           ... 
        };
    }

    static defaultProps = defaultConfig;

    render() {...}
};

```

That's really it. Just a simple React Component with a render function and some state.

Our storefronts have no global state. The state that each block need is self-contained, and block
communication happens though a simple PubSub mechanism exposed through the SDK. No need for state
managers like Redux or Mobx.


### src/Block/styles.js

In this file, we specify the styles of our block. In order to do that, we export a function
that receives the global styles (as explained in the factory function signature section) and
the block configuration. The styles are defined using the `CSS in JS` style, where you define
the styles as a JavaScript object. The fact that we are getting the block configuration and the
global styles gives us an additional power: we can define which styles to apply according
to the user configuration, or when to use global styles. Let's see:

```js
export default (global, block) => {
    return {
        div: {
            fontFamily: global.typography.fontFamily,
            fontSize: global.typography.baseFontSize,
            color: global.color.primary,
            backgroundColor: block.color.background
        } 
    };  
};      
```

Look how we decide to use global configuration for `fontFamily`, `fontSize` and `color` but
block configuration for `backgroundColor`. Remember that `block` here is basically the 
block configuration. If the user does not customize the block, `blockConfig` is equal to `defaultConfig`.

The return value of this function is an object with some properties that you can use to
generate the class names.

```js
const classes = styles(globalConfig, blockConfig);
...
<div className={css(classes.div)}>
```

This will generate the right class name for your DOM element, so you don't need to deal with
picking the right class name or dealing with CSS class naming conventions. 


### src/Block/data/index.js

The default content of this file is really simple:

```js
const getDataProps = (utils, props) => { 
    return Promise.resolve({}); 
};  
        
export { getDataProps };
```

The `getDataProps` function is a really powerful part of the block definition. This function is run
before the block is created, and this lets us fetch additional data from any resource we
need. It can be Volusion's API, or your own API. Note also how we receive the full props again.
This lets you conditionally fetch data depending on the block configuration.

This function returns a promise. As you see, we are returning an empty object. The structure
we return from this function will be automatically available for your blocks to use in the
render function. The following pseudo code will help you to understand a bit what we mean:

```js
getDataProps(utils, props).then(data => {
  const finalProps = {...props, data };
  ...
  <YourBlock {...finalProps} />

})
```

That's how your block will have access to the data structure you return from the `getDataProps`
function.

The `utils` parameter gives you access to the SDK and other goodies documented [here][getdataprops-utils].

In the next section, we will see how we can use this function to create amazing things.


## Running the block

It is time to finally run the block locally. You can see it in action on your computer. Follow the next 
steps. Make sure to be in the `MyFirstBlock` folder.

```bash
npm install
npm run start
```

You will see a browser window with the shiny block on it. Feel free to click on the button to see it 
in action.

Next, let's open the file `local/index.html` and find this section:

```js
props: { 
    queryParams: {}, 
    color: { 
        background: 'yellow' 
    }, 
    text: "Hello from prs" 
}
```

And change `text` with the value you want. You will see the change applied in the browser window. The `props`
object we just modified is just the `configSchema` with some values to test your block locally.

Take the time to read the index.html file. You will see all the concepts of this section used to locally
use and develop a block.


## Before we go: A note about AMP and Tachyons

Google is pushing hard on a technology called [AMP][amp]. In a nutshell, AMP is trying to deliver the fastest
web experiences to countries with slow connections using sophisticated cache networks and some hard restrictions
on how you build your webpages. Incredibly enough, the blocks you build are AMP friendly by default, and you
can deliver experiences that will benefit from the AMP technology without much effort. There is a [dedicated 
section][section-amp] on the considerations you need to have in order to keep your blocks AMP friendly.

One of the restrictions of AMP is that you can't reference any external CSS resource (in a `link` tag) and the total
amount of CSS inlined in the page can't be greater than 50kb. That's pretty hard to accomplish this days, isn't it?

To address this restriction, we adopted a CSS framework called [Tachyons][tachyons]. From their website:

> Create fast loading, highly readable, and 100% responsive interfaces with as little CSS as possible.

The Tachyons framework is globally available in all Volusion storefronts, so we really encourage you to use it
as much as possible inside your block development. The way that Tachyons is built facilitates the goal of
keeping the CSS as dry as possible, considering the fact that a page can be built from many different blocks of
different authors.


## Next section

In the [next section][section2], we will start modifying our starter block to do some more interesting things.


[admin]: https://www.volusion.com/login
[utils]: ../utils-block
[aphro]: https://github.com/Khan/aphrodite
[element-proptypes]: https://github.com/volusion/element-proptypes
[getdataprops-utils]: ./utils-dataprops
[amp]: https://www.ampproject.org/
[section-amp]: ../section-amp
[tachyons]: https://tachyons.io/
[section2]: ../section2
[starter]: https://github.com/volusion/element-BlockStarter
