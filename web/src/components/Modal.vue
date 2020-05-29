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
        <slot
          name="header"
          v-if="!noheader"
        >
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

        <slot
          name="footer"
          v-if="!nofooter"
        >
          <div class="modal-footer">
            <button
              class="btn btn-small"
              @click="cancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="btn btn-small btn-primary"
              @click="confirm"
              v-if="!nosubmit"
            >
              {{ confirmText }}
            </button>
          </div>
        </slot>
      </div>
    </div>
  </portal>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Modal',
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean
    },
    title: {
      type: String
    },
    confirmText: {
      type: String,
      default: 'Save'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    noheader: {
      type: Boolean
    },
    nofooter: {
      type: Boolean
    },
    nosubmit: {
      type: Boolean
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('confirm')
    }
  }
})
</script>
