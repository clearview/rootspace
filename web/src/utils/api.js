import { __awaiter, __generator } from "tslib";
import axios from 'axios';
import store from '@/store';
var api = axios.create({
    baseURL: baseURL()
});
api.interceptors.response.use(function (response) {
    return response;
}, function (error) { return __awaiter(void 0, void 0, void 0, function () {
    var originalConfig, _error_1, _error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                originalConfig = error.config;
                if (!(originalConfig.url !== '/auth/signin' && error.response)) return [3 /*break*/, 8];
                if (!(originalConfig.url === '/users/token' && ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 && !originalConfig._retry)) return [3 /*break*/, 4];
                originalConfig._retry = true;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.dispatch('auth/signout')];
            case 2:
                _b.sent();
                return [2 /*return*/, api(originalConfig)];
            case 3:
                _error_1 = _b.sent();
                return [2 /*return*/, Promise.reject(_error_1)];
            case 4:
                if (!(error.response.status === 401 && !originalConfig._retry)) return [3 /*break*/, 8];
                originalConfig._retry = true;
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, store.dispatch('auth/refreshToken')];
            case 6:
                _b.sent();
                return [2 /*return*/, api(originalConfig)];
            case 7:
                _error_2 = _b.sent();
                return [2 /*return*/, Promise.reject(_error_2)];
            case 8: return [2 /*return*/];
        }
    });
}); });
export function setAPIToken(token) {
    if (api === null || api === void 0 ? void 0 : api.defaults) {
        api.defaults.headers.common.Authorization = token
            ? "Bearer ".concat(token)
            : null;
    }
}
export function baseURL(path) {
    if (path === void 0) { path = '/'; }
    return process.env.VUE_APP_API_URL + '/' + path.replace(/^\/+/g, '');
}
export default api;
//# sourceMappingURL=api.js.map