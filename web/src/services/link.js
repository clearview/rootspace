import { __awaiter, __generator, __rest } from "tslib";
import api from '@/utils/api';
var LinkService = /** @class */ (function () {
    function LinkService() {
    }
    LinkService.fetch = function (_a) {
        var spaceId = _a.spaceId, params = __rest(_a, ["spaceId"]);
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, api.get("links/".concat(spaceId), { params: params })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    LinkService.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.post('links', { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    LinkService.view = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get("links/".concat(id))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    LinkService.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.patch("links/".concat(id), { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    LinkService.destroy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.delete("links/".concat(id))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    return LinkService;
}());
export default LinkService;
//# sourceMappingURL=link.js.map