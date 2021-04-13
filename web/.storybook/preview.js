import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import IconLibraries from '../__storybook/stories/Icon/IconLibraries.vue'

Vue.use(VueCompositionApi)
Vue.component('icon-libraries', IconLibraries)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
