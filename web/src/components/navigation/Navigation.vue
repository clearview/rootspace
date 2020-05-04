<template>
  <div
    class="nav"
    :class="{ 'nav--collapse': collapse }"
  >
    <div class="nav-content">
      <navigation-header
        :collapse="collapse"
        @search="search"
        @toggleCollapse="toggleCollapse"
      />
      <navigation-items :editable="editable" />
      <navigation-footer
        :editable="editable"
        @add="modal.link.isVisible = true"
        @edit="editable = !editable"
      />
    </div>

    <div class="nav-content--collapse">
      <img
        srcset="
          @/assets/logo_2.png,
          @/assets/logo_2@2x.png 2x
        "
        src="@/assets/logo_2.png"
        alt="Root Logo"
      />

      <button
        class="btn p-0 border-none bg-transparent"
        @click="toggleCollapse"
      >
        <v-icon
          name="right"
          size="2em"
          viewbox="36"
          class="text-white"
        />
      </button>
    </div>

    <v-modal
      title="Add Link"
      :visible="modal.link.isVisible"
      :loading="modal.link.isLoading"
      @cancel="modal.link.isVisible = false"
      @confirm="() => $refs.link.submit()"
    >
      <div class="modal-body">
        <form-link
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

import FormLink from '@/components/resource/ResourceFormLink.vue'
import VIcon from '@/components/icons/Index.vue'
import VModal from '@/components/Modal.vue'

import NavigationHeader from './NavigationHeader.vue'
import NavigationItems from './NavigationItems.vue'
import NavigationFooter from './NavigationFooter.vue'

type ComponentData = {
  editable: boolean;
  modal: {
    link: {
      isVisible: boolean;
      isLoading: boolean;
      alert: null | {
        message: string;
      };
    };
  };
}

export default Vue.extend({
  name: 'Navigation',
  components: {
    NavigationHeader,
    NavigationItems,
    NavigationFooter,
    FormLink,
    VIcon,
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
    ...mapState('auth', ['spaces']),

    collapse (): boolean {
      return this.$store.state.nav.collapse
    }
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
    toggleCollapse () {
      this.$store.commit('nav/setCollapse', !this.collapse)
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
