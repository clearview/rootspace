<template>
  <button class="add-card-button" @click="$emit('click')">
    <legacy-icon class="add-card-button-icon" name="plus" size="20px"/>
    <span class="add-card-button-label"><slot></slot></span>
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'ListAddCardButton'
})
export default class ListAddCardButton extends Vue {
}
</script>

<style lang="postcss" scoped>

  .add-card-button {
    @apply inline-flex items-center rounded outline-none;
    background: transparent;

    color: theme("colors.gray.900");
    transition: all 0.15s ease;
    font-weight: bold;
    font-size: 14px;
    margin: 16px 0;

    .stroke-current {
      stroke: theme('colors.gray.900');
    }

    &-icon {
      flex: 0 0 auto;
      background-color: #EFF1F6;
      border-radius: 50%;
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
