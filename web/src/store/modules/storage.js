import { __awaiter, __generator } from "tslib";
import { StorageViewType } from '@/types/resource';
import api from '@/utils/api';
import StorageService from '@/services/storage';
import UploadService from '@/services/upload';
var FilesModule = {
    namespaced: true,
    state: function () {
        return {
            info: null,
            item: null,
            processing: false,
            totalData: 0,
            viewAs: StorageViewType.Grid
        };
    },
    mutations: {
        setInfo: function (state, data) {
            state.info = data;
        },
        setItem: function (state, data) {
            state.item = data;
        },
        setViewAs: function (state, payload) {
            state.viewAs = payload;
        },
        setTotalData: function (state, data) {
            state.totalData = data.length;
        },
        setProcessing: function (state, payload) {
            state.processing = payload;
        }
    },
    actions: {
        info: function (_a, id) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, StorageService.view(id)];
                        case 1:
                            res = _b.sent();
                            commit('setInfo', res.data);
                            return [2 /*return*/];
                    }
                });
            });
        },
        fetch: function (_a, params) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, api.get("storages/".concat(params.id, "/files"), {
                                params: {
                                    search: params.search || undefined,
                                    trashed: params.deleted || undefined
                                }
                            })];
                        case 1:
                            res = _b.sent();
                            if (!params.search) {
                                commit('setTotalData', res === null || res === void 0 ? void 0 : res.data.data);
                            }
                            commit('setItem', res === null || res === void 0 ? void 0 : res.data.data);
                            return [2 /*return*/];
                    }
                });
            });
        },
        create: function (_, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, StorageService.create(data)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        update: function (_, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, UploadService.update(payload.id, payload.data)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        destroy: function (_, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!id) {
                                throw new Error('ID is not defined');
                            }
                            return [4 /*yield*/, UploadService.trash(id)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        permanentDestroy: function (_, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!id) {
                                throw new Error('ID is not defined');
                            }
                            return [4 /*yield*/, UploadService.delete(id)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        restore: function (_, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!id) {
                                throw new Error('ID is not defined');
                            }
                            return [4 /*yield*/, UploadService.restore(id)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        upload: function (_a, payload) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                var activeSpace, formData, res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            activeSpace = rootGetters['space/activeSpace'];
                            if (!activeSpace) {
                                throw new Error('Not in an active space');
                            }
                            if (!payload.item.id) {
                                throw new Error('Invalid storage ID');
                            }
                            formData = new FormData();
                            formData.append('file', payload.file);
                            formData.append('entityId', payload.item.id.toString());
                            formData.append('type', 'storage');
                            formData.append('spaceId', activeSpace.id);
                            commit('setProcessing', true);
                            return [4 /*yield*/, api.post('/uploads', formData, payload.config)];
                        case 1:
                            res = _b.sent();
                            if (!payload.item.uploads) {
                                payload.item.uploads = [];
                            }
                            commit('setProcessing', false);
                            return [2 /*return*/, res];
                    }
                });
            });
        }
    }
};
export default FilesModule;
//# sourceMappingURL=storage.js.map