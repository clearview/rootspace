<template>
  <div class="task-add-lane">
    <button class="add-lane-button" @click="$emit('click')">
      <v-icon class="add-lane-button-icon" name="plus" size="1.5rem"/>
      <span class="add-lane-button-label">Add Another List</span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Icon from '@/components/icon/Icon.vue'

  @Component({
    name: 'TaskAddLane',
    components: {
      Icon
    }
  })
export default class TaskAddLane extends Vue {
}
</script>

<style lang="postcss" scoped>

  .task-add-lane {
    @apply flex flex-col rounded mx-4 pr-4;
    width: 300px;
    max-height: 80vh;
    flex: 0 0 auto;
  }

  .add-lane-button {
    @apply flex items-center p-2 rounded outline-none w-full;
    background: rgba(theme("colors.gray.100"), 0.25);

    color: theme("colors.gray.400");
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
      background: rgba(theme("colors.gray.100"), 0.25);
    }

    &:active {
      background: theme("colors.gray.100");
      color: theme("colors.gray.900");
    }
  }

</style>
