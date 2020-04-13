<template>
  <form class="flex flex-row" @submit.prevent="submit">
    <v-icon
      name="search"
      size="1.5em"
      class="text-gray-400"
    />
    <input
      type="text"
      placeholder="Search"
      class="w-full ml-2 outline-none"
      v-model="payload"
    >
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

import VIcon from '@/components/icons/Index.vue'

interface ComponentData {
  payload: string;
}

export default Vue.extend({
  name: 'SearchField',
  components: {
    VIcon
  },
  props: {
    value: {
      type: String
    }
  },
  data (): ComponentData {
    return {
      payload: this.value
    }
  },
  methods: {
    submit (): void {
      this.$emit('input', this.payload)
    }
  }
})
</script>
