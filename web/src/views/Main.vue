<template>
  <layout-main>
    <router-view/>
  </layout-main>
</template>

<script lang="ts">
import Vue from 'vue'

import LayoutMain from '@/components/LayoutMain.vue'

export default Vue.extend({
  name: 'Main',
  components: {
    LayoutMain
  }
})
</script>
