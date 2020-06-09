<template>
  <div>
    <v-alert v-model="alert" />
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
import Vue from 'vue'
import { isEmpty } from 'lodash/fp'

import VAlert from '@/components/Alert.vue'

type ComponentData = {
  alert: object | null;
}

export default Vue.extend({
  name: 'Start',
  components: {
    VAlert
  },
  data (): ComponentData {
    return {
      alert: null
    }
  },
  created () {
    const query = this.$route.query
    console.log(query)
    if (query.from === 'invitation' && query.accept === '1') {
      this.alert = {
        type: 'success',
        message: `Welcome to ${this.currentSpace.title}, you are invited to this space`,
        noicon: true
      }
    }
  },
  watch: {
    $route (newval) {
      if (isEmpty(newval.query)) {
        this.alert = null
      }
    }
  },
  computed: {
    currentSpace () {
      return this.$store.state.auth.currentSpace || {}
    }
  }
})
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
