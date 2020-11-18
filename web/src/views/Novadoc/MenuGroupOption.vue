<template>
  <div class="menu-group-item" :class="{disabled}" @click="handleClick">
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
  padding: 12px;
  margin: 4px 0;
  &:hover{
    background: #146493;
    color: #fff;
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
  &.disabled {
    opacity: 0.5;
  }
}
</style>
