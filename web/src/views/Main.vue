<template>
  <div class="flex flex-row">
    <v-navigation
      @addLink="addLink"
    />

    <div class="content">Content</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { LinkResource } from '@/types/resource'

import VNavigation from '@/components/navigation/Navigation.vue'

type ComponentData = {
  loading: boolean;
  alert: {
    message: string;
  } | null;
}

export default Vue.extend({
  name: 'Main',
  components: {
    VNavigation
  },
  data (): ComponentData {
    return {
      loading: false,
      alert: null
    }
  },
  methods: {
    async addLink (data: LinkResource) {
      try {
        await this.$store.dispatch('link/create', data)
      } catch (e) {
        this.alert = {
          message: e.message
        }
      }
    }
  }
})
</script>

<style lang="postcss" scoped>
.content {
  @apply flex flex-col p-4;
}
</style>
