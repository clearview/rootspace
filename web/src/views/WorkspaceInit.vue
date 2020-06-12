<template>
  <div class="page">
    <root-header></root-header>

    <div class="content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Welcome {{ name }}!</h2>
        <p class="text-center mb-2 text-gray-800">Create your own workspace in few steps...</p>

        <div class="avatar">
          <img
            src="@/assets/logo@2x.png"
            alt="Root Logo"
            class="mx-auto"
          />
        </div>

        <form-workspace @submit="submit" />
      </div>
    </div>
    <v-loading :loading="isLoading">
      <p>{{ loadingMessage }}</p>
    </v-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'

import { WorkspaceResource } from '@/types/resource'

import WorkspaceService from '@/services/workspace'

import RootHeader from '@/components/RootHeader.vue'
import VLoading from '@/components/Loading.vue'
import FormWorkspace from '@/components/form/FormWorkspace.vue'

type ComponentData = {
  isLoading: boolean;
  loadingMessage: string;
}

export default Vue.extend({
  name: 'WorkspaceInit',
  components: {
    RootHeader,
    VLoading,
    FormWorkspace
  },
  data (): ComponentData {
    return {
      isLoading: false,
      loadingMessage: 'Creating Workspace...'
    }
  },
  computed: {
    ...mapState('auth', ['user', 'spaces']),

    name (): string {
      if (this.user) {
        return ''
      }

      const { firstName, lastName } = this.user

      return `${firstName} ${lastName}`
    },
    hasSpace (): boolean {
      return this.spaces && this.spaces.length > 0
    }
  },
  methods: {
    ...mapActions({
      signout: 'auth/signout'
    }),

    async submit (data: WorkspaceResource) {
      this.isLoading = true

      try {
        await WorkspaceService.create(data)
        await this.$store.dispatch('auth/whoami', { updateSpace: true })

        this.$router.push({ name: 'Main' })
      } catch (err) {
        if (err.code === 401) {
          this.loadingMessage = `${err.message}. You will redirect to Signin Page.`

          this.signout()
          this.$router.push({ name: 'SignIn' })
        }
      } finally {
        this.isLoading = false
      }
    }
  },
  created () {
    if (this.hasSpace) {
      this.$router.replace({ name: 'Main' })
    }
  }
})
</script>

<style lang="postcss" scoped>
.page {
  @apply border-t-4 border-primary;
}
.content {
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

    padding: 0.15rem;
  }
}
</style>
