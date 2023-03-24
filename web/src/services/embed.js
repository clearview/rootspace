import { __awaiter, __generator } from "tslib";
import api from '@/utils/api';
export var EmbedType;
(function (EmbedType) {
    EmbedType["AIRTABLE"] = "airtable";
    EmbedType["GOOGLE_SHEETS"] = "google-sheets";
    EmbedType["FIGMA"] = "figma";
    EmbedType["CUSTOM"] = "custom";
})(EmbedType || (EmbedType = {}));
var EmbedService = /** @class */ (function () {
    function EmbedService() {
    }
    EmbedService.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.post('embeds', { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    EmbedService.view = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get("embeds/".concat(id))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    EmbedService.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.patch("embeds/".concat(data.id), { data: data })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    EmbedService.destroy = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.delete("embeds/".concat(data.id))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    return EmbedService;
}());
export default EmbedService;
//# sourceMappingURL=embed.js.map