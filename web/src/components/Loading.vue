<template>
  <v-modal :visible="loading" :noheader="true" :nofooter="true">
    <div class="modal-loading">
      <v-icon class="icon-loading" name="loading" size="5em" viewbox="100" />
      <slot />
    </div>
  </v-modal>
</template>

<script lang="ts">
import Vue from 'vue'

import VIcon from '@/components/icons/Index.vue'
import VModal from '@/components/Modal.vue'

export default Vue.extend({
  name: 'Loading',
  components: {
    VIcon,
    VModal
  },
  props: {
    loading: {
      type: Boolean
    }
  }
})
</script>

<style scoped>
.modal-loading {
  @apply p-5;

  width: 320px;
  text-align: center;

  .icon-loading {
    @apply mx-auto pb-2;
  }
}
</style>
