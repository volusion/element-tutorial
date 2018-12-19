# `utils` docs

This document describes the `utils` parameter used in the blocks `factory` function, as
seen here:

```js
const factory = (
    { React, VolusionPropTypes, Components },
    utils,
    { StyleSheet, css },
    globalStyles,
    blockConfig
) => {
```

## `utils.addAmpScript(name: string): void`

Injects an AMP script to the page.

*name*: The name of the script to inject. Valid names:

- `amp-bind`
- `amp-analytics`


## `utils.addScript(url: string): void`

Add a script at server side render time to the head of the HTML document. The script will
be added with the `async` attribute.

*url*: The URL of the JavaScript file to add.


## `utils.canonicalUrl(query?: Object): string`

Returns the canonical URL of your store appending the query string represented by the
query parameter.

*query (Optional)*: Object containing the parameters we want to add to the canonical URL.

Example:

```js
const url = utils.canonicalUrl({
  param1: 'value',
  param2: 'value2'
});

console.log(url); // https://your-store-domain/current_page?param1=value&param2=value2
```

## `utils.client: Object`

See full documentation [here][volusion-api-client]


## `utils.events: Object`

Object with the events that can be used for interblock communication.

The shape of the `events` object is:

*`cart.addToCart: string`*

Used to add a product to the cart. The expected payload is:

```js
{
  productId: "the_product_id",
  quantity: 4 // The number of items of productId to add to the cart
}
```

Example:

```js
utils.pubSub.publish(utils.events.addToCart, {
    productId: "an_id",
    quantity: 5 
});
```

*`cart.openCart: string`*

Used to open the cart. No payload expected.

Example:

```js
utils.pubSub.publish(utils.events.openCart);
```


## `utils.isAmpRequest: boolean`

Boolean that tells if the request is AMP or not. See the [AMP section][amp] for more details on how to
use this.


## `utils.pubSub: Object`

Object used for interblock communication. The exposed functions in this object are:


*`publish(event: string, payload: Object)`*

Publish an `event` using the `payload` object.

Example:

```js
utils.pubSub.publish(utils.events.addToCart, {
    productId: "an_id",
    quantity: 5 
});
```

*`subscribe(event: string, callback: Function): string`*

Subscribe to an `event` and react with the provided `callback`. Returns a token string used to
unsubscribe to the event.

Example:

```js
utils.pubSub.subscribe(
    utils.events.cart.addToCart,
    this.onAddToCart
);
```

*`unsubscribe(token: string): void`*

Unsubscribe to an event by using the `token` provided by `pubSub.subscribe`

Example:

```js
const token = utils.pubSub.subscribe(
    utils.events.cart.addToCart,
    this.onAddToCart
);

utils.pubSub.unsubscribe(token);
```


[volusion-api]: ../volusion-api-client
[amp]: ../amp-section
