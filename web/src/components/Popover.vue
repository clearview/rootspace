<template>
  <div class="popover-container" v-click-outside="hide">
    <div class="popover" v-if="visible" :style="{ top }">
      <slot v-bind="{ hide }"></slot>
    </div>
    <div @click="visible = !visible">
      <slot name="trigger" v-bind="{ hide }"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    name: 'Popover'
  })
export default class Popover extends Vue {
  @Prop({ type: String, default: '24px' })
  private readonly top!: number;

    private visible = false

    hide () {
      this.visible = false
    }
}
</script>

<style lang="postcss" scoped>

  .popover-container {
    @apply relative;
  }

  .popover {
    @apply rounded absolute shadow shadow-lg z-50;
    background: theme('colors.white.default');
    top: 24px;
    right: 0;
  }

</style>
