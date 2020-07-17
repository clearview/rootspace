<template>
  <form
    class="flex flex-col flex-1"
    @submit.prevent="submit"
  >
    <v-field label="Board Name">
      <input
        type="text"
        class="input"
        placeholder="E.g. Weekly Groceries"
        v-model="payload.title"
      >
    </v-field>

    <v-field label="Select Board Type">
      <div class="type-list mt-2">
        <a
          class="type-item mr-4"
          :class="{'active': !isKanban}"
          @click="payload.type = boardTypeList"
        >
          <v-icon
            name="list"
            size="3.5em"
            class="icon-list"
          />

          <div class="desc-list">
            <h5>List</h5>
          </div>
        </a>
        <a
          class="type-item"
          :class="{'active': isKanban}"
          @click="payload.type = boardTypeKanban"
        >
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
      align="right"
      class="mb-0"
    >
      <button-switch v-model="payload.isPublic" />
    </v-field>

    <button
      type="submit"
      class="hidden"
    />
  </form>
</template>

<style lang="postcss" scoped>
.type-list {
  @apply flex flex-row;
}
.type-item {
  @apply flex flex-row border p-3 rounded items-center;
  flex: 1 1 auto;

  border-color: theme("colors.gray.400");
  cursor: pointer;

  &:hover {
    background-color: rgba(theme("colors.gray.100"), 0.5);
  }

  &.active {
    background-color: rgba(theme("colors.primary.default"), 0.08);
    border-color: #d83750;
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

import { required } from 'vuelidate/lib/validators'

import { TaskBoardResource, TaskBoardType } from '@/types/resource'

import ButtonSwitch from '@/components/ButtonSwitch.vue'
import VField from '@/components/Field.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Optional } from '@/types/core'

@Component({
  name: 'FormTask',
  components: {
    ButtonSwitch,
    VField
  },
  validations: {
    payload: {
      title: { required },
      type: { required }
    }
  }
})
export default class FormTask extends Vue {
  get boardTypeKanban () {
    return TaskBoardType.Kanban
  }

  get boardTypeList () {
    return TaskBoardType.List
  }

  get isKanban () {
    return this.payload.type === TaskBoardType.Kanban
  }

  @Prop({ type: Object, default: () => ({}) })
  private readonly value!: TaskBoardResource;

  @Prop({ type: Number, default: 0 })
  private readonly space!: number;

  private payload: Optional<TaskBoardResource, 'createdAt' | 'updatedAt' | 'uuid' | 'userId'> = {
    id: this.value.id || null,
    spaceId: this.value.spaceId || this.space,
    title: this.value.title || '',
    type: this.value.type || TaskBoardType.Kanban,
    isPublic: this.value.isPublic || false,
    taskLists: [],
    description: null
  }

  submit (): void {
    this.$v.payload.$touch()

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload)
    }
  }
}
</script>
