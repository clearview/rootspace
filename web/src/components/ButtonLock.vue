<template>
  <button @click="toggle" class="btn">
    <v-icon
      name="unlock"
      size="2em"
      viewbox="36"
      :class="{
        'text-primary': value,
        'text-gray-400': !value
      }"

    />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'ButtonLock',
  components: {
    VIcon
  },
  props: {
    value: {
      type: Boolean
    }
  },
  methods: {
    toggle (): void {
      this.$emit('input', !this.value)
    }
  }
})
</script>

<style lang="postcss" scoped>
.btn {
  @apply p-0 border-none;
}
</style>
