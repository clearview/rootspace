<template>
  <div class="nav-items">
    <v-tree
      class="tree"
      triggerClass="tree-node-handle"
      :indent="16"
      :value="treeData"
      @drop="update({ node: $event.dragNode, path: $event.targetPath, tree: $event.targetTree })"
      #default="{ node, path, tree }"
    >
      <div
        class="tree-node-content"
        :class="{ 'is-editable': editable }"
        @click="open({ node, path, tree })"
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
          @click.stop="toggleFold({ node, path, tree })"
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
            class="truncate"
            @dblclick="editable && select(path)"
          />
          <input
            v-show="isSelected(path)"
            v-model.lazy="node.title"
            @change="update({ node, path, tree })"
            @keydown.esc="select(null)"
          />
        </div>
        <div class="tree-node-actions">
          <button v-if="node.type !== 'doc'" @click="update({ node, path, tree }, true)">
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
import Vue, { PropType } from 'vue'
import { Tree, Draggable, Fold, Node, walkTreeData } from 'he-tree-vue'

import { LinkResource } from '@/types/resource'

type ComponentData = {
  selected: string | null;
}

type NodeContext = {
  node: Node;
  path: number[];
  tree: Tree & Fold & Draggable;
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
      type: Array as PropType<object[]>
    },
    folded: {
      type: Object
    },
    active: {
      type: String
    },
    editable: {
      type: Boolean
    }
  },
  watch: {
    editable (newVal) {
      if (!newVal) this.select(null)
    },
    active (val) {
      const activeEls = this.$el.querySelectorAll('.tree-node-back.is-active')
      const targetEl = this.$el.querySelector(`[data-tree-node-path="${val}"] .tree-node-back`)

      if (activeEls) {
        activeEls.forEach(el => el.classList.remove('is-active'))
      }

      if (targetEl) {
        targetEl.classList.add('is-active')
      }
    }
  },
  data (): ComponentData {
    return {
      selected: null
    }
  },
  computed: {
    treeData () {
      const treeData = [...this.value]

      walkTreeData(treeData, (node, index, parent, path) => {
        node.$folded = this.folded[path.join('.')] === true
      })

      return treeData
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
    toggleFold ({ node, path, tree }: NodeContext) {
      tree.toggleFold(node, path)

      this.$emit('fold', {
        [path.join('.')]: node.$folded === true
      })
    },
    open ({ path, node }: NodeContext) {
      if (this.editable) {
        return
      }

      this.$store.commit('link/setActive', path.join(','))

      switch (node.type) {
        case 'doc':
          this.$router
            .push({ name: 'Document', params: { id: node.value } })
            .catch()
          break

        default:
          window.open(node.value, '_blank')
          break
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
