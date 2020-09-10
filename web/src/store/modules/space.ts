import { Module } from 'vuex'
import { get, isEmpty } from 'lodash'

import { RootState, SpaceState } from '@/types/state'
import { SpaceResource, SpaceSettingResource } from '@/types/resource'

import api from '@/utils/api'

const SpaceModule: Module<SpaceState, RootState> = {
  namespaced: true,

  state () {
    return {
      activeIndex: 0,
      list: [],
      settings: []
    }
  },

  getters: {
    isListEmpty (state): boolean {
      return state.list.length < 1
    },

    getIndex: state => (id: number) => (
      state.list.findIndex(x => x.id === id)
    ),

    getSpaceByIndex: state => (index: number) => (
      state.list[index] || null
    ),

    getSettingByIndex: state => (index: number) => (
      state.settings[index] || null
    ),

    getSpaceById: (_, getters) => (id: number) => getters.getSpaceByIndex(
      getters.getIndex(id)
    ),

    getSettingById: (_, getters) => (id: number) => getters.getSettingByIndex(
      getters.getIndex(id)
    ),

    activeSpace: (state, getters) => getters.getSpaceByIndex(
      state.activeIndex
    ) || {},

    activeSetting: (state, getters) => getters.getSettingByIndex(
      state.activeIndex
    ) || {}
  },

  mutations: {
    setActiveIndex (state, payload: number) {
      state.activeIndex = payload
    },

    setList (state, payload: SpaceResource[]) {
      state.list = payload
    },

    addListItem (state, payload: SpaceResource) {
      state.list = [
        ...state.list,
        payload
      ]
    },

    updateListItem (state, payload: { index: number; data: SpaceResource}) {
      const list = [...state.list]

      list[payload.index] = {
        ...list[payload.index],
        ...payload.data
      }

      state.list = list
    },

    setSettings (state, payload: SpaceSettingResource[]) {
      state.settings = payload
    },

    updateSettingsItem (state, payload: { index: number; data: SpaceSettingResource }) {
      const settings = [...state.settings]

      settings[payload.index] = {
        ...settings[payload.index],
        ...payload.data
      }

      state.settings = settings
    }
  },

  actions: {
    async fetch ({ commit }, params: object) {
      const res = await api.get('/spaces', { params })

      commit('setList', res.data)
    },

    async create ({ commit }, space: SpaceResource) {
      const res = await api.post('/spaces', space)

      commit('addListItem', res.data)

      return res.data
    },

    async update ({ commit, getters }, data: SpaceResource) {
      const index = getters.getIndex(data.id)

      commit('updateListItem', { index, data })

      const res = await api.patch('/spaces/' + data.id, data)

      return res.data
    },

    async initSetting ({ commit, dispatch, state, getters }) {
      const { data } = await api.get('/users/settings/')
      const activeIndex = get(data, 'preferences.activeIndex', 0)

      if (activeIndex !== state.activeIndex) {
        commit('setActiveIndex', activeIndex)
      }

      await dispatch('fetchSetting', getters.activeSpace.id)
    },

    async fetchSetting ({ commit, getters }, id: number) {
      const index = getters.getIndex(id)

      const res = await api.get('/users/settings/' + id)
      const data = get(res, 'data.preferences', {})

      commit('updateSettingsItem', { index, data })

      return data
    },

    async updateSetting ({ commit, getters }, payload: { id: number; data: Partial<SpaceSettingResource>}) {
      const index = getters.getIndex(payload.id)

      if (isEmpty(payload.data)) return

      commit('updateSettingsItem', { index, data: payload.data })

      const res = await api.put('/users/settings/' + payload.id, getters.getSettingByIndex(index))

      return res.data
    },

    async activate ({ commit, dispatch, state, getters }, id: number) {
      const index = getters.getIndex(id)

      await dispatch('fetchSetting', id)

      if (index !== state.activeIndex) {
        commit('setActiveIndex', index)

        await api.put('/users/settings/', { activeIndex: index })
      }
    },

    async clean ({ commit }) {
      commit('setList', [])
      commit('setSettings', [])
    }
  }
}

export default SpaceModule
