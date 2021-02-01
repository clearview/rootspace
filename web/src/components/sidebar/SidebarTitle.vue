<template>
  <div class="sidebar-title">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'SidebarTitle'
})
export default class SidebarTitle extends Vue {
}
</script>
<style lang="postcss" scoped>
.sidebar-title {
  text-transform: uppercase;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
  margin: 0 16px;
}
</style>
