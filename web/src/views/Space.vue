<template>
  <layout-main v-if="hasSpace">
    <router-view />
  </layout-main>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import LayoutMain from '@/components/LayoutMain.vue'
import SpaceMixin from '@/mixins/SpaceMixin'

@Component({
  components: {
    LayoutMain
  }
})
export default class Space extends Mixins(SpaceMixin) {
  async created () {
    try {
      if (!this.hasSpace) {
        await this.$router.replace({ name: 'SpaceInit' })
      } else if (this.$route.path === '/') {
        await this.$router.replace(this.activeSpaceSetting.activePage)
      }
    } catch { }
  }

  @Watch('$route.path')
  async watchRoutePath (path: string) {
    await this.updateSpaceSetting(this.activeSpace.id, {
      activePage: path
    })
  }

  @Watch('activeSpace.id')
  async watchActiveSpaceId () {
    try {
      await this.$router.push(this.activeSpaceSetting.activePage || '/')
    } catch { }
  }
}
</script>
