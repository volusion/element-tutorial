/* eslint-disable-next-line no-unused-vars */
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

export { getDataProps };
