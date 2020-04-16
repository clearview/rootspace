
import AuthService from '@/services/auth'

const state = {
  token: null,
  user: null,
  spaces: null
}

const mutations = {
  setToken (state: any, token: null) {
    state.token = token
  },
  setUser (state: any, user: null) {
    state.user = user
  },
  setSpaces (state: any, spaces: null) {
    state.spaces = spaces
  }
}

const actions = {
  async withGoogle ({ commit }: { commit: any}, params: object) {
    const { token } = await AuthService.googleCallback(params)
    commit('setToken', token)

    const userRes = await AuthService.whoami()
    commit('setUser', userRes.user)
    commit('setSpaces', userRes.spaces)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
