import { __awaiter, __generator } from "tslib";
import Cookie from 'js-cookie';
import AuthService from '@/services/auth';
var tokenName = 'root_session';
var refreshTokenName = 'root_session_refresh_token';
var AuthModule = {
    namespaced: true,
    state: function () {
        return {
            token: null,
            refreshToken: null,
            user: null,
            spaces: null,
            currentSpace: null
        };
    },
    mutations: {
        setToken: function (state, token) {
            state.token = token;
        },
        setRefreshToken: function (state, refreshToken) {
            state.refreshToken = refreshToken;
        },
        setUser: function (state, user) {
            state.user = user;
        }
    },
    actions: {
        whoami: function (_a) {
            var commit = _a.commit, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var data, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, AuthService.whoami()];
                        case 1:
                            data = (_b.sent()).data;
                            commit('setUser', data.user);
                            commit('space/setList', data.spaces, { root: true });
                            return [4 /*yield*/, dispatch('space/initSetting', null, { root: true })];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _b.sent();
                            dispatch('signout');
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        signup: function (_, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, AuthService.signup(payload)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        signin: function (_a, _b) {
            var commit = _a.commit;
            var type = _b.type, payload = _b.payload;
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, AuthService.signin(type, payload)];
                        case 1:
                            data = (_c.sent()).data;
                            commit('setToken', data.token);
                            commit('setRefreshToken', data.refreshToken);
                            return [2 /*return*/];
                    }
                });
            });
        },
        signout: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('setToken', null);
                    commit('setRefreshToken', null);
                    commit('setUser', null);
                    return [2 /*return*/];
                });
            });
        },
        recoverPassword: function (_, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, AuthService.recoverPassword(payload)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        passwordReset: function (_, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, AuthService.passwordReset(payload)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        passwordResetVerify: function (_, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, AuthService.passwordResetVerify(payload)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        refreshToken: function (_a) {
            var commit = _a.commit, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var persistedRefreshToken, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            persistedRefreshToken = Cookie.get(refreshTokenName) || '';
                            return [4 /*yield*/, AuthService.refreshToken(persistedRefreshToken)];
                        case 1:
                            data = (_b.sent()).data;
                            Cookie.set(tokenName, data.token);
                            Cookie.set(refreshTokenName, data.refreshToken);
                            commit('setToken', data.token);
                            commit('setRefreshToken', data.refreshToken);
                            return [4 /*yield*/, dispatch('whoami')];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
};
export default AuthModule;
//# sourceMappingURL=auth.js.map