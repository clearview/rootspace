<template>
  <portal
    to="default"
    v-if="visible"
  >
    <div class="modal">
      <div
        class="modal-background"
        @click="close"
      />

      <div class="modal-inner">
        <slot name="header">
          <div class="modal-header">
            <div class="modal-title">{{ title }}</div>
            <button
              class="btn btn-icon rounded-full"
              @click="close"
            >
              <v-icon name="close" />
            </button>
          </div>
        </slot>

        <slot />

        <slot name="footer">
          <div class="modal-footer">
            <button
              class="btn btn-small"
              @click="close"
            >Cancel</button>
            <button class="btn btn-small btn-primary">Save</button>
          </div>
        </slot>
      </div>
    </div>
  </portal>
</template>

<script lang="ts">
import Vue from 'vue'

import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'Modal',
  inheritAttrs: false,
  components: {
    VIcon
  },
  props: {
    visible: {
      type: Boolean
    },
    title: {
      type: String
    }
  },
  methods: {
    close (): void {
      this.$emit('close')
    }
  }
})
</script>
