<template>
  <div class="nav-header">
    <div class="nav-logo">
      <img
        srcset="
          @/assets/logo_2.png,
          @/assets/logo_2@2x.png 2x
        "
        src="@/assets/logo_2.png"
        alt="Root Logo"
      />
    </div>

    <div class="nav-search">
      <v-searchbar @input="search" />
    </div>

    <div class="nav-collapse">
      <button
        class="btn btn-icon bg-transparent"
        @click="$emit('toggleCollapse')"
      >
        <v-icon
          name="left"
          size="2em"
          viewbox="36"
          class="text-gray-400"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VSearchbar from '@/components/Searchbar.vue'

export default Vue.extend({
  name: 'NavigationHeader',
  components: {
    VSearchbar
  },
  methods: {
    search (keyword: string): void {
      this.$emit('search', keyword)
    }
  }
})
</script>
