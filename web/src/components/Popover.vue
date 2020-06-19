<template>
  <div class="popover-container" v-click-outside="hide">
    <div class="popover" v-if="visible">
      <slot v-bind="{ hide }"></slot>
    </div>
    <div @click="visible = !visible">
      <slot name="trigger" v-bind="{ hide }"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

  @Component({
    name: 'Popover'
  })
export default class Popover extends Vue {
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
    @apply rounded absolute shadow-lg z-50;
    background: theme('colors.white.default');
    top: 24px;
    right: 0;
  }

</style>
