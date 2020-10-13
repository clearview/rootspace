<template>
  <div class="space">
    <div class="col-center">
      <Alert v-model="space.alert"/>

      <div class="space-logo">
        <UploadableImage width="64px" height="64px" radius="4px" type="spaceLogo" :extra="{spaceId: activeSpace.id}"
                         :upload="activeSpace.avatar" edit-offset="-12px" key="space"
                         @uploaded="refreshWhoami">
          <template #fallback>
            <img src="../../assets/images/default-space.png" alt="Avatar Logo">
          </template>
        </UploadableImage>
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
          <p>Email notifications</p>
          <button-switch v-model="emailNotifications"/>
        </div>
      </form-space>
    </div>

    <Loading :loading="isLoading">
      <p>{{ loadingMessage }}</p>
    </Loading>

    <Modal
      title="User Space"
      :visible="space.error"
      :nosubmit="true"
      cancel-text="Okay"
      @cancel="space.error = false"
    >
      <div class="modal-body text-center">
        {{ space.errorMessage }}
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { find } from 'lodash'
import SpaceService from '@/services/space'
import UserService from '@/services/user'
import { SpaceResource } from '@/types/resource'
import store from '@/store'
import Alert from '@/components/Alert.vue'
import FormSpace from '@/components/form/FormSpace.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import UploadableImage from '@/components/UploadableImage.vue'
import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'
@Component({
  components: { Modal, Loading, UploadableImage, ButtonSwitch, FormSpace, Alert }
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

  private space = {
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

  async viewSpace (id: number) {
    try {
      this.isLoading = true
      this.loadingMessage = 'Get Space Settings...'

      const viewSpaceUsers = await SpaceService.spaceUsers(id)
      const viewSpaceUsersPending = await SpaceService.spaceUsersPending(id)

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

  async addSpaceUser (email: string) {
    try {
      this.isLoading = true
      this.loadingMessage = 'Add user to space...'

      const payload = {
        spaceId: this.activeSpace.id,
        emails: [email]
      }
      const res = await UserService.addInvitation(payload)
      if (this.spaceData.invites) {
        if (!this.spaceData.invites.find(invite => invite.email === res.data.data[0].email)) {
          this.spaceData.invites.push(res.data.data[0])
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

  async mounted () {
    await this.viewSpace(this.activeSpace.id)
  }
}
</script>

<style lang="postcss" scoped>
.space {
  @apply flex flex-row my-4;
  .col-center {
    @apply flex flex-col p-0 mx-auto;

    width: 26rem;
  }
}
.form-border {
  @apply flex flex-row justify-between p-2 my-4;
}
.space-logo {
  margin-bottom: 16px;
}
</style>
