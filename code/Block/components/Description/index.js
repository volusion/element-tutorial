import PropTypes from 'prop-types';
import styles from './styles';

export const DescriptionFactory = (
    React,
    { StyleSheet, css },
    globalStyles
) => {
    const classes = StyleSheet.create(styles(globalStyles));

    const component = class extends React.Component {
        static propTypes = {
            showFullDescription: PropTypes.bool,
            toggleFullDescription: PropTypes.func,
            description: PropTypes.string
        };
        static defaultProps = {
            showFullDescription: true,
            description: ''
        };
        truncateDescription = (description, length = 300, ending = '[...]') => {
            return description.length > length
                ? `${description.substring(
                      0,
                      length - ending.length
                  )} ${ending}`
                : description;
        };
        renderDescription = (str, showFullDescription) => {
            const cleanedStr = str.replace(
                /<.*?script.*?>.*?<\/.*?script.*?>/gim,
                ''
            );
            return {
                __html: showFullDescription
                    ? cleanedStr
                    : this.truncateDescription(cleanedStr)
            };
        };
        render() {
            const {
                description,
                toggleFullDescription,
                showFullDescription
            } = this.props;
            return (
                <div className={`measure ${css(classes.description)}`}>
                    <div className={`${css(classes.descriptionText)}`}>
                        <div
                            dangerouslySetInnerHTML={this.renderDescription(
                                description,
                                showFullDescription
                            )}
                        />
                        <a
                            href="#"
                            className={`link dib fw6 ${css(classes.viewMore)}`}
                            onClick={() => toggleFullDescription()}
                        >
                            {showFullDescription ? 'view less' : 'view more'}
                        </a>
                    </div>
                </div>
            );
        }
    };

    return component;
};
