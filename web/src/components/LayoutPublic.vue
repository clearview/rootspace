<template>
  <div class="layout public">
    <header class="header">
      <img
        class="object-contain"
        alt="Root Logo"
        src="@/assets/images/logo-inverse.png"
        srcset="
          @/assets/images/logo-inverse.png,
          @/assets/images/logo-inverse@2x.png 2x
        "
      />
      <h1 class="pl-2">RootApp</h1>
    </header>

    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LayoutPublic'
})
</script>
