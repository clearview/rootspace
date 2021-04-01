<template>
  <div class="task-add-card">
    <button class="add-card-button" @click="$emit('click')">
      <legacy-icon class="add-card-button-icon" name="plus" size="1.5rem"/>
      <span class="add-card-button-label">Add Card</span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'TaskAddCard'
})
export default class TaskAddCard extends Vue {
}
</script>

<style lang="postcss" scoped>

  .add-card-button {
    @apply flex items-center justify-center p-2 rounded outline-none w-full;
    color: theme("colors.gray.800");
    transition: all 0.3s ease;
    font-weight: bold;

    .stroke-current {
      stroke-width: 3px;
    }

    &-icon {
      flex: 0 0 auto;
    }

    &-label {
      flex: 0 0 auto;
    }

    &:hover {
      background: rgba(theme("colors.gray.100"), 0.4);
    }

    &:active {
      background: theme("colors.gray.100");
      color: theme("colors.gray.900");
    }
  }
</style>
