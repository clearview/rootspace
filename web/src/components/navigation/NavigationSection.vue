<template>
  <div class="nav-section">
    <div class="nav-section-title">Section 1</div>

    <v-tree
      :key="treeKey"
      :data="links"
      @node:selected="open"
      #default="{ node }"
    >
      <div class="flex flex-row items-center">
        <v-icon name="file" class="mr-1"/>
        <span v-text="node.text" />
      </div>
    </v-tree>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VTree, { Node } from 'liquor-tree'

import VIcon from '@/components/icons/Index.vue'

import { LinkResource } from '../../types/resource'

type ComponentData = {
  treeKey: number;
  loading: boolean;
}

export default Vue.extend({
  name: 'NavigationSection',
  components: {
    VTree,
    VIcon
  },
  data (): ComponentData {
    return {
      treeKey: 0,
      loading: false
    }
  },
  computed: {
    links () {
      return this.$store.state.link.payload.map(
        (data: LinkResource) => ({
          text: data.title,
          data
        })
      )
    }
  },
  methods: {
    async fetch () {
      this.loading = true

      await this.$store.dispatch('link/fetch')

      this.treeKey += 1
      this.loading = false
    },
    open (item: Node<LinkResource>) {
      window.open(item.data.value, '_blank')
    }
  },
  async created () {
    await this.fetch()

    this.$store.subscribe(mutation => {
      const pattern = /(.*)Payload$/

      if (pattern.test(mutation.type)) {
        this.treeKey += 1
      }
    })
  }
})
</script>

<style lang="postcss" scoped>
.nav-section {
  @apply flex-1;
}
</style>
