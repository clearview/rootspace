import { Module } from 'vuex'
import { RootState, LinkState } from '@/types/state'

import LinkService from '@/services/link'
import { LinkResource } from '@/types/resource'

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
    },
    pushPayload (state, link) {
      state.payload = [
        ...state.payload,
        link
      ]
    },
    popPayload (state, link) {
      state.payload = state.payload.filter(item => item !== link)
    }
  },
  actions: {
    async fetch ({ commit }, params) {
      const res = await LinkService.fetch(params)

      commit('setPayload', res)
    },

    async create ({ commit }, data: LinkResource) {
      const res = await LinkService.create(data)

      commit('pushPayload', res)
    },

    async destroy ({ commit }, data: LinkResource) {
      if (!data.id) {
        throw new Error('ID is not defined')
      }

      await LinkService.destroy(data.id)

      commit('popPayload', data)
    }
  }
}

export default LinkModule
