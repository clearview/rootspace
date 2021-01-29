<template>
  <div class="collapsible" :class="{'expanded': isExpanded}">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Collapsible'
})
export default class Collapsible extends Vue {
  @Prop({ type: Boolean, default: true })
  private readonly isExpanded!: boolean;
}
</script>

<style lang="postcss" scoped>
.collapsible {
  overflow: hidden;
  height: 0;

  &.expanded {
    height: auto;
  }
}
</style>
