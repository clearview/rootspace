<template>
  <NovadocMenu class="novadoc-table-menu">
    <NovadocMenuButton @click="api.addRowAfter">
      <v-icon name="row-add" viewbox="18 16" size="16"></v-icon> <span>Row</span>
    </NovadocMenuButton>
    <NovadocMenuButton @click="api.addColumnAfter">
      <v-icon name="column-add" viewbox="18 16" size="16"></v-icon> <span>Column</span>
    </NovadocMenuButton>
    <NovadocMenuSeparator></NovadocMenuSeparator>
    <NovadocMenuButton @click="api.deleteRow">
      <v-icon name="row-remove" viewbox="18 16" size="16"></v-icon> <span>Row</span>
    </NovadocMenuButton>
    <NovadocMenuButton @click="api.deleteColumn">
      <v-icon name="column-remove" viewbox="18 16" size="16"></v-icon> <span>Column</span>
    </NovadocMenuButton>
    <NovadocMenuSeparator></NovadocMenuSeparator>
    <NovadocMenuButton @click="api.mergeCells">
      <v-icon name="merge" viewbox="16 16" size="16"></v-icon> <span>Merge</span>
    </NovadocMenuButton>
    <NovadocMenuSeparator></NovadocMenuSeparator>
    <NovadocMenuButton @click="api.deleteTable">
      <v-icon name="trash-archive" viewbox="16" size="16"></v-icon> <span>Delete</span>
    </NovadocMenuButton>
  </NovadocMenu>
</template>

<script>

import NovadocMenu from '@/views/Novadoc/Menu/NovadocMenu'
import NovadocMenuButton from '@/views/Novadoc/Menu/NovadocMenuButton'
import NovadocMenuSeparator from '@/views/Novadoc/Menu/NovadocMenuSeparator'

export default {
  components: {
    NovadocMenuSeparator,
    NovadocMenuButton,
    NovadocMenu
  },
  props: ['editor', 'view', 'api'],
  name: 'NovadocTableMenu',
  data () {
    return {

    }
  },
  mounted () {
  }
}
</script>

<style lang="postcss" scoped>
.novadoc-table-menu {
  position: absolute;
  top: -54px;
  .fill-current {
    fill: transparent;
  }
  &:active, &.active {
    .fill-current {
      fill: transparent;
    }
  }
}
</style>
