<template>
  <div :class="$style.container">
    <button
      :class="$style.button"
      @click="$emit('click')"
    >
      <mono-icon
        :class="$style.icon"
        name="plus"
      />
      <span :class="$style.label">Add List</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TaskAddLane'
})
</script>

<style lang="postcss" module>
.container {
  @apply flex flex-col rounded mx-4 pr-4;
  width: 300px;
  max-height: 80vh;
  flex: 0 0 auto;

  &:first-child {
    margin-left: 0;
  }
}

.button {
  @apply flex items-center p-2 rounded outline-none w-full;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 11px;
  border-radius: 4px;
  outline: none;
  background: rgba(theme("colors.gray.100"), 0.25);
  color: theme("colors.gray.800");
  transition: all 0.3s ease;

  &:hover {
    background: rgba(theme("colors.gray.100"), 0.25);
  }

  &:active {
    background: theme("colors.gray.100");
    color: theme("colors.gray.900");
  }
}

.icon {
  flex: none;
  margin-right: 8px;
  font-size: 20px;
  stroke-width: 2px;
}

&-label {
  flex: none;
}
</style>
