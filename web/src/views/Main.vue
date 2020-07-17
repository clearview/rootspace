<template>
  <layout-main>
    <router-view/>
  </layout-main>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import LayoutMain from '@/components/LayoutMain.vue'

@Component({
  name: 'Main',
  components: {
    LayoutMain
  }
})
export default class Main extends Vue {

}
</script>
