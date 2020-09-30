<template>
  <div class="w-full overflow-auto relative">
    <sidebar-empty-tree v-if="treeData.length === 0" @addNew="addNewEmpty()"/>

    <tree
      v-if="treeData.length > 0"
      edge-scroll
      ref="tree"
      v-model="treeData"
      :class="{
        'tree': true,
        'tree--dragging': dragging,
        'h-full overflow-hidden': menuOpen
      }"
      :indent="16"
      :ondragstart="startDragging"
      :ondragend="endDragging"
      :minDisplacement="18"
      edgeScrollTriggerMode="mouse"
      :edgeScrollTriggerMargin="18"
      edgeScroll
      :opacity="0.5"
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

    <!-- <transition name="menu"> : Disable this to prevent animation glitch - will fix soon -->
      <div id="addnew-menu" v-if="menuOpen">
        <div class="menu-wrapper">
          <component
            :is="menuActive(activeMenu.type)"
            @submit-folder="addFolder"
            @submit-link="addLink"
            @submit-embed="addEmbed"
            @submit-task="addTask"
            @select="select">
          </component>
        </div>
      </div>
    <!-- </transition> -->

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
} from '@adityapurwa/he-tree-vue'

import {
  LinkResource,
  TaskBoardResource,
  SpaceResource,
  NodeResource
} from '@/types/resource'

import ModalMixin, { Modal } from '@/mixins/ModalMixin'

import ListMenu from '@/components/sidebar/menu/ListMenu.vue'
import FolderMenu from '@/components/sidebar/menu/FolderMenu.vue'
import LinkMenu from '@/components/sidebar/menu/LinkMenu.vue'
import EmbedMenu from '@/components/sidebar/menu/EmbedMenu.vue'
import TaskMenu from '@/components/sidebar/menu/TaskMenu.vue'

import SidebarEmptyTree from '@/components/sidebar/SidebarEmptyTree.vue'

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
    SidebarEmptyTree,
    FolderMenu,
    ListMenu,
    LinkMenu,
    EmbedMenu,
    TaskMenu
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
    this.updateFoldWith(data)
    this.$store.commit('tree/setList', getPureTreeData(data))
  }

  // Methods

  menuActive (type: string) {
    switch (type) {
      case MenuType.FOLDER:
        return 'folder-menu'

      case MenuType.LINK:
        return 'link-menu'

      case MenuType.TASK:
        return 'task-menu'

      case MenuType.EMBED:
        return 'embed-menu'

      default:
        return 'list-menu'
    }
  }

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

  addNewEmpty () {
    this.$emit('addNew')
  }

  startDragging () {
    this.$store.commit('space/freezeSettings')
    this.dragging = true
  }

  endDragging () {
    this.$store.commit('space/unfreezeSettings')
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

      if (store.targetPath) {
        const movedNode = this.$refs.tree.getNodeByPath(store.targetPath)
        this.$store.commit('tree/setTouched', {
          [path.join('.')]: true
        })
      }

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

  updateFoldWith (data: Node[]) {
    const foldeds = this.$store.state.tree.folded

    walkTreeData(data, (node, index, parent, path) => {
      foldeds[path.join('.')] = node.$folded
    })

    this.$store.commit('tree/setFolded', foldeds)
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
#addnew-menu {
  @apply absolute;

  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #F8F9FD;
  padding: 1rem;
  min-width: 304px;

  .menu-wrapper {
    @apply relative h-full;
  }
}
</style>
