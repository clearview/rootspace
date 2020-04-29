<template>
  <multipane layout="vertical" @paneResizeStop="resize">
    <v-navigation :style="navStyle" />
    <multipane-resizer/>
    <div class="content">
      <slot/>
    </div>
  </multipane>
</template>

<script lang="ts">
import Vue, { VNode } from 'vue'
import { Multipane, MultipaneResizer } from 'vue-multipane'

import VNavigation from '@/components/navigation/Navigation.vue'

export default Vue.extend({
  name: 'LayoutMain',
  components: {
    Multipane,
    MultipaneResizer,
    VNavigation
  },
  computed: {
    navStyle () {
      return {
        width: this.$store.state.nav.size
      }
    }
  },
  methods: {
    resize (pane: VNode, container: VNode, size: string) {
      this.$store.commit('nav/setSize', size)
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
  @apply flex flex-col flex-grow p-4 h-screen overflow-scroll;
}
</style>
