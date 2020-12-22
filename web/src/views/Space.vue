<template>
  <layout-main v-if="hasSpace">
    <router-view />
  </layout-main>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { isEqual } from 'lodash'
import { debounce as Debounce } from 'helpful-decorators'
import LayoutMain from '@/components/LayoutMain.vue'
import SpaceMixin from '@/mixins/SpaceMixin'
import { TaskSettings } from '@/store/modules/task/settings'
import { SpaceSettingResource } from '@/types/resource'

@Component({
  components: {
    LayoutMain
  }
})
export default class Space extends Mixins(SpaceMixin) {
  redirection = true

  get setting (): SpaceSettingResource {
    const { sidebar, tree, task } = this.$store.state

    return {
      activePage: this.$route.path,
      sidebarCollapse: sidebar.collapse || false,
      sidebarSize: sidebar.size || 0,
      treeFolded: tree.folded || {},
      taskViewAs: task.settings.viewAs || {},
      taskSeenViewTip: task.settings.seenViewTip || false
    }
  }

  set setting (data: SpaceSettingResource) {
    this.$store.commit('sidebar/setCollapse', data.sidebarCollapse || false)
    this.$store.commit('sidebar/setSize', data.sidebarSize || 0)
    this.$store.commit('tree/setFolded', data.treeFolded || {})
    this.$store.commit('task/settings/setData', (state: TaskSettings) => {
      state.viewAs = data.taskViewAs || {}
      state.seenViewTip = data.taskSeenViewTip || false
    })
  }

  async created () {
    try {
      if (!this.hasSpace) {
        await this.$router.replace({ name: 'SpaceInit' })
      } else {
        this.setting = this.activeSpaceSetting
        if (this.$route.path === '/') {
          await this.$router.replace(this.activeSpaceSetting.activePage)
        } else {
          this.redirection = true
        }
      }
    } catch { }
  }

  @Watch('activeSpace.id')
  async watchActiveSpaceId () {
    try {
      this.setting = this.activeSpaceSetting
      if (this.redirection) {
        await this.$router.push(this.activeSpaceSetting.activePage || '/')
      } else {
        this.redirection = true
      }
    } catch { }
  }

  @Watch('setting', { deep: true })
  @Debounce(1000)
  async watchSetting (data: SpaceSettingResource, prevData: SpaceSettingResource) {
    if (isEqual(data, prevData) && !this.$store.state.space.afterFrozen) return
    if (data.activePage === '/document') return
    this.$store.commit('space/clearFrozen')
    await this.updateSpaceSetting(this.activeSpace.id, data)
  }
}
</script>
