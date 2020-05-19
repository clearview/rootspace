import Vue from 'vue'
import Vuelidate from 'vuelidate'
import PortalVue from 'portal-vue'
import ClickOutside from 'vue-click-outside'

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

// Register directive
Vue.directive('click-outside', ClickOutside)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
