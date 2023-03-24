"use strict";
// import { Store } from 'vuex'
// import Service from '@/services/userSetting'
// import { RootState } from '@/types/state'
// import { get, merge, debounce } from 'lodash'
// function reducer (state: RootState) {
//   return {
//     sidebar: {
//       collapse: state.sidebar.collapse,
//       size: state.sidebar.size
//     },
//     space: {
//       activeIndex: state.space.activeIndex,
//       activePages: state.space.activePages
//     },
//     task: {
//       settings: state.task.settings
//     },
//     tree: {
//       folded: state.tree.folded
//     }
//   }
// }
// async function restoreState (id: number, state: RootState) {
//   try {
//     const response = await Service.view(id)
//     const data = get(response, 'preferences.data', {})
//     return merge({}, state, data)
//   } catch { }
// }
// async function saveState (id: number, state: RootState) {
//   const data = reducer(state)
//   await Service.update(id, data)
// }
// function filter (type: string) {
//   return [
//     'sidebar/setCollapse',
//     'sidebar/setSize',
//     'space/setActiveIndex',
//     'space/setActivePages',
//     'tree/setFolded',
//     'task/settings/setData'
//   ].includes(type)
// }
// export default {
//   plugin (store: Store<RootState>) {
//     const _saveState = debounce(async (id: number, state: RootState) => {
//       await saveState(id, state)
//     }, 1000)
//     store.subscribe(async (mutations, state) => {
//       const user = state.auth.user
//       if (!user) return
//       if (mutations.type === 'auth/setUser') {
//         const nextState = await restoreState(user.id, state)
//         store.replaceState(nextState)
//       }
//       if (filter(mutations.type)) {
//         await _saveState(user.id, state)
//       }
//     })
//   }
// }
//# sourceMappingURL=userSetting.js.map