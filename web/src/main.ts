import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vuelidate from 'vuelidate'
import PortalVue from 'portal-vue'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(PortalVue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
