<template>
  <div class="nav-items">
    <v-tree
      :key="treeKey"
      :data="treeData"
      :options="treeOptions"
      :class="{ 'tree__editable': editable }"
      @node:selected="open"
      @node:editing:stop="update"
      @node:dragging:finish="update"
      #default="{ node }"
    >
      <div class="tree-anchor-container">
        <span class="tree-icon">
          <v-icon
            name="file"
            class="mr-1"
            size="20px"
          />
        </span>
        <span v-text="node.text" />

        <template v-if="editable">
          <div class="tree-dnd">
            <v-icon
              name="dots"
              size="20px"
            />
          </div>

          <div class="tree-action">
            <button @click="edit(node)">
              <v-icon
                name="link-edit"
                size="20px"
              />
            </button>
            <button
              v-if="node.children.length < 1"
              @click.stop="destroy(node)"
            >
              <v-icon
                name="trash"
                size="20px"
              />
            </button>
          </div>
        </template>
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
  alert?: {
    message: string;
  };
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
      loading: false,
      alert: undefined
    }
  },
  computed: {
    treeData () {
      return this.$store.getters['link/tree']
    },
    treeOptions () {
      return {
        dnd: this.editable
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
    edit (node: Node<LinkResource>) {
      node.startEditing()
    },
    async update ({ text, data, parent }: Node<LinkResource>) {
      try {
        await this.$store.dispatch('link/update', {
          id: data.id,
          title: text,
          parent: parent && parent.id
        })
      } catch (err) {
        this.alert = {
          message: err.message
        }
      }
    },
    async destroy (node: Node<LinkResource>) {
      try {
        await this.$store.dispatch('link/destroy', node.data)

        node.remove()
      } catch (err) {
        this.alert = {
          message: err.message
        }
      }
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
