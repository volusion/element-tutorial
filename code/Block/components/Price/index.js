import PropTypes from 'prop-types';

export const PriceFactory = React => {
    const component = class extends React.Component {
        static propTypes = {
            price: PropTypes.number
        };
        static defaultProps = {
            price: 0
        };
        render() {
            return (
                <div className={`b f2 mv4`}>${this.props.price.toFixed(2)}</div>
            );
        }
    };

    return component;
};
