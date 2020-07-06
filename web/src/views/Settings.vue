<template>
  <div>
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
            <v-alert v-model="account.alert"/>
            <form-settings @submit="updateAccount" ref="account"/>
          </div>
        </div>

        <div class="settings-workspace" v-if="(tab === 'workspace')">
          <div class="col-center">
            <v-alert v-model="workspace.alert"/>

            <div class="workspace-avatar">
              <img src="@/assets/logo@2x.png" alt="Root Logo"/>
            </div>

            <form-workspace
              @submit="updateWorkspace"
              @addUser="addWorkspaceUser"
              @deleteUser="deleteWorkspaceUser"
              :value="workspaceData"
              :is-edit="true"
              button="Save"
              ref="workspace">
              <div class="form-border">
                <p>Mobile push notifications</p>
                <button-switch v-model="mobileNotifications"/>
              </div>

              <div class="form-border">
                <p>Email notifications</p>
                <button-switch v-model="emailNotifications"/>
              </div>
            </form-workspace>
          </div>
        </div>
      </div>
    </div>

    <v-loading :loading="isLoading">
      <p>{{ loadingMessage }}</p>
    </v-loading>

    <v-modal
      title="User Workspace"
      :visible="workspace.error"
      :nosubmit="true"
      cancel-text="Okay"
      @cancel="workspace.error = false"
    >
      <div class="modal-body text-center">
        {{ workspace.errorMessage }}
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">

import { find, get, map } from 'lodash'

import { PasswordResource, UserResource, WorkspaceResource } from '@/types/resource'

import UserService from '@/services/user'
import WorkspaceService from '@/services/workspace'

import VAlert from '@/components/Alert.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import FormSettings from '@/components/form/FormSettings.vue'
import FormWorkspace from '@/components/form/FormWorkspace.vue'
import VLoading from '@/components/Loading.vue'
import VModal from '@/components/Modal.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'

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
      error: boolean;
      errorMessage: string;
    };
  }

  @Component({
    name: 'Settings',
    components: {
      ButtonSwitch,
      FormSettings,
      FormWorkspace,
      VAlert,
      VLoading,
      VModal
    }
  })
export default class Settings extends Vue {
    private tab = 'account';
    private errorAccount = {};
    private errorWorkspace = {};
    private mobileNotifications = false;
    private emailNotifications = true;
    private loadingMessage = 'Update Settings...';
    private isLoading = false;
    private workspaceData = {};
    private userAtSpaceObj = {};
    private account: any = {
      alert: null
    };

    private workspace = {
      alert: null,
      error: false,
      errorMessage: ''
    }

    get activeLink () {
      return this.$store.state.link.active
    }

    get currentSpace () {
      return this.$store.state.auth.currentSpace || {}
    }

    get currentUser () {
      return this.$store.state.auth.user
    }

    @Watch('currentSpace')
    async watchCurrentSpace (val: any) {
      if (this.tab === 'workspace') {
        await this.viewWorkspace(val.id)
      }
    }

    async updateAccount (...args: [UserResource, PasswordResource]) {
      this.isLoading = true

      try {
        const [setting, password] = args
        this.loadingMessage = 'Update Account Settings...'
        const userUpdate = await UserService.update(setting)

        if (password.password !== '' && password.newPassword !== '') {
          await UserService.passwordChange(password)
        }

        const getUserData = userUpdate.data
        this.$store.commit('auth/setUser', getUserData)
      } catch (err) {
        this.account.alert = {
          type: 'danger',
          message: err.message,
          fields: err.fields
        }
      } finally {
        this.isLoading = false
      }
    }

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

        this.$store.dispatch('auth/whoami', { updateSpace: true })
      } catch (err) {
        this.account.alert = {
          type: 'danger',
          message: err.message,
          fields: err.fields
        }
      } finally {
        this.isLoading = false
      }
    }

    async addWorkspaceUser (email: string) {
      console.log(this.currentSpace.id, email)
      try {
        this.isLoading = true
        this.loadingMessage = 'Add user to workspace...'

        const payload = {
          spaceId: this.currentSpace.id,
          emails: [email]
        }
        await UserService.addInvitation(payload)
      } catch (err) {
        if (err.code === 405) {
          this.workspace.error = true
          this.workspace.errorMessage = err.message
        }
      } finally {
        this.isLoading = false
      }
    }

    async deleteWorkspaceUser (email: string) {
      const getUser = find(this.userAtSpaceObj, ['email', email])

      if (getUser) {
        this.isLoading = true
        this.loadingMessage = 'Remove user from workspace...'

        try {
          const getUserId = get(getUser, 'id')
          await WorkspaceService.removeUser(this.currentSpace.id, getUserId)

          if (this.currentUser.id === getUserId) {
            await this.$store.dispatch('auth/whoami', { updateSpace: true })
          } else {
            const id = this.currentSpace.id
            this.viewWorkspace(id)
          }
        } catch (err) {
          if (err.code === 405) {
            this.workspace.error = true
            this.workspace.errorMessage = err.message
          }
        } finally {
          this.isLoading = false
        }
      }
    }

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
    }

    swichTab (tab: string) {
      this.tab = tab

      if (tab === 'workspace') {
        const id = this.currentSpace.id
        this.viewWorkspace(id)
      }
    }
}
</script>

<style lang="postcss" scoped>
  .settings-container {
    @apply max-w-3xl p-4 mt-10;

    width: 44rem;
    margin-left: 70px;
  }

  .settings-content {
    @apply p-8;

    .settings-workspace, .settings-myaccount {
      @apply flex flex-row my-4;
    }

    .settings-myaccount {
      .avatar {
        @apply mt-8 w-24;

        position: relative;
        cursor: pointer;

        img {
          @apply w-24;
        }

        .icon-edit {
          @apply rounded-full;

          display: none;
          padding: 3px;
          width: 22px;
          top: 0;
          right: 0;
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
      .col-center {
        @apply p-0;
      }
    }

    .col-left {
      @apply flex flex-col p-2 w-2/6;
    }

    .col-right {
      @apply flex flex-col py-2 w-4/6;
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
