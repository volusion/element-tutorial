# `utils` parameter of `getDataProps` function

This document describes the `API` of the `utils` parameter.


## `utils.get(name: string): string`

Function to get the value of a cookie with the provided `name`


## `utils.set(name: string, value: string): void`

Function to create a cookie with `name` and `value`


## `utils.addAmpScript(name: string): void`

Adds AMP script with the provided `name`. See [block utils docs][utils-block]


## `utils.addScript(url: string): void`

Adds script with `url` to the head of the document. See [block utils docs][utils-block]


## `utils.canonicalUrl(query?: Object): string`

Returns a store URL with a query string. See [block utils docs][utils-block]


## `utils.isAmpRequest: boolean`

Returns `true` if the request is AMP. See [block utils docs][utils-block]


## `utils.queryParams(): Object`

Returns an object with the query parameters of the current request.

Example:

For a request with the url `http://www.store.com?param=1&param2=2`

```js
console.log(utils.queryParams());
{
    param: 1,
    param2: 2
}
```

## `utils.seo(): Object`

Return an object with helpful functions for SEO as documented below.

*`utils.seo().setTitle(title: string)`*

Sets the title of the page to the provided `title`

*`utils.seo().setDescription(description: string)`*

Sets a description to be used in the meta description using the `description` parameter.


## `utils.client`

See the [Volusion API client][volusion-api] documentation.


[utils-block]: ../utils-block
[volusion-api]: ../volusion-api-client


