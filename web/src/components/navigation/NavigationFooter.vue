<template>
  <div class="nav-footer">
    <div class="flex flex-row mt-4">
      <button class="btn btn-mute flex-grow px-2 mr-2">
        My Workspace
        <v-icon
          name="down"
          class="ml-1 text-gray-400"
        />
      </button>

      <div class="btn-group">
        <button class="btn btn-mute btn-icon" v-on:click="settingsPage()">
          <v-icon name="settings" />
        </button>
        <button class="btn btn-mute btn-icon">
          <v-icon name="edit" />
        </button>
      </div>
    </div>
    <div class="flex mt-4">
      <button
        class="btn btn-primary flex-grow"
        @click="$emit('add')"
      >
        <v-icon
          name="plus"
          class="mr-1"
        />
        Add New Link
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'NavigationFooter',
  components: {
    VIcon
  },
  methods: {
    settingsPage () {
      this.$router.push({ name: 'Settings' })
    }
  }
})
</script>
