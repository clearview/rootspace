<template>
  <input
    v-if="canEdit"
    ref="input"
    :value="value"
    v-click-outside="end"
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
import { Vue, Component, Prop } from 'vue-property-decorator'

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

  save (e: Event) {
    const target: HTMLInputElement = e.target as HTMLInputElement

    this.end()
    this.$emit('input', target.value)
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
