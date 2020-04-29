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
            <resource-form-settings @submit="save" ref="settings" />
          </div>
        </div>

        <div class="settings-workspace" v-if="(tab === 'workspace')">
          <div class="col-center">
            <v-alert :the-message="error" />

            <div class="workspace-avatar">
              <img src="@/assets/logo@2x.png" alt="Root Logo"/>
            </div>

            <resource-form-workspace @submit="createWorkspace" ref="workspace">
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
  </layout-main>
</template>

<script lang="ts">
import Vue from 'vue'

import { SettingsResource } from '@/types/resource'

import VIcon from '@/components/icons/Index.vue'
import VAlert from '@/components/Alert.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import ResourceFormSettings from '@/components/resource/ResourceFormSettings.vue'
import ResourceFormWorkspace from '@/components/resource/ResourceFormWorkspace.vue'
import LayoutMain from '@/components/LayoutMain.vue'

type ComponentData = {
  tab: string;
  error: object;
  mobileNotifications: boolean;
  emailNotifications: boolean;
}

export default Vue.extend({
  name: 'Settings',
  components: {
    VIcon,
    ButtonSwitch,
    ResourceFormSettings,
    ResourceFormWorkspace,
    VAlert,
    LayoutMain
  },
  data (): ComponentData {
    return {
      tab: 'workspace',
      error: {},
      mobileNotifications: false,
      emailNotifications: true
    }
  },
  computed: {
    activeLink () {
      return this.$store.state.link.active
    }
  },
  methods: {
    save (data: SettingsResource) {
      console.log('save: ', data)
    },
    swichTab (tab: string) {
      this.tab = tab
    },
    createWorkspace () {
      console.log('createWorkspace: ')
    }
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
