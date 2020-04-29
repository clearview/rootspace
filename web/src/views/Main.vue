<template>
  <multipane class="pane" layout="vertical">
    <v-navigation />
    <multipane-resizer></multipane-resizer>
    <div class="content"></div>
  </multipane>
</template>

<script lang="ts">
import Vue from 'vue'
import { Multipane, MultipaneResizer } from 'vue-multipane'

import VNavigation from '@/components/navigation/Navigation.vue'

export default Vue.extend({
  name: 'Main',
  components: {
    Multipane,
    MultipaneResizer,
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
.multipane-resizer {
  @apply border-l border-gray-100;

  height: 100vh;
}

.content {
  @apply flex flex-col p-4 flex-grow;
}
</style>
