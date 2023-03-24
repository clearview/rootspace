import { __awaiter, __generator } from "tslib";
import { createChildServiceModule } from '@/store/utils/createChildServiceModule';
import { TagService } from '@/services/task';
import api from '@/utils/api';
import { merge, remove, difference } from 'lodash';
var tag = createChildServiceModule(TagService, function (root) { var _a; return (_a = root.task.board.current) === null || _a === void 0 ? void 0 : _a.id; }, {
    afterCreate: function (context, data) {
        if (!context.state.data) {
            context.state.data = [];
        }
        context.state.data.push(data);
    },
    afterUpdate: function (context, data) {
        context.state.data = context.state.data.map(function (tag) {
            if (tag.id === data.id) {
                return data;
            }
            return tag;
        });
    }
});
if (tag.actions) {
    tag.actions.addToTask = function (_a, params) {
        var state = _a.state, commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('task/board/operate', function (board) {
                            if (board.current) {
                                board.current.taskLists = board.current.taskLists.map(function (list) {
                                    var task = list.tasks.find(function (task) { return task.id === params.taskId; });
                                    var tag = state.data.find(function (tag) { return tag.id === params.tagId; });
                                    if (task && tag) {
                                        if (!task.tags) {
                                            task.tags = [];
                                        }
                                        task.tags.push(tag);
                                    }
                                    return list;
                                });
                            }
                        }, { root: true });
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.post("tasks/task/".concat(params.taskId, "/tag/").concat(params.tagId, "/add"))];
                    case 1:
                        res = _b.sent();
                        commit('setProcessing', false);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    tag.actions.removeFromTask = function (_a, params) {
        var commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('task/board/operate', function (board) {
                            if (board.current) {
                                board.current.taskLists = board.current.taskLists.map(function (list) {
                                    var task = list.tasks.find(function (task) { return task.id === params.taskId; });
                                    if (task && task.tags) {
                                        task.tags = task.tags.filter(function (t) { return t.id !== params.tagId; });
                                    }
                                    return list;
                                });
                            }
                        }, { root: true });
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.post("tasks/task/".concat(params.taskId, "/tag/").concat(params.tagId, "/remove"))];
                    case 1:
                        res = _b.sent();
                        commit('setProcessing', false);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    tag.actions.updateTag = function (_a, params) {
        var state = _a.state, commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.patch("tasks/board/tags/".concat(params.tagId), { data: params.data })];
                    case 1:
                        res = _b.sent();
                        commit('setProcessing', false);
                        commit('task/board/operate', function (board) {
                            if (board.current) {
                                board.current.taskLists = board.current.taskLists.map(function (list) {
                                    list.tasks.map(function (task) {
                                        if (task.tags) {
                                            var findIndex = task.tags.findIndex(function (t) { return t.id === params.tagId; });
                                            task.tags[findIndex] = merge(task.tags[findIndex], params.data);
                                        }
                                        return tag;
                                    });
                                    return list;
                                });
                            }
                            if (state) {
                                var findIndex = state.data.findIndex(function (t) { return t.id === params.tagId; });
                                state.data[findIndex] = merge(state.data[findIndex], params.data);
                            }
                        }, { root: true });
                        return [2 /*return*/, res];
                }
            });
        });
    };
    tag.actions.deleteTag = function (_a, params) {
        var state = _a.state, commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.delete("tasks/board/tags/".concat(params.tagId))];
                    case 1:
                        res = _b.sent();
                        commit('setProcessing', false);
                        commit('task/board/operate', function (board) {
                            if (board.current) {
                                board.current.taskLists = board.current.taskLists.map(function (list) {
                                    list.tasks.map(function (task) {
                                        if (task.tags) {
                                            var findIndex = task.tags.findIndex(function (t) { return t.id === params.tagId; });
                                            remove(task.tags, findIndex);
                                        }
                                        return tag;
                                    });
                                    return list;
                                });
                            }
                            if (state) {
                                var findIndex = state.data.findIndex(function (t) { return t.id === params.tagId; });
                                remove(state.data, findIndex);
                            }
                        }, { root: true });
                        return [2 /*return*/, res];
                }
            });
        });
    };
    tag.actions.reorderTags = function (_a, params) {
        var state = _a.state, commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var changedTags, promises;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('setProcessing', true);
                        changedTags = difference(params.data, state.data);
                        promises = [];
                        changedTags.forEach(function (tag) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                promises.push(api.patch("tasks/board/tags/".concat(tag.id), { data: tag }));
                                return [2 /*return*/];
                            });
                        }); });
                        // update the differences data
                        return [4 /*yield*/, Promise.all(promises)
                            // update current state
                        ];
                    case 1:
                        // update the differences data
                        _b.sent();
                        // update current state
                        state.data = params.data;
                        commit('setProcessing', false);
                        return [2 /*return*/];
                }
            });
        });
    };
}
export default tag;
//# sourceMappingURL=tag.js.map