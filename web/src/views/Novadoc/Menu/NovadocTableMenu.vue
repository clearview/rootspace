<template>
  <NovadocMenu class="novadoc-table-menu">
    <template v-if="isExpanded">
      <NovadocMenuButton @click="api.addRowAfter">
        <v-icon name="row-add" viewbox="18 16" size="16"></v-icon> <span>Row</span>
      </NovadocMenuButton>
      <NovadocMenuButton @click="api.addColumnAfter" no-margin>
        <v-icon name="column-add" viewbox="18 16" size="16"></v-icon> <span>Column</span>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton @click="api.deleteRow">
        <v-icon name="row-remove" viewbox="18 16" size="16"></v-icon> <span>Row</span>
      </NovadocMenuButton>
      <NovadocMenuButton @click="api.deleteColumn" no-margin>
        <v-icon name="column-remove" viewbox="18 16" size="16"></v-icon> <span>Column</span>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton @click="api.mergeCells" no-margin>
        <v-icon name="merge" viewbox="16 16" size="16"></v-icon> <span>Merge</span>
      </NovadocMenuButton>
      <NovadocMenuSeparator></NovadocMenuSeparator>
      <NovadocMenuButton @click="api.deleteTable">
        <v-icon name="trash-archive" viewbox="16" size="16"></v-icon> <span>Delete</span>
      </NovadocMenuButton>
    </template>
    <NovadocMenuButton @click="toggleExpand">
      <v-icon v-if="!isExpanded" name="left" viewbox="32" size="16"></v-icon>
      <v-icon v-else name="close" viewbox="32" size="16"></v-icon>
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
      isExpanded: false
    }
  },
  mounted () {
  },
  methods: {
    toggleExpand () {
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<style lang="postcss" scoped>
.table-menu-container{

}
.novadoc-table-menu {
  position: absolute;
  top: -40px;
  right: 0;
  z-index: 10;
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
