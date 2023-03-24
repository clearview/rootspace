<template>
  <form-menu
    no-button
    title="Add New"
    description="Please select one option you want to add">
    <template>
      <select-node-type @select="select"/>
    </template>
  </form-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import FormMenu from '@/components/form/FormMenu.vue'
import SelectNodeType from '@/components/SelectNodeType.vue'

enum MenuType {
  INDEX = 'index',
  FOLDER = 'folder',
  LINK = 'link',
  TASK = 'task',
  DOCUMENT = 'document',
  EMBED = 'embed',
  STORAGE = 'storage'
}

@Component({
  name: 'ListMenu',
  components: {
    FormMenu,
    SelectNodeType
  }
})

export default class ListMenu extends Vue {
  select (type: MenuType) {
    this.$emit('select', type)
  }
}
</script>
