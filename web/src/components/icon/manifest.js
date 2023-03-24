import DefaultIcon from './DefaultIcon.vue';
var manifest = {
    mono: {},
    color: {}
};
var requireComponent = require.context('./', true, /[A-Z]\w+\.(vue)$/, 'lazy');
requireComponent.keys().forEach(function (filePath) {
    var _a = filePath.split('/'), type = _a[1], filename = _a[2];
    if (!filename)
        return;
    var name = filename.replace(/\.\w+$/, '');
    manifest[type][name] = function () { return ({
        component: requireComponent(filePath),
        loading: DefaultIcon,
        error: DefaultIcon
    }); };
});
export default manifest;
//# sourceMappingURL=manifest.js.map