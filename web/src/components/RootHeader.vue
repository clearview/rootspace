<template>
  <header>
    <img
      srcset="@/assets/images/logo-inverse.png, @/assets/images/logo-inverse@2x.png 2x"
      src="@/assets/images/logo-inverse.png"
      alt="Root Logo"
      class="object-contain"
    />
    <h1 class="pl-2">RootApp</h1>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'RootHeader'
})
</script>

<style scoped>
header {
  @apply flex justify-center border-b-2 p-2;
  border-color: theme("colors.secondary.default");

  h1 {
    @apply text-2xl;
  }
}
</style>
