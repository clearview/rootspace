import { __awaiter, __generator } from "tslib";
export function createServiceModule(service, hooks) {
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
            },
            operate: function (state, operator) {
                operator(state);
            }
        },
        actions: {
            fetch: function (context, params) {
                return __awaiter(this, void 0, void 0, function () {
                    var activeSpace, res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                activeSpace = context.rootGetters['space/activeSpace'];
                                if (!activeSpace) {
                                    throw new Error('There is no currently active space');
                                }
                                context.commit('setFetching', true);
                                return [4 /*yield*/, service.fetch(params)];
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
                    var task;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                context.commit('setFetching', true);
                                return [4 /*yield*/, service.view(id)];
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
            refresh: function (context) {
                var _a;
                return __awaiter(this, void 0, void 0, function () {
                    var task;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!((_a = context.state.current) === null || _a === void 0 ? void 0 : _a.id)) return [3 /*break*/, 2];
                                context.commit('setFetching', true);
                                return [4 /*yield*/, service.view(context.state.current.id)];
                            case 1:
                                task = _b.sent();
                                context.commit('setFetching', false);
                                context.commit('setCurrent', task === null || task === void 0 ? void 0 : task.data);
                                _b.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                });
            },
            create: function (context, data) {
                return __awaiter(this, void 0, void 0, function () {
                    var res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                context.commit('setProcessing', true);
                                return [4 /*yield*/, service.create(data)];
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
                    var res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (data.id === null) {
                                    throw new Error('Unable to update data without ID');
                                }
                                if (hooks && hooks.beforeUpdate) {
                                    hooks.beforeUpdate(context, data);
                                }
                                context.commit('setProcessing', true);
                                return [4 /*yield*/, service.update(data.id, data)];
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
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (data.id === null) {
                                    throw new Error('Unable to delete data without ID');
                                }
                                context.commit('setProcessing', true);
                                return [4 /*yield*/, service.destroy(data.id)];
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
            },
            archive: function (context, data) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (data.id === null) {
                                    throw new Error('Unable to archive data without ID');
                                }
                                context.commit('setProcessing', true);
                                return [4 /*yield*/, service.archive(data.id)];
                            case 1:
                                _a.sent();
                                context.commit('setProcessing', false);
                                if (hooks && hooks.afterArchive) {
                                    hooks.afterArchive(context, data);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            },
            restore: function (context, data) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (data.id === null) {
                                    throw new Error('Unable to restore data without ID');
                                }
                                context.commit('setProcessing', true);
                                return [4 /*yield*/, service.restore(data.id)];
                            case 1:
                                _a.sent();
                                context.commit('setProcessing', false);
                                if (hooks && hooks.afterRestore) {
                                    hooks.afterRestore(context, data);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            }
        }
    };
}
//# sourceMappingURL=createServiceModule.js.map