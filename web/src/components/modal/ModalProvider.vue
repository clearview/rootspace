<template>
  <div>
    <slot/>

    <portal v-if="visible" :to="to">
      <component
        :is="component"
        v-bind="componentAttrs"
        @close="close"
     />
    </portal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from '@vue/composition-api'
import { Component } from 'vue'
import { ComponentAttrs, OpenModal, CloseModal } from './types'

export default defineComponent({
  name: 'ModalProvider',
  setup () {
    const to = ref('default')
    const visible = ref(false)
    const component = ref<Component | string>()
    const componentAttrs = ref<ComponentAttrs>({})

    const open: OpenModal = (opts) => {
      component.value = opts.component
      componentAttrs.value = opts.attrs || {}
      to.value = opts.to || 'default'

      visible.value = true
    }

    const close: CloseModal = () => {
      if (componentAttrs.value.onClose) {
        componentAttrs.value.onClose()
      }
      visible.value = false
    }

    provide('modal', { open, close })

    return {
      to,
      visible,
      component,
      componentAttrs,
      close
    }
  }
})
</script>
