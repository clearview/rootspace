<template>
  <div>
    <div class="flex flex-row mt-4">
      <button class="btn btn-mute flex-grow px-2 mr-2">
        My Workspace
        <v-icon
          name="down"
          class="ml-1 text-gray-400"
        />
      </button>

      <div class="btn-group">
        <button class="btn btn-mute btn-icon">
          <v-icon name="settings" />
        </button>
        <button class="btn btn-mute btn-icon">
          <v-icon name="edit" />
        </button>
      </div>
    </div>
    <div class="flex mt-4">
      <button
        class="btn btn-primary flex-grow"
        @click="linkForm.isVisible = true"
      >
        <v-icon
          name="plus"
          class="mr-1"
        />
        Add New Link
      </button>
    </div>

    <v-modal
      title="Add Link"
      :visible="linkForm.isVisible"
      @cancel="linkForm.isVisible = false"
      @confirm="() => $refs.linkForm.submit()"
    >
      <div class="modal-body">
        <resource-form-link
          @submit="add"
          ref="linkForm"
        />
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import ResourceFormLink from '@/components/resource/ResourceFormLink.vue'
import VIcon from '@/components/icons/Index.vue'
import VModal from '@/components/Modal.vue'

type ComponentData = {
  linkForm: {
    isVisible: boolean;
  };
}

export default Vue.extend({
  name: 'NavigationFooter',
  components: {
    ResourceFormLink,
    VIcon,
    VModal
  },
  data (): ComponentData {
    return {
      linkForm: {
        isVisible: false
      }
    }
  },
  methods: {
    add (payload: Resource.Link): void {
      this.$emit('add', payload)
    }
  }
})
</script>

<style lang="postcss" scoped>
.btn-icon {
  @apply p-2;

  font-size: 22px;
}
</style>
