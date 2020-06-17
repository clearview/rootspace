import { Module } from 'vuex'

import { RootState, TaskState } from '@/types/state'
import { createServiceModule } from '@/store/utils/createServiceModule'
import { TaskBoardService, TaskItemService, TaskListService } from '@/services/task'

const TaskModule: Module<TaskState, RootState> = {
  namespaced: true,
  modules: {
    board: createServiceModule(new TaskBoardService()),
    list: createServiceModule(new TaskListService()),
    item: createServiceModule(new TaskItemService())
  }
}

export default TaskModule
