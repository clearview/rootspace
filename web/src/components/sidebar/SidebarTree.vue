<template>
  <div class="w-full overflow-auto relative">
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
      :class="{
        'tree': true,
        'tree--dragging': dragging
      }"
      :indent="16"
      :ondragstart="startDragging"
      :ondragend="endDragging"
      :allowOutOfBounds="true"
      @change="change"
      #default="{ node, path }"
    >
      <tree-node
        :value="node"
        :path="path"
        @content:update="updateContent"
        @node:update="updateNode"
        @node:remove="removeNode"
        @node:fold:toggle="toggleNodeFold"
        @node:addNew="addNewNode"
      />
    </tree>

    <transition name="menu">
      <div id="addnew-menu" v-if="menuOpen">
        <div class="menu-wrapper">
          <div class="list-menu" v-if="isMenuActive('index')">
            <h3>Add New</h3>
            <p>Please select one option you want to add</p>
            <select-node-type @select="select"/>
          </div>

          <div class="list-menu" v-if="isMenuActive('folder')">
            <h3>Folder</h3>
            <p>Please enter name to create a folder</p>

            <form-folder
              @submit="addFolder"
              :space="activeSpace.id"
              ref="formFolder"
            />
          </div>

          <div class="list-menu" v-if="isMenuActive('link')">
            <h3>Link</h3>
            <p>Please enter name and put link to create a link</p>

            <form-link
              @submit="addLink"
              :space="activeSpace.id"
              ref="formLink"
            />
          </div>

          <div class="list-menu" v-if="isMenuActive('embed')">
            <h3>Embed</h3>
            <p>Please select 1 of 4 categories you want to add</p>

            <form-embed
              @submit="addEmbed"
              :space="activeSpace.id"
              ref="formEmbed"
            />
          </div>

          <div class="list-menu" v-if="isMenuActive('task')">
            <h3>Task Board</h3>
            <p>Please select view type</p>

            <form-task
              @submit="addTask"
              :space="activeSpace.id"
              ref="formTask"
            />
          </div>
        </div>
      </div>
    </transition>

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
import SelectNodeType from '@/components/SelectNodeType.vue'

import {
  Tree,
  Draggable,
  Fold,
  Node,
  Store as TreeStore,
  walkTreeData,
  getPureTreeData
} from '@adityapurwa/he-tree-vue'

import {
  LinkResource,
  TaskBoardResource,
  SpaceResource,
  NodeResource
} from '@/types/resource'

import ModalMixin, { Modal } from '@/mixins/ModalMixin'

import FormLink from '@/components/form/FormLink.vue'
import FormTask from '@/components/form/FormTask.vue'
import FormEmbed from '@/components/form/FormEmbed.vue'
import FormFolder from '@/components/form/FormFolder.vue'

import TreeNode, { nodeRouteNames } from './SidebarTreeNode.vue'
import { EmbedResource } from '@/services/embed'

enum NodeType {
  Link = 'link',
  Doc = 'doc',
  Task = 'taskBoard',
  Embed = 'embed',
  Folder = 'folder'
}

enum MenuType {
  INDEX = 'index',
  FOLDER = 'folder',
  LINK = 'link',
  TASK = 'task',
  DOCUMENT = 'document',
  EMBED = 'embed'
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
    FormEmbed,
    FormFolder,
    SelectNodeType
  }
})
export default class SidebarTree extends Mixins(ModalMixin) {
  @Prop(Boolean)
  private readonly menuOpen!: boolean

  @Watch('menuOpen', { immediate: false })
  private resetDeferredParent (val: boolean) {
    this.$nextTick(() => {
      if (!val) {
        this.deferredParent = null
        this.deferredPath = null
      }
    })
  }

  $refs!: {
    tree: Tree & Fold & Draggable;
  }

  // State

  dragging = false

  private activeMenu = {
    visible: false,
    type: MenuType.INDEX,
    loading: false,
    alert: null
  }

  private deferredParent: NodeResource | null = null;
  private deferredPath: number[] | null = null;

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

  async select (type: MenuType) {
    if (type === MenuType.DOCUMENT) {
      this.$emit('menu-selected', false)

      try {
        this.$store.commit('document/setDeferredParent', this.deferredParent ? { ...this.deferredParent } : null)
        await this.$router.push({ name: 'Document' })
      } catch { }

      return true
    }

    this.setActiveMenu(true, type)
  }

  setActiveMenu (visible: boolean, type = MenuType.INDEX) {
    this.activeMenu = {
      ...this.activeMenu,

      type,
      visible
    }
  }

  isMenuActive (type: MenuType): boolean {
    return this.activeMenu.type === type && this.activeMenu.visible
  }

  async fetchTree () {
    return this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
  }

  async addFolder (data: NodeResource) {
    this.activeMenu.loading = true

    try {
      if (this.deferredParent && this.deferredPath) {
        data.parentId = this.deferredParent.id
      }
      await this.$store.dispatch('tree/createFolder', data)
      await this.fetchTree()
    } catch { }

    this.activeMenu.loading = false

    this.setActiveMenu(false)
    this.$emit('menu-selected', false)
  }

  async addLink (data: LinkResource) {
    this.activeMenu.loading = true

    try {
      if (this.deferredParent && this.deferredPath) {
        data.parentId = this.deferredParent.id
      }
      await this.$store.dispatch('link/create', data)
      await this.fetchTree()
    } catch { }

    this.activeMenu.loading = false

    this.setActiveMenu(false)
    this.$emit('menu-selected', false)
  }

  async addTask (data: TaskBoardResource) {
    this.activeMenu.loading = true

    try {
      if (this.deferredParent && this.deferredPath) {
        (data as any).parentId = this.deferredParent.id
      }
      const res = await this.$store.dispatch('task/board/create', data) as NodeResource
      await this.fetchTree()
      if (res.contentId) {
        await this.$router.push({
          name: 'TaskPage',
          params: {
            id: res.contentId.toString()
          }
        })
      }
    } catch { }

    this.activeMenu.loading = false

    this.setActiveMenu(false)
    this.$emit('menu-selected', false)
  }

  async addEmbed (data: any) {
    this.activeMenu.loading = true
    try {
      if (this.deferredParent && this.deferredPath) {
        data.parentId = this.deferredParent.id
      }
      await this.$store.dispatch('embed/create', data)
      await this.fetchTree()
    } catch { }

    this.activeMenu.loading = false

    this.setActiveMenu(false)
    this.$emit('menu-selected', false)
  }

  addNewNode (path: number[], payload: NodeResource) {
    this.$emit('addNew', path, payload)
    this.deferredParent = payload
    this.deferredPath = path
  }

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
      let nextNode = node

      if (!this.deferredParent && !this.deferredPath) {
        nextNode = Object.assign(
          this.$refs.tree.getNodeByPath(path),
          node
        )
      }

      // Update store
      this.treeData = this.$refs.tree.cloneTreeData()

      // Sync node update with api
      if (!localOnly) {
        await this.$store.dispatch('tree/update', nextNode)
      }
    } catch (ex) {
      console.error(ex)
    }
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

  @Watch('menuOpen')
  watchMenuOpen () {
    if (this.menuOpen) {
      this.setActiveMenu(true)
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

#addnew-menu {
  @apply absolute;

  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #F8F9FD;
  padding: 1rem;

  .menu-wrapper {
    @apply relative h-full;

    .list-menu {
      @apply absolute;

      bottom: 0;
      right: 0;
      left: 0;

      h3 {
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
      }

      p {
        @apply mb-4;

        font-size: 14px;
        line-height: 17px;
      }
    }
  }
}
</style>
