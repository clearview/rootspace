<template>
  <div class="nav">
    <navigation-header
      class="nav-header"
      @search="search"
    />

    <navigation-items
      class="nav-items"
      @open="openLink"
    />

    <navigation-footer
      class="nav-footer"
      @add="addLink"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import NavigationHeader from './NavigationHeader.vue'
import NavigationItems from './NavigationItems.vue'
import NavigationFooter from './NavigationFooter.vue'

export default Vue.extend({
  name: 'Navigation',
  components: {
    NavigationHeader,
    NavigationItems,
    NavigationFooter
  },
  methods: {
    search (keyword: string): void {
      console.log(`Search: ${keyword}`)
    },
    addLink (): void {
      console.log('Add link')
    },
    openLink (link: string): void {
      console.log(`Open link: ${link}`)
    }
  }
})
</script>

<style lang="postcss" scoped>
.nav {
  @apply flex flex-col min-h-screen p-4;
  @apply border-r border-gray-100;

  width: 282px;
}

.nav-header {
  @apply flex flex-row items-center mb-4;
}

.nav-items {
  @apply flex-1;
}
</style>
