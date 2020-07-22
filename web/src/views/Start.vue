<template>
  <div>
    <v-alert v-model="alert"/>
    <div class="main-container">
      <h1>Get Started</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>

      <h2 class="subtitle">Introduction</h2>
      <div class="box"></div>

      <h2 class="subtitle">Title</h2>
      <div class="box"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { isEmpty } from 'lodash/fp'

import VAlert from '@/components/Alert.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'

  type ComponentData = {
    alert: object | null;
  }

  @Component({
    name: 'Start',
    components: {
      VAlert
    }
  })
export default class Start extends Vue {
    private alert: any = null

    created () {
      const query = this.$route.query

      if (query.from === 'invitation' && query.accept === '1') {
        this.alert = {
          type: 'success',
          message: `Welcome to ${this.activeSpace.title}, you are invited to this space`,
          noicon: true
        }
      }
    }

    @Watch('$route')
    watchRoute (newval: Route) {
      if (isEmpty(newval.query)) {
        this.alert = null
      }
    }

    get activeSpace () {
      return this.$store.getters['space/activeSpace'] || {}
    }
}
</script>

<style lang="postcss" scoped>
  p {
    @apply text-base;
    color: theme("colors.gray.400");
  }

  .subtitle {
    @apply font-bold text-base mt-8;
  }

  .box {
    @apply w-full h-64 mt-4;

    background-color: theme("colors.gray.100");
  }
</style>
