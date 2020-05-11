<template>
  <div
    class="layout"
    @mouseup="end"
    @mouseleave="end"
  >
    <v-navigation :style="paneStyle" />
    <div
      class="resizer"
      @mousedown="start"
    />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VNavigation from '@/components/navigation/Navigation.vue'

export default Vue.extend({
  name: 'LayoutMain',
  components: {
    VNavigation
  },
  computed: {
    size () {
      return this.$store.state.nav.size
    },
    paneStyle (): object {
      return {
        width: `${this.size}px`
      }
    }
  },
  methods: {
    start (e: MouseEvent) {
      e.preventDefault()

      document.addEventListener('mousemove', this.resize)
    },
    end () {
      document.removeEventListener('mousemove', this.resize)
    },
    resize (e: MouseEvent) {
      e.preventDefault()

      this.$store.commit('nav/setSize', e.pageX)
    }
  },
  created () {
    this.resize = this.resize.bind(this)
  }
})
</script>

<style lang="postcss" scoped>
.layout {
  @apply flex flex-row;
}

.resizer {
  padding: 0 5px;
  margin-left: -5px;
  height: 100vh;
  cursor: col-resize;

  &:after {
    @apply block h-full bg-gray-100;

    content: '';
    width: 1px;
  }

  .nav--collapse ~ & {
    @apply hidden;
  }
}

.content {
  @apply flex flex-col flex-grow p-4 h-screen overflow-scroll;
}
</style>
