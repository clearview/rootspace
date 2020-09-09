<template>
  <div class="w-full overflow-auto">
    <div class="flex justify-center" v-if="treeData.length === 0">
      <div class="empty-content">
        <div class="space-logo">
          <img
            v-if="activeSpace.avatar"
            :src="activeSpace.avatar.versions.default.path"
            alt="Space"
          >
          <img src="@/assets/images/default-space.png" alt="Space Logo" v-else>
        </div>
        <h3>Welcome to your Space</h3>
        <p>Here you can create different types of content,
          start by creating your first content on Root</p>

        <button class="btn add-button flex-grow">
          Add New
        </button>
      </div>
    </div>
    <tree
      v-if="treeData.length > 0"
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
      v-if="modal.type === 'UpdateEmbed'"
      title="Update Embed"
      :visible="modal.visible"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      @cancel="modalClose"
      @confirm="() => $refs.embedForm.submit()"
    >
      <div class="modal-body">
        <form-embed
          ref="embedForm"
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
import { omit, last, pick, findKey, pickBy } from 'lodash'

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
import FormEmbed from '@/components/form/FormEmbed.vue'

import TreeNode, { nodeRouteNames } from './SidebarTreeNode.vue'
import { EmbedResource } from '@/services/embed'

enum NodeType {
  Link = 'link',
  Doc = 'doc',
  Task = 'taskBoard',
  Embed = 'embed',
  Folder = 'folder'
}

enum ModalType {
  UpdateLink = 'UpdateLink',
  UpdateTask = 'UpdateTask',
  UpdateEmbed = 'UpdateEmbed',
  Destroy = 'Destroy'
}

@Component({
  name: 'SidebarTree',
  components: {
    Tree: Mixins(Tree, Fold, Draggable),
    TreeNode,
    Modal,
    FormLink,
    FormTask,
    FormEmbed
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

      this.updateFold()
    } catch { }
  }

  async updateContent (path: number[], node: Node) {
    switch (node.type) {
      case NodeType.Link:
        return this.updateLink(path, node)
      case NodeType.Task:
        return this.updateTask(path, node)
      case NodeType.Embed:
        return this.updateEmbed(path, node)
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

  async updateEmbed (path: number[], { contentId }: Node) {
    try {
      await this.$store.dispatch('embed/view', contentId)

      const data = await this.modalOpen(ModalType.UpdateEmbed, this.$store.state.embed.item) as EmbedResource

      await this.updateNode(path, pick(data, ['title']), { localOnly: true })
      await this.$store.dispatch('embed/update', data)
    } catch { }
  }

  async removeNode (path: number[], node: Node) {
    try {
      await this.modalOpen(ModalType.Destroy)

      this.$refs.tree.removeNodeByPath(path)
      this.treeData = this.$refs.tree.cloneTreeData()

      await this.$store.dispatch('tree/destroy', node)

      this.$router.push({ name: 'Main' })
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

    this.$store.commit('tree/updateFolded', {
      index: path.join('.'),
      value: !node.$folded
    })
  }

  async change (store: TreeStore) {
    if (store.pathChanged) {
      const path = store.targetPath || []
      const node = store.dragNode || {}

      await this.updateNodePosition(path, node)
    }
  }

  updateFold () {
    let activePath: number[] = []

    const activeNode = {
      type: findKey(nodeRouteNames, (name: string) => name === this.$route.name),
      contentId: Number(this.$route.params.id)
    }

    // Find active path
    walkTreeData(this.treeData, (node, index, parent, path) => {
      if (node.type === activeNode.type && node.contentId === activeNode.contentId) {
        activePath = path
      }
    })

    // Inital data
    const folded = this.$store.state.tree.folded

    // Unfold active path
    for (let i = 1; i < activePath.length; i++) {
      const key = activePath.slice(0, 0 - i).join('.')

      folded[key] = false
    }

    this.$store.commit('tree/setFolded', pickBy(folded, x => x))
  }

  // Hooks

  async created () {
    if (this.activeSpace.id) {
      await this.fetch()
    }
  }

  // Watchers

  @Watch('activeSpace')
  async watchActiveSpace (space: SpaceResource, prevSpace: SpaceResource) {
    if (space.id && space.id !== prevSpace.id) {
      await this.fetch()
    }
  }
}
</script>

<style lang="postcss" scoped>
.empty-content {
  @apply flex flex-col relative;

  padding: 36px 24px 16px 24px;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 44px;
  background-color: #EFF1F6;
  width: 272px;

  h3 {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    text-align: center;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    margin-bottom: 16px;
  }

  button {
    @apply w-full;

    background-color: #EFF1F6;
    font-size: 14px;
    line-height: 17px;

    &:hover {
      background-color: #F8F9FD;
    }
  }

  .space-logo {
    @apply absolute;

    background-color: #EFF1F6;
    padding: 12px;
    top: -38px;
    border-radius: 56px;
    border: 5px solid #FFF;
    right: 108px;

    img {
      width: 32px;
      height: 32px;
      border-radius: 32px;
    }
  }
}
</style>
