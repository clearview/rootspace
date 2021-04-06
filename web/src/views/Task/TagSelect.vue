<template>
  <div class="select">
    <h4 class="title">Tags</h4>
    <div
      v-if="list.length < 1"
      class="empty"
    >
      You don’t have any tags
    </div>

    <div
      v-else
      class="options"
    >
      <div
        v-for="tag in list"
        :key="tag.id"
        class="option"
        @click="() => handleSelect(tag)"
      >
        <div
          class="tag"
          :style="getStyle(tag.color)"
        >
          <span>{{tag.label}}</span>
          <mono-icon
            v-if="isSelected(tag)"
            name="check"
            class="tag-check"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { TagResource } from '@/types/resource'
import colors from './colors'

export default defineComponent({
  name: 'TagSelect',
  props: {
    list: {
      type: Array as PropType<TagResource[]>,
      default: () => ([])
    },
    selected: {
      type: Array as PropType<TagResource[]>,
      default: () => ([])
    }
  },
  setup (props, { emit }) {
    const isSelected = (tag: TagResource) => (
      props.selected.findIndex(x => x.id === tag.id) >= 0
    )

    const getStyle = (color: string) => {
      const index = colors.background.findIndex(
        _color => (_color === color)
      )

      return {
        background: colors.background[index],
        color: colors.text[index]
      }
    }

    const handleSelect = (tag: TagResource) => {
      const list = [...props.selected]
      const index = props.selected.findIndex(
        (x) => x.id === tag.id
      )

      if (index >= 0) {
        list.splice(index, 1)
      } else {
        list.push(tag)
      }

      emit('input', list)
    }

    return {
      isSelected,
      getStyle,
      handleSelect
    }
  }
})
</script>

<style lang="postcss" scoped>
.select {
  width: 216px;
  background: #ffffff;
  padding: 0;
  border: none;
  border-radius: 4px;
  box-shadow: 0px 2px 12px 0px rgba(#000000, 16%);
}

.title {
  padding: 16px;
  padding-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.empty {
  padding: 16px;
  padding-top: 8px;
  color: #aab1c5;
  font-size: 12px;
}

.options {
  padding-bottom: 8px;
}

.option {
  display: flex;
  padding: 4px 16px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f4f5f7;
  }
}

.tag {
  display: flex;
  flex-flow: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.tag-check {
  stroke-width: 2px;
}
</style>
