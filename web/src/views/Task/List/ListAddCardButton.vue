<template>
  <button class="add-card-button" @click="$emit('click')">
    <v-icon class="add-card-button-icon" name="plus" size="1.5rem"/>
    <span class="add-card-button-label"><slot></slot></span>
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Icon from '@/components/icon/Icon.vue'

  @Component({
    name: 'ListAddCardButton',
    components: {
      Icon
    }
  })
export default class ListAddCardButton extends Vue {
}
</script>

<style lang="postcss" scoped>

  .add-card-button {
    @apply inline-flex items-center rounded outline-none;
    background: transparent;

    color: theme("colors.gray.800");
    transition: all 0.15s ease;
    font-weight: bold;
    font-size: 16px;
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
      color: theme("colors.primary.default");
    }

    &:active {
      color: theme("colors.gray.900");
    }
  }

</style>
