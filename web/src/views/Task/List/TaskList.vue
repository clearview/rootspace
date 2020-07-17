<template>
  <div class="task-list">
    <h4 class="title">
      <v-icon class="title-arrow" name="right"/>
      <span class="title-text">{{list.title}}</span>
    </h4>
    <div class="items">
    </div>
    <div class="new-task">
      <button v-if="!isInputtingNewTask" class="new-task-button" @click="toggleInputNewTask(true)">
        <v-icon class="new-task-button-icon" name="plus" size="1.5rem"/>
        <span class="new-task-button-label">Add Task</span>
      </button>
      <TaskListItem with-actions v-else @cancel="toggleInputNewTask(false)"></TaskListItem>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TaskListResource } from '@/types/resource'
import TaskListItem from '@/views/Task/List/TaskListItem.vue'
import Icon from '@/components/icon/Icon.vue'

  @Component({
    name: 'TaskList',
    components: { TaskListItem, Icon }
  })
export default class TaskList extends Vue {
    @Prop({ type: Object, required: true })
    private readonly list!: TaskListResource

    private isInputtingNewTask = false

    toggleInputNewTask (inputting: boolean) {
      this.isInputtingNewTask = inputting
    }
}
</script>

<style lang="postcss" scoped>

  .title {
    @apply text-base flex items-center;
  }

  .title-arrow {
    flex: 0 0 auto;
  }

  .title-text {
    @apply flex-auto;
  }

  .items {
    @apply ml-4;
  }

  .new-task-button {
    @apply inline-flex items-center ml-12 p-2 rounded outline-none;
    color: theme("colors.gray.400");
    transition: all 0.3s ease;

    &-icon {
      flex: 0 0 auto;
    }

    &-label {
      @apply flex-auto;
    }

    &:hover {
      background: rgba(theme("colors.gray.100"), 0.25);
    }

    &:active {
      background: theme("colors.gray.100");
      color: theme("colors.gray.900");
    }
  }

</style>
