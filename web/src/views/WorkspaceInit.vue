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

        <form-workspace @submit="submit"/>
      </div>
    </div>
    <v-loading :loading="isLoading">
      <p>{{ loadingMessage }}</p>
    </v-loading>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'

import { WorkspaceResource } from '@/types/resource'

import WorkspaceService from '@/services/workspace'

import RootHeader from '@/components/RootHeader.vue'
import VLoading from '@/components/Loading.vue'
import FormWorkspace from '@/components/form/FormWorkspace.vue'
import { Component, Vue } from 'vue-property-decorator'

  type ComponentData = {
    isLoading: boolean;
    loadingMessage: string;
  }
  @Component({
    name: 'WorkspaceInit',
    components: {
      RootHeader,
      VLoading,
      FormWorkspace
    },
    computed: {
      ...mapState('auth', ['user', 'spaces'])
    }
  })
export default class WorkspaceInit extends Vue {
    private isLoading = false;
    private loadingMessage = 'Creating Workspace...';

    get user () {
      return this.$store.state.auth.user
    }

    get spaces () {
      return this.$store.state.auth.spaces
    }

    get name (): string {
      if (!this.user) {
        return ''
      }

      const { firstName, lastName } = this.user

      return `${firstName} ${lastName}`
    }

    get hasSpace (): boolean {
      return this.spaces && this.spaces.length > 0
    }

    async submit (data: WorkspaceResource) {
      this.isLoading = true

      try {
        await WorkspaceService.create(data)
        await this.$store.dispatch('auth/whoami', { updateSpace: true })

        await this.$router.push({ name: 'Main' })
      } catch (err) {
        if (err.code === 401) {
          this.loadingMessage = `${err.message}. You will redirect to Signin Page.`

          await this.$store.dispatch('auth/signout')
          await this.$router.push({ name: 'SignIn' })
        }
      } finally {
        this.isLoading = false
      }
    }

    created () {
      if (this.hasSpace) {
        this.$router.replace({ name: 'Main' })
      }
    }
}

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
</style>
