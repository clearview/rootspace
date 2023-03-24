import { __decorate, __extends } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
var PageMixin = /** @class */ (function (_super) {
    __extends(PageMixin, _super);
    function PageMixin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PageMixin.prototype, "pageTitle", {
        get: function () {
            return document.title;
        },
        set: function (title) {
            var spaceTitle = (this.$store.getters['space/activeSpace'] || {}).title;
            var appName = 'Root';
            var fragments = [title, spaceTitle, appName];
            document.title = fragments.filter(function (x) { return x; }).join(' · ');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PageMixin.prototype, "pageReady", {
        get: function () {
            return this.$store.state.page.ready;
        },
        set: function (value) {
            this.$store.commit('page/setReady', value);
        },
        enumerable: false,
        configurable: true
    });
    PageMixin = __decorate([
        Component
    ], PageMixin);
    return PageMixin;
}(Vue));
export default PageMixin;
//# sourceMappingURL=PageMixin.js.map