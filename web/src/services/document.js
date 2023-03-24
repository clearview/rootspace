import { __awaiter, __generator } from "tslib";
import api from '@/utils/api';
var DocumentService = /** @class */ (function () {
    function DocumentService() {
    }
    DocumentService.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.post('docs', { data: data })];
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
    DocumentService.history = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.get("docs/".concat(id, "/history"))];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_2 = _a.sent();
                        err = error_2;
                        if (error_2.response) {
                            body = {
                                code: error_2.response.status,
                                data: error_2.response.data
                            };
                            err = body;
                        }
                        throw err;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DocumentService.view = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.get("docs/".concat(id))];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _a.sent();
                        err = error_3;
                        if (error_3.response) {
                            body = {
                                code: error_3.response.status,
                                data: error_3.response.data
                            };
                            err = body;
                        }
                        throw err;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DocumentService.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_4, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.patch("docs/".concat(id), { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
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
    DocumentService.destroy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_5, err, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.delete("docs/".concat(id))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
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
    return DocumentService;
}());
export default DocumentService;
//# sourceMappingURL=document.js.map