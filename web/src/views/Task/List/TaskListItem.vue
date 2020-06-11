<template>
  <div class="list-entry">
    <div class="drag-handle">
      <Icon name="drag" viewbox="20"/>
    </div>
    <div class="input-box">
      <input class="input-field" type="text" placeholder="e.g Design UI Components on Sunday  at 11am #Personal">
      <div class="input-actions">
        <Icon name="attachment" viewbox="24"/>
        <Icon name="tag" viewbox="24"/>
        <Icon name="time" viewbox="24"/>
        <Icon name="user2" viewbox="24"/>
      </div>
    </div>
    <div class="actions" v-if="withActions">
      <button class="btn btn-small btn-primary">Add Task</button>
      <button @click="cancel" class="btn btn-small">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import Icon from '@/components/icon/Icon.vue'

  @Component({
    name: 'TaskListItem',
    components: {
      Icon
    }
  })
export default class TaskListItem extends Vue {
    @Prop({ type: Boolean, default: false })
    private readonly withActions!: boolean;

    @Emit('cancel')
    cancel (): void {
    }
}
</script>

<style lang="postcss" scoped>

  .list-entry {
    @apply flex items-center p-4 flex-wrap;
  }

  .drag-handle {
    @apply flex-grow-0 mr-4;
  }

  .input-box {
    @apply flex flex-auto p-2 items-center rounded;
    background: rgba(theme("colors.gray.100"), 0.25);
  }

  .input-field {
    @apply flex-auto bg-transparent outline-none;
  }

  .input-actions {
    @apply flex items-center;

    svg {
      @apply mr-1;
    }
  }

  .actions {
    @apply flex items-center pl-8 mt-2;
    flex: 1 0 100%;
  }

  .list-entry .fill-current {
    fill: transparent;
  }

  .drag-handle .stroke-current {
    stroke: transparent;
  }

</style>
