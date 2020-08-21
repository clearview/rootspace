<template>
  <component
    :is="wrapper.tag"
    v-bind="wrapper.attrs"
    v-on="wrapper.listeners"
    active-class="is-active"
    :class="{
      'tree-node-content': true,
      'is-editable': editable,
    }"
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
        'is-hidden': !hasChildren,
        'is-folded': folded
      }"
      @click.stop.prevent="toggleFold"
    >
      <v-icon name="down" />
    </div>

    <div class="tree-node-label overflow-hidden" >
      <div class="tree-node-icon">
        <v-icon :name="iconName" />
      </div>
      <label-editable
        class="tree-node-text truncate"
        v-model="title"
        :disabled="!editable"
      />
    </div>

    <div class="tree-node-actions">
      <button v-if="canEdit" @click="updateContent">
        <v-icon name="link-edit" />
      </button>
      <button @click="remove">
        <v-icon name="trash" />
      </button>
    </div>
  </component>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Node } from 'he-tree-vue'
import { Dictionary, Location } from 'vue-router/types/router'
import LabelEditable from '@/components/LabelEditable.vue'

import {
  NodeResource
} from '@/types/resource'

// Interfaces

interface WrapperConfig {
  tag: string;
  attrs?: object;
  listeners?: object;
}

// Enums

export enum NodeType {
  Link = 'link',
  Doc = 'doc',
  Task = 'taskBoard',
  Folder = 'folder'
}

export const nodeRouteNames = {
  link: 'Link',
  doc: 'Document',
  taskBoard: 'TaskPage',
  folder: ''
} as const

export const nodeIconNames = {
  link: 'link',
  doc: 'file',
  taskBoard: 'file',
  folder: 'folder'
} as const

// Types

type NodeData = Node & NodeResource

@Component({
  name: 'SidebarTreeNode',
  components: {
    LabelEditable
  }
})
export default class SidebarTreeNode extends Vue {
  // Props

  @Prop(Object)
  private readonly value!: NodeData

  @Prop(Array)
  private readonly path!: number[]

  @Prop(Boolean)
  private readonly editable!: boolean

  // State

  private payload: Partial<NodeData> = {}

  // Computed

  get type (): NodeType {
    return this.payload.type as NodeType
  }

  get title (): string {
    return this.payload.title || ''
  }

  set title (title: string) {
    this.payload.title = title

    this.update()
  }

  get iconName (): string {
    return nodeIconNames[this.type]
  }

  get to (): Location {
    const { contentId } = this.payload

    const name = nodeRouteNames[this.type]
    const params: Dictionary<string> = {}

    if (contentId) {
      params.id = contentId.toString()
    }

    return { name, params }
  }

  get wrapper (): WrapperConfig {
    if (this.editable) {
      return {
        tag: 'span'
      }
    }

    switch (this.type) {
      case NodeType.Folder:
        return {
          tag: 'span',
          listeners: {
            click: this.toggleFold
          }
        }

      default:
        return {
          tag: 'router-link',
          attrs: {
            to: this.to,
            activeClass: 'is-active'
          }
        }
    }
  }

  get hasChildren () {
    const { children } = this.payload

    return children && children.length > 0
  }

  get folded (): boolean {
    const index = this.path.join('.')

    return this.$store.state.tree.folded[index] === true
  }

  get canEdit () {
    const blacklist = [NodeType.Doc, NodeType.Folder]

    return !blacklist.includes(this.type)
  }

  // Methods

  update () {
    this.$emit('node:update', this.path, this.payload)
  }

  remove () {
    this.$emit('node:remove', this.path, this.payload)
  }

  updateContent () {
    this.$emit('content:update', this.path, this.payload)
  }

  toggleFold () {
    this.$emit('node:fold:toggle', this.path)
  }

  // Watchers

  @Watch('value', { immediate: true })
  watchValue (value: NodeData) {
    this.payload = { ...value }
  }
}
</script>
