<template>
  <div class="popover-container">
    <div class="popover-cloak" v-if="visible" @click.self.prevent.stop="hide"></div>
    <div class="popover" :class="{borderless}" v-if="visible" ref="popover">
      <header class="popover-header" v-if="title || withClose">
        <div v-if="backButton" @click="back">
            <v-icon id="back-button" name="left" size="24px" viewbox="36"/>
        </div>
        <div class="popover-title" :class="{ pointer: backButton }" @click="back">
          {{title}}
        </div>
        <div class="popover-close" v-if="withClose">
          <button class="btn btn-icon" @click.stop="hide">
            <v-icon name="close2" size="1rem" viewbox="20" title="Close"/>
          </button>
        </div>
      </header>
      <slot v-bind="{ hide, visible }"></slot>
    </div>
    <div @click.prevent.stop="toggleVisibility" ref="trigger" class="popover-trigger" :class="{ 'show': visible }">
      <slot name="trigger" v-bind="{ hide, visible }"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { createPopper } from '@popperjs/core'

@Component({
  name: 'Popover'
})
export default class Popover extends Vue {
  // DEPRECATED: In favor of offset
  @Prop({ type: String, default: '24px' })
  private readonly top!: number;

  @Prop({ type: Number, default: 0 })
  private readonly offset!: number;

  @Prop({ type: Number, default: 0 })
  private readonly skid!: number;

  @Prop({ type: String })
  private readonly title?: string;

  @Prop({ type: String, default: 'bottom-end' })
  private readonly position!: 'top' | 'auto' | 'auto-start' | 'auto-end' | 'bottom' | 'right' | 'left' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'right-start' | 'right-end' | 'left-start' | 'left-end' | undefined;

  @Prop({ type: Boolean, default: true })
  private readonly withClose!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly backButton!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly borderless!: boolean;

  @Ref('trigger')
  private readonly triggerRef?: HTMLDivElement;

  @Ref('popover')
  private readonly popoverRef?: HTMLDivElement;

  private visible = false

  hide (event: Event) {
    if (event) {
      const srcElement = event.srcElement as HTMLInputElement
      const textContent = srcElement.textContent ? srcElement.textContent.replace(/\s/g, '') : ''

      if (srcElement.id !== 'back-button' &&
      textContent !== 'edit' &&
      textContent !== 'trash') {
        this.visible = false
        this.$emit('hide', true)
        this.$emit('trigger', this.visible)
      }

      return
    }

    this.visible = false
    this.$emit('hide', true)
    this.$emit('trigger', this.visible)
  }

  back () {
    if (this.backButton) {
      this.$emit('back', false)
    }
  }

  toggleVisibility () {
    this.visible = !this.visible
    Vue.nextTick(() => {
      if (this.triggerRef && this.popoverRef) {
        createPopper(this.triggerRef, this.popoverRef, {
          placement: this.position,
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [this.skid, this.offset]
              }
            }
          ]
        })
      }
    })
    this.$emit('trigger', this.visible)
  }
}
</script>

<style lang="postcss" scoped>

  .popover-cloak {
    @apply fixed top-0 left-0 w-full;
    height: 100vh;
    z-index: 49;
  }
  .popover-header {
    @apply flex items-center p-4;
  }
  .popover-title {
    color: theme("colors.gray.900");
    flex: 1 1 auto;
    font-size: 15px;
    font-weight: 600;
    line-height: 18px;
  }
  .popover-close {
    flex: 0 0 auto;

    .btn-icon {
      height: 20px;
      width: 20px;
    }
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
    &.borderless {
      box-shadow: 0 1px 12px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      border: none;
    }
  }

  #back-button {
    cursor: pointer;
  }

  .popover-trigger {
    button {
      border: 0;
    }

    &.show {
      button {
        /* background: rgba(216, 55, 80, 0.16); */
        color: theme("colors.primary.default");

        .stroke-current {
          color: theme("colors.primary.default");
        }
      }
    }
  }

</style>
