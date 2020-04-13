<template>
  <div class="flex flex-row">
    <v-navigation/>

    <div class="content">Content</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VNavigation from '@/components/navigation/Navigation.vue'

export default Vue.extend({
  name: 'Main',
  components: {
    VNavigation
  }
})
</script>

<style lang="postcss" scoped>
.content {
  @apply flex flex-col p-4;
}
</style>
