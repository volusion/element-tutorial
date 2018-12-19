import PropTypes from 'prop-types';
import styles from './styles';

export const ImageAlternatesFactory = (
    React,
    utils,
    { StyleSheet, css },
    globalStyles,
    blockStyles
) => {
    const classes = StyleSheet.create(styles(globalStyles, blockStyles));
    const component = class extends React.Component {
        isSelected = index => {
            const { selectedIndex } = this.props;
            const base = `${
                !utils.isAmpRequest ? 'w4-ns' : ''
            } border-box h-auto db outline-0 v-mid center b--solid bw1`;
            return parseInt(selectedIndex, 10) === index
                ? `${base} ${css(classes.selected)}`
                : `${base} b--transparent o-50`;
        };

        altImageUrl = (imagePath, uriBase, fullUri) => {
            return uriBase ? `${uriBase}w_100/${imagePath}` : fullUri;
        };
        getImageAltsClasses = () => {
            const base = 'flex flex-wrap tc justify-center';
            return `${base} w-100`;
        };

        getImage = (image, index) => {
            if (!utils.isAmpRequest) {
                return (
                    <img
                        className={this.isSelected(index)}
                        alt="Alternate"
                        src={this.altImageUrl(
                            image.imagePath,
                            image.uriBase,
                            image.fullUri
                        )}
                    />
                );
            }

            return (
                <amp-img
                    width="128"
                    height="128"
                    layout="responsive"
                    class={this.isSelected(index)}
                    src={this.altImageUrl(
                        image.imagePath,
                        image.uriBase,
                        image.fullUri
                    )}
                />
            );
        };

        render() {
            const {
                productImages,
                selectImage
            } = this.props;
            return (
                <div className={this.getImageAltsClasses()}>
                    {productImages.map((image, index) => (
                        <a
                            className={`pa1 pointer w-20`}
                            key={index}
                            {...(utils.isAmpRequest
                                ? {
                                      href: utils.canonicalUrl({
                                          selectedImageIdx: index
                                      })
                                  }
                                : { onClick: () => selectImage(index) })}
                        >
                            {this.getImage(image, index)}
                        </a>
                    ))}
                </div>
            );
        }
    };

    component.propTypes = {
        selectedIndex: PropTypes.number,
        productImages: PropTypes.array,
        selectImage: PropTypes.func
    };

    return component;
};
