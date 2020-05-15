<template>
  <div class="nav-menu">
    <div
      v-for="(item, key) in spaces"
      class="nav-menu-item"
      :class="{ 'nav-menu-item--active': item.active }"
      :key="key"
      @click="select(item)"
    >
      <div class="nav-menu-item-content">
        <div class="nav-menu-item-logo">
          <img
            src="@/assets/images/workspace.png"
            alt="Logo"
          >
        </div>
        <div class="nav-menu-item-label">
          <strong v-text="item.title" />
          <span class="text-gray-400">1 Member</span>
        </div>
      </div>

      <div class="nav-menu-item-check">
        <svg
          width="12"
          height="9"
          viewBox="0 0 12 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 1L4.125 7.875L1 4.75"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

      </div>
    </div>

    <button class="nav-menu-create">
      <v-icon name="plus" />
      <span>Add New Workspace</span>
    </button>

    <button class="nav-menu-logout">
      <strong>Logout</strong>
      <span>({{ user.email }})</span>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { omit } from 'lodash/fp'

import { WorkspaceResource } from '@/types/resource'

import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'NavigationMenu',
  components: {
    VIcon
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    },
    spaces () {
      const current = this.$store.state.auth.currentSpace

      return this.$store.state.auth.spaces.map((space: WorkspaceResource) => {
        return {
          ...space,
          active: current.id === space.id
        }
      })
    }
  },
  methods: {
    select (data: object) {
      this.$store.commit('auth/setCurrentSpace', omit('active', data))
    }
  }
})
</script>
