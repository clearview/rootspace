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
      <div class="header space-header">
        <select-space :hide-label="!pageReady" class="select-space"/>

        <div class="sidebar-collapse collapse-hidden">
          <button-icon
            name="left"
            size="24px"
            viewbox="32"
            @click.stop="toggleCollapse()"
            transparent
          />
        </div>
      </div>

      <div class="header activities-header">
        <span class="sidebar-icon">
          <v-icon
            name="grid"
            size="16px"
            viewbox="16"
            class="flex flex-none text-gray-400"
          />
        </span>
        <span class="title collapse-hidden">
          Activities
        </span>
      </div>

      <div class="header settings-header">
        <span class="sidebar-icon">
          <v-icon
            name="settings"
            size="16px"
            viewbox="30"
            class="flex flex-none text-gray-400"
          />
        </span>
        <span class="title collapse-hidden">
          Settings
        </span>
      </div>
    </div>

    <div class="sidebar-items">
      <sidebar-tree v-if="pageReady" :locked="locked" />
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-actions">
        <button-node-add />
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

import { SpaceResource } from '@/types/resource'
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

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
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

<style lang="postcss" scoped>
.sidebar-header {
  @apply flex flex-col justify-start;

  padding-left: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #EAEAEA;

  .header {
    @apply flex items-center;

    width: 100%;
    color: #2C2B35;

    span {
      &.title {
        font-size: 16px;
        line-height: 19px;
        margin-left: 8px;
      }
    }
  }

  .space-header {
    position: relative;
    padding: 8px;
    padding-top: 0;
    padding-left: 0;

    .select-space {
      @apply flex-grow;
    }

    .sidebar-collapse {
      @apply flex-grow-0 items-center justify-end;

      .btn {
        height: 24px;
      }
    }
  }

  .activities-header,
  .settings-header {
    padding: 8px 10px;
    padding-left: 0;
    cursor: pointer;
    border-radius: 3px;
    height: 40px;
    align-items: center;

    &:hover {
      background: #F8F9FD;
    }
  }

  .sidebar-icon {
    padding-left: 8px;
    transition: 300ms;
  }

}
</style>
