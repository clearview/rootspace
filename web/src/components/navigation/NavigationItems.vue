<template>
  <div class="nav-items">
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
        :class="{ 'is-editable': editable }"
        @click="open({ node, path, tree })"
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
            @dblclick="editable && select(path)"
          />
          <input
            v-show="isSelected(path)"
            v-model.lazy="node.title"
            @change="updateNode({ node, path, tree })"
            @keydown.esc="select(null)"
          />
        </div>
        <div class="tree-node-actions">
          <button
            v-if="node.type !== 'doc'"
            @click="updateLink({ node, path, tree })"
          >
            <v-icon name="link-edit" />
          </button>
          <button @click="destroyNode({ node, path, tree })">
            <v-icon name="trash" />
          </button>
        </div>
      </div>
    </v-tree>

    <v-modal
      v-if="modal.type == 'Update'"
      title="Update item"
      :visible="modal.visible"
      :loading="modal.loading"
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
    </v-modal>

    <v-modal
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
    </v-modal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Tree, Draggable, Fold, Node, walkTreeData } from 'he-tree-vue'

import { LinkResource, NodeResource } from '@/types/resource'

import VModal from '@/components/Modal.vue'
import FormLink from '@/components/form/FormLink.vue'

enum ModalType {
  Update = 'Update',
  Destroy = 'Destroy'
}

type ComponentData = {
  selected: string | null;
  modal: {
    visible: boolean;
    loading: boolean;
    type: ModalType | null;
    data: object | null;
  };
}

type ComponentRef = {
  formUpdate: HTMLFormElement;
}

type NodeContext = {
  node: Node;
  path: number[];
  tree: Tree & Fold & Draggable;
}

const VTree = Vue.extend({
  name: 'Tree',
  extends: Tree,
  mixins: [Draggable, Fold]
})

export default Vue.extend({
  name: 'NavigationItems',
  components: {
    VTree,
    VModal,
    FormLink
  },
  props: {
    value: {
      type: Array as PropType<NodeResource[]>
    },
    folded: {
      type: Object
    },
    active: {
      type: String
    },
    editable: {
      type: Boolean
    }
  },
  watch: {
    editable (newVal) {
      if (!newVal) this.select(null)
    },
    active (val) {
      const activeEls = this.$el.querySelectorAll('.tree-node-back.is-active')
      const targetEl = this.$el.querySelector(`[data-tree-node-path="${val}"] .tree-node-back`)

      if (activeEls) {
        activeEls.forEach(el => el.classList.remove('is-active'))
      }

      if (targetEl) {
        targetEl.classList.add('is-active')
      }
    }
  },
  data (): ComponentData {
    return {
      selected: null,
      modal: {
        visible: false,
        loading: false,
        type: null,
        data: null
      }
    }
  },
  computed: {
    treeData (): NodeResource[] {
      const treeData = [...this.value]

      walkTreeData(treeData, (node, index, parent, path) => {
        node.$folded = this.folded[path.join('.')] === true
      })

      return treeData
    },
    iconName: {
      get () {
        return {
          doc: 'file',
          link: 'link',
          taskBoard: 'file'
        }
      }
    }
  },
  methods: {
    hasChildren (link: LinkResource) {
      return link.children && link.children.length > 0
    },
    select (path: number[] | null) {
      this.selected = !path ? path : path.join('.')
    },
    isSelected (path: number[]) {
      return this.selected === path.join('.')
    },
    toggleFold ({ node, path, tree }: NodeContext) {
      tree.toggleFold(node, path)

      this.$emit('fold', {
        [path.join('.')]: node.$folded === true
      })
    },
    open ({ path, node }: NodeContext) {
      if (this.editable) {
        return
      }

      this.$store.commit('tree/setActive', path.join(','))

      switch (node.type) {
        case 'doc':
          this.$router
            .push({ name: 'Document', params: { id: node.value } })
            .catch(err => err)
          break
        case 'taskBoard':
          this.$router
            .push({ name: 'TaskPage', params: { id: node.value } })
            .catch(err => err)
          break

        default:
          window.open(node.value, '_blank')
          break
      }
    },
    async updateLink ({ node }: NodeContext) {
      try {
        await this.$store.dispatch('link/view', node.contentId)

        const list = await this.modalOpen(ModalType.Update, this.$store.state.link.item)

        await this.$store.dispatch('link/update', list)
      } catch { }
    },
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
        this.$emit('update', data)
      } catch { }
    },
    async destroyNode ({ node }: NodeContext) {
      try {
        await this.modalOpen(ModalType.Destroy)

        this.$emit('destroy', node)
      } catch { }
    },
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
  }
})
</script>

<style lang="postcss" scoped>
.modal-body {
  width: 456px;
}
</style>
