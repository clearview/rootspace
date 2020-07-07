<template>
  <div
    class="nav"
    :class="{
      'nav--collapse': collapse,
      'nav--noanimate': noanimate
    }"
  >
    <navigation-header @toggleCollapse="toggleCollapse" />
    <navigation-items
      :value="tree.list"
      :folded="tree.folded"
      :active="tree.active"
      :editable="editable"
      @update="updateItem"
      @destroy="destroyItem"
      @fold="toggleFold"
    />
    <navigation-footer
      :editable="editable"
      @add="startAddNew"
      @edit="editable = !editable"
      @toggleCollapse="toggleCollapse"
      @addSpace="startAddSpace"
    />

    <v-modal
      title="Add New"
      :visible="addNew.visible"
      :nosubmit="true"
      @cancel="addNew.visible = false"
    >
      <div class="modal-body">
        <select-link-type
          @link="startAddLink"
          @document="startAddDocument"
          @task="startAddTask"
        />
      </div>
    </v-modal>

    <v-modal
      title="Add Link"
      :visible="link.add.visible"
      :loading="link.add.loading"
      @cancel="link.add.visible = false"
      @confirm="() => $refs.formLinkAdd.submit()"
    >
      <div class="modal-body">
        <form-link
          @submit="addLink"
          :space="currentSpace.id"
          ref="formLinkAdd"
        />
      </div>
    </v-modal>

    <v-modal
      title="Add Board"
      :visible="task.add.visible"
      :loading="task.add.loading"
      @cancel="task.add.visible = false"
      confirm-text="Create"
      @confirm="() => $refs.formTaskAdd.submit()"
    >
      <div class="modal-body">
        <form-task
          @submit="addTask"
          :space="currentSpace.id"
          ref="formTaskAdd"
        />
      </div>
    </v-modal>

    <v-modal
      title="Add Space"
      :visible="space.add.visible"
      :loading="space.add.loading"
      confirmText="Add"
      @cancel="space.add.visible = false"
      @confirm="() => $refs.formSpaceAdd.submit()"
    >
      <div class="modal-body">
        <form-space
          nobutton
          ref="formSpaceAdd"
          @submit="addSpace"
        />
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import { pick } from 'lodash'

import {
  SpaceResource,
  LinkResource,
  TaskBoardResource,
  NodeResource
} from '@/types/resource'

import SpaceService from '@/services/space'

import FormLink from '@/components/form/FormLink.vue'
import FormTask from '@/components/form/FormTask.vue'
import SelectLinkType from '@/components/SelectLinkType.vue'
import FormSpace from '@/components/form/FormSpace.vue'
import VModal from '@/components/Modal.vue'

import NavigationHeader from './NavigationHeader.vue'
import NavigationItems from './NavigationItems.vue'
import NavigationFooter from './NavigationFooter.vue'

type Alert = {
  type: string;
  message: string;
}

type NestedState = {
  loading?: boolean;
  visible?: boolean;
  data?: object | null;
  alert?: Alert | null;
}

type NestedStateMap = {
  [key: string]: NestedState;
}

@Component({
  name: 'Navigation',
  components: {
    NavigationHeader,
    NavigationItems,
    NavigationFooter,
    FormLink,
    FormTask,
    SelectLinkType,
    FormSpace,
    VModal
  }
})
export default class Navigation extends Vue {
  private editable = false

  @Prop(Boolean)
  private readonly noanimate!: boolean

  addNew: NestedState = {
    visible: false
  }

  link: NestedStateMap = {
    fetch: {
      loading: false,
      alert: null
    },
    add: {
      visible: false,
      loading: false,
      alert: null
    },
    update: {
      visible: false,
      loading: false,
      data: null,
      alert: null
    },
    destroy: {
      visible: false,
      loading: false,
      data: null,
      alert: null
    }
  }

  task: NestedStateMap = {
    fetch: {
      loading: false,
      alert: null
    },
    add: {
      visible: false,
      loading: false,
      alert: null
    },
    update: {
      visible: false,
      loading: false,
      data: null,
      alert: null
    },
    destroy: {
      visible: false,
      loading: false,
      data: null,
      alert: null
    }
  }

  space: NestedStateMap = {
    add: {
      visible: false,
      loading: false,
      alert: null
    }
  }

  get tree () {
    return this.$store.state.tree
  }

  get links () {
    return this.$store.state.link
  }

  get collapse () {
    return this.$store.state.nav.collapse
  }

  get hasSpace () {
    const spaces = this.$store.state.auth.spaces

    return spaces && spaces.length > 0
  }

  get currentSpace () {
    return this.$store.state.auth.currentSpace || {}
  }

  @Watch('currentSpace')
  async onCurrentSpaceChange (currentSpace: SpaceResource) {
    await this.fetchTree(currentSpace)
  }

  async created () {
    if (!this.hasSpace) {
      return this.$router.replace({ name: 'SpaceInit' })
    }

    await this.fetchTree(this.currentSpace)
  }

  toggleCollapse () {
    this.$store.commit('nav/setCollapse', !this.collapse)
  }

  startAddLink () {
    this.addNew.visible = false
    this.link.add.visible = true
  }

  startAddTask () {
    this.addNew.visible = false
    this.task.add.visible = true
  }

  startAddDocument () {
    this.$router.push({ name: 'Document' })
    this.addNew.visible = false
  }

  startAddNew () {
    this.addNew.visible = true
  }

  startAddSpace () {
    this.space.add.visible = true
  }

  toggleFold (data: object) {
    this.$store.commit('tree/setFolded', data)
  }

  async fetchTree (space: SpaceResource) {
    this.link.fetch.loading = true

    await this.$store.dispatch('tree/fetch', { spaceId: space.id })

    this.link.fetch.loading = false
  }

  async addLink (data: LinkResource) {
    this.link.add.loading = true

    try {
      await this.$store.dispatch('link/create', data)
      await this.fetchTree(this.currentSpace)
    } catch (e) {
      this.link.add.alert = {
        type: 'danger',
        message: e.message
      }
    }

    this.link.add.loading = false
    this.link.add.visible = false
  }

  async addTask (data: TaskBoardResource) {
    this.link.add.loading = true

    try {
      const res = await this.$store.dispatch('task/board/create', data) as {data: TaskBoardResource}
      await this.fetchTree(this.currentSpace)
      if (res.data.id) {
        await this.$router.push({
          name: 'TaskPage',
          params: {
            id: res.data.id.toString()
          }
        })
      }
    } catch (e) {
      this.task.add.alert = {
        type: 'danger',
        message: e.message
      }
    }

    this.task.add.loading = false
    this.task.add.visible = false
  }

  async updateItem (data: NodeResource) {
    try {
      await this.$store.dispatch('tree/update', data)
      await this.fetchTree(this.currentSpace)
    } catch (err) {
      this.link.update.alert = {
        type: 'danger',
        message: err.message
      }
    }
  }

  async destroyItem (data: NodeResource) {
    await this.$store.dispatch('tree/destroy', data)

    await this.fetchTree(this.currentSpace)
  }

  async addSpace (data: SpaceResource) {
    this.space.add.loading = true

    try {
      const res = await SpaceService.create(data)

      await this.$store.dispatch('auth/whoami')

      this.$store.commit(
        'auth/setCurrentSpace',
        pick(res.data, ['id', 'title', 'settings'])
      )
    } catch (err) {
      this.space.add.alert = {
        type: 'danger',
        message: err.message
      }
    }

    this.space.add.loading = false
    this.space.add.visible = false
  }
}
</script>

<style lang="postcss" scoped>
.modal-body {
  width: 456px;
}
</style>
