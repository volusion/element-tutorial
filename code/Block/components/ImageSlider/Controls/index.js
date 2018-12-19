import PropTypes from 'prop-types';
import styles from './styles';

export const ControlsFactory = (React, { StyleSheet, css }) => {
    const classes = StyleSheet.create(styles);

    const component = props => (
        <div
            className={`${css(
                classes.controlsWrap
            )} flex justify-between ph4 absolute left-0 right-0`}
        >
            <span
                onClick={props.selectPreviousImage}
                className="w2 h2 br4 pointer bg-black o-50 glow relative"
            >
                <svg
                    className={`${css(
                        classes.controlsImage
                    )} w1 h1 absolute absolute--fill`}
                    viewBox="0 0 512 512"
                >
                    <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256" />
                </svg>
            </span>
            <span
                onClick={props.selectNextImage}
                className="w2 h2 br4 pointer bg-black o-50 glow relative"
            >
                <svg
                    className={`${css(
                        classes.controlsImage
                    )} w1 h1 absolute absolute--fill`}
                    viewBox="0 0 512 512"
                >
                    <polygon points="160,128.4 192.3,96 352,256 352,256 352,256 192.3,416 160,383.6 287.3,256" />
                </svg>
            </span>
        </div>
    );

    component.propTypes = {
        selectNextImage: PropTypes.func,
        selectPreviousImage: PropTypes.func
    };

    return component;
};
