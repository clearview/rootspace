<template>
  <div id="create-workspace-page">
    <root-header></root-header>

    <div id="create-workspace-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Welcome Adnan!</h2>
        <p class="text-center mb-2 text-gray-800">Create your own workspace in few steps...</p>

        <small>
          {{ user }}
        </small>

        <div class="avatar">
          <img
            src="@/assets/logo@2x.png"
            alt="Root Logo"
            class="mx-auto"
          />
        </div>

        <form class="mt-10">
          <div class="form-group mb-2">
            <label class="block text-gray-800 text-sm" for="workspacename">Workspace Name</label>
            <input
              class="input w-full leading-tight mx-0"
              id="workspacename"
              type="text"
              placeholder="My Workspace"
            />
          </div>
          <div class="form-group">
            <label class="block text-gray-800 text-sm" for="team">Team</label>

            <div class="input-group mb-4">
              <div class="flex -mr-px">
                <span class="input-group-component flex items-center">
                  <v-icon name="plus" size="1.3em" viewbox="32"/>
                </span>
              </div>
              <input type="text" class="input-group-component flex-grow w-px flex-1 border h- px-3 relative" >
              <div class="flex">
                <button class="button input-group-component flex items-center justify-center">Send</button>
              </div>
            </div>
          </div>

          <div class="list-invitation">
            <div class="invitation flex items-center">
              <img class="w-10 h-10 rounded-full mr-4" src="@/assets/logo@2x.png" alt="Avatar of John Doe">
              <div class="flex-grow text-sm">
                <p class="leading-none text-gray-800">John Doe</p>
                <p class="text-gray-400">johndoe@clearview.team</p>
              </div>
              <span class="close-icon">
                <v-icon name="close" size="1.3em" viewbox="32"/>
              </span>
            </div>
            <div class="invitation flex items-center">
              <img class="w-10 h-10 rounded-full mr-4" src="@/assets/logo@2x.png" alt="Avatar of John Doe">
              <div class="flex-grow text-sm">
                <p class="leading-none text-gray-800">Adnan</p>
                <p class="text-gray-400">adnan@clearview.team</p>
              </div>
              <span class="close-icon">
                <v-icon name="close" size="1.3em" viewbox="32"/>
              </span>
            </div>
          </div>

          <button class="btn btn-primary w-full mx-0" type="button" disabled>Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VIcon from '@/components/icons/Index.vue'
import RootHeader from '@/components/RootHeader.vue'

import { mapState } from 'vuex'

export default Vue.extend({
  name: 'CreateWorkspace',
  components: {
    VIcon,
    RootHeader
  },
  computed: mapState('auth', ['token', 'user'])
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
  @apply mt-10;

  img {
    height: 64px;
  }
}
.list-invitation {
  @apply py-3 border-t border-b border-gray-100 text-gray-400 mb-5;

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
