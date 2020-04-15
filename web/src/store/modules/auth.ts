
import AuthService from '@/services/auth'

const state = {
  token: null
}

const mutations = {
  setToken (state: any, token: null) {
    state.token = token
  }
}

const actions = {
  async withGoogle ({ commit }: { commit: any}, params: object) {
    const { token } = await AuthService.googleCallback(params)

    commit('setToken', token)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
