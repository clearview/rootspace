<template>
  <input
    v-if="canEdit"
    ref="input"
    v-model="payload"
    v-click-outside="save"
    @keydown.esc="end"
    @keydown.enter="save"
  />

  <span
    v-else
    v-text="value"
    @dblclick="start"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class LabelEditable extends Vue {
  $refs!: {
    input: HTMLInputElement;
  }

  // Props

  @Prop(String)
  private readonly value!: string

  @Prop(Boolean)
  private readonly disabled!: boolean

  // State

  private editing = false
  private payload = ''

  // Computed

  get canEdit () {
    return !this.disabled && this.editing
  }

  // Method

  start () {
    if (this.disabled) {
      return
    }

    this.editing = true

    this.$nextTick(() => {
      this.$refs.input.focus()
    })
  }

  end () {
    this.editing = false
  }

  save () {
    this.end()

    this.$emit('input', this.payload)
  }

  // Watchers

  @Watch('value', { immediate: true })
  watchValue (value: string) {
    this.payload = value
  }
}
</script>

<style lang="postcss" scoped>
input,
span {
  @apply border border-transparent;
}

input {
  @apply bg-transparent outline-none;
  @apply border-gray-400;
}
</style>
