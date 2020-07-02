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
          <v-icon name="down"/>
        </div>
        <div class="tree-node-icon">
          <v-icon :name="iconName[node.type]"/>
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
            <v-icon name="link-edit"/>
          </button>
          <button @click="destroy({ node, path, tree })">
            <v-icon name="trash"/>
          </button>
        </div>
      </div>
    </v-tree>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Draggable, Fold, Node, Tree, walkTreeData } from 'he-tree-vue'

import { LinkResource } from '@/types/resource'
import { Component, Prop, Watch } from 'vue-property-decorator'

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

@Component({
  name: 'NavigationItems',
  components: {
    VTree
  }
})
export default class NavigationItems extends Vue {
    @Prop({ type: Array })
    private readonly value?: any[];

    @Prop({ type: Object })
    private readonly folded?: any;

    @Prop({ type: String })
    private readonly active?: string;

    @Prop({ type: Boolean })
    private readonly editable!: boolean;

    @Watch('editable')
    watchEditable (newVal: boolean) {
      if (!newVal) this.select(null)
    }

    @Watch('active')
    watchActive (val: string) {
      const activeEls = this.$el.querySelectorAll('.tree-node-back.is-active')
      const targetEl = this.$el.querySelector(`[data-tree-node-path="${val}"] .tree-node-back`)

      if (activeEls) {
        activeEls.forEach(el => el.classList.remove('is-active'))
      }

      if (targetEl) {
        targetEl.classList.add('is-active')
      }
    }

    private selected: any = null

    get treeData () {
      const treeData = this.value ? [...this.value] : []

      walkTreeData(treeData, (node, index, parent, path) => {
        node.$folded = this.folded[path.join('.')] === true
      })

      return treeData
    }

    get iconName () {
      return {
        doc: 'file',
        link: 'link',
        taskBoard: 'file'
      }
    }

    hasChildren (link: LinkResource) {
      return link.children && link.children.length > 0
    }

    select (path: number[] | null) {
      this.selected = !path ? path : path.join('.')
    }

    isSelected (path: number[]) {
      return this.selected === path.join('.')
    }

    toggleFold ({ node, path, tree }: NodeContext) {
      tree.toggleFold(node, path)

      this.$emit('fold', {
        [path.join('.')]: node.$folded === true
      })
    }

    open ({ path, node }: NodeContext) {
      if (this.editable) {
        return
      }

      this.$store.commit('link/setActive', path.join(','))

      switch (node.type) {
        case 'doc':
          this.$router
            .push({ name: 'Document', params: { id: node.value } })
            .catch(err => err)
          break
        case 'taskBoard':
          this.$router
            .push({ name: 'TaskPage', params: { id: node.value } })
            .catch(err => err)
          break

        default:
          window.open(node.value, '_blank')
          break
      }
    }

    update ({ node, path, tree }: NodeContext, modal = false) {
      const parent = tree.getNodeParentByPath(path)
      const position = path.slice(-1).pop() || 0

      const _data = {
        ...node,
        parent: (parent && parent.id) || null,
        position: position + 1,
        children: undefined,
        created: undefined,
        updated: undefined
      }

      this.select(null)
      this.$emit('update', _data, modal)
    }

    destroy ({ node }: NodeContext) {
      this.$emit('destroy', node)
    }
}
</script>
