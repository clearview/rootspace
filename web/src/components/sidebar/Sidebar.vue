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
        <select-space :hide-label="!pageReady" :collapse-state="collapse" class="select-space"/>

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

      <Popover top="38px"
        :with-close="false"
        position="bottom-end"
        class="settings-contextmenu header settings-header">
        <template #default>
          <router-link :to="{name: 'SettingsAccount'}" class="action-line">
            <v-icon class="action-icon" name="user" viewbox="32" size="16px"></v-icon>
            <div class="action-line-text" @click="open(images[index].path)">
              My Account
            </div>
          </router-link>
          <div class="action-separator"></div>
          <router-link :to="{name: 'SettingsSpace'}" class="action-line">
            <v-icon class="action-icon" name="space" viewbox="22" size="16px"></v-icon>
            <div class="action-line-text" @click="open(images[index].path)">
              Space Settings
            </div>
          </router-link>
        </template>
        <template #trigger="{ visible }">
          <span class="sidebar-icon">
            <v-icon
              name="settings"
              size="16px"
              viewbox="30"
              class="flex flex-none text-gray-400"
            />
          </span>
          <span class="title flex-grow collapse-hidden">
            Settings
          </span>
          <span class="more-menu collapse-hidden" :class="{'btn-link-primary': visible}">
            <v-icon
              name="down2"
              size="20px"
              viewbox="16"
              class="flex flex-none text-gray-400 -rotate-90"
            />
          </span>
        </template>
      </Popover>
    </div>

    <div class="sidebar-items">
      <sidebar-tree v-if="pageReady" :locked="locked" @addNew="addNewNode" />
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-actions">
        <button-node-add />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Ref } from 'vue-property-decorator'

import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonNodeAdd from '@/components/ButtonNodeAdd.vue'
import Searchbar from '@/components/Searchbar.vue'
import SelectSpace from '@/components/SelectSpace.vue'
import SidebarTree from '@/components/sidebar/SidebarTree.vue'
import Popover from '@/components/Popover.vue'

import { SpaceResource } from '@/types/resource'
import PageMixin from '@/mixins/PageMixin'

@Component({
  name: 'Sidebar',
  components: {
    ButtonIcon,
    ButtonNodeAdd,
    Searchbar,
    SelectSpace,
    SidebarTree,
    Popover
  }
})
export default class Sidebar extends Mixins(PageMixin) {
  @Prop(Boolean)
  private readonly noanimate!: boolean

  @Ref('buttonAdd')
  private readonly buttonAddRef!: ButtonNodeAdd;

  private locked = true

  get collapse () {
    return this.$store.state.sidebar.collapse
  }

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  addNewNode () {
    this.buttonAddRef.setModalVisible(true)
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
  @apply flex flex-col justify-start py-2;

  border-bottom: 1px solid #EAEAEA;

  .header {
    @apply flex items-center p-4;

    width: 100%;
    color: #2C2B35;
    padding-left: 8px;

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
    padding: 8px;
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

  .more-menu {
    svg {
      transform: rotate(-90deg);
    }
  }
}

.action-line {
  @apply flex items-center py-2 px-4 my-1 relative;
  font-size: 13px;
  line-height: 16px;
  width: 168px;
  color: theme("colors.gray.900");
  stroke-width: 3px;
  cursor: pointer;

  &:hover{
    background: #F0F2F5;
  }
  &.danger {
    color: theme("colors.danger.default");
  }
}

.action-line-text {
  @apply ml-2;
  flex: 1 1 auto;
}
.action-separator{
  @apply my-1;
  height:1px;
  background: theme("colors.gray.100");
}
</style>

<style lang="postcss">
.settings-contextmenu {
  .popover-trigger {
    @apply flex items-center;
    @apply w-full;
  }
}
</style>
