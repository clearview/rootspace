import Vue from 'vue'
import Vuelidate from 'vuelidate'
import PortalVue from 'portal-vue'

import App from './App.vue'
import router from './router'
import store from './store'

import VIcon from '@/components/icons/Index.vue'

Vue.config.productionTip = false

// Register plugins
Vue.use(Vuelidate)
Vue.use(PortalVue)

// Register components
Vue.component('v-icon', VIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
