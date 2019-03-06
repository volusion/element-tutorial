# Volusion API client

This document describes the exposed properties of the `utils.client` object to interact
with Volusion's API.


## `utils.client.products`

Exposes the following functions related to products:

### `getById(id: string): ProductResponse`

Gets a product given an ID.

### `getBySlug(slug: string): ProductResponse`

Gets a product given an SEO slug.

### `search(params: Object): PagedProductResponse`

Searches for products matching some criteria as provided in the `params` object 
that has the following shape:

```js
{
    query,     // The text to search
    page,      // The current page
    pageSize,  // The number of elements to return
    offset,    // Return products from the given offset; page will be ingored
    sort       // Product sort
}
```

### Responses

Next, you can see the shape of the product response, using `TypeScript` interface
syntax.

```ts
export interface ProductResponse {
    description: string;
    id: string;
    images: ProductImageResponse[];
    name: string;
    price: number;
    productVariantId: string;
    productVariants: ProductVariantsResponse[];
    listPrice?: number | null;
    salePrice?: number | null;
    seo_friendlyName: string;
    seo_metaDescription: string;
    seo_title: string;
    variantOptions: ProductVariantOptionsResponse[];
    variants?: string[];
}

export interface ProductImageResponse {
    description: string;
    id: string;
    imagePath: string;
    fullUri: string;
    title: string;
    uriBase: string;
}

export interface ProductVariantsResponse {
    id: string;
    images: ProductImageResponse[];
    isInventoryTracked: boolean;
    price: number;
    quantity: number;
    sku: string;
    variants: string[];
}

interface ProductPagedResponse {
    items: ProductResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface ProductVariantOptionsResponse {
    id: string | null;
    imageLinkIds: string[][];
    name: string;
    options: string[];
    order: number;
    priceDifferences: number[];
}
```


## `utils.client.cart`

Exposes the following functions to interact with carts:

### `create(): CartResponse`

Creates a new cart.

### `get(cartId: string): CartResponse`

Gets the content of a cart given the provided `cartId`.

### `getForShopper(cartId: string, shopperId?: string, shopperToken?: string): CartResponse`

If no `shopperId` or `shopperToken`, get a new cart without personal data. Otherwise, get latest cart for `shopperId`.

### `update(cartid: string, newQuantity: number, variantId: string): CartResponse`

Updates a cart (`cartId`) element (`variantId`) with a `newQuantity`.

### `add(cartId: string, productId: string, quantity: number, variantId: string): CartResponse`

Adds a `variantId` of the given `productId` to the `cartId` with the specified `quantity`.

### `getTotalItems(cartId: string): CartTotalItemsResponse`

Gets the total count of items in a cart with an ID of `cartId`.

### `addDiscount(cartId: string, discountCode: string): CartResponse`

Adds a discount with the specified `discountCode` to the `cartId`.

### `removeDiscount(cartId: string, discountCode: string)`

Removes a discount with the specified `discountCode` from the `cartId`.

### Responses

```ts
export interface CartResponse {
    discounts: CartDiscountItemResponse[];
    id: string;
    items: CartItemResponse[];
    messages: string[];
    taxAmount: number;
    total: number;
    totalItems: number;
    revision: number;
}

export interface CartItemResponse {
    product: CartProductResponse;
    quantity: number;
}

export interface CartTotalItemsResponse {
    totalItems: number;
}

export interface CartDiscountItemResponse {
    discount: CartDiscountResponse;
    discountAmount: number;
}

export type CartProductImageResponse = Pick<
    ProductImageResponse,
    "description" | "fullUri" | "description" | "title"
>;

export interface CartProductResponse
    extends Pick<
            ProductResponse,
            | "description"
            | "id"
            | "name"
            | "price"
            | "listPrice"
            | "salePrice"
            | "productVariantId"
            | "variants"
        > {
    images: CartProductImageResponse[];
}
```

## `utils.client.request(url: string, options: Object): Promise`

The request function is exposed to perform arbitrary requests. The request function is internally the
well known [fetch][fetch] function.


[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch 
