import Vue from 'vue'
import Vuelidate from 'vuelidate'
import PortalVue from 'portal-vue'
import ClickOutside from 'vue-click-outside'
import { TippyComponent } from 'vue-tippy'
import VueTippy from 'vue-tippy/dist/vue-tippy.esm'

import App from './App.vue'
import router from './router'
import store from './store'

import VIcon from '@/components/icon/Icon.vue'

import 'tippy.js/themes/light.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/themes/google.css'
import 'tippy.js/themes/translucent.css'

Vue.config.productionTip = false

// Register plugins
Vue.use(Vuelidate)
Vue.use(VueTippy, {
  placement: 'bottom',
  arrow: true,
  animation: 'perspective',
  a11y: false
})
Vue.use(PortalVue)

// Register components
Vue.component('v-icon', VIcon)
Vue.component('tippy', TippyComponent)

// Register directive
Vue.directive('click-outside', ClickOutside)

new Vue({
  router,
  store,
  render: h => h(App),
  methods: {}
}).$mount('#app')
