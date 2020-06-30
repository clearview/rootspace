<template>
  <div
    class="nav"
    :class="{
      'nav--collapse': collapse
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
      @addWorkspace="startAddWorkspace"
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
      title="Add Workspace"
      :visible="workspace.add.visible"
      :loading="workspace.add.loading"
      confirmText="Add"
      @cancel="workspace.add.visible = false"
      @confirm="() => $refs.formWorkspaceAdd.submit()"
    >
      <div class="modal-body">
        <form-workspace
          nobutton
          ref="formWorkspaceAdd"
          @submit="addWorkspace"
        />
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { pick } from 'lodash'

import { LinkResource, TaskBoardResource, WorkspaceResource, NodeResource } from '@/types/resource'

import WorkspaceService from '@/services/workspace'

import FormLink from '@/components/form/FormLink.vue'
import FormTask from '@/components/form/FormTask.vue'
import SelectLinkType from '@/components/SelectLinkType.vue'
import FormWorkspace from '@/components/form/FormWorkspace.vue'
import VModal from '@/components/Modal.vue'

import NavigationHeader from './NavigationHeader.vue'
import NavigationItems from './NavigationItems.vue'
import NavigationFooter from './NavigationFooter.vue'
import { Module } from 'vuex'
import { LinkState, RootState } from '@/types/state'

type Alert = {
  type: string;
  message: string;
};

type ComponentData = {
  editable: boolean;
  addNew: {
    visible: boolean;
  };
  link: {
    fetch: {
      loading: boolean;
      alert: Alert | null;
    };
    add: {
      visible: boolean;
      loading: boolean;
      alert: Alert | null;
    };
    update: {
      visible: boolean;
      loading: boolean;
      data: LinkResource | null;
      alert: Alert | null;
    };
    destroy: {
      visible: boolean;
      loading: boolean;
      data: LinkResource | null;
      alert: Alert | null;
    };
  };
  task: {
    fetch: {
      loading: boolean;
      alert: Alert | null;
    };
    add: {
      visible: boolean;
      loading: boolean;
      alert: Alert | null;
    };
    update: {
      visible: boolean;
      loading: boolean;
      data: LinkResource | null;
      alert: Alert | null;
    };
    destroy: {
      visible: boolean;
      loading: boolean;
      data: LinkResource | null;
      alert: Alert | null;
    };
  };
  workspace: {
    add: {
      visible: boolean;
      loading: boolean;
      alert: Alert | null;
    };
  };
};

export default Vue.extend({
  name: 'Navigation',
  components: {
    NavigationHeader,
    NavigationItems,
    NavigationFooter,
    FormLink,
    FormTask,
    SelectLinkType,
    FormWorkspace,
    VModal
  },
  data (): ComponentData {
    return {
      editable: false,
      addNew: {
        visible: false
      },
      link: {
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
      },
      task: {
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
      },
      workspace: {
        add: {
          visible: false,
          loading: false,
          alert: null
        }
      }
    }
  },
  computed: {
    tree () {
      return this.$store.state.tree
    },
    links () {
      return this.$store.state.link
    },
    collapse () {
      return this.$store.state.nav.collapse
    },
    hasSpace () {
      const spaces = this.$store.state.auth.spaces

      return spaces && spaces.length > 0
    },
    currentSpace () {
      return this.$store.state.auth.currentSpace || {}
    }
  },
  watch: {
    async currentSpace (val) {
      await this.fetchTree(val)
    }
  },
  async created () {
    if (!this.hasSpace) {
      return this.$router.replace({ name: 'WorkspaceInit' })
    }

    await this.fetchTree(this.currentSpace)
  },
  methods: {
    toggleCollapse () {
      this.$store.commit('nav/setCollapse', !this.collapse)
    },
    startAddLink () {
      this.addNew.visible = false
      this.link.add.visible = true
    },
    startAddTask () {
      this.addNew.visible = false
      this.task.add.visible = true
    },
    startAddDocument () {
      this.$router.push({ name: 'Document' })
      this.addNew.visible = false
    },
    startAddNew () {
      this.addNew.visible = true
    },
    startAddWorkspace () {
      this.workspace.add.visible = true
    },
    toggleFold (data: object) {
      this.$store.commit('tree/setFolded', data)
    },
    async fetchTree (space: WorkspaceResource) {
      this.link.fetch.loading = true

      await this.$store.dispatch('tree/fetch', { spaceId: space.id })

      this.link.fetch.loading = false
    },
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
    },
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
    },
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
    },
    async destroyItem (data: NodeResource) {
      await this.$store.dispatch('tree/destroy', data)

      await this.fetchTree(this.currentSpace)
    },
    async addWorkspace (data: WorkspaceResource) {
      this.workspace.add.loading = true

      try {
        const res = await WorkspaceService.create(data)

        await this.$store.dispatch('auth/whoami')

        this.$store.commit(
          'auth/setCurrentSpace',
          pick(res.data, ['id', 'title', 'settings'])
        )
      } catch (err) {
        this.workspace.add.alert = {
          type: 'danger',
          message: err.message
        }
      }

      this.workspace.add.loading = false
      this.workspace.add.visible = false
    }
  }
})
</script>

<style lang="postcss" scoped>
.modal-body {
  width: 456px;
}
</style>
