import styles from './styles';
import { NameFactory } from './components/Name';
import { PriceFactory } from './components/Price';
import { DescriptionFactory } from './components/Description';
import { ControlsFactory } from './components/Controls';
import { ImageSliderFactory } from './components/ImageSlider';


const defaultConfig = {
    productLayout: 'left',
    color: {
        background: 'transparent'
    }
};

const factory = (
    { React, VolusionPropTypes, Components },
    utils,
    { StyleSheet, css },
    globalStyles,
    blockConfig
) => {
    if (!blockConfig.color) {
        blockConfig.color = { background: defaultConfig.color.background };
    }

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


    const configSpec = {
        productId: VolusionPropTypes.string.isRequired,
        productLayout: VolusionPropTypes.oneOf(['left', 'right']).isRequired,
        color: VolusionPropTypes.shape({
            background: VolusionPropTypes.color.isRequired
        }).isRequired,
    };

    const block = class extends React.Component {
        constructor(props) {
            super(props);
        }

        static defaultProps = defaultConfig;

        getLayoutClasses = layout => {
            const base = 'fn';
            const layouts = {
                left: 'fl-l',
                right: 'fr-l'
            };

            return `${base} ${layouts[layout]}`;
        };

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
    };

    return {
        block: React.createFactory(block),
        config: configSpec
    };
};

export { factory, defaultConfig };
