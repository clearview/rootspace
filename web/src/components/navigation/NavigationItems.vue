<template>
  <div class="nav-items">
    <v-tree
      ref="tree"
      class="tree"
      triggerClass="tree-node-handle"
      :indent="16"
      :value="value"
      @drop="update($event.dragNode, $event.targetPath)"
      #default="{ node, path }"
    >
      <div
        class="tree-node-content"
        :class="{ 'is-editable': editable }"
        @click="open(node)"
      >
        <div class="tree-node-handle">
          <v-icon
            name="dots"
            size="20px"
          />
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
            v-show="!isSelected(path)"
            v-text="node.title"
            @dblclick="select(path)"
          />
          <input
            v-show="isSelected(path)"
            v-model.lazy="node.title"
            @change="update(node, path)"
            @keydown.esc="select(null)"
          />
        </div>
        <div class="tree-node-actions">
          <button @click="update(node, path, true)">
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
  selected: string | null;
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
    value: {
      type: Array
    },
    editable: {
      type: Boolean
    }
  },
  data (): ComponentData {
    return {
      selected: null
    }
  },
  computed: {
    treeData () {
      return this.$store.state.link.payload
    }
  },
  methods: {
    hasChildren (link: LinkResource) {
      return link.children && link.children.length > 0
    },
    select (path: number[] | null) {
      this.selected = !path ? path : path.join('.')
    },
    isSelected (path: number[]) {
      return this.selected === path.join('.')
    },
    open (data: LinkResource) {
      if (!this.editable) {
        window.open(data.value, '_blank')
      }
    },
    update (data: LinkResource, path: number[], modal = false) {
      const tree: Tree = this.$refs.tree as Tree
      const parent = tree.getNodeParentByPath(path)

      const _data = {
        ...data,
        parent: (parent && parent.id) || null,
        children: undefined,
        created: undefined,
        updated: undefined
      }

      this.select(null)
      this.$emit('update', _data, modal)
    },
    destroy (data: LinkResource) {
      this.$emit('destroy', data)
    }
  }
})
</script>
