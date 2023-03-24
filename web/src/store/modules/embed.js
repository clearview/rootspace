import { __awaiter, __generator } from "tslib";
import EmbedService from '@/services/embed';
var EmbedModule = {
    namespaced: true,
    state: function () {
        return {
            item: null
        };
    },
    mutations: {
        setItem: function (state, item) {
            state.item = item;
        }
    },
    actions: {
        view: function (_a, id) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, EmbedService.view(id)];
                        case 1:
                            res = _b.sent();
                            commit('setItem', res.data);
                            return [2 /*return*/];
                    }
                });
            });
        },
        create: function (_a, data) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            commit('setItem', data);
                            return [4 /*yield*/, EmbedService.create(data)];
                        case 1:
                            res = _b.sent();
                            commit('setItem', res.data);
                            return [2 /*return*/, res];
                    }
                });
            });
        },
        update: function (_a, data) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            commit('setItem', data);
                            return [4 /*yield*/, EmbedService.update(data)];
                        case 1:
                            _b.sent();
                            commit('setItem', data);
                            return [2 /*return*/];
                    }
                });
            });
        },
        destroy: function (_a, data) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, EmbedService.destroy(data)];
                        case 1:
                            _b.sent();
                            commit('setItem', null);
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
};
export default EmbedModule;
//# sourceMappingURL=embed.js.map