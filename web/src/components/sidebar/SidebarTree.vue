<template>
  <div class="sidebar-items">
    <v-tree
      class="tree"
      triggerClass="tree-node-handle"
      :indent="16"
      :value="treeData"
      @drop="updateNode({ node: $event.dragNode, path: $event.targetPath, tree: $event.targetTree })"
      #default="{ node, path, tree }"
    >
      <div
        class="tree-node-content"
        :class="{
          'is-editable': !locked,
          'is-active': getNodeURL({ node }) === $route.path,
        }"
        @click="open({ node })"
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
          <v-icon name="down" />
        </div>
        <div class="tree-node-icon">
          <v-icon :name="iconName[node.type]" />
        </div>
        <div class="tree-node-text">
          <span
            v-show="!isSelected(path)"
            v-text="node.title"
            class="truncate"
            @dblclick="!locked && select(path)"
          />
          <input
            v-show="isSelected(path)"
            v-model="node.title"
            @change="updateNode({ node, path, tree })"
            @keydown.esc="select(null)"
          />
        </div>
        <div class="tree-node-actions">
          <button
            v-if="node.type === 'link'"
            @click="updateLink({ node, path, tree })"
          >
            <v-icon name="link-edit" />
          </button>
          <button
            v-if="node.type === 'taskBoard'"
            @click="updateTask({ node, path, tree })"
          >
            <v-icon name="link-edit" />
          </button>
          <button @click="destroyNode({ node, path, tree })">
            <v-icon name="trash" />
          </button>
        </div>
      </div>
    </v-tree>

    <modal
      v-if="modal.type === 'UpdateLink'"
      title="Update Link"
      :visible="modal.visible"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      @cancel="$emit('modal:cancel')"
      @confirm="() => $refs.formUpdate.submit()"
    >
      <div class="modal-body">
        <form-link
          notitle
          :value="modal.data"
          ref="formUpdate"
          @submit="$emit('modal:confirm', $event)"
        />
      </div>
    </modal>

    <modal
      v-if="modal.type === 'UpdateTask'"
      title="Update Board"
      :visible="modal.visible"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      @cancel="$emit('modal:cancel')"
      @confirm="() => $refs.formUpdate.submit()"
    >
      <div class="modal-body">
        <form-task
          notitle
          :value="modal.data"
          ref="formUpdate"
          @submit="$emit('modal:confirm', $event)"
        />
      </div>
    </modal>

    <modal
      v-if="modal.type == 'Destroy'"
      title="Delete Item"
      :visible="modal.visible"
      :loading="modal.loading"
      confirmText="Yes"
      @cancel="$emit('modal:cancel')"
      @confirm="$emit('modal:confirm')"
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

import {
  SpaceMetaResource,
  LinkResource,
  NodeResource,
  TaskBoardResource,
  SpaceResource
} from '@/types/resource'

import Modal from '@/components/Modal.vue'
import FormLink from '@/components/form/FormLink.vue'
import FormTask from '@/components/form/FormTask.vue'
import { TreeState } from '../../types/state'

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

interface NodeContext {
  node: Node & NodeResource;
  path: number[];
  tree: Tree & Fold & Draggable;
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
    Modal,
    FormLink,
    FormTask
  }
})
export default class SidebarTree extends Vue {
  @Prop(Boolean)
  private readonly locked!: boolean

  private selected: string | null = null
  private treeData: NodeResource[] = []

  private modal: ModalState = {
    visible: false,
    loading: false,
    type: null,
    data: null
  }

  get treeState (): TreeState {
    return this.$store.state.tree
  }

  get iconName () {
    return {
      doc: 'file',
      folder: 'folder',
      link: 'link',
      taskBoard: 'file'
    }
  }

  get nodeTypeRouteMap (): { [key: string]: string } {
    return {
      link: 'Link',
      doc: 'Document',
      taskBoard: 'TaskPage'
    }
  }

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  get activeSpaceMeta (): SpaceMetaResource {
    return this.$store.getters['space/activeSpaceMeta']
  }

  fetchTreeData () {
    const { list, folded } = this.treeState

    walkTreeData(list, (node, index, parent, path) => {
      node.$folded = folded[path.join('.')] === true
    })

    this.treeData = [...list]
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

    this.$store.commit('tree/setFolded', {
      [path.join('.')]: node.$folded === true
    })
  }

  getNodeURL ({ node }: Pick<NodeContext, 'node'>) {
    const { href } = this.$router.resolve({
      name: this.nodeTypeRouteMap[node.type],
      params: {
        id: node.contentId.toString()
      }
    })

    return href
  }

  async open ({ node }: Pick<NodeContext, 'node'>) {
    const url = this.getNodeURL({ node })
    if (!this.locked) {
      return
    }

    if (node.type === 'link') {
      await this.$router.push(url)
    } else {
      this.$store.commit('space/updateMeta', {
        index: this.$store.state.space.activeIndex,
        meta: {
          activePage: url
        }
      })
    }
  }

  async updateLink ({ node }: NodeContext) {
    try {
      await this.$store.dispatch('link/view', node.contentId)

      const list = await this.modalOpen(ModalType.UpdateLink, this.$store.state.link.item)

      await this.$store.dispatch('link/update', list)
    } catch { }
  }

  async updateTask ({ node }: NodeContext) {
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

  async updateNode ({ node, path, tree }: NodeContext) {
    try {
      const parent = tree.getNodeParentByPath(path)
      const position = path.slice(-1).pop() || 0

      const data = {
        ...node,
        parent: (parent && parent.id) || null,
        position: position + 1,
        children: undefined,
        created: undefined,
        updated: undefined
      }

      this.select(null)

      await this.$store.dispatch('tree/update', data)
      await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
    } catch { }
  }

  async destroyNode ({ node }: NodeContext) {
    try {
      await this.modalOpen(ModalType.Destroy)

      this.$emit('destroy', node)
    } catch { }
  }

  async modalOpen (type: ModalType, data?: object) {
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

  @Watch('activeSpace')
  async watchActiveSpace () {
    try {
      await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
    } catch { }
  }

  @Watch('treeState', { immediate: true, deep: true })
  watchTreeData () {
    this.fetchTreeData()
  }

  async created () {
    try {
      await this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
    } catch { }
  }
}
</script>
