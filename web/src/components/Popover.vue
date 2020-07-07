<template>
  <div class="popover-container" v-click-outside="hide">
    <div class="popover" v-if="visible" :style="{ top }">
      <header class="popover-header" v-if="title || withClose">
        <div class="popover-title">
          {{title}}
        </div>
        <div class="popover-close" v-if="withClose">
          <button class="btn btn-icon">
            <v-icon name="close2" size="1rem" viewbox="20"/>
          </button>
        </div>
      </header>
      <slot v-bind="{ hide, visible }"></slot>
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

  @Prop({ type: String })
  private readonly title?: string;

  @Prop({ type: Boolean, default: true })
  private readonly withClose!: boolean;

  private visible = false

  hide () {
    this.visible = false
  }
}
</script>

<style lang="postcss" scoped>

  .popover-header {
    @apply flex items-center p-2;
  }
  .popover-title {
    flex: 1 1 auto;
  }
  .popover-close {
    flex: 0 0 auto;
  }

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
