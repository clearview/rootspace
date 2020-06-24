import { Module } from 'vuex'

import { RootState, TaskState } from '@/types/state'
import { createServiceModule } from '@/store/utils/createServiceModule'
import { BoardService, CommentService, ItemService, ListService } from '@/services/task'

const TaskModule: Module<TaskState, RootState> = {
  namespaced: true,
  modules: {
    board: createServiceModule(BoardService),
    list: createServiceModule(ListService),
    item: createServiceModule(ItemService),
    comment: createServiceModule(CommentService)
  }
}

export default TaskModule
