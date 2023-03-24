import { __awaiter, __generator } from "tslib";
export function createChildServiceModule(service, parentResolver, hooks) {
    return {
        namespaced: true,
        state: function () {
            return {
                fetching: false,
                current: null,
                data: [],
                processing: false
            };
        },
        mutations: {
            setFetching: function (state, payload) {
                state.fetching = payload;
            },
            setCurrent: function (state, payload) {
                state.current = payload;
            },
            setData: function (state, payload) {
                state.data = payload;
            },
            setProcessing: function (state, payload) {
                state.processing = payload;
            }
        },
        actions: {
            fetch: function (context, params) {
                return __awaiter(this, void 0, void 0, function () {
                    var activeSpace, parentId, res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                activeSpace = context.rootGetters['space/activeSpace'];
                                parentId = parentResolver(context.rootState);
                                if (!parentId) {
                                    return [2 /*return*/];
                                }
                                if (!activeSpace) {
                                    throw new Error('There is no currently active space');
                                }
                                context.commit('setFetching', true);
                                return [4 /*yield*/, service.fetch(params, parentId)];
                            case 1:
                                res = _a.sent();
                                context.commit('setFetching', false);
                                context.commit('setData', res);
                                if (hooks && hooks.afterFetch) {
                                    hooks.afterFetch(context, res);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            },
            view: function (context, id) {
                return __awaiter(this, void 0, void 0, function () {
                    var parentId, task;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parentId = parentResolver(context.rootState);
                                if (!parentId) {
                                    throw new Error('No parent ID');
                                }
                                context.commit('setFetching', true);
                                return [4 /*yield*/, service.view(id, parentId)];
                            case 1:
                                task = _a.sent();
                                context.commit('setFetching', false);
                                context.commit('setCurrent', task === null || task === void 0 ? void 0 : task.data);
                                if ((task === null || task === void 0 ? void 0 : task.data) && hooks && hooks.afterView) {
                                    hooks.afterView(context, task.data);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            },
            refresh: function (_a) {
                var _b;
                var commit = _a.commit, state = _a.state, rootState = _a.rootState;
                return __awaiter(this, void 0, void 0, function () {
                    var parentId, task;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                parentId = parentResolver(rootState);
                                if (!parentId) {
                                    throw new Error('No parent ID');
                                }
                                if (!((_b = state.current) === null || _b === void 0 ? void 0 : _b.id)) return [3 /*break*/, 2];
                                commit('setFetching', true);
                                return [4 /*yield*/, service.view(state.current.id, parentId)];
                            case 1:
                                task = _c.sent();
                                commit('setFetching', false);
                                commit('setCurrent', task === null || task === void 0 ? void 0 : task.data);
                                _c.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                });
            },
            create: function (context, data) {
                return __awaiter(this, void 0, void 0, function () {
                    var parentId, res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parentId = parentResolver(context.rootState);
                                if (!parentId) {
                                    throw new Error('No parent ID');
                                }
                                context.commit('setProcessing', true);
                                return [4 /*yield*/, service.create(data, parentId)];
                            case 1:
                                res = _a.sent();
                                context.commit('setProcessing', false);
                                if (hooks && hooks.afterCreate) {
                                    hooks.afterCreate(context, res);
                                }
                                return [2 /*return*/, res];
                        }
                    });
                });
            },
            update: function (context, data) {
                return __awaiter(this, void 0, void 0, function () {
                    var parentId, res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parentId = parentResolver(context.rootState);
                                if (!parentId) {
                                    throw new Error('No parent ID');
                                }
                                if (data.id === null) {
                                    throw new Error('Unable to update data without ID');
                                }
                                context.commit('setProcessing', true);
                                return [4 /*yield*/, service.update(data.id, data, parentId)];
                            case 1:
                                res = _a.sent();
                                context.commit('setProcessing', false);
                                if (hooks && hooks.afterUpdate) {
                                    hooks.afterUpdate(context, res);
                                }
                                return [2 /*return*/, res];
                        }
                    });
                });
            },
            destroy: function (context, data) {
                return __awaiter(this, void 0, void 0, function () {
                    var parentId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parentId = parentResolver(context.rootState);
                                if (!parentId) {
                                    throw new Error('No parent ID');
                                }
                                if (data.id === null) {
                                    throw new Error('Unable to delete data without ID');
                                }
                                context.commit('setProcessing', true);
                                return [4 /*yield*/, service.destroy(data.id, parentId)];
                            case 1:
                                _a.sent();
                                context.commit('setProcessing', false);
                                if (hooks && hooks.afterDestroy) {
                                    hooks.afterDestroy(context, data);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            }
        }
    };
}
//# sourceMappingURL=createChildServiceModule.js.map