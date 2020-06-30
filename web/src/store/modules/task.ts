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

const item = createServiceModule(ItemService)
if (item.actions) {
  item.actions.addAssigneeToTask = async ({ commit }, params: { taskId: number; userId: number }) => {
    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/assignee/${params.userId}/add`)
    commit('setProcessing', false)
    return res
  }
  item.actions.removeAssigneeFromTask = async ({ commit }, params: { taskId: number; userId: number }) => {
    commit('setProcessing', true)
    const res = await api.post(`tasks/task/${params.taskId}/assignee/${params.userId}/remove`)
    commit('setProcessing', false)
    return res
  }
}

const TaskModule: Module<TaskState, RootState> = {
  namespaced: true,
  modules: {
    board: createServiceModule(BoardService),
    list: createServiceModule(ListService),
    comment: createServiceModule(CommentService),
    item,
    tag
  }
}

export default TaskModule
