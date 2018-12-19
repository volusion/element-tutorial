const styles = global => {
    return {
        description: {},
        descriptionText: {
            color: global.color.text
        },
        truncate: {
            display: 'inline-block',
            width: '250px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            verticalAlign: 'middle'
        },
        viewMore: {
            color: global.color.link
        }
    };
};

export default styles;
