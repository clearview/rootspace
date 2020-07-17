<template>
  <form class="flex flex-row flex-1" @submit.prevent="submit">
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
    >
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Searchbar'
})
export default class Searchbar extends Vue {
    @Prop({ type: String })
    private readonly value?: string;

    @Prop({ type: String, default: 'Search' })
    private readonly placeholder?: string;

    private payload: string = this.value || ''

    submit (): void {
      this.$emit('input', this.payload)
    }
}
</script>
