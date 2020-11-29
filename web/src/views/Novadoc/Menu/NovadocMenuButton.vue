<template>
  <button class="editor-menu-button" :class="{ active }" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class NovadocMenuButton extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly active!: boolean;
}
</script>

<style lang="postcss" scoped>
.editor-menu-button {
  background: #fff;
  color: #444754;
  border: none;
  padding: 8px;
  outline: none;
  border-radius: 2px;
  transition: all 0.15s ease;
  margin-right: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;

  > span {
    margin-left: 4px;
  }

  .stroke-current {
    stroke: #444754;
  }
  .fill-current {
    fill: #444754;
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

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background: #eee;
  }

  &[disabled] {
    opacity: 0.5;
  }
}
</style>
