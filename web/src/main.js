import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import Vuelidate from 'vuelidate';
import PortalVue from 'portal-vue';
import ClickOutside from 'vue-click-outside';
import { TippyComponent } from 'vue-tippy';
import VueTippy from 'vue-tippy/dist/vue-tippy.esm';
import Toast from 'vue-toastification';
import App from './App.vue';
import router from './router';
import store from './store';
import LegacyIcon from '@/components/legacy/icon/Icon.vue';
import { ColorIcon, MonoIcon } from '@/components/icon';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/themes/google.css';
import 'tippy.js/themes/translucent.css';
import 'vue-toastification/dist/index.css';
Vue.config.productionTip = false;
// Register plugins
Vue.use(VueCompositionAPI);
Vue.use(Vuelidate);
Vue.use(VueTippy, {
    placement: 'bottom',
    arrow: true,
    animation: 'perspective',
    a11y: false
});
Vue.use(PortalVue);
Vue.use(Toast, {
    position: 'bottom-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false
});
// Register components
Vue.component('legacy-icon', LegacyIcon);
Vue.component('color-icon', ColorIcon);
Vue.component('mono-icon', MonoIcon);
Vue.component('tippy', TippyComponent);
// Register directive
Vue.directive('click-outside', ClickOutside);
new Vue({
    router: router,
    store: store,
    render: function (h) { return h(App); },
    methods: {}
}).$mount('#app');
//# sourceMappingURL=main.js.map