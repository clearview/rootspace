<template>
  <div
    class="sidebar"
    :class="{
      'sidebar--collapse': collapse,
      'sidebar--noanimate': noanimate
    }"
    @click="collapse && toggleCollapse()"
  >
    <div class="sidebar-header">
      <router-link to="/" class="sidebar-logo">
        <img
          srcset="
            @/assets/logo_2.png,
            @/assets/logo_2@2x.png 2x
          "
          src="@/assets/logo_2.png"
          alt="Root Logo"
        />
      </router-link>

      <div class="sidebar-search">
        <searchbar />
      </div>

      <div class="sidebar-collapse">
        <button-icon
          name="left"
          size="2em"
          viewbox="36"
          @click.stop="toggleCollapse()"
          transparent
        />
      </div>
    </div>

    <div class="sidebar-items">
      <sidebar-tree v-if="pageReady" :locked="locked" />
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-actions relative">
        <select-space :hide-label="!pageReady" />

        <div class="btn-group">
          <button-icon
            mute
            name="settings"
            @click.stop="gotoSetting()"
          />
          <button-icon
            mute
            :active="!locked"
            name="edit"
            @click.stop="locked = !locked"
          />
        </div>
      </div>

      <div class="sidebar-actions">
        <button-node-add />
      </div>

      <div class="sidebar-expand">
        <button class="btn btn-icon bg-transparent hover:bg-transparent">
          <v-icon
            name="right"
            size="1em"
            viewbox="36"
            class="text-white"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'

import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonNodeAdd from '@/components/ButtonNodeAdd.vue'
import Searchbar from '@/components/Searchbar.vue'
import SelectSpace from '@/components/SelectSpace.vue'
import SidebarTree from '@/components/sidebar/SidebarTree.vue'

import PageMixin from '@/mixins/PageMixin'

@Component({
  name: 'Sidebar',
  components: {
    ButtonIcon,
    ButtonNodeAdd,
    Searchbar,
    SelectSpace,
    SidebarTree
  }
})
export default class Sidebar extends Mixins(PageMixin) {
  @Prop(Boolean)
  private readonly noanimate!: boolean

  private locked = true

  get collapse () {
    return this.$store.state.sidebar.collapse
  }

  toggleCollapse () {
    this.$store.commit('sidebar/setCollapse', !this.collapse)
  }

  async gotoSetting () {
    try {
      await this.$router.push({ name: 'Settings' })
    } catch { }
  }
}
</script>
