import { createServiceModule } from '@/store/utils/createServiceModule';
import { CommentService } from '@/services/task';
export default createServiceModule(CommentService, {
    afterCreate: function (context, data) {
        context.commit('task/board/operate', function (board) {
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
    },
    afterUpdate: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                board.current.taskLists = board.current.taskLists.map(function (list) {
                    list.tasks = list.tasks.map(function (task) {
                        if (task.id === data.taskId) {
                            task.taskComments = task.taskComments.map(function (comment) {
                                if (comment.id === data.id) {
                                    return data;
                                }
                                return comment;
                            });
                        }
                        return task;
                    });
                    return list;
                });
            }
        }, { root: true });
    },
    afterDestroy: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                board.current.taskLists = board.current.taskLists.map(function (list) {
                    list.tasks = list.tasks.map(function (task) {
                        if (task.id === data.taskId) {
                            task.taskComments = task.taskComments.filter(function (comment) { return comment.id !== data.id; });
                        }
                        return task;
                    });
                    return list;
                });
            }
        }, { root: true });
    }
});
//# sourceMappingURL=comment.js.map