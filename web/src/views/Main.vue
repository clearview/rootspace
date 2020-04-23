<template>
  <split-pane
    class="pane"
    split="vertical"
    :default-percent='20'
    :min-percent='20'
  >
    <template #paneL>
      <v-navigation />
    </template>

    <template #paneR>
      <div class="content"></div>
    </template>
  </split-pane>
</template>

<script lang="ts">
import Vue from 'vue'
import SplitPane from 'vue-splitpane'

import VNavigation from '@/components/navigation/Navigation.vue'

export default Vue.extend({
  name: 'Main',
  components: {
    SplitPane,
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
.pane {
  & >>> .splitter-pane-resizer {
    @apply bg-gray-100 opacity-100;
  }
}

.content {
  @apply flex flex-col p-4;
}
</style>
