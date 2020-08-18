<template>
  <layout-main v-if="hasSpace" :key="activeSpace.id">
    <router-view />
  </layout-main>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import LayoutMain from '@/components/LayoutMain.vue'
import SpaceMixin from '@/mixins/SpaceMixin'

@Component({
  name: 'Main',
  components: {
    LayoutMain
  },
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      const hasSpace = vm.$store.getters['space/hasSpace']
      const { activePage } = vm.$store.getters['space/activeSpaceMeta'] || {}

      try {
        if (!hasSpace) {
          return vm.$router.replace({ name: 'SpaceInit' })
        }

        if (activePage && from.name && to.name === 'Main') {
          return vm.$router.replace(activePage)
        }
      } catch { }
    })
  }
})
export default class Main extends Mixins(SpaceMixin) { }
</script>
