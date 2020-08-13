<template>
  <div class="flex flex-1 overflow-auto">
    <v-tree
      ref="tree"
      class="tree"
      triggerClass="tree-node-handle"
      :indent="16"
      :value="treeData"
      @drop="updateNode({ node: $event.dragNode, path: $event.targetPath, tree: $event.targetTree })"
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
    </v-tree>

    <modal
      v-if="modal.type === 'UpdateLink'"
      title="Update Link"
      :visible="modal.visible"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      @cancel="modalCancel"
      @confirm="() => $refs.formUpdate.submit()"
    >
      <div class="modal-body">
        <form-link
          notitle
          :value="modal.data"
          ref="formUpdate"
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
      @cancel="modalCancel"
      @confirm="() => $refs.formUpdate.submit()"
    >
      <div class="modal-body">
        <form-task
          notitle
          :value="modal.data"
          ref="formUpdate"
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
      @cancel="modalCancel"
      @confirm="modalConfirm"
    >
      <div class="modal-body text-center">
        Are you sure you want to delete this item?
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Tree, Draggable, Fold, Node, walkTreeData } from 'he-tree-vue'

import TreeNode from './SidebarTreeNode.vue'

import {
  LinkResource,
  NodeResource,
  TaskBoardResource,
  SpaceResource
} from '@/types/resource'

import Modal from '@/components/Modal.vue'
import FormLink from '@/components/form/FormLink.vue'
import FormTask from '@/components/form/FormTask.vue'

type NodeData = Node & NodeResource

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

interface ModalState {
  visible: boolean;
  loading: boolean;
  type: ModalType | null;
  data: object | null;
}

const VTree = Vue.extend({
  name: 'Tree',
  extends: Tree,
  mixins: [Draggable, Fold]
})

@Component({
  name: 'SidebarTree',
  components: {
    VTree,
    TreeNode,
    Modal,
    FormLink,
    FormTask
  }
})
export default class SidebarTree extends Vue {
  $refs!: {
    tree: Tree & Fold & Draggable;
  }

  // Props

  @Prop(Boolean)
  private readonly locked!: boolean

  // State

  private modal: ModalState = {
    visible: false,
    loading: false,
    type: null,
    data: null
  }

  // Computed

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  get treeData () {
    const state = this.$store.state.tree
    const list = [...state.list]

    walkTreeData(list, (node, index, parent, path) => {
      const key = path.join('.')

      node.$folded = state.folded[key] === true
    })

    return list
  }

  // Methods

  async modalOpen<T> (type: ModalType, data?: object) {
    this.modal = {
      ...this.modal,
      visible: true,
      data: data || null,
      type
    }

    return new Promise((resolve, reject) => {
      this.$once('modal:cancel', () => {
        this.modal.visible = false

        reject(new Error('Cancel'))
      })

      this.$once('modal:confirm', (data: object) => {
        this.modal.visible = false

        resolve(data)
      })
    })
  }

  modalCancel () {
    this.$emit('modal:cancel')
  }

  modalConfirm (data: object) {
    this.$emit('modal:confirm', data)
  }

  async fetch () {
    const spaceId = this.activeSpace.id

    try {
      await this.$store.dispatch('tree/fetch', { spaceId })
    } catch { }
  }

  async updateContent (path: number[], node: NodeData) {
    switch (node.type) {
      case NodeType.Link:
        return this.updateLink(node)

      case NodeType.Task:
        return this.updateTask(node)
    }
  }

  async updateLink (node: NodeData) {
    try {
      await this.$store.dispatch('link/view', node.contentId)

      const data = await this.modalOpen(ModalType.UpdateLink, this.$store.state.link.item) as LinkResource

      await this.$store.dispatch('link/update', data)
    } catch { }
  }

  async updateTask (node: NodeData) {
    try {
      await this.$store.dispatch('task/board/view', node.contentId)

      const board = await this.modalOpen(ModalType.UpdateTask, this.$store.state.task.board.current) as TaskBoardResource

      await this.$store.dispatch('task/board/update', {
        id: board.id,
        title: board.title,
        isPublic: board.isPublic,
        type: board.type
      })
    } catch { }
  }

  toggleNodeFold (path: number[], node: NodeData) {
    const key = path.join('.')

    this.$store.commit('tree/setFolded', {
      [key]: node.$folded === true
    })
  }

  async removeNode (path: number[], node: NodeResource) {
    try {
      await this.modalOpen(ModalType.Destroy)

      await this.$store.dispatch('tree/destroy', node)
      await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
    } catch { }
  }

  async updateNode (path: number[], node: NodeResource) {
    try {
      const parent = this.$refs.tree.getNodeParentByPath(path)
      const position = path.slice(-1).pop() || 0

      const data = {
        ...node,
        parent: (parent && parent.id) || null,
        position: position + 1,
        children: undefined,
        created: undefined,
        updated: undefined
      }

      await this.$store.dispatch('tree/update', data)
      await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
    } catch { }
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
