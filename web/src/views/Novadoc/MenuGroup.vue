<template>
  <div class="menu-group">
    <div class="display" @click="showOptions" ref="display" :class="{ disabled, visible }">
      <div class="text">
        <slot :value="value"></slot>
      </div>
      <div class="icon">
        <v-icon name="down2" viewbox="16" size="16"></v-icon>
<!--        <ChevronDownIcon size="14"></ChevronDownIcon>-->
      </div>
    </div>
    <div class="options-cloak" v-show="visible" @click="hide"></div>
    <div class="options" ref="options" v-show="visible">
      <slot name="options" :select="select" :hide="hide"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { createPopper, Instance } from '@popperjs/core'

import { ChevronDownIcon } from 'vue-feather-icons'

@Component({
  components: {
    ChevronDownIcon
  }
})
export default class MenuGroup extends Vue {
  @Prop({ required: true })
  private readonly value!: any;

  @Ref('display')
  private readonly displayRef!: HTMLDivElement;

  @Ref('options')
  private readonly optionsRef!: HTMLDivElement;

  @Prop({ type: Boolean, default: false })
  private readonly disabled!: boolean;

  private popper: Instance | null = null;
  private visible = false

  private select (value: any) {
    this.$emit('input', value)
  }

  private hide () {
    this.visible = false
    if (this.popper) {
      this.popper.destroy()
    }
  }

  private showOptions () {
    if (this.disabled) {
      return
    }
    this.visible = true
    this.popper = createPopper(this.displayRef, this.optionsRef, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 6]
          }
        }
      ]
    })
  }
}
</script>

<style lang="postcss" scoped>
.menu-group {
  position: relative;
  font-size: 14px;
  cursor: pointer;
}
.display {
  padding: 8px;
  font-weight: bolder;
  display: flex;
  align-items: center;
  border:solid 2px transparent;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: #F4F5F7;
  }
  &.disabled {
    opacity: 0.5;
  }
  &.visible{
    border:solid 2px #8CD5FF;
  }

  .text {
    flex: 1 1 auto;
  }
  .icon {
    margin-left: 8px;
    flex: 0 0 auto;
  }
}
.options-cloak {
  cursor: default;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
}
.options {
  background: #FFFFFF;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  z-index: 12;
  width: max-content;
}
</style>
