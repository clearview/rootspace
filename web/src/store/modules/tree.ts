import { Module } from 'vuex'
import { findIndex } from 'lodash'

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
      favorites: [],
      focusedList: [],
      folded: {},
      touched: {}
    }
  },

  getters: {
    isFavorited: state => (data: NodeResource) => {
      if (!state.favorites.length) {
        return false
      }
      return (findIndex(state.favorites, { id: data.id }) >= 0)
    },
    getNode: state => (fn: (node: NodeResource) => boolean) => {
      return state.list.find(fn)
    }
  },

  mutations: {
    setList (state, list) {
      state.list = list
    },
    setFavorites (state, favorites) {
      state.favorites = favorites
    },
    setFocusedList (state, list) {
      state.focusedList = list
    },
    updateNode (state, payload: {compareFn: (node: NodeResource) => boolean; fn: (node: NodeResource) => NodeResource}) {
      const looper = (nodes: NodeResource[]) => {
        let idx = 0
        for (const node of nodes) {
          if (payload.compareFn(node)) {
            Vue.set(nodes, idx, payload.fn(node))
          }
          idx++
          looper(node.children)
        }
      }
      looper(state.list)
    },
    setFolded (state, folded) {
      state.folded = folded
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

    async fetchFavorites ({ commit }, params: FetchParams) {
      const res = await TreeService.fetchFavoritesBySpace(params.spaceId)

      commit('setFavorites', res.data)
    },

    async setFocusedList ({ commit }, data: NodeResource) {
      commit('setFocusedList', [data])
    },

    async clearFocusedList ({ commit }) {
      commit('setFocusedList', [])
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

    async addToFavorites (_, data: NodeResource) {
      await TreeService.addToFavorites(data.id)
    },

    async removeFromFavorites (_, data: NodeResource) {
      await TreeService.removeFromFavorites(data.id)
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
