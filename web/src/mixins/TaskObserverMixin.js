import { __assign, __awaiter, __decorate, __extends, __generator } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
var TaskObserverMixin = /** @class */ (function (_super) {
    __extends(TaskObserverMixin, _super);
    function TaskObserverMixin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TaskObserverMixin.prototype.createTag = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.$store.state.task.tag.data) {
                    this.$store.state.task.tag.data = [];
                }
                this.$store.state.task.tag.data.push(data);
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.updateTag = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.state.task.tag.data = this.$store.state.task.tag.data.map(function (tag) {
                    if (tag.id === data.id) {
                        return data;
                    }
                    return tag;
                });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.archiveTaskLane = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        board.current.taskLists = board.current.taskLists.filter(function (list) { return list.id !== data.id; });
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.createTaskLane = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        var isExist = board.current.taskLists.some(function (list) { return list.id === data.id; });
                        if (!isExist) {
                            board.current.taskLists.push(__assign(__assign({}, data), { tasks: [] }));
                        }
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.updateTaskLane = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        var index = board.current.taskLists.findIndex(function (list) { return list.id === data.id; });
                        if (index !== -1) {
                            var old = board.current.taskLists[index];
                            Vue.set(board.current.taskLists, index, __assign(__assign({}, data), { tasks: old.tasks }));
                        }
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.removeTagFromTask = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        board.current.taskLists = board.current.taskLists.map(function (list) {
                            var task = list.tasks.find(function (task) { return task.id === data.taskId; });
                            if (task && task.tags) {
                                task.tags = task.tags.filter(function (t) { return t.id !== data.tagId; });
                            }
                            return list;
                        });
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.addTagToTask = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        board.current.taskLists = board.current.taskLists.map(function (list) {
                            var task = list.tasks.find(function (task) { return task.id === data.taskId; });
                            var tag = _this.$store.state.task.tag.data.find(function (tag) { return tag.id === data.tagId; });
                            if (task && tag) {
                                if (!task.tags) {
                                    task.tags = [];
                                }
                                var isExist = task.tags.some(function (tag) { return tag.id === data.tagId; });
                                if (!isExist) {
                                    task.tags.push(tag);
                                }
                            }
                            return list;
                        });
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.removeAssignee = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        board.current.taskLists = board.current.taskLists.map(function (list) {
                            list.tasks = list.tasks.map(function (task) {
                                if (task.id === data.taskId) {
                                    if (!task.assignees) {
                                        task.assignees = [];
                                    }
                                    task.assignees = task.assignees.filter(function (assignee) { return assignee.id !== data.userId; });
                                }
                                return task;
                            });
                            return list;
                        });
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.addAssignee = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        board.current.taskLists = board.current.taskLists.map(function (list) {
                            list.tasks = list.tasks.map(function (task) {
                                if (task.id === data.taskId) {
                                    if (!task.assignees) {
                                        task.assignees = [];
                                    }
                                    if (data.user) {
                                        var isExist = task.assignees.some(function (assignee) { return assignee.id === data.user.id; });
                                        if (!isExist) {
                                            task.assignees.push(data.user);
                                        }
                                    }
                                }
                                return task;
                            });
                            return list;
                        });
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.restoreTaskItem = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        board.current.taskLists = board.current.taskLists.map(function (list) {
                            list.tasks = list.tasks.filter(function (task) {
                                return !(task.id === data.taskId && list.id === task.listId);
                            });
                            return list;
                        });
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.archiveTaskItem = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        board.current.taskLists = board.current.taskLists.map(function (list) {
                            list.tasks = list.tasks.filter(function (task) {
                                return !(task.id === data.taskId && list.id === task.listId);
                            });
                            return list;
                        });
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.createComment = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        board.current.taskLists = board.current.taskLists.map(function (list) {
                            list.tasks = list.tasks.map(function (task) {
                                if (task.id === data.taskId) {
                                    task.taskComments.push(data);
                                }
                                return task;
                            });
                            return list;
                        });
                    }
                }, { root: true });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.createTaskItem = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
                    if (board.current) {
                        var index = board.current.taskLists.findIndex(function (list) { return list.id === data.listId; });
                        if (index !== -1) {
                            var list = board.current.taskLists[index];
                            if (!list.tasks) {
                                list.tasks = [__assign(__assign({}, data), { taskComments: [], attachments: [], assignees: [], tags: [] })];
                            }
                            else {
                                // check if item id is exist on current list
                                var isExist = list.tasks.some(function (task) { return task.id === data.id; });
                                if (!isExist) {
                                    list.tasks.push(__assign(__assign({}, data), { taskComments: [], attachments: [], assignees: [], tags: [] }));
                                }
                            }
                        }
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin.prototype.updateTaskItem = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.$store.commit('task/board/operate', function (board) {
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
                return [2 /*return*/];
            });
        });
    };
    TaskObserverMixin = __decorate([
        Component
    ], TaskObserverMixin);
    return TaskObserverMixin;
}(Vue));
export default TaskObserverMixin;
//# sourceMappingURL=TaskObserverMixin.js.map