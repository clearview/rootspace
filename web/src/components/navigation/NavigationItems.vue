<template>
  <div class="nav-items">
    <v-tree
      ref="tree"
      class="tree"
      triggerClass="tree-node-handle"
      :indent="16"
      v-model="treeData"
      foldingTransitionName="fold"
      @drop="update({ node: $event.dragNode, path: $event.targetPath, tree: $event.targetTree })"
      #default="{ node, path, tree }"
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
          :class="{
            'is-hidden': !hasChildren(node),
            'is-folded': node.$folded
          }"
          @click.stop="tree.toggleFold(node, path)"
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
            @change="update({ node, path, tree })"
            @keydown.esc="select(null)"
          />
        </div>
        <div class="tree-node-actions">
          <button @click="update({ node, path, tree }, true)">
            <v-icon name="link-edit" />
          </button>
          <button @click="destroy({ node, path, tree })">
            <v-icon name="trash" />
          </button>
        </div>
      </div>
    </v-tree>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tree, Draggable, Fold } from 'he-tree-vue'

import { LinkResource } from '@/types/resource'

type ComponentData = {
  selected: string | null;
}

type NodeContext = {
  node: object;
  path: number[];
  tree: Tree;
}

const VTree = Vue.extend({
  name: 'Tree',
  extends: Tree,
  mixins: [Draggable, Fold]
})

export default Vue.extend({
  name: 'NavigationItems',
  components: {
    VTree
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
      return this.value
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
    update ({ node, path, tree }: NodeContext, modal = false) {
      const parent = tree.getNodeParentByPath(path)

      const _data = {
        ...node,
        parent: (parent && parent.id) || null,
        children: undefined,
        created: undefined,
        updated: undefined
      }

      this.select(null)
      this.$emit('update', _data, modal)
    },
    destroy ({ node }: NodeContext) {
      this.$emit('destroy', node)
    }
  }
})
</script>
