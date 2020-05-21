<template>
  <layout-main>
    <div class="settings-container">
      <h2 class="mb-5">Settings</h2>

      <ul class="tab list-reset">
        <li :class="{ active: (tab === 'account') }" @click="swichTab('account')">
          <a href="#">My Account</a>
        </li>
        <li :class="{ active: (tab === 'workspace') }" @click="swichTab('workspace')">
          <a href="#">Workspace</a>
        </li>
      </ul>

      <div class="settings-content">
        <div class="settings-myaccount" v-if="(tab === 'account')">
          <div class="col-left">
            <div class="avatar">
              <img class="rounded-full" src="@/assets/logo@2x.png" alt="Avatar Logo">
              <div class="icon-edit">
                <v-icon
                  name="edit"
                  size="1.2em"
                  viewbox="36"
                />
              </div>
            </div>
          </div>
          <div class="col-right">
            <v-alert v-model="account.alert" />
            <resource-form-settings @submit="updateAccount" ref="account" />
          </div>
        </div>

        <div class="settings-workspace" v-if="(tab === 'workspace')">
          <div class="col-center">
            <v-alert v-model="workspace.alert" />

            <div class="workspace-avatar">
              <img src="@/assets/logo@2x.png" alt="Root Logo"/>
            </div>

            <resource-form-workspace
              @submit="updateWorkspace"
              @addUser="addWorkspaceUser"
              @deleteUser="deleteWorkspaceUser"
              :value="workspaceData"
              :is-edit="true"
              button="Save"
              ref="workspace">
              <div class="form-border">
                <p>Mobile push notifications</p>
                <button-switch v-model="mobileNotifications" />
              </div>

              <div class="form-border">
                <p>Email notifications</p>
                <button-switch v-model="emailNotifications" />
              </div>
            </resource-form-workspace>
          </div>
        </div>
      </div>
    </div>

    <v-loading :loading="isLoading">
      <p>{{ loadingMessage }}</p>
    </v-loading>
  </layout-main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapMutations } from 'vuex'

import { map, find, get } from 'lodash'

import { SettingsResource, WorkspaceResource, PasswordResource } from '@/types/resource'

import UserService from '@/services/user'
import WorkspaceService from '@/services/workspace'

import VIcon from '@/components/icons/Index.vue'
import VAlert from '@/components/Alert.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import ResourceFormSettings from '@/components/resource/ResourceFormSettings.vue'
import ResourceFormWorkspace from '@/components/resource/ResourceFormWorkspace.vue'
import LayoutMain from '@/components/LayoutMain.vue'
import VLoading from '@/components/Loading.vue'

type ComponentData = {
  tab: string;
  errorAccount: object;
  errorWorkspace: object;
  mobileNotifications: boolean;
  emailNotifications: boolean;
  loadingMessage: string;
  isLoading: boolean;
  workspaceData: object;
  userAtSpaceObj: object;
  account: {
    alert: object | null;
  };
  workspace: {
    alert: object | null;
  };
}

export default Vue.extend({
  name: 'Settings',
  components: {
    VIcon,
    ButtonSwitch,
    ResourceFormSettings,
    ResourceFormWorkspace,
    VAlert,
    LayoutMain,
    VLoading
  },
  data (): ComponentData {
    return {
      tab: 'account',
      errorAccount: {},
      errorWorkspace: {},
      mobileNotifications: false,
      emailNotifications: true,
      loadingMessage: 'Update Settings...',
      isLoading: false,
      workspaceData: {},
      userAtSpaceObj: {},
      account: {
        alert: null
      },
      workspace: {
        alert: null
      }
    }
  },
  computed: {
    activeLink () {
      return this.$store.state.link.active
    },
    currentSpace () {
      return this.$store.state.auth.currentSpace || {}
    }
  },
  watch: {
    async currentSpace (val) {
      if (this.tab === 'workspace') {
        await this.viewWorkspace(val.id)
      }
    }
  },
  methods: {
    async updateAccount (...args: [SettingsResource, PasswordResource]) {
      this.isLoading = true

      try {
        const [setting, password] = args
        this.loadingMessage = 'Update Account Settings...'
        const userUpdate = await UserService.update(setting)

        if (password.password !== '' && password.newPassword !== '') {
          await UserService.passwordChange(password)
        }

        const getUserData = userUpdate.data
        this.setUser(getUserData)
      } catch (err) {
        this.account.alert = {
          type: 'danger',
          message: err.message,
          fields: err.fields
        }
      } finally {
        this.isLoading = false
      }
    },
    async updateWorkspace (data: WorkspaceResource) {
      this.isLoading = true

      try {
        const id = this.currentSpace.id
        this.isLoading = true
        this.loadingMessage = 'Update Workspace Settings...'

        const payload = { // for temporary
          title: data.title,
          invites: data.invites
        }

        await WorkspaceService.update(id, payload)
      } catch (err) {
        this.account.alert = {
          type: 'danger',
          message: err.message,
          fields: err.fields
        }
      } finally {
        this.isLoading = false
      }
    },
    addWorkspaceUser (email: string) {
      console.log(this.currentSpace.id, email)
    },
    async deleteWorkspaceUser (email: string) {
      const getUser = find(this.userAtSpaceObj, ['email', email])

      if (getUser) {
        this.isLoading = true
        this.loadingMessage = 'Remove user from workspace...'

        const getUserId = get(getUser, 'id')
        await WorkspaceService.removeUser(this.currentSpace.id, getUserId)

        this.isLoading = false
      }
    },
    async viewWorkspace (id: number) {
      this.isLoading = true
      this.loadingMessage = 'Get Workspace Settings...'

      const viewUserAtSpace = await WorkspaceService.userAtSpace(id)
      // const currentUser = this.$store.state.auth.user.id

      // remove(viewUserAtSpace.data, (user: UserResource) => user.id === currentUser)
      this.userAtSpaceObj = viewUserAtSpace.data
      const userAtSpace = map(viewUserAtSpace.data, 'email')

      const workspaceTitle = this.currentSpace.title
      this.workspaceData = {
        title: workspaceTitle,
        invites: userAtSpace
      }
      this.isLoading = false
    },
    swichTab (tab: string) {
      this.tab = tab

      if (tab === 'workspace') {
        const id = this.currentSpace.id
        this.viewWorkspace(id)
      }
    },

    ...mapMutations({
      setUser: 'auth/setUser'
    }),

    ...mapActions({
      signout: 'auth/signout'
    })
  }
})
</script>

<style lang="postcss" scoped>
.settings-container {
  @apply max-w-2xl mx-auto p-4 mt-10;

  width: 42rem;
}
.settings-content {
  @apply p-8;

  .settings-workspace, .settings-myaccount {
    @apply flex flex-row my-4;
  }

  .settings-myaccount {
    .avatar {
      @apply mt-8;

      position: relative;
      cursor: pointer;

      .icon-edit {
        @apply rounded-full;

        display: none;
        padding: 3px;
        width: 22px;
        top: 0;
        right: 20px;
        position: absolute;
        background: theme("colors.secondary.default");
      }

      &:hover {
        .icon-edit {
          display: block;
        }
      }
    }
  }

  .settings-workspace {

  }

  .col-left {
    @apply flex flex-col p-2 w-1/5;
  }

  .col-right {
    @apply flex flex-col py-2 w-4/5;
  }

  .col-center {
    @apply flex flex-col py-2 mx-auto;

    width: 26rem;
  }
}
.workspace-avatar {
  @apply mb-5;

  img {
    height: 64px;
  }
}

.form-border {
  @apply flex flex-row justify-between p-2 my-4;
}
</style>
