import { __assign, __awaiter, __generator } from "tslib";
import { findIndex } from 'lodash';
import TreeService from '@/services/tree';
import Vue from 'vue';
var TreeModule = {
    namespaced: true,
    state: function () {
        return {
            list: [],
            favorites: [],
            focusedList: [],
            folded: {},
            touched: {}
        };
    },
    getters: {
        isFavorited: function (state) { return function (data) {
            if (!state.favorites.length) {
                return false;
            }
            return (findIndex(state.favorites, { id: data.id }) >= 0);
        }; }
    },
    mutations: {
        setList: function (state, list) {
            state.list = list;
        },
        setFavorites: function (state, favorites) {
            state.favorites = favorites;
        },
        setFocusedList: function (state, list) {
            state.focusedList = list;
        },
        updateNode: function (state, payload) {
            var looper = function (nodes) {
                var idx = 0;
                for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                    var node = nodes_1[_i];
                    if (payload.compareFn(node)) {
                        Vue.set(nodes, idx, payload.fn(node));
                    }
                    idx++;
                    looper(node.children);
                }
            };
            looper(state.list);
        },
        setFolded: function (state, folded) {
            state.folded = folded;
        },
        setTouched: function (state, touched) {
            state.touched = touched;
        },
        updateFolded: function (state, _a) {
            var _b;
            var index = _a.index, value = _a.value;
            state.folded = __assign(__assign({}, state.folded), (_b = {}, _b[index] = value, _b));
        }
    },
    actions: {
        fetch: function (_a, params) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, TreeService.fetchBySpace(params.spaceId)];
                        case 1:
                            res = _b.sent();
                            commit('setList', res.data);
                            return [2 /*return*/];
                    }
                });
            });
        },
        fetchFavorites: function (_a, params) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, TreeService.fetchFavoritesBySpace(params.spaceId)];
                        case 1:
                            res = _b.sent();
                            commit('setFavorites', res.data);
                            return [2 /*return*/];
                    }
                });
            });
        },
        setFocusedList: function (_a, data) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('setFocusedList', [data]);
                    return [2 /*return*/];
                });
            });
        },
        clearFocusedList: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('setFocusedList', []);
                    return [2 /*return*/];
                });
            });
        },
        update: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, TreeService.update(data.id, data)];
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
                        case 0: return [4 /*yield*/, TreeService.destroy(data.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        clearArchive: function (_, spaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, TreeService.clearArchive(spaceId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        archive: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, TreeService.archive(data.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        addToFavorites: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, TreeService.addToFavorites(data.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        removeFromFavorites: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, TreeService.removeFromFavorites(data.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        restore: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, TreeService.restore(data.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        createFolder: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, TreeService.createFolder(data)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }
    }
};
export default TreeModule;
//# sourceMappingURL=tree.js.map