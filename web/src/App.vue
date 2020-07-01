<template>
  <div
    id="app"
    class="relative h-screen overflow-y-auto"
  >
    <router-view />
    <portal-target name="default" />
    <portal-target name="secondary" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'auth/setToken' && !state.auth.token) {
        this.$router.push({ name: 'SignIn' })
      }
    })
  }
})
</script>

<style src="@/assets/css/index.css" />
