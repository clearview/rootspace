<template>
  <permission role="admin">
    <div>
      <Alert v-model="space.alert" />
      <div class="space">
        <div class="col-left">
          <h4 class="title">Space Photo</h4>
          <div class="space-logo">
            <UploadableImage
              width="96px"
              height="96px"
              radius="48px"
              type="spaceLogo"
              :extra="{spaceId: activeSpace.id}"
              :upload="activeSpace.avatar"
              edit-offset="-12px"
              key="space"
              @uploaded="fetch"
            >
              <template #fallback>
                <img
                  class="fallback-logo"
                  src="../../assets/images/default-space.png"
                  alt="Avatar Logo"
                >
              </template>
            </UploadableImage>
          </div>
        </div>
        <div class="col-right">
          <h4 class="title">Space Information</h4>
          <form-space-info
            @submit="submit"
            :value="payload"
            :is-edit="true"
            button="Save"
            ref="space"
          />
        </div>
      </div>
    </div>
  </permission>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SpaceResource } from '@/types/resource'
import store from '@/store'
import Alert from '@/components/Alert.vue'
import FormSpaceInfo from '@/components/form/FormSpaceInfo.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import UploadableImage from '@/components/UploadableImage.vue'
import Loading from '@/components/Loading.vue'
import Modal from '@/components/legacy/Modal.vue'
import { Permission } from '@/components/access'

@Component({
  components: {
    Modal,
    Loading,
    UploadableImage,
    ButtonSwitch,
    FormSpaceInfo,
    Alert,
    Permission
  }
})
export default class Space extends Vue {
  get activeSpace () {
    return this.$store.getters['space/activeSpace'] || {}
  }

  private emailNotifications = true;

  private space = {
    alert: null as any,
    error: false,
    errorMessage: ''
  }

  get payload (): Pick<SpaceResource, 'title'> {
    return {
      title: this.activeSpace.title
    }
  }

  private loadingMessage = 'Update Settings...';
  private isLoading = false;

  async submit (data: SpaceResource) {
    this.isLoading = true

    try {
      this.isLoading = true
      this.loadingMessage = 'Update Space Settings...'

      await this.$store.dispatch('space/update', {
        id: this.activeSpace.id,
        title: data.title
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

  async fetch () {
    await store.dispatch('auth/whoami', { updateSpace: true })
  }

  async mounted () {
    await this.fetch()
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
