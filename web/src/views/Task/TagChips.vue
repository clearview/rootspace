<template>
  <div class="chips">
    <div
      v-for="tag in list"
      class="chip"
      :key="tag.id"
      :style="getStyle(tag.color)"
    >
      {{ tag.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { TagResource } from '@/types/resource'
import colors from './colors'

export default defineComponent({
  name: 'TagChips',
  props: {
    list: {
      type: Array as PropType<TagResource[]>,
      default: () => ([])
    },
    size: {
      type: Number,
      default: 24
    }
  },
  setup () {
    const getStyle = (color: string) => {
      const index = colors.background.findIndex(
        _color => (_color === color)
      )

      return {
        background: colors.background[index],
        color: colors.text[index]
      }
    }

    return {
      getStyle
    }
  }
})
</script>

<style lang="postcss" scoped>
.chips {
  display: flex;
  flex-flow: row;
  align-items: center;
}

.chip {
  flex: initial;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.chip + .chip {
  margin-left: 4px;
}
</style>
