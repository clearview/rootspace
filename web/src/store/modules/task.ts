import { Module } from 'vuex'

import { RootState, TaskState } from '@/types/state'
import { createServiceModule } from '@/store/utils/createServiceModule'
import { BoardService } from '@/services/task'

const TaskModule: Module<TaskState, RootState> = {
  namespaced: true,
  modules: {
    board: createServiceModule(BoardService)
  }
}

export default TaskModule
