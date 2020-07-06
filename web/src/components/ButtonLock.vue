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
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ButtonLock'
})
export default class ButtonLock extends Vue {
    @Prop({ type: Boolean })
    private readonly value!: boolean;

    toggle (): void {
      this.$emit('input', !this.value)
    }
}
</script>

<style lang="postcss" scoped>
  .btn {
    @apply p-0 border-none;
  }
</style>
