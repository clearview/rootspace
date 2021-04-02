<template>
  <div class="filter">
    <div class="filter-label">
      <strong>Filters:</strong>
    </div>

    <div class="filter-fields">
      <div class="filter-field">
        <mono-icon name="user" />
        <inline-modal>
          <template #trigger="{ active }">
            <member-chips
              v-if="!isEmpty(memberSelected)"
              class="filter-field-value"
              :list="memberSelected"
            />
            <button
              class="filter-field-add"
              :class="{ active }"
            >
              <mono-icon name="plus" />
            </button>
          </template>

          <member-select
            v-model="memberSelected"
            :list="memberList"
          />
        </inline-modal>

        <button
          v-if="!isEmpty(memberSelected)"
          class="filter-field-clear"
          @click="memberSelected = []"
        >
          <mono-icon name="close" />
        </button>
      </div>

      <div class="filter-field">
        <mono-icon name="tag" />
        <inline-modal>
          <template #trigger="{ active }">
            <tag-chips
              v-if="!isEmpty(tagSelected)"
              class="filter-field-value"
              :list="tagSelected"
            />
            <button
              class="filter-field-add"
              :class="{ active }"
            >
              <mono-icon name="plus" />
            </button>
          </template>

          <tag-select
            v-model="tagSelected"
            :list="tagList"
            :selected="tagSelected"
          />
        </inline-modal>

        <button
          v-if="!isEmpty(tagSelected)"
          class="filter-field-clear"
          @click="tagSelected = []"
        >
          <mono-icon name="close" />
        </button>
      </div>

      <!-- TODO: Enable this when the api is ready -->
      <div v-if="false" class="filter-field">
        <mono-icon name="calendar" />
        <inline-modal>
          <template #trigger="{ active }">
            <div
              v-if="!isEmpty(dateSelected)"
              class="filter-field-value"
            >
              {{dateSelected.label}}
            </div>
            <button
              v-if="isEmpty(dateSelected)"
              class="filter-field-add"
              :class="{ active }"
            >
              <mono-icon name="plus" />
            </button>
          </template>

          <date-select v-model="dateSelected" />
        </inline-modal>

        <button
          v-if="!isEmpty(dateSelected)"
          class="filter-field-clear"
          @click="dateSelected = []"
        >
          <mono-icon name="close" />
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
import { isEmpty } from 'lodash'

import { InlineModal } from '@/components/modal'
import MemberChips from './MemberChips.vue'
import MemberSelect from './MemberSelect.vue'
import TagChips from './TagChips.vue'
import TagSelect from './TagSelect.vue'
import DateSelect from './DateSelect.vue'

import { TagResource, UserResource } from '@/types/resource'

export default defineComponent({
  name: 'FilterBar',
  components: {
    InlineModal,
    MemberChips,
    MemberSelect,
    TagChips,
    TagSelect,
    DateSelect
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
  setup (_, { emit }) {
    const memberSelected = ref<UserResource[]>([])
    const tagSelected = ref<TagResource[]>([])
    const dateSelected = ref({})

    const fieldsEmpty = computed(() => (
      isEmpty(memberSelected.value) &&
      isEmpty(tagSelected.value) &&
      isEmpty(dateSelected.value)
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
      dateSelected,
      fieldsEmpty,
      clearAll,
      isEmpty
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
  transition: all 300ms;

  &:focus {
    outline: none;
  }

  &.active {
    background-color: #ddf3ff;
    color: #146493;
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
    color: #95959a;
    cursor: default;
  }

  span {
    margin-left: 8px;
  }
}
</style>
