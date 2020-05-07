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
        <button
          class="btn btn-mute btn-icon"
          @click="settingsPage()"
        >
          <v-icon
            name="settings"
            class="icon"
          />
        </button>
        <button
          class="btn btn-mute btn-icon"
          :class="{ 'btn-active': editable }"
          @click="$emit('edit')"
        >
          <v-icon
            name="edit"
            class="icon"
          />
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
  props: {
    editable: {
      type: Boolean
    }
  },
  methods: {
    settingsPage () {
      this.$router.push({ name: 'Settings' })
    }
  }
})
</script>

<style lang="postcss" scoped>
.btn-active {
  .icon {
    @apply text-primary;
  }
}
</style>
