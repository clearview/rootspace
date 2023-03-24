import { __awaiter, __generator } from "tslib";
import api from '@/utils/api';
function createService(url) {
    return new /** @class */ (function () {
        function class_1() {
        }
        class_1.prototype.create = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.post(url, { data: data })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.data.data];
                    }
                });
            });
        };
        class_1.prototype.destroy = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.delete("".concat(url, "/").concat(id))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        class_1.prototype.archive = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.post("".concat(url, "/").concat(id, "/archive"))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        class_1.prototype.restore = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.post("".concat(url, "/").concat(id, "/restore"))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        class_1.prototype.fetch = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.get(url, { params: params })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.data];
                    }
                });
            });
        };
        class_1.prototype.update = function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.patch("".concat(url, "/").concat(id), { data: data })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.data.data];
                    }
                });
            });
        };
        class_1.prototype.view = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.get("".concat(url, "/").concat(id))];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.data];
                    }
                });
            });
        };
        return class_1;
    }())();
}
function createChildService(url) {
    return new /** @class */ (function () {
        function class_2() {
        }
        class_2.prototype.create = function (data, parentId) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.post(url.replace(':parentId', String(parentId)), { data: data })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.data];
                    }
                });
            });
        };
        class_2.prototype.destroy = function (id, parentId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.delete("".concat(url.replace(':parentId', String(parentId)), "/").concat(id))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        class_2.prototype.fetch = function (params, parentId) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.get(url.replace(':parentId', String(parentId)), { params: params })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.data.data];
                    }
                });
            });
        };
        class_2.prototype.update = function (id, data, parentId) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.patch("".concat(url.replace(':parentId', String(parentId)), "/").concat(id), { data: data })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.data];
                    }
                });
            });
        };
        class_2.prototype.view = function (id, parentId) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, api.get("".concat(url.replace(':parentId', String(parentId)), "/").concat(id))];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.data];
                    }
                });
            });
        };
        return class_2;
    }())();
}
export var BoardService = createService('tasks/board');
export var ListService = createService('tasks/list');
export var ItemService = createService('tasks/task');
export var CommentService = createService('tasks/comment');
export var TagService = createChildService('tasks/board/:parentId/tags');
//# sourceMappingURL=task.js.map