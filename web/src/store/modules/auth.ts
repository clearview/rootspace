import { Module } from 'vuex'

import { RootState, AuthState } from '@/types/state'
import { WorkspaceResource } from '@/types/resource'

import AuthService from '@/services/auth'

type SigninContext = {
  type: string;
  payload: object;
}

const AuthModule: Module<AuthState, RootState> = {
  namespaced: true,
  state () {
    return {
      token: null,
      user: null,
      spaces: null,
      currentSpace: null
    }
  },

  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUser (state, user) {
      state.user = user
    },
    setSpaces (state, spaces) {
      state.spaces = spaces
    },
    setCurrentSpace (state, space) {
      state.currentSpace = space
    }
  },

  actions: {
    async whoami ({ commit, dispatch }) {
      try {
        const { data } = await AuthService.whoami()

        commit('setUser', data.user)
        commit('setSpaces', data.spaces)
      } catch (err) {
        dispatch('signout')
      }
    },
    async initSpace ({ commit, state }) {
      const spaces: WorkspaceResource[] = state.spaces || []
      const cache: Partial<WorkspaceResource> = state.currentSpace || {}

      const space = spaces.find(
        (space: WorkspaceResource) => space.id === cache.id
      )

      commit('setCurrentSpace', space || spaces[0])
    },
    async signup (_, payload) {
      await AuthService.signup(payload)
    },
    async signin ({ commit }, { type, payload }: SigninContext) {
      const { data } = await AuthService.signin(type, payload)

      commit('setToken', data.token)
    },
    async signout ({ commit }) {
      commit('setToken', null)
      commit('setUser', null)
      commit('setSpaces', null)
      commit('setCurrentSpace', null)
    }
  }
}

export default AuthModule
