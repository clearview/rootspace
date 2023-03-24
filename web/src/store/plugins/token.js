import { __awaiter, __generator } from "tslib";
import Cookie from 'js-cookie';
import { setAPIToken } from '@/utils/api';
var name = 'root_session';
var refreshTokenName = 'root_session_refresh_token';
function init(store) {
    var persistedToken = Cookie.get(name) || null;
    var persistedRefreshToken = Cookie.get(refreshTokenName) || null;
    store.commit('auth/setToken', persistedToken);
    store.commit('auth/setRefreshToken', persistedRefreshToken);
    store.subscribe(function (mutation, state) {
        if (mutation.type === 'auth/setToken') {
            var token = state.auth.token;
            if (token) {
                Cookie.set(name, token);
            }
            else {
                Cookie.remove(name);
            }
        }
        if (mutation.type === 'auth/setRefreshToken') {
            var refreshToken = state.auth.refreshToken;
            if (refreshToken) {
                Cookie.set(refreshTokenName, refreshToken);
            }
            else {
                Cookie.remove(refreshTokenName);
            }
        }
    });
}
function plugin(store) {
    var _this = this;
    store.subscribe(function (mutation, state) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (mutation.type === 'auth/setToken') {
                setAPIToken(state.auth.token);
            }
            return [2 /*return*/];
        });
    }); });
    init(store);
}
export default { plugin: plugin };
//# sourceMappingURL=token.js.map