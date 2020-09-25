<template>
  <form-menu
    title="Embed"
    description="Please select 1 of 4 categories you want to add">
    <template>
      <form-embed
        @submit="addEmbed"
        :space="activeSpace.id"
        ref="formEmbed"
      />
    </template>
  </form-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import FormMenu from '@/components/form/FormMenu.vue'
import FormEmbed from '@/components/form/FormEmbed.vue'

import {
  SpaceResource
} from '@/types/resource'

@Component({
  name: 'LinkMenu',
  components: {
    FormMenu,
    FormEmbed
  }
})

export default class LinkMenu extends Vue {
  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  addEmbed (data: object) {
    this.$emit('submit-embed', data)
  }
}
</script>
