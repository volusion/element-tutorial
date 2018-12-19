import PropTypes from 'prop-types';
import { ImageFactory } from './Image';
import { ImageAlternatesFactory } from './ImageAlternates';

const props = {
    images: PropTypes.array
};

const defaultProps = {
    images: []
};

export const ImageSliderFactory = (
    React,
    utils,
    { StyleSheet, css },
    globalStyles,
    blockStyles
) => {
    const Image = ImageFactory(React, utils, { StyleSheet, css });
    const ImageAlternates = ImageAlternatesFactory(
        React,
        utils,
        { StyleSheet, css },
        globalStyles,
        blockStyles
    );

    const component = class extends React.Component {
        state = {
            productImages: [...this.props.images],
            selectedIndex: 0
        };
        static propTypes = props;
        static defaultProps = defaultProps;

        selectImage = index => {
            this.setState({
                selectedIndex: index
            });
        };

        selectPreviousImage = () => {
            this.setState(prevState => ({
                selectedIndex:
                    prevState.selectedIndex === 0
                        ? prevState.productImages.length - 1
                        : prevState.selectedIndex - 1
            }));
        };

        selectNextImage = () => {
            this.setState(prevState => ({
                selectedIndex:
                    prevState.selectedIndex ===
                    prevState.productImages.length - 1
                        ? 0
                        : prevState.selectedIndex + 1
            }));
        };

        getLayoutClasses = ()  => {
            const base = 'flex tc flex-column justify-center';
            return `${base} items-center flex-column cookies`;
        };

        render() {
            const { productImages, selectedIndex } = this.state;
            const className = this.getLayoutClasses();
            return (
                <div className={className}>
                    <Image
                        selectPreviousImage={this.selectPreviousImage}
                        selectNextImage={this.selectNextImage}
                        selectedIndex={selectedIndex}
                        imagePath={productImages[selectedIndex].imagePath}
                        uriBase={productImages[selectedIndex].uriBase}
                        fullUri={productImages[selectedIndex].fullUri}
                    />
                    <ImageAlternates
                        selectImage={this.selectImage}
                        productImages={productImages}
                        selectedIndex={selectedIndex}
                    />
                </div>
            );
        }
    };

    return component;
};
