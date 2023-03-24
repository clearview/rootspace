import { __assign, __awaiter, __generator } from "tslib";
import { createServiceModule } from '@/store/utils/createServiceModule';
import { ItemService } from '@/services/task';
import api from '@/utils/api';
var item = createServiceModule(ItemService, {
    afterCreate: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                var index = board.current.taskLists.findIndex(function (list) { return list.id === data.listId; });
                if (index !== -1) {
                    var list = board.current.taskLists[index];
                    if (!list.tasks) {
                        list.tasks = [__assign(__assign({}, data), { taskComments: [], attachments: [], assignees: [], tags: [] })];
                    }
                    else {
                        list.tasks.push(__assign(__assign({}, data), { taskComments: [], attachments: [], assignees: [], tags: [] }));
                    }
                }
            }
        }, { root: true });
    },
    afterUpdate: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                var list = board.current.taskLists.find(function (list) { return list.id === data.listId; });
                if (list) {
                    var oldItem = null;
                    var oldList = null;
                    for (var _i = 0, _a = board.current.taskLists; _i < _a.length; _i++) {
                        var lst = _a[_i];
                        for (var _b = 0, _c = lst.tasks; _b < _c.length; _b++) {
                            var tsk = _c[_b];
                            if (tsk.id === data.id) {
                                oldItem = tsk;
                                oldList = lst;
                                break;
                            }
                        }
                    }
                    if (oldItem && oldList) {
                        // Moved to another lane
                        if (oldItem.listId !== data.listId) {
                            oldList.tasks = oldList.tasks.filter(function (task) { return task.id !== data.id; });
                            var targetList = board.current.taskLists.find(function (list) { return list.id === data.listId; });
                            if (targetList) {
                                if (!targetList.tasks) {
                                    targetList.tasks = [data];
                                }
                                else {
                                    targetList.tasks.push(data);
                                }
                            }
                        }
                        else {
                            list.tasks = list.tasks.map(function (task) {
                                if (task.id === data.id) {
                                    return __assign({}, data);
                                }
                                return task;
                            });
                        }
                    }
                }
            }
        }, { root: true });
    },
    beforeUpdate: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                var list = board.current.taskLists.find(function (list) { return list.id === data.listId; });
                if (list) {
                    var oldItem_1 = null;
                    var oldList = null;
                    for (var _i = 0, _a = board.current.taskLists; _i < _a.length; _i++) {
                        var lst = _a[_i];
                        for (var _b = 0, _c = lst.tasks; _b < _c.length; _b++) {
                            var tsk = _c[_b];
                            if (tsk.id === data.id) {
                                oldItem_1 = tsk;
                                oldList = lst;
                                break;
                            }
                        }
                    }
                    if (oldItem_1 && oldList) {
                        // Moved to another lane
                        if (oldItem_1.listId !== data.listId) {
                            oldList.tasks = oldList.tasks.filter(function (task) { return task.id !== data.id; });
                            var targetList = board.current.taskLists.find(function (list) { return list.id === data.listId; });
                            if (targetList) {
                                if (!targetList.tasks) {
                                    targetList.tasks = [__assign(__assign({}, oldItem_1), { listId: data.listId, position: data.position })];
                                }
                                else {
                                    targetList.tasks.push(__assign(__assign({}, oldItem_1), { listId: data.listId, position: data.position }));
                                }
                            }
                        }
                        else {
                            list.tasks = list.tasks.map(function (task) {
                                if (task.id === data.id) {
                                    return __assign(__assign({}, oldItem_1), { listId: data.listId, position: data.position });
                                }
                                return task;
                            });
                        }
                    }
                }
                else if (data.dueDate) {
                    board.current.taskLists = board.current.taskLists.map(function (list) {
                        var task = list.tasks.find(function (task) { return task.id === data.id; });
                        if (task) {
                            task.dueDate = data.dueDate;
                        }
                        return list;
                    });
                }
            }
        }, { root: true });
    },
    afterDestroy: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                var listIndex = board.current.taskLists.findIndex(function (list) { return list.id === data.listId; });
                if (listIndex !== -1) {
                    var list = board.current.taskLists[listIndex];
                    list.tasks = list.tasks.filter(function (task) { return task.id !== data.id; });
                }
            }
        }, { root: true });
    }
});
if (item.actions) {
    item.actions.upload = function (_a, params) {
        var commit = _a.commit, rootGetters = _a.rootGetters;
        return __awaiter(void 0, void 0, void 0, function () {
            var activeSpace, formData, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        activeSpace = rootGetters['space/activeSpace'];
                        if (!activeSpace) {
                            throw new Error('Not in an active space');
                        }
                        if (!params.task.id) {
                            throw new Error('Invalid task ID');
                        }
                        formData = new FormData();
                        formData.append('file', params.file);
                        formData.append('entityId', params.task.id.toString());
                        formData.append('entity', 'Task');
                        formData.append('type', 'taskAttachment');
                        formData.append('spaceId', activeSpace.id);
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.post('/uploads', formData)];
                    case 1:
                        res = _b.sent();
                        if (!params.task.attachments) {
                            params.task.attachments = [];
                        }
                        params.task.attachments.push(res.data.data);
                        commit('setProcessing', false);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    item.actions.deleteUpload = function (_a, params) {
        var commit = _a.commit, rootGetters = _a.rootGetters;
        return __awaiter(void 0, void 0, void 0, function () {
            var activeSpace, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        activeSpace = rootGetters['space/activeSpace'];
                        if (!activeSpace) {
                            throw new Error('Not in an active space');
                        }
                        if (!params.task.id) {
                            throw new Error('Invalid task ID');
                        }
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.delete("/uploads/".concat(params.upload.id))];
                    case 1:
                        res = _b.sent();
                        if (params.task.attachments) {
                            params.task.attachments = params.task.attachments.filter(function (attc) { return attc.id !== params.upload.id; });
                        }
                        commit('setProcessing', false);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    item.actions.addAssigneeToTask = function (_a, params) {
        var commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('task/board/operate', function (board) {
                            if (board.current) {
                                board.current.taskLists = board.current.taskLists.map(function (list) {
                                    list.tasks = list.tasks.map(function (task) {
                                        if (task.id === params.taskId) {
                                            if (!task.assignees) {
                                                task.assignees = [];
                                            }
                                            if (params.user) {
                                                task.assignees.push(params.user);
                                            }
                                        }
                                        return task;
                                    });
                                    return list;
                                });
                            }
                        }, { root: true });
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.post("tasks/task/".concat(params.taskId, "/assignee/").concat(params.userId, "/add"))];
                    case 1:
                        res = _b.sent();
                        commit('setProcessing', false);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    item.actions.removeAssigneeFromTask = function (_a, params) {
        var commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('task/board/operate', function (board) {
                            if (board.current) {
                                board.current.taskLists = board.current.taskLists.map(function (list) {
                                    list.tasks = list.tasks.map(function (task) {
                                        if (task.id === params.taskId) {
                                            if (!task.assignees) {
                                                task.assignees = [];
                                            }
                                            task.assignees = task.assignees.filter(function (t) { return t.id !== params.userId; });
                                        }
                                        return task;
                                    });
                                    return list;
                                });
                            }
                        }, { root: true });
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.post("tasks/task/".concat(params.taskId, "/assignee/").concat(params.userId, "/remove"))];
                    case 1:
                        res = _b.sent();
                        commit('setProcessing', false);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    item.actions.archiveTask = function (_a, params) {
        var commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('task/board/operate', function (board) {
                            if (board.current) {
                                board.current.taskLists = board.current.taskLists.map(function (list) {
                                    list.tasks = list.tasks.filter(function (task) {
                                        return !(task.id === params.taskId && list.id === task.listId);
                                    });
                                    return list;
                                });
                            }
                        }, { root: true });
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.post("tasks/task/".concat(params.taskId, "/archive"))];
                    case 1:
                        res = _b.sent();
                        commit('setProcessing', false);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    item.actions.restoreTask = function (_a, params) {
        var commit = _a.commit;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commit('task/board/operate', function (board) {
                            if (board.current) {
                                board.current.taskLists = board.current.taskLists.map(function (list) {
                                    list.tasks = list.tasks.filter(function (task) {
                                        return !(task.id === params.taskId && list.id === task.listId);
                                    });
                                    return list;
                                });
                            }
                        }, { root: true });
                        commit('setProcessing', true);
                        return [4 /*yield*/, api.post("tasks/task/".concat(params.taskId, "/restore"))];
                    case 1:
                        res = _b.sent();
                        commit('setProcessing', false);
                        return [2 /*return*/, res];
                }
            });
        });
    };
}
export default item;
//# sourceMappingURL=item.js.map