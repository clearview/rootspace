<template>
  <button
    :class="$style.container"
    @click="$emit('click')"
  >
    <mono-icon
      :class="$style.icon"
      name="plus"
    />
    <span :class="$style.label">Add Card</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TaskAddCard'
})
</script>

<style lang="postcss" module>
.container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 11px;
  border-radius: 4px;
  outline: none;
  background: rgba(#EDEFF3, 70%);
  transition: all 0.3s ease;

  &:hover,
  &:active {
    background: #EDEFF3;
  }
}

.icon {
  flex: none;
  margin-right: 8px;
  font-size: 20px;
  stroke-width: 2px;
}

.label {
  flex: none;
}
</style>
