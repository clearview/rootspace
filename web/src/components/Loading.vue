<template>
  <v-modal :visible="loading" :noheader="true" :nofooter="true">
    <div class="modal-loading">
      <v-icon class="icon-loading" name="loading" size="5em" viewbox="100"/>
      <slot/>
    </div>
  </v-modal>
</template>

<script lang="ts">

import VModal from '@/components/legacy/Modal.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Loading',
  components: {
    VModal
  }
})
export default class Loading extends Vue {
    @Prop({ type: Boolean })
    private readonly loading?: boolean
}
</script>

<style lang="postcss" scoped>
  .modal-loading {
    @apply p-5;

    width: 320px;
    text-align: center;

    .icon-loading {
      @apply mx-auto pb-2;
    }
  }
</style>
