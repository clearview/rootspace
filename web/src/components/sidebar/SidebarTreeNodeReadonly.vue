<template>
  <div
    class="tree-node-content readonly"
    :class="{ deep: isDeep, bordered: !isFirst}"
  >
    <div
      class="tree-node-arrow"
      :class="{
        'is-hidden': !hasChildren,
        'is-folded': false
      }"
    >
      <v-icon name="down2" viewbox="16"/>
    </div>

    <div class="tree-node-label overflow-hidden">
      <div class="tree-node-icon">
        <v-icon viewbox="16" :name="iconName"/>
      </div>
      <label-editable
        class="tree-node-text truncate"
        v-model="title"
      />
    </div>
    <div class="actions">
        <button class="btn btn-icon" @click="restore" v-tippy="{ placement : 'top',  arrow: true }" content="Restore">
          <v-icon name="restore" size="16px" viewbox="16" title="Restore"/>
        </button>
      <button class="btn btn-icon" @click="remove" v-tippy="{ placement : 'top',  arrow: true }" content="Delete">
        <v-icon name="trash" size="16px" viewbox="30" title="Delete"/>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { Node } from '@adityapurwa/he-tree-vue'
import LabelEditable from '@/components/LabelEditable.vue'

import { NodeResource } from '@/types/resource'
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
export default class SidebarTreeNodeReadonly extends Vue {
  // Props

  @Prop(Object)
  private readonly value!: NodeData;

  @Prop(Array)
  private readonly path!: number[];

  // Computed

  get isDeep () {
    return this.path.length > 1
  }

  get isFirst () {
    return this.path[0] === 0
  }

  get type (): NodeType {
    return this.value.type as NodeType
  }

  get iconName (): string {
    if (this.type === NodeType.Folder) {
      return 'folder-open'
    }
    return nodeIconNames[this.type]
  }

  get hasChildren () {
    const { children } = this.value

    return children && children.length > 0
  }

  get folded (): boolean {
    return false
  }

  get title (): string {
    return this.value.title || ''
  }

  remove () {
    this.$emit('remove', this.path, this.value)
  }

  restore () {
    this.$emit('restore', this.path, this.value)
  }
}
</script>
<style lang="postcss" scoped>
.tree-node-content.readonly {
  &.bordered {
    border-top: solid 1px #DEE2EE;
  }
  border-radius: 0;
  cursor: default;
  margin: 0;
  &:hover {
    background: transparent;
    .tree-node-icon {
      color: #AAB1C5;
    }
  }
}
.tree-node-content.readonly.deep {
  border: none;
}
.tree-node-label {
  cursor: default;
  align-items: center;
  flex: 1 1 auto;
}
.tree-node-icon .fill-current {
  fill: transparent;
}

.tree-node-content .btn-link {
  padding: 8px;
  height: auto;
  transition: none;
}

.tree-node-content.is-renaming {
  padding-top: 0;
  padding-bottom: 0;
}

.tree-node-arrow {
  cursor: default;
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
  cursor: pointer;

  .action-icon {
    color: #AAB1C5;
  }

  &:hover {
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

.action-separator {
  @apply my-1;
  height: 1px;
  background: theme("colors.gray.100");
}

.action-arrow {
  @apply ml-2;
  color: theme("colors.gray.400");
}

.actions {
  display: flex;
  align-items: center;
  margin: 0 16px;

  .btn-icon {
    background: transparent;
    color: #AAB1C5;
    padding: 8px;
    height: auto;
    border-radius: 100%;
    &:hover {
      background: #EFF1F6;
      color: #444754;
    }
    .fill-current {
      fill: transparent;
    }
  }
}
</style>
