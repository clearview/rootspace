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
      folded: {},
      active: null
    }
  },

  mutations: {
    setList (state, list) {
      state.list = list
    },
    setActive (state, link) {
      state.active = link
    },
    setFolded (state, path) {
      state.folded = {
        ...state.folded,
        ...path
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
    }
  }
}

export default TreeModule
