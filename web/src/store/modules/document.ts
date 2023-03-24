import { Module } from 'vuex'

import { RootState, DocumentState } from '@/types/state'
import { DocumentResource } from '@/types/resource'

import DocumentService from '@/services/document'

const DocumentModule: Module<DocumentState, RootState> = {
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

      await DocumentService.destroy(data.id)
    }
  }
}

export default DocumentModule
