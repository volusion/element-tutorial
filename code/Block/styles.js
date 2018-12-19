export default (global, block) => {
    return {
        div: {
            fontFamily: global.typography.fontFamily,
            fontSize: global.typography.baseFontSize,
            color: global.color.primary,
            backgroundColor: block.color.background
        }
    };
};
