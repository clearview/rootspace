import { Module } from 'vuex'

import { RootState, LinkState } from '@/types/state'
import { LinkResource } from '@/types/resource'

import LinkService from '@/services/link'

const LinkModule: Module<LinkState, RootState> = {
  namespaced: true,

  state () {
    return {
      active: null,
      payload: []
    }
  },

  mutations: {
    setActive (state, link) {
      state.active = link
    },
    setPayload (state, payload) {
      state.payload = payload
    }
  },

  actions: {
    async fetch ({ commit }, params) {
      const res = await LinkService.fetch(params)

      commit('setPayload', res)
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
