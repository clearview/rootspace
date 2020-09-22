<template>
  <component
    :is="wrapper.tag"
    v-bind="wrapper.attrs"
    v-on="wrapper.listeners"
    active-class="is-active"
    :class="{
      'tree-node-content': true,
      'is-editable': editable,
      'is-renaming': isRenaming
    }"
  >
    <div
      class="tree-node-arrow"
      :class="{
        'is-hidden': !hasChildren,
        'is-folded': folded
      }"
      @click.stop.prevent="toggleFold"
    >
      <v-icon name="down2" viewbox="16" />
    </div>

    <div class="tree-node-label overflow-hidden" >
      <div class="tree-node-icon">
        <v-icon viewbox="16" :name="iconName" />
      </div>
      <label-editable
        class="tree-node-text truncate"
        v-model="title"
        :disabled="!editable"
        v-if="!isRenaming"
      />
      <input ref="input" type="text" class="field node-input" v-show="isRenaming" placeholder="Node name" v-model="title"
        @blur="saveTitle" @keydown.enter="saveTitle" @keydown.esc="isRenaming = false">
    </div>

    <div class="tree-node-actions">
      <Popover top="38px" :with-close="false">
        <template #default="{ hide }">
          <div class="action-line" @click.prevent.stop="hide();addNew()">
            <v-icon class="action-icon" name="plus2" viewbox="16" size="16px"></v-icon>
            <div class="action-line-text">
              Add new
            </div>
          </div>
          <div class="action-separator"></div>
          <div class="action-line" @click.prevent.stop="hide();rename();">
            <v-icon class="action-icon no-fill" name="edit2" viewbox="18" size="16px"></v-icon>
            <div class="action-line-text">
              Rename
            </div>
          </div>
          <div class="action-line" @click.prevent.stop="hide();remove()">
            <v-icon class="action-icon" name="archive" viewbox="16" size="16px"></v-icon>
            <div class="action-line-text">
              Archive
            </div>
          </div>
        </template>
        <template #trigger="{ visible }">
          <button class="btn btn-link" :class="{'btn-link-primary': visible}">
            <v-icon name="vertical-ellipsis" viewbox="20" size="20px"/>
          </button>
        </template>
      </Popover>
    </div>
  </component>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'
import { Node } from '@adityapurwa/he-tree-vue'
import { Dictionary, Location } from 'vue-router/types/router'
import LabelEditable from '@/components/LabelEditable.vue'

import {
  NodeResource
} from '@/types/resource'
import Popover from '@/components/Popover.vue'

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
  Folder = 'folder',
  Embed = 'embed'
}

export const nodeRouteNames = {
  link: 'Link',
  doc: 'Document',
  taskBoard: 'TaskPage',
  embed: 'Embed',
  folder: ''
} as const

export const nodeIconNames = {
  link: 'link2',
  doc: 'file-empty',
  taskBoard: 'layout',
  embed: 'code',
  folder: 'folder-closed',
  archive: 'folder-closed'
} as const

// Types

type NodeData = Node & NodeResource

@Component({
  name: 'SidebarTreeNode',
  components: {
    LabelEditable,
    Popover
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

  @Ref('input')
  private readonly inputRef!: HTMLInputElement;

  // State

  private payload: Partial<NodeData> = {}
  private isRenaming = false

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
    if (!this.folded && this.type === NodeType.Folder) {
      return 'folder-open'
    }
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

  saveTitle () {
    this.update()
    this.isRenaming = false
  }

  addNew () {
    this.$emit('node:addNew', this.path, this.payload)
  }

  rename () {
    this.isRenaming = true
    Vue.nextTick(() => {
      this.inputRef.focus()
    })
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
<style lang="postcss" scoped>
.tree-node-icon .fill-current {
  fill: transparent;
}
.tree-node-content .btn-link {
  padding: 8px;
  height: auto;
  transition: none;
  .stroke-current {
    stroke: transparent;
  }
}
.tree-node-content.is-renaming {
  padding-top: 6px;
  padding-bottom: 6px;
}
.action-icon.no-fill {
    fill: transparent;
}
.action-line {
  @apply flex items-center py-2 px-4 my-1 relative;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  width: 168px;
  color: #2C2B35;
  stroke-width: 3px;
  cursor: pointer;
  .action-icon {
    color: #AAB1C5;
  }

  &:hover{
    background: #F0F2F5;
    .action-icon {
      color: #2C2B35;

    }
  }
  &.danger {
    color: theme("colors.danger.default");
  }
}

.action-line-text {
  @apply ml-2;
  flex: 1 1 auto;
}
.action-separator{
  @apply my-1;
  height:1px;
  background: theme("colors.gray.100");
}
.action-arrow{
  @apply ml-2;
  color: theme("colors.gray.400");
}

.node-input {
  outline: none;
  padding: 6px 4px;
  font-size: 16px;
  line-height: 0;
  color: #2C2B35;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #D83750;
  &:hover{
    border: 1px solid #D83750;
  }
  &:focus, &:active {
    border: 1px solid #D83750;
    box-shadow: 0 0 0 2px #F9DFE3;
  }
}

</style>
