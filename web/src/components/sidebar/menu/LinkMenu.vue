<template>
  <form-menu
    title="Link"
    description="Please enter name and put link to create a link">
    <template>
      <form-link
        @submit="addLink"
        :space="activeSpace.id"
        ref="formLink"
      />
    </template>
  </form-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import FormMenu from '@/components/form/FormMenu.vue'
import FormLink from '@/components/form/FormLink.vue'

import {
  SpaceResource,
  LinkResource
} from '@/types/resource'

@Component({
  name: 'LinkMenu',
  components: {
    FormMenu,
    FormLink
  }
})

export default class LinkMenu extends Vue {
  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  addLink (data: LinkResource) {
    this.$emit('submit-link', data)
  }
}
</script>
