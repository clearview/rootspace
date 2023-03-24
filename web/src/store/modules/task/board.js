import { __awaiter, __generator } from "tslib";
import { createServiceModule } from '@/store/utils/createServiceModule';
import { BoardService } from '@/services/task';
import api from '@/utils/api';
var board = createServiceModule(BoardService);
if (board.actions) {
    board.actions.search = function (_a, params) {
        var commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('setFetching', true);
                        return [4 /*yield*/, api.post("tasks/board/".concat(params.boardId, "/search"), {
                                data: { search: params.search, filters: params.filters }
                            })];
                    case 1:
                        res = _b.sent();
                        commit('setFetching', false);
                        commit('setCurrent', res === null || res === void 0 ? void 0 : res.data.data);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    board.actions.archived = function (_a, params) {
        var commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('setFetching', true);
                        return [4 /*yield*/, api.get("tasks/board/".concat(params.boardId, "/archived"))];
                    case 1:
                        res = _b.sent();
                        commit('setFetching', false);
                        commit('setCurrent', res === null || res === void 0 ? void 0 : res.data.data);
                        return [2 /*return*/, res];
                }
            });
        });
    };
}
export default board;
//# sourceMappingURL=board.js.map