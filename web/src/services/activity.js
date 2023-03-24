import { __assign, __awaiter, __generator } from "tslib";
import api from '@/utils/api';
var ActivityService = /** @class */ (function () {
    function ActivityService() {
    }
    ActivityService.bySpace = function (spaceId, params) {
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.get('activities/space/' + spaceId, {
                            params: __assign({ offset: 0, limit: 10, type: 'content' }, params)
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.data];
                }
            });
        });
    };
    return ActivityService;
}());
export default ActivityService;
//# sourceMappingURL=activity.js.map