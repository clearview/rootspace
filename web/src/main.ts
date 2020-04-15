import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vuelidate from 'vuelidate'
import PortalVue from 'portal-vue'

import '@/assets/css/index.css'

Vue.config.productionTip = false

// Overwrite axios defaults
axios.defaults.baseURL = process.env.VUE_APP_API_URL

// axios.interceptors.request.use((config) => {
//   const token = store.state.auth.token

//   if (token) {
//     return {
//       ...config,
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   }

//   return config
// })

Vue.use(Vuelidate)
Vue.use(PortalVue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
