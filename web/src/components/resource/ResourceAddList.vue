<template>
  <div>
    <a class="add-list  mb-4" @click="$emit('link')">
      <v-icon
        name="link"
        size="3.5em"
        class="icon-list"
      />

      <div class="desc-list">
        <h5>Link</h5>
        <p>ADD A LINK TO ANYTHING YOU’D LIKE.</p>
      </div>
    </a>

    <a class="add-list" @click="$emit('document')">
      <v-icon
        name="file"
        size="3.5em"
        class="icon-list"
      />

      <div class="desc-list">
        <h5>Document</h5>
        <p>WRITE NOTES, THOUGHTS OR IDEAS.</p>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'ResourceAddList',
  components: {
    VIcon
  }
})
</script>

<style lang="postcss" scoped>
.add-list {
  @apply flex flex-row border p-3 rounded;

  border-color: theme("colors.gray.400");
  cursor: pointer;

  &:hover {
    background-color: rgba(theme('colors.gray.100'), 0.5);
  }

  .icon-list {
    @apply rounded-full text-white p-2;

    background: theme("colors.primary.default");
  }
  .desc-list {
    @apply pl-2;

    font-size: 12px;
  }
}
</style>
