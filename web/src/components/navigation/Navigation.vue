<template>
  <div class="nav">
    <navigation-header
      class="nav-header"
      @search="search"
    />

    <navigation-items
      class="nav-items"
      @open="openLink"
    />

    <navigation-footer
      class="nav-footer"
      @add="linkForm.isVisible = true"
    />

    <v-modal
      title="Add Link"
      :visible="linkForm.isVisible"
      :loading="linkForm.isLoading"
      @cancel="linkForm.isVisible = false"
      @confirm="() => $refs.linkForm.submit()"
    >
      <div class="modal-body">
        <resource-form-link
          @submit="addLink"
          ref="linkForm"
        />
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { LinkResource } from '@/types/resource'

import NavigationHeader from './NavigationHeader.vue'
import NavigationItems from './NavigationItems.vue'
import NavigationFooter from './NavigationFooter.vue'
import VModal from '@/components/Modal.vue'
import ResourceFormLink from '@/components/resource/ResourceFormLink.vue'

type ComponentData = {
  linkForm: {
    isVisible: boolean;
    isLoading: boolean;
    alert: {
      message: string;
    } | null;
  };
}

export default Vue.extend({
  name: 'Navigation',
  components: {
    NavigationHeader,
    NavigationItems,
    NavigationFooter,
    VModal,
    ResourceFormLink
  },
  data (): ComponentData {
    return {
      linkForm: {
        isVisible: false,
        isLoading: false,
        alert: null
      }
    }
  },
  methods: {
    search (keyword: string): void {
      console.log(`Search: ${keyword}`)
    },
    async addLink (data: LinkResource) {
      this.linkForm.isLoading = true

      try {
        await this.$store.dispatch('link/create', data)
      } catch (e) {
        this.linkForm.alert = {
          message: e.message
        }
      }

      this.linkForm.isLoading = false
      this.linkForm.isVisible = false
    },
    openLink (link: string): void {
      console.log(`Open link: ${link}`)
    }
  }
})
</script>

<style lang="postcss" scoped>
.nav {
  @apply flex flex-col min-h-screen p-4;
  @apply border-r border-gray-100;

  width: 282px;
}

.nav-header {
  @apply flex flex-row items-center mb-4;
}

.nav-items {
  @apply flex-1;
}
</style>
