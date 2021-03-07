<template>
  <div>
    <Alert v-model="account.alert"/>
    <div class="account">
      <div class="col-left">
        <div class="user-avatar">
          <UploadableImage width="109px" height="109px" radius="1000px" type="userAvatar"
                          edit-offset="0px"
                          key="avatar"
                          :upload="currentUser.avatar"
                          @uploaded="refreshWhoami">
            <template #fallback>
              <avatar :size="109" :username="`${currentUser.firstName} ${currentUser.lastName}`"></avatar>
            </template>
          </UploadableImage>
        </div>
      </div>
      <div class="col-right">
        <form-settings
          @submit-account="updateAccount"
          ref="account"/>
      </div>
    </div>

    <Loading :loading="isLoading">
      <p>{{ loadingMessage }}</p>
    </Loading>

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UploadableImage from '@/components/UploadableImage.vue'
import Alert from '@/components/Alert.vue'
import FormSettings from '@/components/form/FormSettings.vue'
import store from '@/store'
import { UserResource } from '@/types/resource'
import UserService from '@/services/user'
import Loading from '@/components/Loading.vue'
import Avatar from 'vue-avatar'
import Modal from '@/components/legacy/Modal.vue'
@Component({
  components: { Modal, Loading, FormSettings, Alert, UploadableImage, Avatar }
})
export default class Account extends Vue {
  private loadingMessage = 'Update Settings...'
  private isLoading = false;
  private account: any = {
    alert: null
  };

  get currentUser () {
    return this.$store.state.auth.user
  }

  async refreshWhoami () {
    await store.dispatch('auth/whoami', { updateSpace: true })
  }

  async updateAccount (setting: UserResource) {
    this.isLoading = true

    try {
      let message = ''
      this.loadingMessage = 'Update Account Settings...'

      const userUpdate = await UserService.update(setting)
      message += 'Your account settings have been saved'

      const getUserData = userUpdate.data
      this.$store.commit('auth/setUser', getUserData)

      this.account.alert = {
        type: 'success',
        message: message
      }
    } catch (err) {
      const message = err.message === 'Unauthorized' ? 'You have entered an incorrect current password' : err.message

      this.account.alert = {
        type: 'danger',
        message: message,
        fields: err.fields
      }
    } finally {
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.account {
  @apply flex flex-row my-4;

  .col-left {
    @apply flex flex-col p-2 w-2/6;
  }

  .col-right {
    @apply flex flex-col py-2 w-4/6;
  }

}
</style>
