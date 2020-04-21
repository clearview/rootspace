<template>
  <div class="flex flex-row">
    <v-navigation />

    <div class="content"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VNavigation from '@/components/navigation/Navigation.vue'

export default Vue.extend({
  name: 'Main',
  components: {
    VNavigation
  },
  computed: {
    activeLink () {
      return this.$store.state.link.active
    }
  }
})
</script>

<style lang="postcss" scoped>
.content {
  @apply flex flex-col p-4;
}
</style>
