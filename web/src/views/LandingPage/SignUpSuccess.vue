<template>
  <div id="signup-success-page">
    <root-header></root-header>

    <div id="signup-success-content" class="flex flex-col items-center justify-center">
      <h5>Sign up success!</h5>
      <h6>Please confirm your email</h6>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import RootHeader from '@/components/RootHeader.vue'

export default Vue.extend({
  name: 'SignupSuccess',
  components: {
    RootHeader
  }
})
</script>

<style lang="postcss" scoped>
#signup-success-page {
  @apply border-t-4;
  border-color: theme("colors.primary.default");
}
#signup-success-content {
  height: calc(100vh - 100px);
}
</style>
