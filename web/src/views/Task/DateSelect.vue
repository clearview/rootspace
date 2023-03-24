<template>
  <div class="select">
    <h4 class="title">Due Date</h4>

    <div class="options">
      <div
        v-for="date in list"
        :key="date.id"
        class="option"
        @click="() => handleSelect(date)"
      >
        <div class="option-label">
          {{date.label}}
        </div>

        <mono-icon
          v-if="isSelected(date)"
          name="check"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'

interface DateDetail {
  id: number
  label: string
}

const list: DateDetail[] = [
  { id: 1, label: 'Today' },
  { id: 2, label: 'Yesterday' },
  { id: 3, label: 'Tomorrow' },
  { id: 4, label: 'Next 7 days' },
  { id: 5, label: 'Last 7 days' },
  { id: 6, label: 'This week' },
  { id: 7, label: 'Next week' },
  { id: 8, label: 'This month' },
  { id: 9, label: 'Last month' }
]

export default defineComponent({
  name: 'DateSelect',
  model: {
    prop: 'selected'
  },
  props: {
    selected: {
      type: Object as PropType<DateDetail>,
      default: () => ({})
    }
  },
  setup (props, { emit }) {
    const handleSelect = (option: DateDetail) => {
      emit('input', option)
    }

    const isSelected = (option: DateDetail) => (
      props.selected.id === option.id
    )

    return {
      list,
      handleSelect,
      isSelected
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

.option {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f4f5f7;
  }
}

.option-label {
  flex: initial;
}
</style>
