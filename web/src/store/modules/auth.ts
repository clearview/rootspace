import { Module } from 'vuex'

import { RootState, AuthState } from '@/types/state'
import { SpaceResource } from '@/types/resource'

import AuthService from '@/services/auth'

type SigninContext = {
  type: string;
  payload: object;
}

type WhoamiOptions = {
  updateSpace?: boolean;
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
    async whoami ({ commit, dispatch, state }, opts: WhoamiOptions = {}) {
      try {
        const { data } = await AuthService.whoami()

        commit('setUser', data.user)
        commit('setSpaces', data.spaces)

        if (opts.updateSpace) {
          const spaces: SpaceResource[] = state.spaces || []
          const cache: Partial<SpaceResource> = state.currentSpace || {}

          const space = spaces.find(
            (space: SpaceResource) => space.id === cache.id
          )

          commit('setCurrentSpace', space || spaces[0])
        }
      } catch (err) {
        dispatch('signout')
      }
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
