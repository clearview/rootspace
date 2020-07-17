import { ResourceState, RootState } from '@/types/state'

import { ChildApiService } from '@/services/task'
import { ActionContext, Module } from 'vuex'
import { ApiResource } from '@/types/resource'
import { Hooks } from '@/store/utils/createServiceModule'

export function createChildServiceModule<TResource extends ApiResource | Omit<ApiResource, 'createdAt' | 'updatedAt'>, TParams> (service: ChildApiService<TResource, TParams>, parentResolver: (root: RootState) => number | null | undefined, hooks?: Hooks<TResource>): Module<ResourceState<TResource>, RootState> {
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
      async fetch (context, params: TParams): Promise<void> {
        const currentSpace = context.rootState.auth.currentSpace
        const parentId = parentResolver(context.rootState)

        if (!parentId) {
          return
        }
        if (!currentSpace) {
          throw new Error('There is no currently active space')
        }

        context.commit('setFetching', true)
        const res = await service.fetch(params, parentId)
        context.commit('setFetching', false)

        context.commit('setData', res)

        if (hooks && hooks.afterFetch) {
          hooks.afterFetch(context, res)
        }
      },

      async view (context, id: number): Promise<void> {
        const parentId = parentResolver(context.rootState)
        if (!parentId) {
          throw new Error('No parent ID')
        }

        context.commit('setFetching', true)
        const task = await service.view(id, parentId)
        context.commit('setFetching', false)

        context.commit('setCurrent', task?.data)

        if (task?.data && hooks && hooks.afterView) {
          hooks.afterView(context, task.data)
        }
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

      async create (context, data: TResource): Promise<TResource> {
        const parentId = parentResolver(context.rootState)
        if (!parentId) {
          throw new Error('No parent ID')
        }

        context.commit('setProcessing', true)
        const res = await service.create(data, parentId)
        context.commit('setProcessing', false)

        if (hooks && hooks.afterCreate) {
          hooks.afterCreate(context, res)
        }
        return res
      },

      async update (context, data: TResource): Promise<TResource> {
        const parentId = parentResolver(context.rootState)
        if (!parentId) {
          throw new Error('No parent ID')
        }
        if (data.id === null) {
          throw new Error('Unable to update data without ID')
        }
        context.commit('setProcessing', true)
        const res = await service.update(data.id, data, parentId)
        context.commit('setProcessing', false)

        if (hooks && hooks.afterUpdate) {
          hooks.afterUpdate(context, res)
        }
        return res
      },

      async destroy (context, data: TResource): Promise<void> {
        const parentId = parentResolver(context.rootState)
        if (!parentId) {
          throw new Error('No parent ID')
        }

        if (data.id === null) {
          throw new Error('Unable to delete data without ID')
        }
        context.commit('setProcessing', true)
        await service.destroy(data.id, parentId)
        context.commit('setProcessing', false)

        if (hooks && hooks.afterDestroy) {
          hooks.afterDestroy(context, data)
        }
      }
    }
  }
}
