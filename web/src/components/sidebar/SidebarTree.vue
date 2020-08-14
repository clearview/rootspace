<template>
  <div class="w-full overflow-auto">
    <tree
      edge-scroll
      ref="tree"
      v-model="treeData"
      trigger-class="tree-node-handle"
      :class="{
        'tree': true,
        'tree--dragging': dragging
      }"
      :indent="16"
      :ondragstart="startDragging"
      :ondragend="endDragging"
      @change="change"
      #default="{ node, path }"
    >
      <tree-node
        :value="node"
        :path="path"
        :editable="!locked"
        @content:update="updateContent"
        @node:update="updateNode"
        @node:remove="removeNode"
        @node:fold:toggle="toggleNodeFold"
      />
    </tree>

    <modal
      v-if="modal.type === 'UpdateLink'"
      title="Update Link"
      :visible="modal.visible"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      @cancel="modalClose"
      @confirm="() => $refs.linkForm.submit()"
    >
      <div class="modal-body">
        <form-link
          ref="linkForm"
          :value="modal.data"
          @submit="modalConfirm"
        />
      </div>
    </modal>

    <modal
      v-if="modal.type === 'UpdateTask'"
      title="Update Board"
      :visible="modal.visible"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      @cancel="modalClose"
      @confirm="() => $refs.taskForm.submit()"
    >
      <div class="modal-body">
        <form-task
          ref="taskForm"
          :value="modal.data"
          @submit="modalConfirm"
        />
      </div>
    </modal>

    <modal
      v-if="modal.type == 'Destroy'"
      title="Delete Item"
      :visible="modal.visible"
      :loading="modal.loading"
      confirmText="Yes"
      @cancel="modalClose"
      @confirm="modalConfirm"
    >
      <div class="modal-body text-center">
        Are you sure you want to delete this item?
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import { omit, last, pick } from 'lodash'

import {
  Tree,
  Draggable,
  Fold,
  Node,
  Store as TreeStore,
  walkTreeData,
  getPureTreeData
} from 'he-tree-vue'

import {
  LinkResource,
  TaskBoardResource,
  SpaceResource
} from '@/types/resource'

import ModalMixin, { Modal } from '@/mixins/ModalMixin'

import FormLink from '@/components/form/FormLink.vue'
import FormTask from '@/components/form/FormTask.vue'

import TreeNode from './SidebarTreeNode.vue'

enum NodeType {
  Link = 'link',
  Doc = 'doc',
  Task = 'taskBoard',
  Folder = 'folder'
}

enum ModalType {
  UpdateLink = 'UpdateLink',
  UpdateTask = 'UpdateTask',
  Destroy = 'Destroy'
}

@Component({
  name: 'SidebarTree',
  components: {
    Tree: Mixins(Tree, Fold, Draggable),
    TreeNode,
    Modal,
    FormLink,
    FormTask
  }
})
export default class SidebarTree extends Mixins(ModalMixin) {
  $refs!: {
    tree: Tree & Fold & Draggable;
  }

  // Props

  @Prop(Boolean)
  readonly locked!: boolean

  // State

  dragging = false

  // Computed

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  get treeData (): Node[] {
    const state = this.$store.state.tree
    const list = [...state.list]

    walkTreeData(list, (node, index, parent, path) => {
      const key = path.join('.')

      node.$folded = state.folded[key] === true
    })

    return list
  }

  set treeData (data: Node[]) {
    this.$store.commit('tree/setList', getPureTreeData(data))
  }

  // Methods

  startDragging () {
    this.dragging = true
  }

  endDragging () {
    this.dragging = false
  }

  async fetch () {
    const spaceId = this.activeSpace.id

    try {
      await this.$store.dispatch('tree/fetch', { spaceId })
    } catch { }
  }

  async updateContent (path: number[], node: Node) {
    switch (node.type) {
      case NodeType.Link:
        return this.updateLink(path, node)

      case NodeType.Task:
        return this.updateTask(path, node)
    }
  }

  async updateLink (path: number[], { contentId }: Node) {
    try {
      await this.$store.dispatch('link/view', contentId)

      const data = await this.modalOpen(ModalType.UpdateLink, this.$store.state.link.item) as LinkResource

      await this.updateNode(path, pick(data, ['title']), { localOnly: true })
      await this.$store.dispatch('link/update', data)
    } catch { }
  }

  async updateTask (path: number[], { contentId }: Node) {
    try {
      await this.$store.dispatch('task/board/view', contentId)

      const data = await this.modalOpen(ModalType.UpdateTask, this.$store.state.task.board.current) as TaskBoardResource

      await this.updateNode(path, pick(data, ['title']), { localOnly: true })
      await this.$store.dispatch('task/board/update', pick(data, ['id', 'title', 'isPublic', 'type']))
    } catch { }
  }

  async removeNode (path: number[], node: Node) {
    try {
      await this.modalOpen(ModalType.Destroy)

      this.$refs.tree.removeNodeByPath(path)
      this.treeData = this.$refs.tree.cloneTreeData()

      await this.$store.dispatch('tree/destroy', node)
    } catch { }
  }

  async updateNode (path: number[], node: Node, { localOnly = false } = {}) {
    try {
      // Mutate node
      const nextNode = Object.assign(
        this.$refs.tree.getNodeByPath(path),
        node
      )

      // Update store
      this.treeData = this.$refs.tree.cloneTreeData()

      // Sync node update with api
      if (!localOnly) {
        await this.$store.dispatch('tree/update', nextNode)
      }
    } catch { }
  }

  async updateNodePosition (path: number[], node: Node) {
    try {
      const parent = this.$refs.tree.getNodeParentByPath(path)
      const index = last(path) || 0

      const nextNode = omit(
        {
          ...node,
          parent: (parent && parent.id) || null,
          position: index + 1
        },
        ['children', 'created', 'updated']
      )

      await this.updateNode(path, nextNode)
    } catch { }
  }

  toggleNodeFold (path: number[]) {
    if (this.dragging) {
      return
    }

    const node = this.$refs.tree.getNodeByPath(path)

    this.$refs.tree.toggleFold(node, path)
    this.$store.commit('tree/updateFolded', {
      index: path.join('.'),
      value: node.$folded
    })
  }

  async change (store: TreeStore) {
    if (store.pathChanged) {
      const path = store.targetPath || []
      const node = store.dragNode || {}

      await this.updateNodePosition(path, node)
    }
  }

  // Hooks

  async created () {
    await this.fetch()
  }

  // Watchers

  @Watch('activeSpace')
  async watchActiveSpace (space: SpaceResource, prevSpace: SpaceResource) {
    if (space.id !== prevSpace.id) {
      await this.fetch()
    }
  }
}
</script>
