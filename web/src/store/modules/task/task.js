import board from '@/store/modules/task/board';
import list from '@/store/modules/task/list';
import comment from '@/store/modules/task/comment';
import item from '@/store/modules/task/item';
import tag from '@/store/modules/task/tag';
import settings from '@/store/modules/task/settings';
var TaskModule = {
    namespaced: true,
    modules: {
        board: board,
        list: list,
        comment: comment,
        item: item,
        tag: tag,
        settings: settings
    }
};
export default TaskModule;
//# sourceMappingURL=task.js.map