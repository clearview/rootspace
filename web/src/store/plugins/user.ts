import { Store } from 'vuex'
import { RootState } from '@/types/state'

function plugin (store: Store<RootState>) {
  if (store.state.auth.token) {
    store.dispatch('auth/whoami')
  }
}

export default { plugin }
