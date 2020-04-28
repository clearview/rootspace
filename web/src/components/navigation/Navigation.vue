<template>
  <div class="nav">
    <navigation-header @search="search" />
    <navigation-items :editable="editable" />
    <navigation-footer
      :editable="editable"
      @add="modal.link.isVisible = true"
      @edit="editable = !editable"
    />

    <v-modal
      title="Add Link"
      :visible="modal.link.isVisible"
      :loading="modal.link.isLoading"
      @cancel="modal.link.isVisible = false"
      @confirm="() => $refs.link.submit()"
    >
      <div class="modal-body">
        <resource-form-link
          @submit="addLink"
          ref="link"
        />
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { LinkResource } from '@/types/resource'

import NavigationHeader from './NavigationHeader.vue'
import NavigationItems from './NavigationItems.vue'
import NavigationFooter from './NavigationFooter.vue'
import ResourceFormLink from '@/components/resource/ResourceFormLink.vue'
import VModal from '@/components/Modal.vue'

type ComponentData = {
  editable: boolean;
  modal: {
    link: {
      isVisible: boolean;
      isLoading: boolean;
      alert: {
        message: string;
      } | null;
    };
  };
}

export default Vue.extend({
  name: 'Navigation',
  components: {
    NavigationHeader,
    NavigationItems,
    NavigationFooter,
    ResourceFormLink,
    VModal
  },
  data (): ComponentData {
    return {
      editable: false,
      modal: {
        link: {
          isVisible: false,
          isLoading: false,
          alert: null
        }
      }
    }
  },
  computed: {
    ...mapState('auth', ['spaces'])
  },
  created () {
    if (this.spaces && this.spaces.length === 0) {
      this.$router.push({ name: 'CreateWorkspace' })
    }
  },
  methods: {
    search (keyword: string): void {
      console.log(`Search: ${keyword}`)
    },
    async addLink (data: LinkResource) {
      this.modal.link.isLoading = true

      try {
        await this.$store.dispatch('link/create', data)
      } catch (e) {
        this.modal.link.alert = {
          message: e.message
        }
      }

      this.modal.link.isLoading = false
      this.modal.link.isVisible = false
    }
  }
})
</script>
