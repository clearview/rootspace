<template>
  <div
    id="app"
    class="relative h-screen"
  >
    <router-view />
    <portal-target name="default" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import api from '@/utils/api'

export default Vue.extend({
  created () {
    this.updateAuthorization(this.$store.state.auth.token)

    this.$store.watch(
      ({ auth }) => auth.token,
      (token) => {
        this.updateAuthorization(token)
      }
    )
  },
  methods: {
    updateAuthorization (token: string) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  }
})
</script>

<style src="@/assets/css/index.css" />
