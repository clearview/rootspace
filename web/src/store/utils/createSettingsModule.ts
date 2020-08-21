import { RootState } from '@/types/state'

import { Module } from 'vuex'

export function createSettingsModule<TSetting> (defaults: () => TSetting): Module<TSetting, RootState> {
  return {
    namespaced: true,
    state (): TSetting {
      return defaults()
    },
    mutations: {
      setData (state, setter: (settings: TSetting) => TSetting) {
        setter(state)
      }
    },
    actions: {

    }
  }
}
