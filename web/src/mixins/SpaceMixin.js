import { __awaiter, __decorate, __extends, __generator } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
var SpaceMixin = /** @class */ (function (_super) {
    __extends(SpaceMixin, _super);
    function SpaceMixin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SpaceMixin.prototype, "spaces", {
        get: function () {
            return this.$store.state.space.list;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpaceMixin.prototype, "activeSpace", {
        get: function () {
            return this.$store.getters['space/activeSpace'];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpaceMixin.prototype, "activeSpaceSetting", {
        get: function () {
            return this.$store.getters['space/activeSetting'];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpaceMixin.prototype, "hasSpace", {
        get: function () {
            return this.$store.getters['space/isListEmpty'] === false;
        },
        enumerable: false,
        configurable: true
    });
    SpaceMixin.prototype.activateSpace = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$store.dispatch('space/activate', id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SpaceMixin.prototype.updateSpaceSetting = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$store.dispatch('space/updateSetting', { id: id, data: data })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SpaceMixin.prototype.getSpaceSettingById = function (id) {
        return this.$store.getters['space/getSettingById'](id);
    };
    SpaceMixin = __decorate([
        Component
    ], SpaceMixin);
    return SpaceMixin;
}(Vue));
export default SpaceMixin;
//# sourceMappingURL=SpaceMixin.js.map