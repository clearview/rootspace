<template>
  <header>
    <img
      srcset="@/assets/images/logo-inverse.png, @/assets/images/logo-inverse@2x.png 2x"
      src="@/assets/images/logo-inverse.png"
      alt="Root Logo"
      class="object-contain"
    />
    <h1 class="pl-2">Rootspace</h1>
  </header>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'RootHeader'
})
export default class RootHeader extends Vue {
}
</script>

<style lang="postcss" scoped>
header {
  @apply flex justify-center border-b-2 p-2;
  border-color: theme("colors.secondary.default");

  h1 {
    @apply text-2xl;
  }
}
</style>
