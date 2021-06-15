import { Module } from 'vuex'

import { RootState, StorageState } from '@/types/state'
import { StorageResource, NewUploadResource } from '@/types/resource'
import api from '@/utils/api'
import StorageService from '@/services/storage'
import UploadService from '@/services/upload'

const FilesModule: Module<StorageState, RootState> = {
  namespaced: true,

  state () {
    return {
      info: null,
      item: null,
      processing: false,
      totalData: 0,
      viewAs: 0
    }
  },

  mutations: {
    setInfo (state, data) {
      state.info = data
    },
    setItem (state, data) {
      state.item = data
    },
    setViewAs (state, payload: number) {
      state.viewAs = payload
    },
    setTotalData (state, data) {
      state.totalData = data.length
    },
    setProcessing (state, payload: boolean): void {
      state.processing = payload
    }
  },

  actions: {
    async info ({ commit }, id: number) {
      const res = await StorageService.view(id)
      commit('setInfo', res.data)
    },

    async fetch ({ commit }, params: { id: number; search: string; }) {
      const res = await api.get(`storages/${params.id}/files`, {
        params: { search: params.search }
      })
      if (!params.search) {
        commit('setTotalData', res?.data.data)
      }
      commit('setItem', res?.data.data)
    },

    async create (_, data: StorageResource) {
      return await StorageService.create(data)
    },

    async update (_, payload: { id: number, data: NewUploadResource }) {
      return await UploadService.update(payload.id, payload.data)
    },

    async destroy (_, id: number) {
      if (!id) {
        throw new Error('ID is not defined')
      }

      return await UploadService.trash(id)
    },

    async restore (_, id: number) {
      if (!id) {
        throw new Error('ID is not defined')
      }

      return await UploadService.restore(id)
    },

    async upload ({ commit, rootGetters }, payload: { item: StorageResource, file: File, config: any }) {
      const activeSpace = rootGetters['space/activeSpace']

      if (!activeSpace) {
        throw new Error('Not in an active space')
      }
      if (!payload.item.id) {
        throw new Error('Invalid storage ID')
      }
      const formData = new FormData()
      formData.append('file', payload.file)
      formData.append('entityId', payload.item.id.toString())
      formData.append('type', 'storage')
      formData.append('spaceId', activeSpace.id)
      commit('setProcessing', true)
      const res = await api.post('/uploads', formData, payload.config)
      if (!payload.item.uploads) {
        payload.item.uploads = []
      }
      commit('setProcessing', false)
      return res
    }
  }
}

export default FilesModule
