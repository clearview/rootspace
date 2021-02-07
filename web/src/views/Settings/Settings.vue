<template>
  <div>
    <div class="settings-container">
      <h2 class="mb-5">Settings</h2>

      <ul class="tab list-reset">
        <li :class="{ active: $route.name === 'SettingsAccount' }">
          <router-link :to="{name: 'SettingsAccount'}">My Account</router-link>
        </li>
        <li  :class="{ active: $route.name === 'SettingsSpace' }" v-if="isAdmin">
          <router-link :to="{name: 'SettingsSpace'}">Space</router-link>
        </li>
      </ul>

      <div class="settings-content">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'

import { UserResource } from '@/types/resource'

import VAlert from '@/components/Alert.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import FormSettings from '@/components/form/FormSettings.vue'
import FormSpace from '@/components/form/FormSpace.vue'
import VLoading from '@/components/Loading.vue'
import VModal from '@/components/Modal.vue'

import PageMixin from '@/mixins/PageMixin'
import RoleMixin from '@/mixins/RoleMixin'
import UploadableImage from '@/components/UploadableImage.vue'
import Avatar from 'vue-avatar'
import store from '@/store'

type ComponentData = {
  tab: string;
  errorAccount: object;
  errorSpace: object;
  mobileNotifications: boolean;
  emailNotifications: boolean;

  spaceData: {
    title: string;
    invites: UserResource[];
  };

  spaceUsersObj: object;
  spaceUsersPendingObj: object;
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
    UploadableImage,
    ButtonSwitch,
    FormSettings,
    FormSpace,
    Avatar,
    VAlert,
    VLoading,
    VModal
  }
})
export default class Settings extends Mixins(PageMixin, RoleMixin) {
    private tab = 'account';
    private emailNotifications = true;
    private loadingMessage = 'Update Settings...';
    private isLoading = false;
    private spaceData: {
      title?: string;
      invites?: any[];
    } = {}

    private spaceUsersObj = {};
    private spaceUsersPendingObj = {};
    private account: any = {
      alert: null
    };

  private space = {
    alert: null,
    error: false,
    errorMessage: ''
  }

  mounted () {
    this.pageTitle = 'Settings'
    this.pageReady = true
  }

  async refreshWhoami () {
    await store.dispatch('auth/whoami', { updateSpace: true })
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
  }

</style>
<style lang="postcss">
.settings-content .settings-myaccount .user-avatar .vue-avatar--wrapper > span{
  margin: 1px 1px 0 0 !important;
  color: #fff;
}
</style>
