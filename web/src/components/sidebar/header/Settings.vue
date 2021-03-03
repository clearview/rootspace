<template>
  <Popover top="38px"
    :with-close="false"
    :offset="-24"
    position="right-start"
    class="settings-contextmenu header settings-header"
    borderless>
    <template #default="{ hide }">
      <router-link :to="{name: 'SettingsAccount'}" class="action-line" @click.native="hide()">
        <v-icon class="action-icon" name="user" viewbox="32" size="16px"></v-icon>
        <div class="action-line-text" >
          My Account
        </div>
      </router-link>
      <permission role="admin">
        <router-link :to="{name: 'SettingsSpace'}" class="action-line" @click.native="hide()">
          <v-icon class="action-icon" name="space" viewbox="22" size="16px"></v-icon>
          <div class="action-line-text">
            Space Settings
          </div>
        </router-link>
      </permission>
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
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from 'vue-property-decorator'

import Popover from '@/components/Popover.vue'
import { Permission } from '@/components/access'

@Component({
  name: 'SidebarHeaderSettings',
  components: {
    Popover,
    Permission
  }
})

export default class SidebarHeaderSettings extends Vue {
  @Prop(Boolean)
  private readonly collapseState!: boolean

  @Watch('collapseState')
  async watchCollapseState (value: boolean) {
    if (value) {
      // this.optionsVisible = !value
    }
  }
}
</script>

<style lang="postcss" scoped>
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

.action-line {
  @apply flex items-center py-2 px-4 my-1 relative;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  width: 168px;
  color: #2C2B35;
  stroke-width: 3px;
  cursor: pointer;

  &:hover{
    background: #F0F2F5;
  }
  &.danger {
    color: theme("colors.danger.default");
  }
}

.action-icon {
  color: theme("colors.gray.400");
}

.action-line-text {
  margin-left: 8px;
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

    height: 40px;
    padding: 8px;
    min-width: 232px;
  }
}
</style>
