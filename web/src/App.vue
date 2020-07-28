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
  async created () {
    this.$store.subscribe(async (mutation, state) => {
      if (mutation.type === 'auth/setToken' && !state.auth.token) {
        this.$router.push({ name: 'SignIn' })
      }

      if (mutation.type === 'space/setActive' || mutation.type === 'space/updateMeta') {
        const { activePage } = this.$store.getters['space/activeSpaceMeta']

        try {
          if (this.$route.path !== activePage) {
            await this.$router.push(activePage || '/')
          }
        } catch { }
      }
    })
  }
})
</script>

<style src="@/assets/css/index.css" />
