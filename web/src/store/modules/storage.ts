import { Module } from 'vuex'

import { RootState, StorageState } from '@/types/state'
import { StorageResource, NewUploadResource } from '@/types/resource'
import api from '@/utils/api'
import StorageService from '@/services/storage'
import UserService from '@/services/user'
import UploadService from '@/services/upload'
type StorageContext = {
  id: number;
  search: string;
}

const FilesModule: Module<StorageState, RootState> = {
  namespaced: true,

  state () {
    return {
      info: null,
      item: null,
      processing: false,
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
      console.log(payload)
      state.viewAs = payload
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
      console.log('tes', res?.data.data)
      // const res = await StorageService.fetchItem(params.id, search)

      const uploadLists = res?.data.data
      // Loop to get the user detail
      for (let i = 0; i < uploadLists.length; i++) {
        const uploadItem = uploadLists[i]
        const resUser = await UserService.getProfile(uploadItem.userId)
        uploadItem.username = `${resUser.firstName} ${resUser.lastName}`
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

      return await UploadService.destroy(id)
    },

    async upload ({ commit, rootGetters }, payload: { item: StorageResource, file: File, config: any }) {
      const activeSpace = rootGetters['space/activeSpace']

      if (!activeSpace) {
        throw new Error('Not in an active space')
      }
      if (!payload.item.id) {
        throw new Error('Invalid files ID')
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
