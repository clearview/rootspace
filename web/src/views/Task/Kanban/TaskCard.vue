<template>
  <div class="task-card">
    <div class="task-input" v-if="isInputting">
      <textarea ref="textarea" v-model="itemCopy.title" placeholder="Enter a title for this card…" rows="5"
                class="task-textarea"></textarea>
      <div class="task-actions">
        <button class="btn btn-link" @click="cancel">
          <Icon name="close" size="1.5rem"/>
        </button>
        <button class="btn btn-primary" @click="save">Add Card</button>
      </div>
    </div>
    <div v-else class="card" @click="click">
      <div class="color"></div>
      <div class="title">
        {{itemCopy.title}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator'
import Icon from '@/components/icon/Icon.vue'
import { TaskItemResource } from '@/types/resource'

  @Component({
    name: 'TaskCard',
    components: {
      Icon
    }
  })
export default class TaskCard extends Vue {
    @Prop({ type: Object, required: true })
    private readonly item!: TaskItemResource

    @Prop({ type: Boolean, default: false })
    private readonly isInputting!: boolean;

    @Ref('textarea')
    private readonly textarea!: HTMLTextAreaElement;

    private itemCopy: TaskItemResource = { ...this.item }

    @Emit('save')
    save () {
      return this.itemCopy
    }

    @Emit('cancel')
    cancel () {
      this.itemCopy = { ...this.item }
      return true
    }

    @Emit('click')
    click () {
      Vue.nextTick().then(() => {
        this.textarea.focus()
      })
    }
}
</script>

<style lang="postcss" scoped>
  .task-card {
    cursor: pointer;
  }

  .task-card ~ .task-card {
    @apply mt-3
  }

  .task-input {

  }

  .btn-link {
    @apply py-2 px-2;
  }

  .btn-link .stroke-current {
    stroke-width: 3px;
    color: theme("colors.gray.400");
  }

  .task-actions {
    @apply flex items-center justify-end mt-2;

    .btn {
      @apply px-4;
      flex: 0 0 auto;
    }
  }

  .task-textarea {
    @apply rounded p-2 w-full text-base;
    border: solid thin theme("colors.gray.100");
  }

  .card {
    @apply p-2 flex items-center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    background: theme("colors.white.default");
  }

  .color {
    @apply rounded;
    background: theme("colors.gray.100");
    width: 4px;
    height: auto;
    align-self: stretch;
    flex: 0 0 auto;
  }

  .title {
    @apply ml-2 text-base;
    font-weight: 500;
    color: theme("colors.gray.900");
    flex: 1 1 auto;
  }
</style>
