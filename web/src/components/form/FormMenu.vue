<template>
  <div class="list-menu">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'FormMenu'
})
export default class FormMenu extends Vue {
  @Prop({ type: String })
  private readonly title!: string;

  @Prop({ type: String })
  private readonly description!: string;
}
</script>

<style lang="postcss" scoped>
.list-menu {
  @apply absolute;

  bottom: 0;
  right: 0;
  left: 0;

  h3 {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
  }

  p {
    @apply mb-4;

    font-size: 14px;
    line-height: 17px;
  }
}
</style>
