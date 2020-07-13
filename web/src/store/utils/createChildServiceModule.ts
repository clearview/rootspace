import { ResourceState, RootState } from '@/types/state'

import { ChildApiService } from '@/services/task'
import { Module } from 'vuex'
import { ApiResource } from '@/types/resource'

export function createChildServiceModule<TResource extends ApiResource | Omit<ApiResource, 'createdAt' | 'updatedAt'>, TParams> (service: ChildApiService<TResource, TParams>, parentResolver: (root: RootState) => number | null | undefined): Module<ResourceState<TResource>, RootState> {
  return {
    namespaced: true,
    state (): ResourceState<TResource> {
      return {
        fetching: false,
        current: null,
        data: [],
        processing: false
      }
    },
    mutations: {
      setFetching (state, payload: boolean): void {
        state.fetching = payload
      },
      setCurrent (state, payload: TResource): void {
        state.current = payload
      },
      setData (state, payload: TResource[]): void {
        state.data = payload
      },
      setProcessing (state, payload: boolean): void {
        state.processing = payload
      }
    },
    actions: {
      async fetch ({ commit, rootState }, params: TParams): Promise<void> {
        const currentSpace = rootState.auth.currentSpace
        const parentId = parentResolver(rootState)

        if (!parentId) {
          return
        }
        if (!currentSpace) {
          throw new Error('There is no currently active space')
        }

        commit('setFetching', true)
        const res = await service.fetch(params, parentId)
        commit('setFetching', false)

        commit('setData', res)
      },

      async view ({ commit, rootState }, id: number): Promise<void> {
        const parentId = parentResolver(rootState)
        if (!parentId) {
          throw new Error('No parent ID')
        }

        commit('setFetching', true)
        const task = await service.view(id, parentId)
        commit('setFetching', false)

        commit('setCurrent', task?.data)
      },

      async refresh ({ commit, state, rootState }): Promise<void> {
        const parentId = parentResolver(rootState)
        if (!parentId) {
          throw new Error('No parent ID')
        }

        if (state.current?.id) {
          commit('setFetching', true)
          const task = await service.view(state.current.id, parentId)
          commit('setFetching', false)
          commit('setCurrent', task?.data)
        }
      },

      async create ({ commit, rootState }, data: TResource): Promise<TResource> {
        const parentId = parentResolver(rootState)
        if (!parentId) {
          throw new Error('No parent ID')
        }

        commit('setProcessing', true)
        const res = await service.create(data, parentId)
        commit('setProcessing', false)
        return res
      },

      async update ({ commit, rootState }, data: TResource): Promise<TResource> {
        const parentId = parentResolver(rootState)
        if (!parentId) {
          throw new Error('No parent ID')
        }
        if (data.id === null) {
          throw new Error('Unable to update data without ID')
        }
        commit('setProcessing', true)
        const res = await service.update(data.id, data, parentId)
        commit('setProcessing', false)

        return res
      },

      async destroy ({ commit, rootState }, data: TResource): Promise<void> {
        const parentId = parentResolver(rootState)
        if (!parentId) {
          throw new Error('No parent ID')
        }

        if (data.id === null) {
          throw new Error('Unable to delete data without ID')
        }
        commit('setProcessing', true)
        await service.destroy(data.id, parentId)
        commit('setProcessing', false)
      }
    }
  }
}
