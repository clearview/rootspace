import { Module } from 'vuex'

import { RootState, LinkState } from '@/types/state'
import { LinkResource } from '@/types/resource'

import LinkService from '@/services/link'

import store from '@/store'

const LinkModule: Module<LinkState, RootState> = {
  namespaced: true,

  state () {
    return {
      payload: [],
      folded: {},
      active: null
    }
  },

  mutations: {
    setPayload (state, payload) {
      state.payload = payload
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
    async fetch ({ commit }, params) {
      const currentSpace = store.state.auth.currentSpace

      if (currentSpace) {
        const res = await LinkService.fetch(currentSpace.id, params)
        commit('setPayload', res.data)
      }
    },

    async create ({ dispatch }, data: LinkResource) {
      await LinkService.create(data)
      await dispatch('fetch')
    },

    async update ({ dispatch }, data: LinkResource) {
      await LinkService.update(data.id, data)
      await dispatch('fetch')
    },

    async destroy ({ dispatch }, data: LinkResource) {
      if (!data.id) {
        throw new Error('ID is not defined')
      }

      await LinkService.destroy(data.id)
      await dispatch('fetch')
    }
  }
}

export default LinkModule
