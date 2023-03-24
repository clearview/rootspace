import { __awaiter, __generator } from "tslib";
import LinkService from '@/services/link';
var LinkModule = {
    namespaced: true,
    state: function () {
        return {
            item: null
        };
    },
    mutations: {
        setItem: function (state, view) {
            state.item = view;
        }
    },
    actions: {
        view: function (_a, id) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, LinkService.view(id)];
                        case 1:
                            data = (_b.sent()).data;
                            commit('setItem', data);
                            return [2 /*return*/];
                    }
                });
            });
        },
        create: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, LinkService.create(data)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        update: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, LinkService.update(data.id, data)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        destroy: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!data.id) {
                                throw new Error('ID is not defined');
                            }
                            return [4 /*yield*/, LinkService.destroy(data.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
};
export default LinkModule;
//# sourceMappingURL=link.js.map