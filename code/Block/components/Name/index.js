import PropTypes from 'prop-types';

export const NameFactory = React => {
    const component = class extends React.Component {
        static propTypes = {
            name: PropTypes.string
        };
        static defaultProps = {
            name: ''
        };
        render() {
            return (
                <React.Fragment>
                    <h1 className="f2 fw4 measure">{this.props.name}</h1>
                </React.Fragment>
            );
        }
    };

    return component;
};
