<template>
  <form
    class="flex flex-col flex-1"
    @submit.prevent="submit"
  >
    <v-field
      label="Board Name"
    >
      <div class="flex flow-row items-center">
        <input
          type="text"
          class="input"
          placeholder="E.g. Weekly Groceries"
          v-model="payload.name"
        >
      </div>
    </v-field>

    <v-field
      label="Select Board Type"
    >
      <div class="type-list mt-2">
        <a class="type-item mr-4" :class="{'active': payload.type === 'list'}" @click="payload.type = 'list'">
          <v-icon
            name="list"
            size="3.5em"
            class="icon-list"
          />

          <div class="desc-list">
            <h5>List</h5>
          </div>
        </a>
        <a class="type-item" :class="{'active': payload.type === 'kanban'}" @click="payload.type = 'kanban'">
          <v-icon
            name="kanban"
            size="3.5em"
            class="icon-list"
          />

          <div class="desc-list">
            <h5>Kanban</h5>
          </div>
        </a>
      </div>
    </v-field>

    <v-field
      inline
      border
      label="Make Board Private"
      class="mb-0"
    >
      <button-switch v-model="payload.config.private" />
    </v-field>

    <button type="submit" class="hidden"/>
  </form>
</template>

<style lang="postcss" scoped>
  .type-list{
    @apply flex flex-row;
  }
  .type-item {
    @apply flex flex-row border p-3 rounded items-center;
    flex: 1 1 auto;

    border-color: theme("colors.gray.400");
    cursor: pointer;

    &:hover {
      background-color: rgba(theme('colors.gray.100'), 0.5);
    }

    &.active {
      background-color: rgba(theme("colors.primary.default"), 0.08);
      border-color: #D83750;
    }

    .icon-list {
      @apply rounded-full p-2;
      color: transparent;

      background: theme("colors.primary.default");
    }
    .desc-list {
      @apply pl-2;

      font-size: 12px;
    }
  }
</style>

<script lang="ts">
import Vue from 'vue'

import { required } from 'vuelidate/lib/validators'

import { TaskResource } from '@/types/resource'

import ButtonSwitch from '@/components/ButtonSwitch.vue'
import VField from '@/components/Field.vue'

type ComponentData = {
  payload: Omit<TaskResource, 'children'>;
}

export default Vue.extend({
  name: 'ResourceFormTask',
  components: {
    ButtonSwitch,
    VField
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    space: {
      type: Number,
      default: 0
    }
  },
  validations: {
    payload: {
      name: { required },
      type: { required }
    }
  },
  data (): ComponentData {
    return {
      payload: {
        id: this.value.id || undefined,
        spaceId: this.value.space || this.space,
        name: this.value.name || '',
        type: this.value.type || 'list',
        config: {
          private: false,
          ...this.value.config
        }
      }
    }
  },
  methods: {
    submit (): void {
      this.$v.payload.$touch()

      if (!this.$v.payload.$invalid) {
        this.$emit('submit', this.payload)
      }
    }
  }
})
</script>
