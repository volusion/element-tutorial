import PropTypes from 'prop-types';
import { ControlsFactory } from '../Controls';

export const ImageFactory = (React, utils, { StyleSheet, css }) => {
    const Controls = ControlsFactory(React, { StyleSheet, css });

    const component = class extends React.Component {
        mainImageUrl = (imagePath, uriBase, fullUri) => {
            return uriBase ? `${uriBase}w_500/${imagePath}` : fullUri;
        };

        getImage = (imagePath, uriBase, fullUri) => {
            if (!utils.isAmpRequest) {
                return (
                    <img
                        className="center db outline-0 mw-100 h-auto"
                        alt="Alternate"
                        src={this.mainImageUrl(imagePath, uriBase, fullUri)}
                    />
                );
            }

            return (
                <amp-img
                    height="496"
                    width="496"
                    layout="responsive"
                    src={this.mainImageUrl(imagePath, uriBase, fullUri)}
                />
            );
        };

        render() {
            const {
                fullUri,
                imagePath,
                uriBase,
                selectNextImage,
                selectPreviousImage
            } = this.props;
            return (
                <div className="relative pv2 pa2-m pa2-l mw6 w-100">
                    <Controls
                        selectNextImage={selectNextImage}
                        selectPreviousImage={selectPreviousImage}
                    />
                    {this.getImage(imagePath, uriBase, fullUri)}
                </div>
            );
        }
    };

    component.propTypes = {
        fullUri: PropTypes.string,
        uriBase: PropTypes.string,
        imagePath: PropTypes.string,
        selectPreviousImage: PropTypes.func,
        selectNextImage: PropTypes.func,
    };

    return component;
};
