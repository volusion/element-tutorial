import PropTypes from 'prop-types';
import styles from './styles';

export const ControlsFactory = (
    { React, ElementPropTypes, Components },
    utils,
    { StyleSheet, css },
    globalStyles
) => {
    const classes = StyleSheet.create(styles());
    const Button = Components.Button.factory(
        { React, ElementPropTypes },
        { StyleSheet, css },
        globalStyles
    );
    const component = class extends React.Component {
        state = {
            qty: this.setQuantity()
        };

        setQuantity() {
            if (this.props.decrementQty) {
                return 0;
            }

            if (this.props.incrementQty) {
                return 2;
            }

            return 1;
        }

        incrementQty = () => {
            this.setState(prevState => ({
                qty: prevState.qty + 1
            }));
        };

        decrementQty = () => {
            this.setState(prevState => ({
                qty: prevState.qty === 1 ? 1 : prevState.qty - 1
            }));
        };

        handleUpdate = value => {
            this.setState(() => ({
                qty: parseInt(value, 10)
            }));
        };

        handleQtyCheck = value => {
            if (value <= 0) {
                this.setState(() => ({
                    qty: 1
                }));
            }
        };

        render() {
            return (
                <div className="mv5">
                    <div className={`mb5 ${css(classes.qty)}`}>
                        <div className={`dib f6 mr5 ${css(classes.qtyLabel)}`}>
                            Qty
                        </div>
                        <div className={`dib ${css(classes.qtyInputWrap)}`}>
                            <div
                                className={`flex flex-nowrap ${css(
                                    classes.qtyInput
                                )}`}
                            >
                                <a
                                    {...(utils.isAmpRequest
                                        ? {
                                              href: utils.canonicalUrl({
                                                  decrementQty: true
                                              })
                                          }
                                        : {
                                              onClick: this.decrementQty
                                          })}
                                    className={`outline-0 pointer f3 pv2 ph3 bt bb bl dib br-0 ${css(
                                        classes.qtyInputButton
                                    )}`}
                                >
                                    -
                                </a>
                                <input
                                    className={`outline-0 pv2 ph3 w3 tc ba dib ${css(
                                        classes.qtyInputField
                                    )}`}
                                    type="text"
                                    placeholder="1"
                                    value={this.state.qty}
                                    onChange={e =>
                                        this.handleUpdate(e.target.value)
                                    }
                                    onBlur={e =>
                                        this.handleQtyCheck(e.target.value)
                                    }
                                />
                                <a
                                    {...(utils.isAmpRequest
                                        ? {
                                              href: utils.canonicalUrl({
                                                  incrementQty: true
                                              })
                                          }
                                        : {
                                              onClick: this.incrementQty
                                          })}
                                    className={`outline-0 pointer f3 pv2 ph3 dib bt br bb bl-0 ${css(
                                        classes.qtyInputButton
                                    )}`}
                                >
                                    +
                                </a>
                            </div>
                        </div>
                    </div>
                    <Button.component
                        {...(utils.isAmpRequest
                            ? {
                                  href: utils.canonicalUrl({
                                      addToCart: this.props.productId,
                                      openCart: true
                                  })
                              }
                            : {
                                  onClick: () =>
                                      this.props.onAddToCart(this.state.qty)
                              })}
                    >
                        Add to Cart
                    </Button.component>
                </div>
            );
        }
    };

    component.propTypes = {
        decrementQty: PropTypes.bool,
        incrementQty: PropTypes.bool,
        onAddToCart: PropTypes.func,
        productId: PropTypes.string
    };

    return component;
};
