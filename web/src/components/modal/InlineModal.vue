<template>
  <div class="wrapper">
    <div
      class="trigger"
      @click="active = true"
    >
      <slot
        name="trigger"
        :active="active"
      />
    </div>

    <div
      v-if="active"
      class="modal"
    >
      <div :class="['modal-content', align]">
        <slot name="default" />
      </div>

      <div
        class="modal-backdrop"
        @click="active = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'InlineModal',
  props: {
    align: {
      type: String as PropType<'left' | 'center' | 'right'>,
      default: 'left'
    }
  },
  setup () {
    const active = ref(false)

    return {
      active
    }
  }
})
</script>

<style lang="postcss" scoped>
.modal {
  position: relative;
  z-index: 100;
}

.modal-content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 110;

  &.left {
    transform: translateX(0%);
  }

  &.center {
    transform: translateX(-50%);
  }

  &.right {
    transform: translateX(-100%);
  }
}

.trigger {
  display: flex;
  flex-flow: row;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
