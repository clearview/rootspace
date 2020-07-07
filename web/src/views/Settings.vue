<template>
  <div>
    <div class="settings-container">
      <h2 class="mb-5">Settings</h2>

      <ul class="tab list-reset">
        <li :class="{ active: (tab === 'account') }" @click="swichTab('account')">
          <a href="#">My Account</a>
        </li>
        <li :class="{ active: (tab === 'space') }" @click="swichTab('space')">
          <a href="#">Space</a>
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

        <div class="settings-space" v-if="(tab === 'space')">
          <div class="col-center">
            <v-alert v-model="space.alert"/>

            <div class="space-avatar">
              <img src="@/assets/logo@2x.png" alt="Root Logo"/>
            </div>

            <form-space
              @submit="updateSpace"
              @addUser="addSpaceUser"
              @deleteUser="deleteSpaceUser"
              :value="spaceData"
              :is-edit="true"
              button="Save"
              ref="space">
              <div class="form-border">
                <p>Mobile push notifications</p>
                <button-switch v-model="mobileNotifications"/>
              </div>

              <div class="form-border">
                <p>Email notifications</p>
                <button-switch v-model="emailNotifications"/>
              </div>
            </form-space>
          </div>
        </div>
      </div>
    </div>

    <v-loading :loading="isLoading">
      <p>{{ loadingMessage }}</p>
    </v-loading>

    <v-modal
      title="User Space"
      :visible="space.error"
      :nosubmit="true"
      cancel-text="Okay"
      @cancel="space.error = false"
    >
      <div class="modal-body text-center">
        {{ space.errorMessage }}
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">

import { find, get, map } from 'lodash'

import { PasswordResource, UserResource, SpaceResource } from '@/types/resource'

import UserService from '@/services/user'
import SpaceService from '@/services/space'

import VAlert from '@/components/Alert.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import FormSettings from '@/components/form/FormSettings.vue'
import FormSpace from '@/components/form/FormSpace.vue'
import VLoading from '@/components/Loading.vue'
import VModal from '@/components/Modal.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'

  type ComponentData = {
    tab: string;
    errorAccount: object;
    errorSpace: object;
    mobileNotifications: boolean;
    emailNotifications: boolean;
    loadingMessage: string;
    isLoading: boolean;
    spaceData: object;
    userAtSpaceObj: object;
    account: {
      alert: object | null;
    };
    space: {
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
      FormSpace,
      VAlert,
      VLoading,
      VModal
    }
  })
export default class Settings extends Vue {
    private tab = 'account';
    private errorAccount = {};
    private errorSpace = {};
    private mobileNotifications = false;
    private emailNotifications = true;
    private loadingMessage = 'Update Settings...';
    private isLoading = false;
    private spaceData = {};
    private userAtSpaceObj = {};
    private account: any = {
      alert: null
    };

    private space = {
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
      if (this.tab === 'space') {
        await this.viewSpace(val.id)
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

    async updateSpace (data: SpaceResource) {
      this.isLoading = true

      try {
        const id = this.currentSpace.id
        this.isLoading = true
        this.loadingMessage = 'Update Space Settings...'

        const payload = { // for temporary
          title: data.title,
          invites: data.invites
        }

        await SpaceService.update(id, payload)

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

    async addSpaceUser (email: string) {
      console.log(this.currentSpace.id, email)
      try {
        this.isLoading = true
        this.loadingMessage = 'Add user to space...'

        const payload = {
          spaceId: this.currentSpace.id,
          emails: [email]
        }
        await UserService.addInvitation(payload)
      } catch (err) {
        if (err.code === 405) {
          this.space.error = true
          this.space.errorMessage = err.message
        }
      } finally {
        this.isLoading = false
      }
    }

    async deleteSpaceUser (email: string) {
      const getUser = find(this.userAtSpaceObj, ['email', email])

      if (getUser) {
        this.isLoading = true
        this.loadingMessage = 'Remove user from space...'

        try {
          const getUserId = get(getUser, 'id')
          await SpaceService.removeUser(this.currentSpace.id, getUserId)

          if (this.currentUser.id === getUserId) {
            await this.$store.dispatch('auth/whoami', { updateSpace: true })
          } else {
            const id = this.currentSpace.id
            this.viewSpace(id)
          }
        } catch (err) {
          if (err.code === 405) {
            this.space.error = true
            this.space.errorMessage = err.message
          }
        } finally {
          this.isLoading = false
        }
      }
    }

    async viewSpace (id: number) {
      this.isLoading = true
      this.loadingMessage = 'Get Space Settings...'

      const viewUserAtSpace = await SpaceService.userAtSpace(id)
      // const currentUser = this.$store.state.auth.user.id

      // remove(viewUserAtSpace.data, (user: UserResource) => user.id === currentUser)
      this.userAtSpaceObj = viewUserAtSpace.data
      const userAtSpace = map(viewUserAtSpace.data, 'email')

      const spaceTitle = this.currentSpace.title
      this.spaceData = {
        title: spaceTitle,
        invites: userAtSpace
      }
      this.isLoading = false
    }

    swichTab (tab: string) {
      this.tab = tab

      if (tab === 'space') {
        const id = this.currentSpace.id
        this.viewSpace(id)
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

    .settings-space, .settings-myaccount {
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

    .settings-space {
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

  .space-avatar {
    @apply mb-5;

    img {
      height: 64px;
    }
  }

  .form-border {
    @apply flex flex-row justify-between p-2 my-4;
  }
</style>
