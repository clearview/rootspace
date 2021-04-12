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
      <slot />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ListAddCardButton'
})
</script>

<style lang="postcss" module>
.container {
  display: inline-flex;
  align-items: center;
  border-radius: 50%;
  background: transparent;
  outline: none;

  color: theme("colors.gray.900");
  transition: all 0.15s ease;
  font-size: 14px;
  margin: 16px 0;

  &:hover {
    color: theme("colors.primary.default");
  }

  &:active {
    color: theme("colors.gray.900");
  }
}

.icon {
  flex: 0 0 auto;
  border-radius: 50%;
  font-size: 20px;
  stroke-width: 2px;
}

.label {
  flex: 0 0 auto;
  margin-left: 4px;
}
</style>
