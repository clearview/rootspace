<template>
  <div class="h-full w-full relative" ref="scrollContainer">
    <div class="h-full overflow-auto">
      <sidebar-empty-tree v-if="treeData.length === 0" @addNew="addNewEmpty()"/>

      <FavoriteNode
        ref="favoriteNode"
        @restore="refresh"
        @content:update="updateContent"
        @node:update="updateNodeFromFavorites"
        @node:archive="archiveNode"
        @node:removeFromFavorites="removeFromFavorites"
        @node:fold:toggle="toggleNodeFold"
        @node:addNew="addNewNode"
      />

      <sidebar-title v-if="favorites.length">Main</sidebar-title>
      <tree
        v-if="treeData.length > 0"
        edge-scroll
        ref="tree"
        v-model="treeData"
        :class="{
          'tree': true,
          'tree--dragging': dragging,
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
          @node:archive="archiveNode"
          @node:addToFavorites="addToFavorites"
          @node:removeFromFavorites="removeFromFavorites"
          @node:fold:toggle="toggleNodeFold"
          @node:addNew="addNewNode"
        />
      </tree>

      <ArchiveNode ref="archiveNode" @restore="refresh"></ArchiveNode>
    </div>

    <transition name="menu">
      <div id="addnew-menu" v-show="menuOpen">
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

    <modal
      v-if="modal.type === 'Archive'"
      title="Archive Item"
      :visible="modal.visible"
      :loading="modal.loading"
      confirmText="Yes"
      @cancel="modalClose"
      @confirm="modalConfirm"
    >
      <div class="modal-body text-center">
        Are you sure you want to archive <span class="font-semibold">{{ modal.data }}</span>?
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins, Ref } from 'vue-property-decorator'
import { omit, last, pick, findKey, pickBy, throttle } from 'lodash'

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
import SidebarTitle from './SidebarTitle.vue'
import { EmbedResource } from '@/services/embed'
import ArchiveNode from '@/components/sidebar/ArchiveNode.vue'
import FavoriteNode from '@/components/sidebar/FavoriteNode.vue'

import FormLink from '@/components/form/FormLink.vue'
import FormTask from '@/components/form/FormTask.vue'
import FormEmbed from '@/components/form/FormEmbed.vue'

import DocumentService from '@/services/document'
import EventBus from '@/utils/eventBus'
import Primus from '@/utils/primus'

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
  NOVADOC = 'novadoc',
  EMBED = 'embed'
}

enum ModalType {
  UpdateLink = 'UpdateLink',
  UpdateTask = 'UpdateTask',
  UpdateEmbed = 'UpdateEmbed',
  Destroy = 'Destroy',
  Archive = 'Archive'
}

@Component({
  name: 'SidebarTree',
  components: {
    ArchiveNode,
    FavoriteNode,
    Tree: Mixins(Tree, Fold, Draggable),
    TreeNode,
    Modal,
    SidebarEmptyTree,
    SidebarTitle,
    FolderMenu,
    ListMenu,
    LinkMenu,
    EmbedMenu,
    TaskMenu,
    FormLink,
    FormTask,
    FormEmbed
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

  @Ref('archiveNode')
  private readonly archiveNodeRef!: ArchiveNode;

  @Ref('favoriteNode')
  private readonly favoriteNodeRef!: FavoriteNode;

  @Ref('scrollContainer')
  private readonly scrollContainerRef!: HTMLDivElement;

  $refs!: {
    tree: Tree & Fold & Draggable;
  }

  // State

  dragging = false
  socket!: Primus

  private activeMenu = {
    visible: false,
    type: MenuType.INDEX,
    loading: false,
    alert: null
  }

  private deferredParent: NodeResource | null = null;
  public deferredPath: number[] | null = null;

  // Computed

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  get favorites (): Node[] {
    const state = this.$store.state.tree
    const favorites = [...state.favorites]

    return favorites
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

  refresh () {
    this.fetch()
  }

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

  eventBusTree (type: string, node: Node) {
    switch (type) {
      case NodeType.Task:
        EventBus.$emit('BUS_TASKBOARD_UPDATE', node)
        break

      case NodeType.Doc:
        EventBus.$emit('BUS_DOC_UPDATE', node)
        break
    }
  }

  async select (type: MenuType) {
    if (type === MenuType.DOCUMENT) {
      try {
        const payload = {
          spaceId: this.activeSpace.id,
          title: 'Untitled',
          content: {},
          access: 2,
          isLocked: false,
          config: {

          }
        }

        this.$store.commit('document/setDeferredParent', this.deferredParent ? { ...this.deferredParent } : null)

        const document = await DocumentService.create({
          ...payload,
          parentId: this.$store.state.document.deferredParent ? this.$store.state.document.deferredParent.id : undefined
        })
        const getDocument = document.data
        this.$store.commit('document/setDeferredParent', null)
        await this.fetchTree()
        this.$router.replace({
          name: 'Document',
          params: { id: getDocument.data.contentId },
          query: { isnew: '1' }
        })
          .catch(() => {
            // Silent duplicate error
          })
      } catch { }

      this.$emit('menu-selected', false)

      return true
    }

    if (type === MenuType.NOVADOC) {
      try {
        const payload = {
          spaceId: this.activeSpace.id,
          // API doesn't allow empty title, so we set a "phantom" emptiness
          title: String.fromCharCode(1, 2),
          content: { type: 'doc', content: [] },
          access: 2,
          isLocked: false,
          config: {
            novaDoc: true
          }
        }
        this.$store.commit('document/setDeferredParent', this.deferredParent ? { ...this.deferredParent } : null)
        const document = await DocumentService.create({
          ...payload,
          parentId: this.$store.state.document.deferredParent ? this.$store.state.document.deferredParent.id : undefined
        })
        const getDocument = document.data
        this.$store.commit('document/setDeferredParent', null)
        this.$router.replace({
          name: 'Novadoc',
          params: { id: getDocument.data.id }
        }).catch(() => {
          // Silent duplicate error
        })
      } catch { }

      this.$emit('menu-selected', false)

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
      if (this.deferredPath) {
        this.openNodeFold(this.deferredPath)
      }
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
      if (this.deferredPath) {
        this.openNodeFold(this.deferredPath)
      }
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
      if (this.deferredPath) {
        this.openNodeFold(this.deferredPath)
      }
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
      if (this.deferredPath) {
        this.openNodeFold(this.deferredPath)
      }
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
    this.$store.commit('tree/setTouched', {})
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
      this.$store.dispatch('tree/fetchFavorites', { spaceId })

      await this.$store.dispatch('tree/fetch', { spaceId })

      this.updateFold()
    } catch { }
  }

  async updateContent (path: number[], node: Node) {
    switch (node.type) {
      case NodeType.Link:
        await this.updateLink(path, node)
        break
      case NodeType.Task:
        await this.updateTask(path, node)
        break
      case NodeType.Embed:
        await this.updateEmbed(path, node)
        break
    }
    this.$store.dispatch('tree/fetchFavorites', { spaceId: this.activeSpace.id })
  }

  async updateLink (path: number[], { id, contentId }: Node) {
    try {
      await this.$store.dispatch('link/view', contentId)

      const data = await this.modalOpen(ModalType.UpdateLink, this.$store.state.link.item) as LinkResource

      await this.updateNode(path, { ...pick(data, ['title']), id }, { localOnly: true })
      await this.$store.dispatch('link/update', data)
    } catch { }
  }

  async updateTask (path: number[], { id, contentId }: Node) {
    try {
      await this.$store.dispatch('task/board/view', contentId)

      const data = await this.modalOpen(ModalType.UpdateTask, this.$store.state.task.board.current) as TaskBoardResource

      await this.updateNode(path, { ...pick(data, ['title']), id }, { localOnly: true })
      await this.$store.dispatch('task/board/update', pick(data, ['id', 'title', 'isPublic', 'type']))

      EventBus.$emit('BUS_TASKBOARD_UPDATE', data)
    } catch { }
  }

  async updateEmbed (path: number[], { id, contentId }: Node) {
    try {
      await this.$store.dispatch('embed/view', contentId)

      const data = await this.modalOpen(ModalType.UpdateEmbed, this.$store.state.embed.item) as EmbedResource

      await this.updateNode(path, { ...pick(data, ['title']), id }, { localOnly: true })
      await this.$store.dispatch('embed/update', data)
    } catch { }
  }

  async archiveNode (path: number[], node: Node) {
    try {
      await this.modalOpen(ModalType.Archive, node.title)

      this.$refs.tree.removeNodeByPath(path)
      this.treeData = this.$refs.tree.cloneTreeData()

      await this.$store.dispatch('tree/archive', node)
      this.$store.dispatch('tree/fetchFavorites', { spaceId: this.activeSpace.id })
      this.archiveNodeRef.loadArchive()

      this.$router.push({ name: 'Main' }).catch(() => null)
    } catch { }
  }

  async addToFavorites (path: number[], node: Node) {
    try {
      await this.$store.dispatch('tree/addToFavorites', node)
      this.$store.dispatch('tree/fetchFavorites', { spaceId: this.activeSpace.id })
    } catch {}
  }

  async removeFromFavorites (path: number[], node: Node) {
    try {
      await this.$store.dispatch('tree/removeFromFavorites', node)
      this.$store.dispatch('tree/fetchFavorites', { spaceId: this.activeSpace.id })
    } catch {}
  }

  findPathFromId (treeData: Node, id: number): number[] {
    let path: number[] = []

    for (let i = 0; i < treeData.length; i++) {
      path = []
      const node = treeData[i]
      if (node.id === id) {
        path = [i]
        break
      } else if (node.children?.length) {
        path = [i, ...this.findPathFromId(node.children, id)]
      }
    }

    return path
  }

  async updateNodeFromFavorites (_: number[], node: Node, { localOnly = false } = {}) {
    const path = this.findPathFromId(this.$refs.tree.cloneTreeData(), node.id)
    this.updateNode(path, node, { localOnly })
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
        this.eventBusTree(node.type, node)
        await this.$store.dispatch('tree/update', nextNode)
      }
      this.$store.dispatch('tree/fetchFavorites', { spaceId: this.activeSpace.id })
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

    this.$store.commit('tree/setTouched', {})
    const node = this.$refs.tree.getNodeByPath(path)

    this.$store.commit('tree/updateFolded', {
      index: path.join('.'),
      value: !node.$folded
    })
  }

  openNodeFold (path: number[]) {
    if (this.dragging) {
      return
    }

    this.$store.commit('tree/setTouched', {})
    this.$refs.tree.getNodeByPath(path)

    this.$store.commit('tree/updateFolded', {
      index: path.join('.'),
      value: false
    })
  }

  async change (store: TreeStore) {
    if (store.pathChanged) {
      const path = store.targetPath || []
      const node = store.dragNode || {}
      if (store.targetPath) {
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

  public scrollToBottom () {
    this.$nextTick(() => {
      // Add slight delay to let the UI finishes render
      setTimeout(() => {
        this.scrollContainerRef.scrollTop = Number.MAX_SAFE_INTEGER
      }, 500)
    })
  }

  // Hooks

  async created () {
    this.socket = Primus.connect(this.$store.state.auth.token)
    this.socket.on('data', throttle(
      (data) => {
        console.log(data.spaceId)

        this.fetch()

        if (this.archiveNodeRef) {
          this.archiveNodeRef.loadArchive()
        }
      },
      1000
    ))

    if (this.activeSpace.id) {
      await this.fetch()

      this.socket.join(`space.${this.activeSpace.id}.Node`)
    }
  }

  // Watchers

  @Watch('activeSpace')
  async watchActiveSpace (space: SpaceResource, prevSpace: SpaceResource) {
    if (space.id && space.id !== prevSpace.id) {
      await this.fetch()

      this.socket.leave(`space.${prevSpace.id}.Node`)
      this.socket.join(`space.${space.id}.Node`)
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
  padding: 1rem 1rem 0 1rem;
  min-width: 304px;
  overflow-y: auto;

  .menu-wrapper {
    @apply relative h-full;

    >>> .list-menu  {
      padding-bottom: 16px;
    }
  }
}
</style>
