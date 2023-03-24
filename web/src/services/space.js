import { __awaiter, __generator } from "tslib";
import api from '@/utils/api';
var SpaceService = /** @class */ (function () {
    function SpaceService() {
    }
    SpaceService.create = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.post('spaces', payload)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_1 = _a.sent();
                        err = error_1;
                        if (error_1.response) {
                            body = {
                                code: error_1.response.status,
                                message: error_1.response.data
                            };
                            err = body;
                        }
                        throw err;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SpaceService.update = function (id, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.patch("spaces/".concat(id), payload)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_2 = _a.sent();
                        err = error_2;
                        if (error_2.response) {
                            body = {
                                code: error_2.response.status,
                                message: (error_2.response.status === 401) ? error_2.response.data : error_2.response.data.error.message,
                                fields: error_2.response.data.error.fields
                            };
                            err = body;
                        }
                        throw err;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SpaceService.my = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get('spaces/my')];
                    case 1:
                        data = (_a.sent()).data;
                        if (data.status === 'error') {
                            throw new Error(data);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SpaceService.view = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get("spaces/".concat(id))];
                    case 1:
                        data = (_a.sent()).data;
                        if (data.status === 'error') {
                            throw new Error(data);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SpaceService.spaceUsers = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id)
                            throw new Error('ID cannot empty');
                        return [4 /*yield*/, api.get("spaces/".concat(id, "/users"))];
                    case 1:
                        data = (_a.sent()).data;
                        if (data.status === 'error') {
                            throw new Error(data);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SpaceService.spaceUsersPending = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get("spaces/".concat(id, "/invites"))];
                    case 1:
                        data = (_a.sent()).data;
                        if (data.status === 'error') {
                            throw new Error(data);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SpaceService.removeUser = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_3, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.delete("spaces/".concat(id, "/users/").concat(userId))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_3 = _a.sent();
                        err = error_3;
                        if (error_3.response) {
                            body = {
                                code: error_3.response.status,
                                message: (error_3.response.status === 401) ? error_3.response.data : error_3.response.data.error.message,
                                fields: error_3.response.data.error.fields
                            };
                            err = body;
                        }
                        throw err;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SpaceService.cancelUser = function (id, inviteId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.delete("invites/cancel/".concat(inviteId))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        err = error_4;
                        if (error_4.response) {
                            body = {
                                code: error_4.response.status,
                                message: (error_4.response.status === 401) ? error_4.response.data : error_4.response.data.error.message,
                                fields: error_4.response.data.error.fields
                            };
                            err = body;
                        }
                        throw err;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SpaceService.whoami = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_5, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.get("spaces/".concat(id, "/whoami"))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.data];
                    case 2:
                        error_5 = _a.sent();
                        err = error_5;
                        if (error_5.response) {
                            body = {
                                code: error_5.response.status,
                                message: (error_5.response.status === 401) ? error_5.response.data : error_5.response.data.error.message,
                                fields: error_5.response.data.error.fields
                            };
                            err = body;
                        }
                        throw err;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SpaceService.updateUserRole = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.patch("/spaces/".concat(data.id, "/users/").concat(data.userId), { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    SpaceService.updateInvitationRole = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.patch("/invites/role/".concat(data.id), { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    return SpaceService;
}());
export default SpaceService;
//# sourceMappingURL=space.js.map