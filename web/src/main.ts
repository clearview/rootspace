import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Vuelidate from 'vuelidate'
import PortalVue from 'portal-vue'
import ClickOutside from 'vue-click-outside'
import { TippyComponent } from 'vue-tippy'
import VueTippy from 'vue-tippy/dist/vue-tippy.esm'

import App from './App.vue'
import router from './router'
import store from './store'

import LegacyIcon from '@/components/legacy/icon/Icon.vue'
import { ColorIcon, MonoIcon } from '@/components/icon'

import 'tippy.js/themes/light.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/themes/google.css'
import 'tippy.js/themes/translucent.css'

Vue.config.productionTip = false

// Register plugins
Vue.use(VueCompositionAPI)
Vue.use(Vuelidate)
Vue.use(VueTippy, {
  placement: 'bottom',
  arrow: true,
  animation: 'perspective',
  a11y: false
})
Vue.use(PortalVue)

// Register components
Vue.component('legacy-icon', LegacyIcon)
Vue.component('color-icon', ColorIcon)
Vue.component('mono-icon', MonoIcon)
Vue.component('tippy', TippyComponent)

// Register directive
Vue.directive('click-outside', ClickOutside)

new Vue({
  router,
  store,
  render: h => h(App),
  methods: {}
}).$mount('#app')
