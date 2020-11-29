<template>
  <div class="novadoc-menu-separator">

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class NovadocMenuSeparator extends Vue {
}
</script>

<style scoped>
.novadoc-menu-separator {
  width: 1px;
  height: 24px;
  background: #E0E2E7;
  margin: 0 8px;
  display: inline-block;
}
</style>
