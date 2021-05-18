<template>
  <div>
    <div class="settings-container">
      <h2 class="mb-5">Settings</h2>

      <ul class="tab list-reset">
        <li :class="{ active: $route.name === 'SettingsAccount' }">
          <router-link :to="{name: 'SettingsAccount'}">My Account</router-link>
        </li>
        <permission role="admin">
          <li :class="{ active: $route.name === 'SettingsSpace' }">
            <router-link :to="{name: 'SettingsSpace'}">Space Info</router-link>
          </li>
        </permission>
        <permission role="admin">
          <li :class="{ active: $route.name === 'SettingsMembers' }">
            <router-link :to="{name: 'SettingsMembers'}">Members</router-link>
          </li>
        </permission>
        <li :class="{ active: $route.name === 'SettingsNotification' }">
          <router-link :to="{name: 'SettingsNotification'}">Notification</router-link>
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

import VAlert from '@/components/Alert.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import FormSettings from '@/components/form/FormSettings.vue'
import FormSpace from '@/components/form/FormSpace.vue'
import VLoading from '@/components/Loading.vue'
import VModal from '@/components/legacy/Modal.vue'

import PageMixin from '@/mixins/PageMixin'
import UploadableImage from '@/components/UploadableImage.vue'
import { Permission } from '@/components/access'
import Avatar from 'vue-avatar'
import store from '@/store'

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
    VModal,
    Permission
  }
})
export default class Settings extends Mixins(PageMixin) {
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
    @apply p-4 mt-10;

    width: 100%;
    margin-left: 70px;

    .tab {
      border-bottom-width: 0;
      margin-bottom: 40px;

      li {
        a {
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
          padding-left: 1.2rem;
          padding-right: 1.2rem;
        }
      }

      li.active {

        a {
          border-bottom-width: 0;
          background-color: theme('colors.gray.900');
          color: white;
          border-radius: 4px;
          font-weight: normal;
        }
      }
    }
  }

  .settings-content {

  }

</style>
<style lang="postcss">
.settings-content .settings-myaccount .user-avatar .vue-avatar--wrapper > span{
  margin: 1px 1px 0 0 !important;
  color: #fff;
}
</style>
