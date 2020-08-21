<template>
  <button class="add-lane-button" @click="$emit('click')">
    <v-icon class="add-lane-button-icon" name="plus" size="1.5rem"/>
    <span class="add-lane-button-label"><slot></slot></span>
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Icon from '@/components/icon/Icon.vue'

  @Component({
    name: 'ListAddLaneButton',
    components: {
      Icon
    }
  })
export default class ListAddLaneButton extends Vue {
}
</script>

<style lang="postcss" scoped>

  .add-lane-button {
    @apply inline-flex items-center rounded outline-none;
    padding: 8px 24px 8px 16px;
    background: #F8F9FD;

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
      margin-left: 4px;
    }

    &:hover {
      background: #EFF1F6;
      color: theme("colors.gray.900");
    }

    &:active {
      background: theme("colors.gray.100");
      color: theme("colors.gray.900");
    }
  }

</style>
