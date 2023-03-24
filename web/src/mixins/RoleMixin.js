import { __decorate, __extends } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
// Fixed values now but in the future we will probably implement more dynamic roles
export var roleIdAdmin = 0;
export var roleIdMember = 1;
var RouteMixin = /** @class */ (function (_super) {
    __extends(RouteMixin, _super);
    function RouteMixin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RouteMixin.prototype.hasRoleId = function (roleId) {
        var _a;
        return ((_a = this.$store.state.auth.user) === null || _a === void 0 ? void 0 : _a.hasRoleId) === roleId;
    };
    Object.defineProperty(RouteMixin.prototype, "isAdmin", {
        get: function () {
            var _a;
            return ((_a = this.$store.state.auth.user) === null || _a === void 0 ? void 0 : _a.hasRoleId) === roleIdAdmin;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RouteMixin.prototype, "isMember", {
        get: function () {
            var _a;
            return ((_a = this.$store.state.auth.user) === null || _a === void 0 ? void 0 : _a.hasRoleId) === roleIdMember;
        },
        enumerable: false,
        configurable: true
    });
    RouteMixin = __decorate([
        Component
    ], RouteMixin);
    return RouteMixin;
}(Vue));
export default RouteMixin;
//# sourceMappingURL=RoleMixin.js.map