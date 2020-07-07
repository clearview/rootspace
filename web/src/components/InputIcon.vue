<template>
  <div class="flex flex-row flex-1">
    <v-icon
      :name="icon"
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
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'InputIcon'
})
export default class InputIcon extends Vue {
    @Prop({ type: String })
    private readonly value?: string;

    @Prop({ type: String, default: 'Search' })
    private readonly placeholder?: string;

    @Prop({ type: String, default: 'search' })
    private readonly icon?: string;

    private payload: string = this.value || ''

    submit (): void {
      this.$emit('input', this.payload)
    }
}
</script>
