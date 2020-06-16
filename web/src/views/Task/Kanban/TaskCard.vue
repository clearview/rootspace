<template>
  <div class="task-card">
    <div class="item-input" v-show="isInputtingNewCard || isEditingCard">
      <textarea ref="textarea" v-model="itemCopy.title" placeholder="Enter a title for this card…" rows="3"
                class="item-textarea"></textarea>
      <div class="item-actions">
        <button class="btn btn-link" @click="cancel">
          <Icon name="close" size="1.5rem"/>
        </button>
        <button v-if="isInputtingNewCard" class="btn btn-primary" @click="save" :disabled="!canSave">Add Card</button>
        <button v-if="isEditingCard" class="btn btn-primary" @click="save" :disabled="!canSave">Save</button>
      </div>
    </div>
    <div v-if="!isInputtingNewCard && !isEditingCard" class="card" @click="click" >
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
import { required } from 'vuelidate/lib/validators'

  @Component({
    name: 'TaskCard',
    components: {
      Icon
    },
    validations: {
      itemCopy: {
        title: { required }
      }
    }
  })
export default class TaskCard extends Vue {
    @Prop({ type: Object, required: true })
    private readonly item!: TaskItemResource

    @Prop({ type: Boolean, default: false })
    private readonly defaultInputting!: boolean

    @Ref('textarea')
    private readonly textarea!: HTMLTextAreaElement;

    private isInputting = this.defaultInputting
    private itemCopy: TaskItemResource = { ...this.item }

    private get isInputtingNewCard () {
      return this.isInputting && this.itemCopy.id === null
    }

    private get isEditingCard () {
      return this.isInputting && this.itemCopy.id !== null
    }

    private get canSave () {
      return !this.$v.$invalid
    }

    @Emit('save')
    async save () {
      if (this.itemCopy.id === null) {
        this.itemCopy = await this.$store.dispatch('task/item/create', this.itemCopy)
      } else {
        this.itemCopy = await this.$store.dispatch('task/item/update', this.itemCopy)
      }
      this.isInputting = false
      return this.itemCopy
    }

    @Emit('cancel')
    cancel () {
      this.itemCopy = { ...this.item }
      this.isInputting = false
      return true
    }

    @Emit('click')
    click () {
      this.isInputting = true
      Vue.nextTick().then(() => {
        this.textarea.focus()
      })
    }
}
</script>

<style lang="postcss" scoped>
  .task-card {
    cursor: pointer;
    &.dragged {
      opacity: 0.5;
    }
    &.overed{
    }
  }

  .task-card ~ .task-card {
    @apply mt-3
  }

  .item-input {

  }

  .btn-link {
    @apply py-2 px-2;
  }

  .btn-link .stroke-current {
    stroke-width: 3px;
    color: theme("colors.gray.400");
  }

  .item-actions {
    @apply flex items-center justify-end mt-2;

    .btn {
      @apply px-4;
      flex: 0 0 auto;
    }
  }

  .item-textarea {
    @apply rounded p-2 w-full text-base;
    border: solid thin theme("colors.gray.100");
  }

  .card {
    @apply p-2 flex items-center rounded;
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

  .overed-container{
    height: 40px;
    background: red;
  }
</style>
