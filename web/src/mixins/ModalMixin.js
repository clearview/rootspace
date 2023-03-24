import { __assign, __awaiter, __decorate, __extends, __generator } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
export { default as Modal } from '@/components/legacy/Modal.vue';
var ModalMixin = /** @class */ (function (_super) {
    __extends(ModalMixin, _super);
    function ModalMixin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.modal = {
            visible: false,
            loading: false,
            type: null,
            data: null
        };
        return _this;
    }
    ModalMixin.prototype.modalOpen = function (type, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.modal = __assign(__assign({}, this.modal), { visible: true, data: data || null, type: type });
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.$once('modal:close', function () {
                            _this.modal.visible = false;
                            reject(new Error('close'));
                        });
                        _this.$once('modal:confirm', function (data) {
                            _this.modal.visible = false;
                            resolve(data);
                        });
                    })];
            });
        });
    };
    ModalMixin.prototype.modalClose = function () {
        this.$emit('modal:close');
    };
    ModalMixin.prototype.modalConfirm = function (data) {
        this.$emit('modal:confirm', data);
    };
    ModalMixin = __decorate([
        Component
    ], ModalMixin);
    return ModalMixin;
}(Vue));
export default ModalMixin;
//# sourceMappingURL=ModalMixin.js.map