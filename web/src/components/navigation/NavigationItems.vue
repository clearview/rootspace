<template>
  <div class="nav-items">
    <v-tree
      ref="tree"
      class="tree"
      triggerClass="tree-node-handle"
      :indent="16"
      :value="treeData"
      :key="treeKey"
      @drop="update($event.dragNode, $event.targetPath)"
      #default="{ node, path }"
    >
      <div
        class="tree-node-content"
        :class="{ 'is-editable': editable }"
        @click="open(node)"
      >
        <div class="tree-node-handle">
          <v-icon name="dots" />
        </div>
        <div
          class="tree-node-arrow"
          :class="{ 'is-hidden': !hasChildren(node) }"
        >
          <v-icon name="down" />
        </div>
        <div class="tree-node-icon">
          <v-icon name="file" />
        </div>
        <div class="tree-node-text">
          <span
            v-show="path.join('.') !== editPath"
            v-text="node.title"
            @dblclick="editPath = path.join('.')"
          />
          <input
            v-show="path.join('.') === editPath"
            v-model="node.title"
            @blur="update(node, path)"
            @keydown.enter="update(node, path)"
            @keydown.esc="editPath = null"
          />
        </div>
        <div class="tree-node-actions">
          <button>
            <v-icon name="link-edit" />
          </button>
          <button @click="destroy(node)">
            <v-icon name="trash" />
          </button>
        </div>
      </div>
    </v-tree>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tree, Draggable } from 'he-tree-vue'

import VIcon from '@/components/icons/Index.vue'

import { LinkResource } from '@/types/resource'

type ComponentData = {
  treeKey: number;
  loading: boolean;
  editPath: null | string;
  alert: null | {
    message: string;
  };
}

interface Tree extends Vue {
  getNodeParentByPath(path: number[]): LinkResource;
}

const VTree = Vue.extend(
  Tree.mixPlugins([Draggable])
)

export default Vue.extend({
  name: 'NavigationItems',
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
      editPath: null,
      alert: null
    }
  },
  computed: {
    treeData () {
      return this.$store.state.link.payload
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
    hasChildren (link: LinkResource) {
      return link.children && link.children.length > 0
    },
    open (data: LinkResource) {
      if (this.editable) {
        return
      }

      window.open(data.value, '_blank')
    },
    async fetch () {
      this.loading = true

      await this.$store.dispatch('link/fetch')

      this.loading = false
    },
    async update (data: LinkResource, path: number[]) {
      const tree: Tree = this.$refs.tree as Tree
      const parent = tree.getNodeParentByPath(path)

      try {
        await this.$store.dispatch('link/update', {
          id: data.id,
          title: data.title,
          parent: parent && parent.id
        })
        await this.$store.dispatch('link/fetch')

        this.editPath = null
      } catch (err) {
        this.alert = {
          message: err.message
        }
      }
    },
    async destroy (data: LinkResource) {
      try {
        await this.$store.dispatch('link/destroy', data)
        await this.$store.dispatch('link/fetch')
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
