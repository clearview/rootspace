import { Module } from 'vuex'

import { RootState, DocumentState } from '@/types/state'
import { DocumentResource } from '@/types/resource'

import FilesService from '@/services/document'

const FilesModule: Module<DocumentState, RootState> = {
  namespaced: true,

  state () {
    return {
      payload: [],
      deferredParent: null
    }
  },

  mutations: {
    setPayload (state, payload) {
      state.payload = payload
    },
    setDeferredParent (state, payload) {
      state.deferredParent = payload
    }
  },

  actions: {
    async destroy (_, data: DocumentResource) {
      if (!data.id) {
        throw new Error('ID is not defined')
      }

      await FilesService.destroy(data.id)
    }
  }
}

export default FilesModule
