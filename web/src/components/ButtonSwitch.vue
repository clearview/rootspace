<template>
  <label class="switch">
    <input
      type="checkbox"
      v-model="payload"
      :disabled="disabled"
    >
    <span class="slider"/>
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ButtonSwitch'
})
export default class ButtonSwitch extends Vue {
    @Prop({ type: Boolean })
    private readonly value!: boolean;

    @Prop({ type: Boolean })
    private readonly disabled!: boolean;

    get payload (): boolean {
      return this.value
    }

    set payload (value: boolean) {
      this.$emit('input', value)
    }
}
</script>

<style lang="postcss" scoped>
  .switch {
    @apply relative inline-block;

    width: 40px;
    height: 18px;

    & input {
      @apply opacity-0 w-0 h-0;
    }
  }

  .slider {
    @apply absolute top-0 left-0 right-0 bottom-0;
    @apply cursor-pointer bg-gray-100;

    border-radius: 34px;
    transition: .4s;

    &::before {
      @apply absolute bg-white;

      content: "";
      height: 16px;
      width: 16px;
      border-radius: 50%;

      left: 1px;
      bottom: 1px;

      transition: .4s;
    }
  }

  input:checked + .slider {
    @apply bg-success;
  }

  input:focus + .slider {
    box-shadow: 0 0 0 1px theme('colors.gray.100');
  }

  input:checked + .slider:before {
    transform: translateX(22px);
  }
</style>
