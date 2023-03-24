import IconLibraries from './IconLibraries.vue';
export default {
    title: 'Components/Icon/ColorIcon',
    component: IconLibraries,
    argTypes: {
        type: { table: { disable: true } }
    },
    parameters: {
        previewTabs: {
            'storybook/docs/panel': {
                hidden: true
            }
        },
        viewMode: 'canvas'
    }
};
var Template = function (_args, _a) {
    var argTypes = _a.argTypes;
    return ({
        props: Object.keys(argTypes),
        components: { IconLibraries: IconLibraries },
        template: '<icon-libraries v-bind="$props" type="color" />'
    });
};
export var Libraries = Template.bind({});
Libraries.args = {
    search: undefined
};
//# sourceMappingURL=ColorIcon.stories.js.map