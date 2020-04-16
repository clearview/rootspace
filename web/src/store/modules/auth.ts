
import AuthService from '@/services/auth'

const state = {
  token: null,
  user: null
}

const mutations = {
  setToken (state: any, token: null) {
    state.token = token
  },
  setUser (state: any, user: null) {
    state.user = user
  }
}

const actions = {
  async withGoogle ({ commit }: { commit: any}, params: object) {
    const { token } = await AuthService.googleCallback(params)
    commit('setToken', token)

    const userRes = await AuthService.whoami()
    const user = {
      id: userRes.id,
      name: userRes.name,
      email: userRes.email
    }
    commit('setUser', user)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
