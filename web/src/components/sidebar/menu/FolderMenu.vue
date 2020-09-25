<template>
  <form-menu
    title="Folder"
    description="Please enter name to create a folder">
    <template>
      <form-folder
        @submit="addFolder"
        :space="activeSpace.id"
        ref="formFolder"
      />
    </template>
  </form-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import FormMenu from '@/components/form/FormMenu.vue'
import FormFolder from '@/components/form/FormFolder.vue'

import {
  SpaceResource,
  NodeResource
} from '@/types/resource'

@Component({
  name: 'FolderMenu',
  components: {
    FormMenu,
    FormFolder
  }
})

export default class FolderMenu extends Vue {
  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  addFolder (data: NodeResource) {
    this.$emit('submit-folder', data)
  }
}
</script>
