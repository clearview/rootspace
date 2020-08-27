<template>
  <div class="flex flex-1">
    <button
      class="btn btn-primary flex-grow"
      @click="setModalVisible(true)"
    >
      <v-icon
        name="plus"
        class="mr-1"
      />
      Add New
    </button>

    <modal
      nosubmit
      title="Add Node"
      :visible="isModalVisible('index')"
      :contentStyle="{ width: '456px' }"
      @confirm="setModalVisible(false)"
      @cancel="setModalVisible(false)"
    >
      <div class="modal-body">
        <select-node-type @select="select" />
      </div>
    </modal>

    <modal
      title="Add Folder"
      :visible="isModalVisible('folder')"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      @cancel="setModalVisible(true, 'index')"
      @confirm="() => $refs.formFolder.submit()"
    >
      <div class="modal-body">
        <form-folder
          nobutton
          @submit="addFolder"
          :space="activeSpace.id"
          ref="formFolder"
        />
      </div>
    </modal>

    <modal
      title="Add Link"
      :visible="isModalVisible('link')"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      @cancel="setModalVisible(true, 'index')"
      @confirm="() => $refs.formLink.submit()"
    >
      <div class="modal-body">
        <form-link
          @submit="addLink"
          :space="activeSpace.id"
          ref="formLink"
        />
      </div>
    </modal>

    <modal
      title="Add Board"
      :visible="isModalVisible('task')"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      confirm-text="Create"
      @cancel="setModalVisible(true, 'index')"
      @confirm="() => $refs.formTask.submit()"
    >
      <div class="modal-body">
        <form-task
          @submit="addTask"
          :space="activeSpace.id"
          ref="formTask"
        />
      </div>
    </modal>

    <modal
      title="Add Embed"
      :visible="isModalVisible('embed')"
      :loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      confirm-text="Create"
      @cancel="setModalVisible(true, 'index')"
      @confirm="() => $refs.formEmbed.submit()"
    >
      <div class="modal-body">
        <form-embed
          @submit="addEmbed"
          :space="activeSpace.id"
          ref="formEmbed"
        />
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import {
  LinkResource,
  SpaceResource,
  TaskBoardResource,
  NodeResource
} from '@/types/resource'

import FormFolder from '@/components/form/FormFolder.vue'
import FormLink from '@/components/form/FormLink.vue'
import FormTask from '@/components/form/FormTask.vue'
import FormEmbed from '@/components/form/FormEmbed.vue'
import Modal from '@/components/Modal.vue'
import SelectNodeType from '@/components/SelectNodeType.vue'

enum ModalType {
  INDEX = 'index',
  FOLDER = 'folder',
  LINK = 'link',
  TASK = 'task',
  DOCUMENT = 'document',
  EMBED = 'embed'
}

interface ModalState {
  type: ModalType;
  visible: boolean;
  loading: boolean;
  alert: object | null;
}

@Component({
  name: 'ButtonNodeAdd',
  components: {
    FormFolder,
    FormLink,
    FormTask,
    FormEmbed,
    Modal,
    SelectNodeType
  }
})
export default class ButtonNodeAdd extends Vue {
  private modal = {
    visible: false,
    type: ModalType.INDEX,
    loading: false,
    alert: null
  }

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  isModalVisible (type: ModalType): boolean {
    return this.modal.type === type && this.modal.visible
  }

  setModalVisible (visible: boolean, type = ModalType.INDEX) {
    this.modal = {
      ...this.modal,

      type,
      visible
    }
  }

  async select (type: ModalType) {
    if (type === ModalType.DOCUMENT) {
      this.setModalVisible(false)

      try {
        await this.$router.push({ name: 'Document' })
      } catch { }

      return
    }

    this.setModalVisible(true, type)
  }

  async fetchTree () {
    return this.$store.dispatch('tree/fetch', { spaceId: this.activeSpace.id })
  }

  async addFolder (data: NodeResource) {
    this.modal.loading = true

    try {
      await this.$store.dispatch('tree/createFolder', data)
      await this.fetchTree()
    } catch { }

    this.modal.loading = false

    this.setModalVisible(false)
  }

  async addLink (data: LinkResource) {
    this.modal.loading = true

    try {
      await this.$store.dispatch('link/create', data)
      await this.fetchTree()
    } catch { }

    this.modal.loading = false

    this.setModalVisible(false)
  }

  async addTask (data: TaskBoardResource) {
    this.modal.loading = true

    try {
      const res = await this.$store.dispatch('task/board/create', data) as { data: TaskBoardResource }
      await this.fetchTree()
      if (res.data.id) {
        await this.$router.push({
          name: 'TaskPage',
          params: {
            id: res.data.id.toString()
          }
        })
      }
    } catch { }

    this.modal.loading = false

    this.setModalVisible(false)
  }

  async addEmbed (data: object) {
    this.modal.loading = true
    try {
      await this.$store.dispatch('embed/create', data)
      await this.fetchTree()
    } catch { }

    this.modal.loading = false

    this.setModalVisible(false)
  }
}
</script>
