<template>
  <button class="editor-menu-button" :class="{ active, 'no-margin': noMargin }" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class NovadocMenuButton extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly active!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly noMargin!: boolean;
}
</script>

<style lang="postcss" scoped>
.editor-menu-button {
  background: #fff;
  color: #444754;
  border: none;
  padding: 4px;
  outline: none;
  border-radius: 4px;
  transition: all 0.15s ease;
  font-size: 11px;
  display: flex;
  align-items: center;
  user-select: none;

  &:not(:last-child){
    margin-right: 4px;
  }

  &.no-margin {
    margin-right: 0 ;
  }

  > span {
    margin-left: 4px;
  }

  .stroke-current {
    stroke: #444754;
  }
  .fill-current {
    fill: #444754;
  }
  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background: #F4F5F7;
  }

  &.active, &:active {
    background: #DDF3FF;
    .stroke-current {
      stroke: #146493;
    }
    .fill-current {
      fill: #146493;
    }
  }

  &[disabled] {
    opacity: 0.5;
  }
}
</style>
