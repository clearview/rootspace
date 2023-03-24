import { __awaiter, __generator } from "tslib";
import api from '@/utils/api';
import { ValidationError } from '@/utils/error';
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.getProfile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get("users/".concat(id, "/profile"))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.data];
                }
            });
        });
    };
    UserService.confirmEmail = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1, response, _a, message, fields;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.patch('users/confirm/email', payload)];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        err_1 = _b.sent();
                        response = err_1.response;
                        if (response) {
                            _a = response.data.error, message = _a.message, fields = _a.fields;
                            throw new ValidationError(message, fields);
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
    UserService.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_2, response, _a, message, fields;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.patch('users', { data: data })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.data];
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
    UserService.passwordChange = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_3, response, _a, message, fields;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.patch('users/password', { data: data })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        err_3 = _b.sent();
                        response = err_3.response;
                        if (response) {
                            _a = response.data.error, message = _a.message, fields = _a.fields;
                            throw new ValidationError(message, fields);
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
    UserService.acceptInvitation = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.post('invites/accept', { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        error_1 = _a.sent();
                        err = error_1;
                        if (error_1.response) {
                            body = {
                                code: error_1.response.status,
                                message: (error_1.response.status === 401) ? error_1.response.data : error_1.response.data.error.message
                            };
                            err = body;
                        }
                        throw err;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.addInvitation = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.post('invites/create', { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        error_2 = _a.sent();
                        err = error_2;
                        if (error_2.response) {
                            body = {
                                code: error_2.response.status,
                                message: error_2.response.data
                            };
                            err = body;
                        }
                        throw err;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserService;
}());
export default UserService;
// export default {
//   confirmEmail,
//   update,
//   passwordChange,
//   acceptInvitation,
//   addInvitation
// }
//# sourceMappingURL=user.js.map