<template>
  <div class="nav-header">
    <div class="flex flex-none">
      <img
        srcset="
          @/assets/logo.png,
          @/assets/logo@2x.png 2x
        "
        src="@/assets/logo.png"
        alt="Root Logo"
      />
    </div>

    <div class="flex flex-1 mx-5">
      <v-searchbar @input="search" />
    </div>

    <div class="flex flex-none">
      <button
        class="btn p-0 border-none"
        @click="$emit('toggleCollapse')"
      >
        <v-icon
          name="left"
          size="2em"
          viewbox="36"
          :class="{
            'text-primary': collapse,
            'text-gray-400': !collapse
          }"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VSearchbar from '@/components/Searchbar.vue'
import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'NavigationHeader',
  components: {
    VSearchbar,
    VIcon
  },
  props: {
    collapse: {
      type: Boolean
    }
  },
  methods: {
    search (keyword: string): void {
      this.$emit('search', keyword)
    }
  }
})
</script>
