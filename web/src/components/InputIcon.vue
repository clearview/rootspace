<template>
  <div class="flex flex-row flex-1">
    <v-icon
      name="search"
      size="1.5em"
      class="text-gray-400"
    />
    <input
      type="text"
      :placeholder="placeholder"
      class="w-full ml-2 outline-none bg-transparent"
      v-model="payload"
      @keyup="submit"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface ComponentData {
  payload: string;
}

export default Vue.extend({
  name: 'InputIcon',
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String,
      default: 'Search'
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
