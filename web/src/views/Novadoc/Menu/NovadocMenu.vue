<template>
  <div class="editor-menu">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class NovadocMenu extends Vue {
}
</script>

<style scoped>
.editor-menu {
  background: #FFFFFF;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 4px;
  max-width: 100%;
  font-size: 12px;
  flex: 0 0 auto;
  overflow: visible;
  margin: auto;
  position: absolute;
  display: flex;
  align-items: center;
}
</style>
