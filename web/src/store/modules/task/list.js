import { __assign } from "tslib";
import { createServiceModule } from '@/store/utils/createServiceModule';
import { ListService } from '@/services/task';
import Vue from 'vue';
var list = createServiceModule(ListService, {
    afterCreate: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                board.current.taskLists.push(__assign(__assign({}, data), { tasks: [] }));
            }
        }, { root: true });
    },
    afterUpdate: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                var index = board.current.taskLists.findIndex(function (list) { return list.id === data.id; });
                if (index !== -1) {
                    var old = board.current.taskLists[index];
                    Vue.set(board.current.taskLists, index, __assign(__assign({}, data), { tasks: old.tasks }));
                }
            }
        }, { root: true });
    },
    beforeUpdate: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                var index = board.current.taskLists.findIndex(function (list) { return list.id === data.id; });
                if (index !== -1) {
                    var old = board.current.taskLists[index];
                    if (data.position) {
                        Vue.set(board.current.taskLists, index, __assign(__assign({}, old), { position: data.position }));
                    }
                    else if (data.settings) {
                        Vue.set(board.current.taskLists, index, __assign(__assign({}, old), { settings: data.settings }));
                    }
                }
            }
        }, { root: true });
    },
    afterDestroy: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                board.current.taskLists = board.current.taskLists.filter(function (list) { return list.id !== data.id; });
            }
        }, { root: true });
    },
    afterArchive: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                board.current.taskLists = board.current.taskLists.filter(function (list) { return list.id !== data.id; });
            }
        }, { root: true });
    },
    afterRestore: function (context, data) {
        context.commit('task/board/operate', function (board) {
            if (board.current) {
                board.current.taskLists = board.current.taskLists.filter(function (list) { return list.id !== data.id; });
            }
        }, { root: true });
    }
});
export default list;
//# sourceMappingURL=list.js.map