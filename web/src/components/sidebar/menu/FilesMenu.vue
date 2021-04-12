<template>
  <form-menu
    class="form-menu"
    title="Files"
    @add="$refs.formFiles.submit()"
    @back="$emit('select', 'index')"
    description="Please enter name to create a files">
    <template>
      <form-files
        @submit="addFiles"
        :space="activeSpace.id"
        ref="formFiles"
      />
    </template>
  </form-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import FormMenu from '@/components/form/FormMenu.vue'
import FormFiles from '@/components/form/FormFiles.vue'

import {
  SpaceResource,
  NodeResource
} from '@/types/resource'

@Component({
  name: 'FilesMenu',
  components: {
    FormMenu,
    FormFiles
  }
})

export default class FilesMenu extends Vue {
  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  addFiles (data: NodeResource) {
    this.$emit('submit-files', data)
  }
}
</script>
