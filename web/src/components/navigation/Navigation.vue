<template>
  <div
    class="nav"
    :class="{
      'nav--collapse': collapse
    }"
  >
    <navigation-header
      @search="search"
      @toggleCollapse="toggleCollapse"
    />
    <navigation-items
      :value="links.payload"
      :folded="links.folded"
      :editable="editable"
      @update="startUpdateLink"
      @destroy="startDestroyLink"
      @fold="toggleFold"
    />
    <navigation-footer
      :editable="editable"
      @add="startAddNew"
      @edit="editable = !editable"
      @toggleCollapse="toggleCollapse"
    />

    <v-modal
      title="Add New"
      :visible="addNew.visible"
      :nosubmit="true"
      @cancel="addNew.visible = false"
    >
      <div class="modal-body">
        <add-list
          @link="startAddLink"
          @document="startAddDocument"
        />
      </div>
    </v-modal>

    <v-modal
      title="Add Link"
      :visible="link.add.visible"
      :loading="link.add.loading"
      @cancel="link.add.visible = false"
      @confirm="() => $refs.formLinkAdd.submit()"
    >
      <div class="modal-body">
        <form-link
          @submit="addLink"
          :space="currentSpaceID"
          ref="formLinkAdd"
        />
      </div>
    </v-modal>

    <v-modal
      title="Change Link"
      :visible="link.update.visible"
      :loading="link.update.loading"
      @cancel="link.update.visible = false"
      @confirm="() => $refs.formLinkUpdate.submit()"
    >
      <div class="modal-body">
        <form-link
          notitle
          :value="link.update.data"
          ref="formLinkUpdate"
          @submit="updateLink"
        />
      </div>
    </v-modal>

    <v-modal
      title="Delete Link/Document"
      :visible="link.destroy.visible"
      :loading="link.destroy.loading"
      confirmText="Yes"
      @cancel="link.destroy.visible = false"
      @confirm="destroyLink(link.destroy.data)"
    >
      <div class="modal-body text-center">
        Are you sure you want to delete this link/document?
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { LinkResource } from '@/types/resource'

import FormLink from '@/components/resource/ResourceFormLink.vue'
import AddList from '@/components/resource/ResourceAddList.vue'
import VModal from '@/components/Modal.vue'

import NavigationHeader from './NavigationHeader.vue'
import NavigationItems from './NavigationItems.vue'
import NavigationFooter from './NavigationFooter.vue'

type Alert = {
  type: string;
  message: string;
}

type ComponentData = {
  editable: boolean;
  addNew: {
    visible: boolean;
  };
  link: {
    fetch: {
      loading: boolean;
      alert: Alert | null;
    };
    add: {
      visible: boolean;
      loading: boolean;
      alert: Alert | null;
    };
    update: {
      visible: boolean;
      loading: boolean;
      data: LinkResource | null;
      alert: Alert | null;
    };
    destroy: {
      visible: boolean;
      loading: boolean;
      data: LinkResource | null;
      alert: Alert | null;
    };
  };
};

export default Vue.extend({
  name: 'Navigation',
  components: {
    NavigationHeader,
    NavigationItems,
    NavigationFooter,
    FormLink,
    AddList,
    VModal
  },
  data (): ComponentData {
    return {
      editable: false,
      addNew: {
        visible: false
      },
      link: {
        fetch: {
          loading: false,
          alert: null
        },
        add: {
          visible: false,
          loading: false,
          alert: null
        },
        update: {
          visible: false,
          loading: false,
          data: null,
          alert: null
        },
        destroy: {
          visible: false,
          loading: false,
          data: null,
          alert: null
        }
      }
    }
  },
  computed: {
    links () {
      return this.$store.state.link
    },
    collapse () {
      return this.$store.state.nav.collapse
    },
    hasSpace () {
      const spaces = this.$store.state.auth.spaces

      return spaces && spaces.length > 0
    },
    currentSpaceID () {
      return this.$store.state.auth.currentSpace.id
    }
  },
  async created () {
    if (!this.hasSpace) {
      return this.$router.replace({ name: 'CreateWorkspace' })
    }

    await this.fetchLink()
  },
  methods: {
    search (keyword: string): void {
      console.log(`Search: ${keyword}`)
    },
    toggleCollapse () {
      this.$store.commit('nav/setCollapse', !this.collapse)
    },
    startAddLink () {
      this.addNew.visible = false
      this.link.add.visible = true
    },
    startAddDocument () {
      this.$router.push({ name: 'Document' })
      this.addNew.visible = false
    },
    startAddNew () {
      this.addNew.visible = true
    },
    startUpdateLink (data: LinkResource, modal: boolean) {
      this.link.update.data = data

      if (modal) {
        this.link.update.visible = true
      } else {
        this.updateLink(data)
      }
    },
    startDestroyLink (data: LinkResource) {
      this.link.destroy.visible = true
      this.link.destroy.data = data
    },
    toggleFold (data: object) {
      this.$store.commit('link/setFolded', data)
    },
    async fetchLink () {
      this.link.fetch.loading = true

      await this.$store.dispatch('link/fetch')

      this.link.fetch.loading = false
    },
    async addLink (data: LinkResource) {
      this.link.add.loading = true

      try {
        await this.$store.dispatch('link/create', data)
      } catch (e) {
        this.link.add.alert = {
          type: 'danger',
          message: e.message
        }
      }

      this.link.add.loading = false
      this.link.add.visible = false
    },
    async updateLink (data: LinkResource) {
      this.link.update.loading = true

      try {
        await this.$store.dispatch('link/update', data)
      } catch (err) {
        this.link.update.alert = {
          type: 'danger',
          message: err.message
        }
      }

      this.link.update.loading = false
      this.link.update.visible = false
      this.link.update.data = null
    },
    async destroyLink (data: LinkResource) {
      this.link.destroy.loading = true

      try {
        await this.$store.dispatch('link/destroy', data)

        const route = this.$route
        const isDoc = (data.type === 'doc' && route.name === 'Document')
        if (isDoc && parseInt(data.value) === parseInt(route.params.id)) {
          this.$router.push({ name: 'Main' })
        }
      } catch (err) {
        this.link.destroy.alert = {
          type: 'danger',
          message: err.message
        }
      }

      this.link.destroy.loading = false
      this.link.destroy.visible = false
      this.link.destroy.data = null
    }
  }
})
</script>

<style lang="postcss" scoped>
.modal-body {
  width: 456px;
}
</style>
