<template>
  <div class="menu-group-item" :class="{disabled, active}" @click="handleClick">
    <div class="icon">
      <slot name="icon"></slot>
    </div>
    <div class="label">
      <slot name="label"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MenuGroupItem extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly disabled!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly active!: boolean;

  handleClick () {
    if (!this.disabled) {
      this.$emit('click')
    }
  }
}
</script>

<style lang="postcss" scoped>
.menu-group-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 13px;
  color: #2C2B35;
  user-select: none;
  &:hover{
    background: #F4F5F7;
    cursor: pointer;
  }
  .icon {
    width: 32px;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.85;
  }
  .label {
    margin-left: 8px;
    flex: 1 0 auto;
    color: inherit;
  }
  &.active, &:active {
    background: #DDF3FF;
    color: #146493;
  }
  &.disabled {
    opacity: 0.5;
  }
}
</style>
