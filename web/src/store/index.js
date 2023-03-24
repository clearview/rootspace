import Vue from 'vue';
import Vuex from 'vuex';
// Plugins
import token from '@/store/plugins/token';
// import userSetting from '@/store/plugins/userSetting'
// Modules
import * as modules from './modules';
Vue.use(Vuex);
export default new Vuex.Store({
    modules: modules,
    plugins: [
        token.plugin
        // userSetting.plugin
    ]
});
//# sourceMappingURL=index.js.map