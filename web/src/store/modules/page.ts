import { Module } from 'vuex'
import { PageState, RootState } from '@/types/state'
import Cookie from 'js-cookie'

const PageModule: Module<PageState, RootState> = {
  namespaced: true,
  state () {
    return {
      ready: false
    }
  },
  mutations: {
    setReady (state, ready) {
      state.ready = ready
    }
  },
  actions: {
    checkVersion () {
      const currentVersion = Cookie.get('app_version') || ''
      const latestVersion: string = process.env.VUE_APP_VERSION || ''

      if (currentVersion !== latestVersion) {
        Cookie.set('app_version', latestVersion)
        window.location.reload()
      }
    }
  }
}

export default PageModule
