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
      ref="input"
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

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

    @Ref('input')
    private readonly inputRef!: HTMLInputElement;

    private payload = ''

    @Watch('value', { immediate: true })
    watchValue (value: string) {
      this.payload = value
    }

    submit (): void {
      this.$emit('input', this.payload)
    }

    mounted () {
      this.inputRef.focus()
    }
}
</script>
