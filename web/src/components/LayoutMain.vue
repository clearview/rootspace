<template>
  <div
    class="layout"
    @mouseup="end"
    @mouseleave="end"
  >
    <v-navigation :style="paneStyle"/>
    <div
      class="resizer"
      @mousedown="start"
    />
    <div class="content">
      <v-alert v-model="alert"/>
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import { throttle } from 'lodash'

import VAlert from '@/components/Alert.vue'
import VNavigation from '@/components/navigation/Navigation.vue'
import { Component, Vue } from 'vue-property-decorator'

  type ComponentData = {
    alert: object | null;
  }

  @Component({
    name: 'LayoutMain',
    components: {
      VAlert,
      VNavigation
    }
  })
export default class LayoutMain extends Vue {
    private alert: any = null

    get size () {
      return this.$store.state.nav.size
    }

    get paneStyle (): object {
      return {
        width: `${this.size}px`
      }
    }

    start (e: MouseEvent) {
      e.preventDefault()

      document.addEventListener('mousemove', this.resize)
    }

    end () {
      document.removeEventListener('mousemove', this.resize)
    }

    resize (e: MouseEvent) {
      e.preventDefault()
      this.$store.commit('nav/setSize', e.pageX)
    }

    created () {
      this.resize = throttle(this.resize.bind(this), 150)

      if (!this.$store.state.auth.user.emailConfirmed) {
        this.alert = {
          type: 'secondary',
          message: 'Please remember to verify your email address',
          noicon: true
        }
      }
    }
}
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
