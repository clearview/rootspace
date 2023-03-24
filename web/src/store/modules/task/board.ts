import { createServiceModule } from '@/store/utils/createServiceModule'
import { BoardService } from '@/services/task'
import api from '@/utils/api'

const board = createServiceModule(BoardService)
if (board.actions) {
  board.actions.search = async ({ commit }, params: {
    boardId: number;
    search: string;
    filters: {
      tags: number[];
      assignees: number[];
    };
  }) => {
    commit('setFetching', true)
    const res = await api.post(`tasks/board/${params.boardId}/search`, {
      data: { search: params.search, filters: params.filters }
    })
    commit('setFetching', false)
    commit('setCurrent', res?.data.data)
    return res
  }

  board.actions.archived = async ({ commit }, params: { boardId: number }) => {
    commit('setFetching', true)
    const res = await api.get(`tasks/board/${params.boardId}/archived`)
    commit('setFetching', false)
    commit('setCurrent', res?.data.data)
    return res
  }
}

export default board
