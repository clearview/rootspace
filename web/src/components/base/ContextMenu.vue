<template>
  <div class="context-menu">
    <slot name="header" v-if="!noheader" class="test"></slot>

    <hr />

    <slot />

    <hr />

    <slot name="footer" v-if="!nofooter"></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ContextMenu',
  props: {
    noheader: {
      type: Boolean
    },
    nofooter: {
      type: Boolean
    }
  }
})
</script>

<style lang="postcss" scoped>
.context-menu {
  position: absolute;
  right: 0;
  width: 170px;
  border: 1px solid;
  border-radius: 5px;
  z-index: 2;
  background: #FFFFFF;
  border: 1px solid theme("colors.gray.100");
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.11);
}

hr {
  color: theme("colors.gray.100");
}
</style>
