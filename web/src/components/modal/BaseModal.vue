<template>
  <div class="modal">
    <div class="modal-body">
      <div class="card" :style="cardStyle">
        <div class="card-header">
          <slot name="header">
            <h2 class="card-title">{{ title }}</h2>
          </slot>

          <div class="close" @click="close">
            <legacy-icon viewbox="20" size="1rem" name="close2" title="Close"/>
          </div>
        </div>

        <div class="card-body">
          <slot v-bind="{ close }"/>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" @click="close"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    title: String,
    size: Number
  },
  setup (props, context) {
    const cardStyle = {
      width: props.size + 'px'
    }

    const close = () => {
      context.emit('close')
    }

    return {
      cardStyle,
      close
    }
  }
})
</script>

<style lang="postcss" scoped>
.modal {
  @apply fixed top-0 left-0 w-screen h-screen;
  @apply overflow-hidden z-10;
}

.modal-backdrop {
  @apply absolute w-full h-full;
  @apply bg-gray-900 bg-opacity-25;
}

.modal-body {
  @apply absolute w-full h-full;
  @apply flex flex-col items-center;
  @apply overflow-auto;
}

.card {
  @apply bg-white z-10;

  padding: 32px 40px;
  border-radius: 8px;

  margin: 93px auto;
}

.card-header {
  @apply flex items-start justify-between;

  margin-bottom: 32px;

  h2 {
    @apply text-lg;
  }
}

.close {
  @apply rounded-full cursor-pointer;

  &:hover {
    @apply bg-gray-900 bg-opacity-25;
  }
}
</style>
