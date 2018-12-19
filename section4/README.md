# Publishing and using the block

In this section, we will learn how to publish and use the block we created during
the tutorial. We will introduce the **Site Designer**, a web interface
that facilitates the process of testing blocks and building themes.


## Publishing the block

To publish the block, we need to use the `element` cli. Make sure you are at the root 
of the block folder. Then, run the following command:

```bash
npm run build
```

By default, we run the test suite located at **test/Block.spec.js**. Given our changes,
the test block should be failing now. We encourage you to fix and adapt the test to our 
new block changes. It's worth mentioning that we are using [Jest snapshot testing][jest],
so if you see an error related to a mismatch in the snapshot, you can run the following
command:

```bash
npm test -- -u
```

The previous command will accept the change of the snapshot. This is useful to avoid accidental
modifications of the block UI.

Additionally, if you don't want to deal with tests, at least not for now, you can also run
this command to build without running tests:

```bash
npm run build:no-test
```

Then, we are ready to publish the block. If you want to publish an image of the block
to display in the *Site Designer*, just add a file in the root of the block repository called
*thumbnail.png*. *Rectangular images under 128KB work best.* When we publish the block, the 
image will be uploaded to the server. 

```bash
element publish -n "Awesome Product Details"
```

The system will ask you for the category you want to assign to the block. As our block
is related to products, pick the category `Products` using your up/down arrows and
hit enter:

```bash
element publish -n "Awesome Product Details"
? Select the Category that best fits this block: 
  Hero Image Banners 
  Image Gallery 
  Misc 
❯ Products 
  Promos & Announcements 
  Services 
  Testimonials 
```

You will see a green message telling you that the process succeeded. The system will
generate a file called `.volusion-block`. Make sure you *check-in* this file into
your repository. In this way, you can make updates to the block using the generated ID.

Also note that *blocks are private by default*, this means, that they will only be visible
from the *Site Designer* to you or members of your organization. Later on we will see how to make a block
visible to the public. 

## Our first theme

We are now ready to access the *Site Designer* and take a look at the options it 
has to offer.

To access, use your store credentials [here][login].

Make sure you add some products to your store by using the `Products` section in the
left menu. Don't spend too much time on this, just create them with a couple of images, name
and price.

Then, again in the left menu, find the option `Designer` to launch the *Site Designer*.

The system will show you a list with your themes. You probably will not have any themes at this point.
You might be asking yourself depending on your interests, "but, wait a minute, I don't want to
build a theme, I just want to test my block!". And that's a valid question to ask, but
if you are not into the theme game, you can still test your block in a theme. Keep
in mind that blocks are meant to be used in themes, so you need to make sure that
your block works well in a theme context.


![theme-list][one]


Then, just click the `Create a New Theme` button, add a name, and leave the toggle set on private.

The next screen is your theme creation canvas. You will see options to add pages, add
sections to pages, and pick the blocks you want to add to the sections.  


![theme-canvas][two]


As you can see, we have two pages by default, `home` and `404`. Those two pages are mandatory
in a theme, but you can create as many pages as you want.

Let's add a products page. Remember that our block is dynamic, capable of showing
multiple products. We will reflect that in the our new page URL:


![theme-canvas][three]


In the `Page Path` field, we are using `/product/:id`. The `:id` part is expressing the
varying nature of our page. Notice the similarity with your favorite web app router library.
We will be using the `:id` read from the page URL as the `productId` in our block configuration.
But first, let's add our block to the page.

Click on the `Add Section` button, pick the block `Awesome Product Details` under the
`Products` category and you will be able to see one of your products on the screen.


![block-added][four]


If you click the pencil in the top left corner of the block, you will be able to view
the configuration options. Remember that the configuration form is generated from the
`configSpec` object in our block definition. The following image shows the block with
a bright orange background. Feel free to play with the form to see the changes applied in
realtime to the block on the right.


![block-config][five]


You can always undo or redo multiple actions by clicking the Undo/Redo buttons located near
the top right corner (They only appear after the user takes an action).

## Updating blocks

If you want to test an update to the block code in the *Site Designer*, make your changes
to the code locally and run the following commands:

```bash
npm run build
element update
```

Or, if you are not writing tests:

```bash
npm run build:no-test
element update
```

Then go to the *Site Designer* and reload the page. 


## Connecting the block with other pages

Even if you are building a single block instead of a full theme, you might find it useful
to test your block in connection with other pages. One good example of this is
precisely the Product Details block we have been developing. If you recall, we created our 
block in a page with the path `/product/:id`. This means, that somehow, the system should 
generate the final path, with the `:id` placeholder replaced with the actual `productId`.

Thinking a bit more about this, it would be awesome to have a page where all products are 
listed, and when you click on them, the user is taken to the page of that particular 
product. Turns out that we can do that by using Volusion's free blocks.

In the Pages dropdown list, select the `Home` page, and add a block called `Basic Product List`
that is under the same `Products` category. 

You should end up with something like this, but with your products:

![product-list][six]


Feel free to play with this block configuration. At this point, we are really only interested
in one of them, called `Product Link`. This configuration is asking us for the link that
the block should use for each product. We need to use the `/product/:id` path that
we used to create the Product Details page.


![product-list-config][seven]


**Product Link value**: `/product/[id]` 

The syntax is a bit different but basically we are saying: *For each element in the collection
of products, use the `id` attribute that each element has, and build the link interpolating that
value into the `[id]` placeholder*. This is something really simple but truly powerful. We are
not making any assumption on the path names that a merchant wants for a store and we can connect
pages using this technique. 

Finally, we need to go back to our block located in the `Product Details` page, and change our
`productId` to its final value:


![product-details-config][eight]


**`productId` value**: `pageVar:id`

Remember that in our `Product Details` page, we are expecting a path of the form `/product/:id`.
As we already saw, the `Product List` block is sending us that, so the last part is to
say that we want to use as our `productId` the `pageVar` with the name `:id`. 

`pageVar` is a reserved word in block configurations that can be used to read values
interpolated in the URL.

The following table summarizes the connection between the home page and the product details page:

|          | Home Page | Product Details Page |
|--------- |--------- | ----------- |
| *Path* | / | /product/:id
| *Block* | Product List  | Awesome Product Details
| *Property* | Product Link | Product Id
| *Value* | `/product/[id]` | `pageVar:id`


## Testing the theme online

So far, we have only created the pages we want and put some blocks on them. But it would be nice to
test our theme as a real webpage. To do that, we need to assign to our store the theme we want
to use and then we can use the temporary domain that Volusion offers to each store to see
our theme live.

Once you have that, access your store at:

`https://your-store-name.zero.myvolusion.com` 

## Making your block public

When you are ready to make your block public, just run:

```bash
element update -p
```


## Next steps

Next, you can play with the global configurations to see how they affect all pages and blocks. Take
the time also to see how you can globally customize all the buttons of the app from a single 
configuration form.

We hope you have enjoyed the journey of creating your first block and theme for the Volusion Platform!
From here, you should be able to start building and testing amazing blocks and themes. If you need
assistance, please don't hesitate to ask for help by opening an issue in this repository.



[jest]: https://jestjs.io/docs/en/snapshot-testing
[login]: https://www.volusion.com/login
[one]: ./images/one.jpg
[two]: ./images/two.png
[three]: ./images/three.png
[four]: ./images/four.png
[five]: ./images/five.png
[six]: ./images/six.png
[seven]: ./images/seven.png
[eight]: ./images/eight.png
[asking_for_help]: TODO_to-be-defined
