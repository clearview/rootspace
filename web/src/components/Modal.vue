<template>
  <portal
    to="default"
    v-if="visible"
  >
    <div class="modal">
      <div
        class="modal-background"
        @click="cancel"
      />

      <div class="modal-inner">
        <slot name="header">
          <div class="modal-header">
            <div class="modal-title">{{ title }}</div>
            <button
              class="btn btn-icon rounded-full"
              @click="cancel"
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
              @click="cancel"
            >
              Cancel
            </button>
            <button
              class="btn btn-small btn-primary"
              @click="confirm"
            >Save</button>
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
    },
    noheader: {
      type: Boolean
    },
    nofooter: {
      type: Boolean
    }
  },
  methods: {
    cancel (): void {
      this.$emit('cancel')
    },
    confirm (): void {
      this.$emit('confirm')
    }
  }
})
</script>
