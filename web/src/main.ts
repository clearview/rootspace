import Vue from 'vue'
import Vuelidate from 'vuelidate'
import PortalVue from 'portal-vue'
import ClickOutside from 'vue-click-outside'
import VueTextareaAutosize from 'vue-textarea-autosize'

import App from './App.vue'
import router from './router'
import store from './store'

import VIcon from '@/components/icon/Icon.vue'

Vue.config.productionTip = false

// Register plugins
Vue.use(Vuelidate)
Vue.use(PortalVue)
Vue.use(VueTextareaAutosize)

// Register components
Vue.component('v-icon', VIcon)

// Register directive
Vue.directive('click-outside', ClickOutside)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
