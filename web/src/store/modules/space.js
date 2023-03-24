import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import { get, isEmpty } from 'lodash';
import SpaceService from '@/services/space';
import UserUISettingService from '@/services/userUISetting';
import api from '@/utils/api';
var SpaceModule = {
    namespaced: true,
    state: function () {
        return {
            activeIndex: 0,
            list: [],
            settings: [],
            freezeSettings: false,
            afterFrozen: false
        };
    },
    getters: {
        isListEmpty: function (state) {
            return state.list.length < 1;
        },
        getIndex: function (state) { return function (id) { return (state.list.findIndex(function (x) { return x.id === id; })); }; },
        getSpaceByIndex: function (state) { return function (index) { return (state.list[index] || null); }; },
        getSettingByIndex: function (state) { return function (index) { return (state.settings[index] || null); }; },
        getSpaceById: function (_, getters) { return function (id) { return getters.getSpaceByIndex(getters.getIndex(id)); }; },
        getSettingById: function (_, getters) { return function (id) { return getters.getSettingByIndex(getters.getIndex(id)); }; },
        activeSpace: function (state, getters) { return getters.getSpaceByIndex(state.activeIndex) || {}; },
        activeSetting: function (state, getters) { return getters.getSettingByIndex(state.activeIndex) || {}; }
    },
    mutations: {
        freezeSettings: function (state) {
            state.freezeSettings = true;
        },
        unfreezeSettings: function (state) {
            state.freezeSettings = false;
            state.afterFrozen = true;
        },
        clearFrozen: function (state) {
            state.afterFrozen = false;
        },
        setActiveIndex: function (state, payload) {
            state.activeIndex = payload;
        },
        setList: function (state, payload) {
            state.list = __spreadArray([], payload, true).sort(function (a, b) { return a.title.localeCompare(b.title); });
        },
        addListItem: function (state, payload) {
            state.list = __spreadArray(__spreadArray([], state.list, true), [
                payload
            ], false).sort(function (a, b) { return a.title.localeCompare(b.title); });
        },
        updateListItem: function (state, payload) {
            var list = __spreadArray([], state.list, true);
            list[payload.index] = __assign(__assign({}, list[payload.index]), payload.data);
            state.list = list;
        },
        setSettings: function (state, payload) {
            state.settings = payload;
        },
        updateSettingsItem: function (state, payload) {
            var settings = __spreadArray([], state.settings, true);
            settings[payload.index] = __assign(__assign({}, settings[payload.index]), payload.data);
            state.settings = settings;
        }
    },
    actions: {
        fetch: function (_a, params) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, api.get('/spaces', { params: params })];
                        case 1:
                            res = _b.sent();
                            commit('setList', res.data);
                            return [2 /*return*/];
                    }
                });
            });
        },
        create: function (_a, space) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, api.post('/spaces', space)];
                        case 1:
                            res = _b.sent();
                            commit('addListItem', res.data);
                            return [2 /*return*/, res.data];
                    }
                });
            });
        },
        leave: function (_a) {
            var _b, _c;
            var commit = _a.commit, dispatch = _a.dispatch, state = _a.state, getters = _a.getters, rootState = _a.rootState;
            return __awaiter(this, void 0, void 0, function () {
                var nextActiveSpace, i;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, api.delete("/spaces/".concat(getters.activeSpace.id, "/me"))];
                        case 1:
                            _d.sent();
                            for (i = 0; i < state.list.length; i++) {
                                if (state.list[i].userId === ((_c = (_b = rootState.auth) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.id)) {
                                    nextActiveSpace = state.list[i];
                                }
                            }
                            commit('setList', state.list.filter(function (item) { return item.id !== getters.activeSpace.id; }));
                            dispatch('activate', nextActiveSpace === null || nextActiveSpace === void 0 ? void 0 : nextActiveSpace.id);
                            return [2 /*return*/];
                    }
                });
            });
        },
        update: function (_a, data) {
            var commit = _a.commit, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                var index, res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            index = getters.getIndex(data.id);
                            commit('updateListItem', { index: index, data: data });
                            return [4 /*yield*/, api.patch('/spaces/' + data.id, data)];
                        case 1:
                            res = _b.sent();
                            return [2 /*return*/, res.data];
                    }
                });
            });
        },
        initSetting: function (_a) {
            var commit = _a.commit, dispatch = _a.dispatch, state = _a.state, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                var data, activeIndex;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, UserUISettingService.fetch()];
                        case 1:
                            data = _b.sent();
                            activeIndex = get(data, 'activeIndex', 0);
                            if (activeIndex !== state.activeIndex) {
                                commit('setActiveIndex', activeIndex);
                            }
                            return [4 /*yield*/, dispatch('fetchSetting', getters.activeSpace.id)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        fetchSetting: function (_a, id) {
            var commit = _a.commit, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                var index, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            index = getters.getIndex(id);
                            return [4 /*yield*/, UserUISettingService.fetch(id)];
                        case 1:
                            data = _b.sent();
                            commit('updateSettingsItem', { index: index, data: data });
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        updateSetting: function (_a, payload) {
            var commit = _a.commit, getters = _a.getters, state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var index, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            index = getters.getIndex(payload.id);
                            if (isEmpty(payload.data) || state.freezeSettings)
                                return [2 /*return*/];
                            commit('updateSettingsItem', { index: index, data: payload.data });
                            return [4 /*yield*/, UserUISettingService.update({
                                    spaceId: payload.id,
                                    data: getters.getSettingByIndex(index)
                                })];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        activate: function (_a, id) {
            var commit = _a.commit, dispatch = _a.dispatch, state = _a.state, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                var index;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            index = getters.getIndex(id);
                            return [4 /*yield*/, dispatch('fetchSetting', id)];
                        case 1:
                            _b.sent();
                            if (!(index !== state.activeIndex)) return [3 /*break*/, 3];
                            commit('setActiveIndex', index);
                            return [4 /*yield*/, UserUISettingService.update({
                                    data: {
                                        activeIndex: index
                                    }
                                })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        whoami: function (_a) {
            var commit = _a.commit, state = _a.state, getters = _a.getters;
            return __awaiter(this, void 0, void 0, function () {
                var activeSpace, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            activeSpace = getters.getSpaceByIndex(state.activeIndex);
                            if (!activeSpace) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, SpaceService.whoami(activeSpace.id)];
                        case 1:
                            data = _b.sent();
                            commit('setList', state.list.map(function (item) {
                                return __assign(__assign({}, item), (item.id === activeSpace.id ? { role: data.role } : {}));
                            }));
                            return [2 /*return*/];
                    }
                });
            });
        },
        clean: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('setList', []);
                    commit('setSettings', []);
                    return [2 /*return*/];
                });
            });
        }
    }
};
export default SpaceModule;
//# sourceMappingURL=space.js.map