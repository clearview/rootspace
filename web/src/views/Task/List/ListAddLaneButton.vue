<template>
  <button
    :class="$style.container"
    @click="$emit('click')"
  >
    <mono-icon
      :class="$style.icon"
      name="plus"
    />
    <span :class="$style.label">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ListAddLaneButton'
})
</script>

<style lang="postcss" module>
.container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 11px 24px;
  background: #F4F5F7;
  outline: none;
  transition: all 0.3s ease;

  &:hover {
    background: #eff1f6;
    color: theme("colors.gray.900");
  }

  &:active {
    background: theme("colors.gray.100");
    color: theme("colors.gray.900");
  }
}

.icon {
  flex: 0;
  font-size: 20px;
  stroke-width: 2px;
}

.label {
  flex: 1;
  margin-left: 4px;
}
</style>
