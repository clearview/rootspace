import { defineComponent } from '@vue/composition-api'
import { Component } from 'vue'

export { default as BaseModal } from './BaseModal.vue'

interface WithPortalOptions {
  to: string;
}

export const withPortal = (component: Component, options?: WithPortalOptions) => {
  return defineComponent({
    name: 'ModalWithPortal',
    template: `
      <portal :to="to" v-if="visible">
        <component
          :is="component"
          v-bind="$attrs"
          @close="close"
        />
      </portal>
    `,
    model: {
      prop: 'visible',
      event: 'close'
    },
    props: {
      visible: Boolean
    },
    setup (props, { emit }) {
      const { to } = { to: 'default', ...options }
      const close = () => emit('close', !props.visible)

      return {
        to,
        component,
        close
      }
    }
  })
}
