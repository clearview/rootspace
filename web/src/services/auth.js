import { __awaiter, __generator } from "tslib";
import api from '@/utils/api';
import { ValidationError } from '@/utils/error';
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.whoami = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1, response, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.get('whoami')];
                    case 1:
                        res = _a.sent();
                        if (!res.data) {
                            throw new Error('Invalid response from server');
                        }
                        if (res.data.status === 'error') {
                            throw new Error(res.data.msg);
                        }
                        return [2 /*return*/, res];
                    case 2:
                        err_1 = _a.sent();
                        response = err_1.response;
                        if (response) {
                            message = response.data.error.message;
                            throw new Error(message);
                        }
                        else {
                            throw err_1;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.signup = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_2, response, _a, message, fields;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.post('signup', payload)];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        err_2 = _b.sent();
                        response = err_2.response;
                        if (response) {
                            _a = response.data.error, message = _a.message, fields = _a.fields;
                            throw new ValidationError(message, fields);
                        }
                        else {
                            throw err_2;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.signin = function (type, payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (type) {
                    case 'google':
                        return [2 /*return*/, AuthService.signinGoogle(payload)];
                    case 'email':
                        return [2 /*return*/, AuthService.signinEmail(payload)];
                    default:
                        throw new Error('Sign-in type is not available');
                }
                return [2 /*return*/];
            });
        });
    };
    AuthService.signinGoogle = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_3, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.get('auth/google/callback', { params: params })];
                    case 1:
                        res = _a.sent();
                        if (!res.data) {
                            throw new Error('Invalid response from server');
                        }
                        if (res.data.status === 'error') {
                            throw new Error(res.data.msg);
                        }
                        return [2 /*return*/, res];
                    case 2:
                        err_3 = _a.sent();
                        response = err_3.response;
                        if (response) {
                            throw new Error(response.data.error.message);
                        }
                        else {
                            throw err_3;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.signinEmail = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_4, response, _a, message, fields;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.post('auth', payload)];
                    case 1:
                        res = _b.sent();
                        if (!res.data) {
                            throw new Error('Invalid response from server');
                        }
                        if (res.data.status === 'error') {
                            throw new Error(res.data.msg);
                        }
                        return [2 /*return*/, res];
                    case 2:
                        err_4 = _b.sent();
                        response = err_4.response;
                        if (response) {
                            _a = response.data.error, message = _a.message, fields = _a.fields;
                            throw new ValidationError(message, fields);
                        }
                        else {
                            throw err_4;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.recoverPassword = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_5, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.post('users/password/recovery', payload)];
                    case 1:
                        res = _a.sent();
                        if (!res.data) {
                            throw new Error('Invalid response from server');
                        }
                        if (res.data.status === 'error') {
                            throw new Error(res.data.msg);
                        }
                        return [2 /*return*/, res];
                    case 2:
                        err_5 = _a.sent();
                        response = err_5.response;
                        if (response) {
                            throw new Error(response.data.error.message);
                        }
                        else {
                            throw err_5;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.passwordReset = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_6, response, _a, message, fields;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.post('users/password/reset', payload)];
                    case 1:
                        res = _b.sent();
                        if (!res.data) {
                            throw new Error('Invalid response from server');
                        }
                        if (res.data.status === 'error') {
                            throw new Error(res.data.msg);
                        }
                        return [2 /*return*/, res];
                    case 2:
                        err_6 = _b.sent();
                        response = err_6.response;
                        if (response) {
                            _a = response.data.error, message = _a.message, fields = _a.fields;
                            throw new ValidationError(message, fields);
                        }
                        else {
                            throw err_6;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.passwordResetVerify = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_7, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.get("password/reset/verify/".concat(token))];
                    case 1:
                        res = _a.sent();
                        if (!res.data) {
                            throw new Error('Invalid response from server');
                        }
                        if (res.data.status === 'error') {
                            throw new Error(res.data.msg);
                        }
                        return [2 /*return*/, res];
                    case 2:
                        err_7 = _a.sent();
                        response = err_7.response;
                        if (response) {
                            throw new Error(response.data.error.message);
                        }
                        else {
                            throw err_7;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.refreshToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_8, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.get('/users/token', {
                                headers: {
                                    Authorization: "Bearer ".concat(token)
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.data) {
                            throw new Error('Invalid response from server');
                        }
                        if (res.data.status === 'error') {
                            throw new Error(res.data.msg);
                        }
                        return [2 /*return*/, res];
                    case 2:
                        err_8 = _a.sent();
                        response = err_8.response;
                        if (response) {
                            throw new Error(response.data.error.message);
                        }
                        else {
                            throw err_8;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthService;
}());
export default AuthService;
//# sourceMappingURL=auth.js.map