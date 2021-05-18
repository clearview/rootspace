<template>
  <form-menu
    class="form-menu"
    title="Storage"
    @add="$refs.formStorage.submit()"
    @back="$emit('select', 'index')"
    description="Please enter name to create a storage">
    <template>
      <form-storage
        @submit="addStorage"
        :space="activeSpace.id"
        ref="formStorage"
      />
    </template>
  </form-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import FormMenu from '@/components/form/FormMenu.vue'
import FormStorage from '@/components/form/FormStorage.vue'

import {
  SpaceResource,
  NodeResource
} from '@/types/resource'

@Component({
  name: 'StorageMenu',
  components: {
    FormMenu,
    FormStorage
  }
})

export default class StorageMenu extends Vue {
  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  addStorage (data: NodeResource) {
    this.$emit('submit-storage', data)
  }
}
</script>
