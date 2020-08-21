<template>
  <div >
    <div class="target" ref="target">
    <slot></slot>
    </div>
    <div class="tip" ref="tip" v-show="active">
      <div class="arrow"></div>
      <button class="btn btn-icon close" @click="$emit('close')">
        <v-icon name="close"></v-icon>
      </button>
      <slot name="tip"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { createPopper, Instance } from '@popperjs/core'

@Component({
  name: 'Tip'
})
export default class Tip extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly active!: boolean;

    @Ref('tip')
    private readonly tip!: HTMLDivElement;

  @Ref('target')
  private readonly target!: HTMLDivElement;

  private pop: Instance | null = null;

  updated () {
    if (this.active) {
      this.pop = createPopper(this.target, this.tip, {
        placement: 'bottom-end',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 20]
            }
          }
        ]
      })
    } else {
      if (this.pop) {
        this.pop.destroy()
      }
    }
  }

  mounted () {
    if (this.active) {
      this.pop = createPopper(this.target, this.tip)
    } else {
      if (this.pop) {
        this.pop.destroy()
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
  .tip {
    @apply p-4;
    background: #fff;
    max-width: 240px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    z-index: 10;
    font-size: 14px;
    animation: hovering 1s 0.3s ease;
    border:solid 1px #eee;
  }
  .arrow {
    border-top:solid 1px #eee;
    border-left:solid 1px #eee;
    z-index: 9;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top:-10px;
    right:20px;
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
  }
  @keyframes hovering {
    0% {
      margin-left: 0;
    }
    25% {
      margin-left: -5px;
    }
    50% {
      margin-left: 5px;
    }
    75% {
      margin-left: -5px;
    }
    100%{
      margin-left:0;
    }
  }
  .close{
    @apply p-1;
    position: absolute;
    top: 8px;
    right: 8px;
    height: auto;
    z-index:10;
  }

</style>
