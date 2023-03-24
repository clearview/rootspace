import { __awaiter, __generator } from "tslib";
import api from '@/utils/api';
var UserSetting = /** @class */ (function () {
    function UserSetting() {
    }
    UserSetting.view = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get('users/settings/' + id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    UserSetting.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.post('users/settings/' + id, { data: data })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UserSetting;
}());
export default UserSetting;
//# sourceMappingURL=userSetting.js.map