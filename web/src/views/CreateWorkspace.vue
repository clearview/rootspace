<template>
  <div id="create-workspace-page">
    <root-header></root-header>

    <div id="create-workspace-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Welcome {{ name }}!</h2>
        <p class="text-center mb-2 text-gray-800">Create your own workspace in few steps...</p>

        <v-alert :the-message="error" />

        <div class="avatar">
          <img src="@/assets/logo@2x.png" alt="Root Logo" class="mx-auto" />
        </div>

        <resource-form-workspace @submit="createWorkspace" ref="workspace" />
      </div>
    </div>
    <v-loading :loading="isLoading">
      <p>{{ loadingMessage }}</p>
    </v-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'

import { WorkspaceResource } from '@/types/resource'

import WorkspaceService from '@/services/workspace'

import VAlert from '@/components/Alert.vue'
import RootHeader from '@/components/RootHeader.vue'
import VLoading from '@/components/Loading.vue'
import ResourceFormWorkspace from '@/components/resource/ResourceFormWorkspace.vue'

type ComponentData = {
  isLoading: boolean;
  loadingMessage: string;
  error: object;
}

export default Vue.extend({
  name: 'CreateWorkspace',
  components: {
    VAlert,
    RootHeader,
    VLoading,
    ResourceFormWorkspace
  },
  data (): ComponentData {
    return {
      isLoading: false,
      loadingMessage: 'Creating Workspace...',
      error: {}
    }
  },
  computed: {
    name () {
      let name = ''
      if (this.user) {
        name = this.user.firstName + ' ' + this.user.lastName
      }

      return name
    },

    ...mapState('auth', ['user', 'spaces'])
  },
  created () {
    if (this.spaces && this.spaces.length > 0) {
      this.$router.push({ name: 'Main' })
    }
  },
  methods: {
    async createWorkspace (data: WorkspaceResource) {
      try {
        this.isLoading = true
        const workspace = await WorkspaceService.create(data)

        this.isLoading = false
        const getUserSpace = workspace.data
        const userSpace = [{
          id: getUserSpace.id,
          title: getUserSpace.title,
          settings: getUserSpace.settings
        }]
        this.setSpaces(userSpace)
        this.$router.push({ name: 'Main' })
      } catch (err) {
        if (err.code === 401) {
          this.loadingMessage = `${err.message}. You will redirect to Signin Page.`
          this.signout()
          this.$router.push({ name: 'SignIn' })
        }
        this.error = err
        this.isLoading = false
      }
    },

    ...mapMutations({
      setSpaces: 'auth/setSpaces'
    }),

    ...mapActions({
      signout: 'auth/signout'
    })
  }
})
</script>

<style lang="postcss" scoped>
#create-workspace-page {
  @apply border-t-4;
  border-color: theme("colors.primary.default");
}
#create-workspace-content {
  @apply bg-local bg-cover bg-no-repeat;
  background-image: url("~@/assets/images/root-bg.png");
  background-position: top 150px right;
  height: calc(100vh - 100px);
}
.avatar {
  @apply my-10;

  img {
    height: 64px;
  }
}
.list-invitation {
  @apply border-t border-b border-gray-100 text-gray-400 mb-5;

  .invitation {
    @apply py-2;

    cursor: pointer;

    &:hover {
      .close-icon {
        @apply visible;
      }
    }
  }

  .close-icon {
    @apply rounded-full bg-gray-100;
    @apply invisible;

    /* transition: all .01s;
    transition-timing-function: ease; */
    padding: 0.15rem;
  }
}
</style>
