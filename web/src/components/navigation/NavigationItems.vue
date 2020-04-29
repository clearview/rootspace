<template>
  <div class="nav-items">
    <v-tree
      :key="treeKey"
      :data="treeData"
      :options="treeOptions"
      @node:selected="open"
      @node:editing:stop="update"
      @node:dragging:finish="update"
      #default="{ node }"
    >
      <div class="flex flex-row items-center">
        <span class="tree-icon">
          <v-icon name="file" class="mr-1" size="20px"/>
        </span>
        <span v-text="node.text" />
      </div>
    </v-tree>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VTree, { Node } from 'liquor-tree'

import VIcon from '@/components/icons/Index.vue'

import { LinkResource } from '@/types/resource'

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
  props: {
    editable: {
      type: Boolean
    }
  },
  data (): ComponentData {
    return {
      treeKey: 0,
      loading: false
    }
  },
  computed: {
    treeData () {
      return this.$store.getters['link/tree']
    },
    treeOptions () {
      return {
        dnd: this.editable,
        editing: this.editable
      }
    }
  },
  watch: {
    editable () {
      this.treeKey += 1
    }
  },
  methods: {
    async fetch () {
      this.loading = true

      await this.$store.dispatch('link/fetch')

      this.treeKey += 1
      this.loading = false
    },
    open ({ data }: Node<LinkResource>) {
      if (this.editable) {
        return
      }

      window.open(data.value, '_blank')
    },
    async update ({ text, data, parent }: Node<LinkResource>) {
      await this.$store.dispatch('link/update', {
        id: data.id,
        title: text,
        parent: parent && parent.id
      })
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
