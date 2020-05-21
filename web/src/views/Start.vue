<template>
  <div class="main-container">
    <v-alert v-model="notif" />
    <h1>Get Started</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>

    <h2 class="subtitle">Introduction</h2>
    <div class="box"></div>

    <h2 class="subtitle">Title</h2>
    <div class="box"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VAlert from '@/components/Alert.vue'

export default Vue.extend({
  name: 'Start',
  components: {
    VAlert
  },
  mounted () {
    const query = this.$route.query
    console.log(query)
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
