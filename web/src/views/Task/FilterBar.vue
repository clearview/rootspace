<template>
  <div class="filter">
    <div class="filter-label">
      <strong>Filters:</strong>
    </div>

    <div class="filter-fields">
      <div class="filter-field">
        <mono-icon name="user" />
        <member-chips
          v-if="memberSelected.length > 0"
          class="filter-field-value"
          :list="memberSelected"
        />
        <inline-modal>
          <button class="filter-field-add">
            <mono-icon name="plus" />
          </button>

          <template #modal>
            <member-select
              v-model="memberSelected"
              :list="memberList"
            />
          </template>
        </inline-modal>

        <button
          v-if="memberSelected.length > 0"
          class="filter-field-clear"
          @click="memberSelected = []"
        >
          <mono-icon name="close" />
        </button>
      </div>

      <div class="filter-field">
        <mono-icon name="tag" />
        <tag-chips
          v-if="tagSelected.length > 0"
          class="filter-field-value"
          :list="tagSelected"
        />
        <inline-modal>
          <button class="filter-field-add">
            <mono-icon name="plus" />
          </button>

          <template #modal>
            <tag-select
              v-model="tagSelected"
              :list="tagList"
              :selected="tagSelected"
            />
          </template>
        </inline-modal>

        <button
          v-if="tagSelected.length > 0"
          class="filter-field-clear"
          @click="tagSelected = []"
        >
          <mono-icon name="close" />
        </button>
      </div>

      <div class="filter-field">
        <mono-icon name="calendar" />
        <button class="filter-field-add">
          <mono-icon name="plus" />
        </button>
      </div>
    </div>

    <div class="filter-actions">
      <button
        class="filter-action"
        @click="clearAll"
        :disabled="fieldsEmpty"
      >
        <mono-icon name="close" />
        <span>Remove All</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watchEffect } from '@vue/composition-api'

import { InlineModal } from '@/components/modal'
import MemberChips from './MemberChips.vue'
import MemberSelect from './MemberSelect.vue'
import TagChips from './TagChips.vue'
import TagSelect from './TagSelect.vue'

import { TagResource, UserResource } from '@/types/resource'

export default defineComponent({
  name: 'FilterBar',
  components: {
    InlineModal,
    MemberChips,
    MemberSelect,
    TagChips,
    TagSelect
  },
  props: {
    value: {
      type: Object as PropType<Record<string, any>>
    },
    memberList: {
      type: Array as PropType<UserResource[]>,
      default: () => ([])
    },
    tagList: {
      type: Array as PropType<TagResource[]>,
      default: () => ([])
    }
  },
  setup (props, { emit }) {
    const memberSelected = ref<UserResource[]>([])
    const tagSelected = ref<TagResource[]>([])
    const fieldsEmpty = computed(() => (
      memberSelected.value.length === 0 &&
      tagSelected.value.length === 0
    ))

    const clearAll = () => {
      memberSelected.value = []
      tagSelected.value = []
    }

    watchEffect(() => {
      const tags = tagSelected.value.map(x => x.id)
      const assignees = memberSelected.value.map(x => x.id)

      emit('input', {
        tags,
        assignees
      })
    })

    return {
      memberSelected,
      tagSelected,
      fieldsEmpty,
      clearAll
    }
  }
})
</script>

<style lang="postcss" scoped>
.filter {
  display: flex;
  flex-flow: row;
  padding-bottom: 16px;
  margin-left: 72px;
  margin-right: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e2e7;
}

.filter-label {
  display: flex;
  flex: initial;
}

.filter-fields {
  display: flex;
  flex-flow: row;
  flex: 1;
  align-items: center;
  padding: 0 24px;
}

.filter-field {
  display: flex;
  flex-flow: row;
  align-items: center;
  font-size: 16px;
}

.filter-field + .filter-field {
  margin-left: 24px;
}

.filter-field-value {
  margin-left: 10px;
}

.filter-field-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: 10px;
  background-color: #edeff3;
  border-radius: 50%;
  stroke-width: 1.5px;

  &:focus {
    outline: none;
  }
}

.filter-field-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  font-size: 12px;
  color: #aab1c5;
  stroke-width: 2px;

  &:focus {
    outline: none;
  }
}

.filter-actions {
  display: flex;
  flex-flow: row;
  flex: initial;
  padding-left: 18px;
  border-left: 1px solid #e0e2e7;
}

.filter-action {
  display: flex;
  flex-flow: row;
  align-items: center;
  font-weight: 700;
  stroke-width: 2px;

  &:focus {
    outline: none;
  }

  &:disabled {
    color: #95959A;
    cursor: default;
  }

  span {
    margin-left: 8px;
  }
}
</style>
