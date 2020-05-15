<template>
  <div class="nav-footer">
    <div class="nav-actions flex-row relative">
      <button
        class="btn btn-mute flex-grow px-2 mr-2"
        @click="showMenu = !showMenu"
      >
        {{ currentSpace.title }}
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

      <transition name="menu">
        <navigation-menu v-show="showMenu"/>
      </transition>
    </div>
    <div class="nav-actions">
      <button
        class="btn btn-primary flex-grow"
        @click="$emit('add')"
      >
        <v-icon
          name="plus"
          class="mr-1"
        />
        Add New
      </button>
    </div>

    <div class="nav-expand">
      <button
        class="btn btn-icon bg-transparent"
        @click="$emit('toggleCollapse')"
      >
        <v-icon
          name="right"
          size="1em"
          viewbox="36"
          class="text-white"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import VIcon from '@/components/icons/Index.vue'
import NavigationMenu from '@/components/navigation/NavigationMenu.vue'

export default Vue.extend({
  name: 'NavigationFooter',
  components: {
    VIcon,
    NavigationMenu
  },
  props: {
    editable: {
      type: Boolean
    }
  },
  data () {
    return {
      showMenu: false
    }
  },
  computed: {
    ...mapState('auth', ['currentSpace'])
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
