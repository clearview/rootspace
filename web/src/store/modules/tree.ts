import { Module } from 'vuex'

import { RootState, TreeState } from '@/types/state'
import { NodeResource } from '@/types/resource'

import TreeService from '@/services/tree'
import Vue from 'vue'

interface FetchParams {
  spaceId: number;
}

const TreeModule: Module<TreeState, RootState> = {
  namespaced: true,

  state () {
    return {
      list: [],
      folded: {},
      touched: {}
    }
  },

  mutations: {
    setList (state, list) {
      state.list = list
    },
    setFolded (state, folded) {
      state.folded = folded
    },
    updateNode (state, payload: {compareFn: (node: NodeResource) => boolean; fn: (node: NodeResource) => NodeResource}) {
      const looper = (nodes: NodeResource[]) => {
        let idx = 0
        for (const node of nodes) {
          if (payload.compareFn(node)) {
            console.log('nodes --- ', nodes, idx)
            Vue.set(nodes, idx, payload.fn(node))
          }
          idx++
          looper(node.children)
        }
      }
      console.log('state.list ', state, state.list)
      looper(state.list)
    },
    setTouched (state, touched) {
      state.touched = touched
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

    async clearArchive (_, spaceId: number) {
      await TreeService.clearArchive(spaceId)
    },

    async archive (_, data: NodeResource) {
      await TreeService.archive(data.id)
    },

    async restore (_, data: NodeResource) {
      await TreeService.restore(data.id)
    },

    async createFolder (_, data: NodeResource) {
      return await TreeService.createFolder(data)
    }
  }
}

export default TreeModule
