import { Module } from 'vuex'

import { RootState, TreeState } from '@/types/state'
import { NodeResource } from '@/types/resource'

import TreeService from '@/services/tree'

interface FetchParams {
  spaceId: number;
}

const TreeModule: Module<TreeState, RootState> = {
  namespaced: true,

  state () {
    return {
      list: [],
      folded: {}
    }
  },

  mutations: {
    setList (state, list) {
      state.list = list
    },
    setFolded (state, folded) {
      state.folded = folded
    },
    updateFolded (state, { index, value }) {
      state.folded = {
        ...state.folded,
        [index]: value
      }
    }
  },

  actions: {
    async fetch ({ commit }, params: FetchParams) {
      const res = await TreeService.fetchBySpace(params.spaceId)

      commit('setList', res.data)
    },

    async update (_, data: NodeResource) {
      await TreeService.update(data.id, data)
    },

    async destroy (_, data: NodeResource) {
      await TreeService.destroy(data.id)
    },

    async createFolder (_, data: NodeResource) {
      await TreeService.createFolder(data)
    }
  }
}

export default TreeModule
