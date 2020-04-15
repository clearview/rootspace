<template>
  <div :class="['field', {
    'field-inline': inline,
    'field-border': border,
    'field-disabled': disabled
  }]">
    <label
      class="field-label"
      v-text="label"
    />
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Field',
  props: {
    label: {
      type: String
    },
    inline: {
      type: Boolean
    },
    border: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    }
  }
})
</script>
