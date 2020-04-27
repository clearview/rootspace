<template>
  <div id="create-workspace-page">
    <root-header></root-header>

    <div id="create-workspace-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Welcome {{ name }}!</h2>
        <p class="text-center mb-2 text-gray-800">Create your own workspace in few steps...</p>

        <div class="avatar">
          <img src="@/assets/logo@2x.png" alt="Root Logo" class="mx-auto" />
        </div>

        <div class="alert alert-danger" v-if="isEmailError">
          <span class="mr-1">
            <v-icon name="warning" size="1.3em" viewbox="20"/>
          </span>
          Your email format is wrong!
        </div>

        <form class="mt-2">
          <div class="form-group mb-2">
            <label class="block text-gray-800 text-sm" for="workspacename">Workspace Name</label>
            <input
              class="input w-full leading-tight mx-0"
              id="workspacename"
              type="text"
              placeholder="My Workspace"
              v-model="workspace.title"
            />
          </div>
          <div class="form-group">
            <label class="block text-gray-800 text-sm" for="team">Team</label>
            <div class="input-group mb-4" :class="{ error: isEmailError }">
              <div class="flex -mr-px">
                <span class="input-group-component flex items-center">
                  <v-icon name="plus" size="1.3em" viewbox="32" />
                </span>
              </div>
              <input
                type="email"
                class="input-group-component flex-grow w-px flex-1 border h- px-3 relative text-inherit"
                v-model="invitation"
                v-on:keyup.enter="addInvitationList(invitation)"
              />
              <div class="flex">
                <button
                  type="button"
                  class="button input-group-component flex items-center justify-center"
                  :class="{ filled: invitation !== '' }"
                  v-on:click="addInvitationList(invitation)"
                >Send</button>
              </div>
            </div>
          </div>

          <div class="list-invitation" v-if="workspace.invites.length > 0">
            <div
              class="invitation flex items-center"
              v-for="(invitation, index) in workspace.invites"
              :key="index"
            >
              <div class="flex-grow text-sm">
                <p class="text-gray-900">{{ invitation }}</p>
              </div>
              <span class="close-icon" v-on:click="deleteInvitation(index)">
                <v-icon name="close" size=".9em" viewbox="32" />
              </span>
            </div>
          </div>

          <button
            type="button"
            class="btn btn-primary w-full mx-0"
            :disabled="$v.workspace.$invalid"
            v-on:click="submit()"
          >
            Create
          </button>
        </form>
      </div>
    </div>
    <v-loading :loading="isLoading">
      <p>{{ loadingMessage }}</p>
    </v-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapState, mapMutations, mapActions } from 'vuex'

import WorkspaceService from '@/services/workspace'

import VIcon from '@/components/icons/Index.vue'
import RootHeader from '@/components/RootHeader.vue'
import VLoading from '@/components/Loading.vue'

type ComponentData = {
  workspace: {
    title: string;
    invites: Array<string>;
  };
  invitation: string;
  isEmailError: boolean;
  isLoading: boolean;
  loadingMessage: string;
}

export default Vue.extend({
  name: 'CreateWorkspace',
  mixins: [validationMixin],
  components: {
    VIcon,
    RootHeader,
    VLoading
  },
  data (): ComponentData {
    return {
      workspace: {
        title: '',
        invites: []
      },
      invitation: '',
      isEmailError: false,
      isLoading: false,
      loadingMessage: 'Creating Workspace...'
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

    ...mapState('auth', ['user'])
  },
  watch: {
    invitation (newVal: string) {
      if (this.isEmailValid(newVal)) {
        this.isEmailError = false
      }
    }
  },
  validations: {
    workspace: {
      title: {
        required
      }
    }
  },
  methods: {
    addInvitationList (email: string): void {
      if (!this.isEmailValid(email) || email === '') {
        this.isEmailError = true
      } else {
        this.isEmailError = false
        this.invitation = ''
        this.workspace.invites.push(email)
      }
    },
    deleteInvitation (index: number): void {
      this.workspace.invites.splice(index, 1)
    },
    isEmailValid (email: string): boolean {
      if (email === '') return true

      const reg = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

      return reg.test(email)
    },
    submit (): void {
      this.$v.workspace.$touch()

      if (this.$v.workspace.$invalid) {
        return
      }

      this.$emit('submit', this.createWorkspace())
    },
    async createWorkspace () {
      try {
        this.isLoading = true
        const data = await WorkspaceService.create(this.workspace)

        this.isLoading = false
        this.workspace = {
          title: '',
          invites: []
        }
        const getUserSpace = data.data
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

<style scoped>
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
