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

export default Vue.extend({
  name: 'App'
})
</script>

<style src="@/assets/css/index.css" />
