<template>
  <permission role="admin">
    <div>
      <Alert v-model="space.alert"/>
      <div class="space">
        <div class="col-left">
          <h4 class="title">Space Photo</h4>
          <div class="space-logo">
            <UploadableImage width="96px" height="96px" radius="48px" type="spaceLogo" :extra="{spaceId: activeSpace.id}"
                            :upload="activeSpace.avatar" edit-offset="-12px" key="space"
                            @uploaded="refreshWhoami">
              <template #fallback>
                <img class="fallback-logo" src="../../assets/images/default-space.png" alt="Avatar Logo">
              </template>
            </UploadableImage>
          </div>
        </div>
        <div class="col-right">
          <h4 class="title">Space Information</h4>
          <form-space
            @submit="updateSpace"
            @addUser="addSpaceUser"
            @updateUserSpaceRole="updateUserSpaceRole"
            @updateInvitationRole="updateInvitationRole"
            @deleteUser="deleteSpaceUser"
            @invitesAlertDisplay="invitesAlertDisplay"
            :value="spaceData"
            :is-edit="true"
            :alert="invitesAlert"
            button="Save"
            ref="space">
            <div class="form-border">
              <p>Email notifications</p>
              <div class="switch-wrapper">
                <button-switch v-model="emailNotifications"/>
              </div>
            </div>
          </form-space>
        </div>
      </div>
    </div>
  </permission>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { find } from 'lodash'
import SpaceService from '@/services/space'
import UserService from '@/services/user'
import UserPreferenceService from '@/services/userPreference'
import { SpaceResource, SpaceRoleResource, InvitationRoleResource } from '@/types/resource'
import store from '@/store'
import Alert from '@/components/Alert.vue'
import FormSpace from '@/components/form/FormSpace.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import UploadableImage from '@/components/UploadableImage.vue'
import Loading from '@/components/Loading.vue'
import Modal from '@/components/legacy/Modal.vue'
import { Permission } from '@/components/access'

@Component({
  components: { Modal, Loading, UploadableImage, ButtonSwitch, FormSpace, Alert, Permission }
})
export default class Space extends Vue {
  async refreshWhoami () {
    await store.dispatch('auth/whoami', { updateSpace: true })
  }

  get currentUser () {
    return this.$store.state.auth.user
  }

  get activeSpace () {
    return this.$store.getters['space/activeSpace'] || {}
  }

  private emailNotifications = true;

  private space: {
    alert: any;
    error: boolean;
    errorMessage: string;
  } = {
    alert: null,
    error: false,
    errorMessage: ''
  }

  private account: any = {
    alert: null
  };

  private spaceData: {
    title?: string;
    invites?: any[];
  } = {}

  private invitesAlert: any = null

  private loadingMessage = 'Update Settings...';
  private isLoading = false;

  async updateSpace (data: SpaceResource) {
    this.isLoading = true

    try {
      this.isLoading = true
      this.loadingMessage = 'Update Space Settings...'

      await this.$store.dispatch('space/update', {
        id: this.activeSpace.id,
        title: data.title,
        invites: data.invites
      })

      await UserPreferenceService.update({
        spaceId: this.activeSpace.id,
        data: {
          receiveEmail: this.emailNotifications
        }
      })

      this.space.alert = {
        type: 'success',
        message: 'Your space settings have been saved'
      }
    } catch (err) {
      this.space.alert = {
        type: 'danger',
        message: err.message,
        fields: err.fields
      }
    } finally {
      this.isLoading = false
    }
  }

  async updateUserSpaceRole (data: SpaceRoleResource) {
    this.isLoading = true
    try {
      this.isLoading = true
      this.loadingMessage = 'Update User Role...'

      await SpaceService.updateUserRole(data)

      this.space.alert = {
        type: 'success',
        message: 'User Role settings have been saved'
      }
    } catch (err) {
      this.space.alert = {
        type: 'danger',
        message: err.message,
        fields: err.fields
      }
    } finally {
      this.isLoading = false
    }
  }

  async updateInvitationRole (data: InvitationRoleResource) {
    this.isLoading = true
    try {
      this.isLoading = true
      this.loadingMessage = 'Update User Role...'

      await SpaceService.updateInvitationRole({
        spaceId: this.activeSpace.id,
        index: data.index,
        id: data.id,
        role: data.role
      })

      this.space.alert = {
        type: 'success',
        message: 'User Role settings have been saved'
      }
    } catch (err) {
      this.space.alert = {
        type: 'danger',
        message: err.message,
        fields: err.fields
      }
    } finally {
      this.isLoading = false
    }
  }

  async viewSpace (id: number) {
    try {
      this.isLoading = true
      this.loadingMessage = 'Get Space Settings...'

      const viewSpaceUsers = await SpaceService.spaceUsers(id)
      const viewSpaceUsersPending = await SpaceService.spaceUsersPending(id)

      if (viewSpaceUsers.data) {
        viewSpaceUsers.data = viewSpaceUsers.data.map((item: { id: number, userToSpace: { role: number } }) => {
          return {
            ...item,
            role: item.userToSpace.role,
            isOwner: item.id === this.currentUser.id,
            isSpaceUser: true
          }
        })
      }

      const concatSpaceUsers = viewSpaceUsers.data.concat(viewSpaceUsersPending.data)

      const spaceTitle = this.activeSpace.title
      this.spaceData = {
        title: spaceTitle,
        invites: concatSpaceUsers
      }
      this.isLoading = false
    } catch { }
  }

  async deleteSpaceUser (email: string) {
    const user = find(this.spaceData.invites, ['email', email])
    // Accepted user doesn't have tokens
    if (!user.token) {
      window.app.confirm('Remove User From Space', `Remove ${email} from the space?`, async () => {
        this.isLoading = true
        this.loadingMessage = 'Remove user from space...'

        try {
          await SpaceService.removeUser(this.activeSpace.id, user.id)
          if (this.currentUser.id === user.id) {
            await this.$store.dispatch('auth/whoami', { updateSpace: true })
          } else {
            const id = this.activeSpace.id
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
      })
    } else {
      window.app.confirm('Cancel Invitation', `Cancel ${email} invitation to the space?`, async () => {
        this.isLoading = true
        this.loadingMessage = 'Remove user from space...'

        try {
          await SpaceService.cancelUser(this.activeSpace.id, user.id)
          if (this.currentUser.id === user.id) {
            await this.$store.dispatch('auth/whoami', { updateSpace: true })
          } else {
            const id = this.activeSpace.id
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
      })
    }
  }

  @Watch('activeSpace')
  async watchActiveSpace (space: SpaceResource, prevSpace: SpaceResource) {
    if (space.id === prevSpace.id) {
      return
    }
    await this.viewSpace(space.id)
  }

  invitesAlertDisplay (value: object) {
    this.invitesAlert = value
  }

  async addSpaceUser ({ email, role }: { email: string, role: number }) {
    try {
      this.isLoading = true
      this.loadingMessage = 'Add user to space...'

      const payload = {
        spaceId: this.activeSpace.id,
        invites: [
          { email, role }
        ]
      }

      const res = await UserService.addInvitation(payload)

      for (const inviteResult of res.data) {
        if (inviteResult.status === 'member') {
          this.invitesAlert = {
            type: 'danger',
            noicon: true,
            message: inviteResult.email + ' alredy exists in this space'
          }
          continue
        }

        if (inviteResult.status === 'suspended') {
          this.invitesAlert = {
            type: 'danger',
            noicon: true,
            message: 'You already invited ' + inviteResult.email + ', let\'s wait a bit'
          }
          continue
        }

        this.invitesAlert = {
          type: 'success',
          noicon: true,
          message: 'Invite sent to ' + inviteResult.email
        }

        if (this.spaceData && this.spaceData.invites) {
          if (!this.spaceData.invites.find(invite => invite.email === inviteResult.email)) {
            this.spaceData.invites.push(inviteResult.invite)
          }
        }
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

  async created () {
    const data = await UserPreferenceService.fetch(this.activeSpace.id)

    this.emailNotifications = data.receiveEmail
  }

  async mounted () {
    await this.viewSpace(this.activeSpace.id)
  }
}
</script>

<style lang="postcss" scoped>
.space {
  @apply flex flex-row;

  .title {
    font-size: 14px;
    line-height: 17px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .col-left {
    @apply flex flex-col p-2;
    flex: 1;

    .space-logo {
      .fallback-logo {
        border-radius: 48px;
      }
    }
  }

  .col-right {
    @apply flex flex-col p-2;
    flex: 4;

    .form-border {
      @apply flex flex-row;

      width: calc(100% - 140px);
      float: left;

      p {
        font-size: 13px;
        line-height: 40px;
        margin-right: 16px;
      }

      .switch-wrapper {
        @apply flex;

        height: 40px;
        align-items: center;
      }
    }
  }
}
</style>
