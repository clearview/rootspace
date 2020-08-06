<template>
  <layout-main v-if="hasSpace">
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
  },
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      const { activePage } = vm.$store.getters['space/activeSpaceMeta'] || {}

      if (activePage && from.name && to.name === 'Main') {
        try {
          await vm.$router.replace(activePage)
        } catch { }
      }
    })
  }
})
export default class Main extends Vue {
  get hasSpace () {
    return this.$store.getters['space/hasSpace']
  }

  async created () {
    if (!this.hasSpace) {
      await this.$router.replace({ name: 'SpaceInit' })
    }
  }
}
</script>
