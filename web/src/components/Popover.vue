<template>
  <div class="popover-container" v-click-outside="hide">
    <div class="popover" v-if="visible" :style="{ top }">
      <header class="popover-header" v-if="title || withClose">
        <div v-if="backButtonState" @click="back">
            <v-icon id="back-button" name="left" size="24px" viewbox="36"/>
        </div>
        <div class="popover-title">
          {{title}}
        </div>
        <div class="popover-close" v-if="withClose">
          <button class="btn btn-icon" @click="hide">
            <v-icon name="close2" size="1rem" viewbox="20"/>
          </button>
        </div>
      </header>
      <slot v-bind="{ hide, visible }"></slot>
    </div>
    <div @click="visible = !visible">
      <slot name="trigger" v-bind="{ hide, visible }"></slot>
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

  @Prop({ type: Boolean, default: false })
  private readonly backButton!: boolean;

  private visible = false

  get backButtonState () {
    return this.backButton
  }

  hide (event: Event) {
    const srcElement = event.srcElement as HTMLInputElement
    const textContent = srcElement.textContent ? srcElement.textContent.replace(/\s/g, '') : ''

    if (srcElement.id !== 'back-button' &&
    textContent !== 'edit' &&
    textContent !== 'trash') {
      this.visible = false
    }
  }

  back () {
    this.$emit('back', false)
  }
}
</script>

<style lang="postcss" scoped>

  .popover-header {
    @apply flex items-center p-4;
  }
  .popover-title {
    color: theme("colors.gray.900");
    font-weight: bold;
    flex: 1 1 auto;
    font-size: 15px;
  }
  .popover-close {
    flex: 0 0 auto;
  }

  .popover-container {
    @apply relative;
  }

  .popover {
    @apply rounded absolute shadow shadow-lg z-50;
    border: 1px solid #E4E4E4;
    background: theme('colors.white.default');
    top: 24px;
    /* right: 0; */
  }

  #back-button {
    cursor: pointer;
  }

</style>
