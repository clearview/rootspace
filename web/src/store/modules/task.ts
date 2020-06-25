import { Module } from 'vuex'

import { RootState, TaskState } from '@/types/state'
import { createServiceModule } from '@/store/utils/createServiceModule'
import { BoardService, CommentService, ItemService, ListService, TagService } from '@/services/task'
import { createChildServiceModule } from '@/store/utils/createChildServiceModule'
import api from '@/utils/api'

const tag = createChildServiceModule(TagService, (root: RootState) => root.task.board.current?.id)
if (tag.actions) {
  tag.actions.addToTask = async ({ commit }, params: { taskId: number; tagId: number }) => {
    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/tag/${params.tagId}/add`)
    commit('setProcessing', false)
    return res
  }
  tag.actions.removeFromTask = async ({ commit }, params: { taskId: number; tagId: number }) => {
    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/tag/${params.tagId}/remove`)
    commit('setProcessing', false)
    return res
  }
}

const TaskModule: Module<TaskState, RootState> = {
  namespaced: true,
  modules: {
    board: createServiceModule(BoardService),
    list: createServiceModule(ListService),
    item: createServiceModule(ItemService),
    comment: createServiceModule(CommentService),
    tag
  }
}

export default TaskModule
