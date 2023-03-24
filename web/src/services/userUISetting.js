import { __awaiter, __generator } from "tslib";
import api from '@/utils/api';
var UserUISetting = /** @class */ (function () {
    function UserUISetting() {
    }
    UserUISetting.fetch = function (spaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.get('users/settings/ui/' + (spaceId || ''))];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, {}];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserUISetting.update = function (_a) {
        var spaceId = _a.spaceId, data = _a.data;
        return __awaiter(this, void 0, void 0, function () {
            var res, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.patch('users/settings/ui/' + (spaceId || ''), data)];
                    case 1:
                        res = _c.sent();
                        return [2 /*return*/, res.data.ui];
                    case 2:
                        _b = _c.sent();
                        return [2 /*return*/, {}];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserUISetting;
}());
export default UserUISetting;
//# sourceMappingURL=userUISetting.js.map