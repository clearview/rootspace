import { Module } from 'vuex'

import { RootState, TaskState } from '@/types/state'
import board from '@/store/modules/task/board'
import list from '@/store/modules/task/list'
import comment from '@/store/modules/task/comment'
import item from '@/store/modules/task/item'
import tag from '@/store/modules/task/tag'

const TaskModule: Module<TaskState, RootState> = {
  namespaced: true,
  modules: {
    board: board,
    list: list,
    comment: comment,
    item: item,
    tag: tag
  }
}

export default TaskModule
