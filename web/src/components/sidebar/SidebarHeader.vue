<template>
  <div class="sidebar-header">
    <div class="header space-header">
      <select-space
        :hide-label="!pageReady"
        :collapse-state="collapseState"
        class="select-space"/>

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

    <sidebar-notification-activity :collapse-state="collapseState" />
    <sidebar-settings :collapse-state="collapseState" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

import SelectSpace from '@/components/SelectSpace.vue'
import SidebarSettings from '@/components/sidebar/header/Settings.vue'
import SidebarNotificationActivity from '@/components/sidebar/header/NotificationActivity.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

@Component({
  name: 'SidebarHeader',
  components: {
    SelectSpace,
    ButtonIcon,
    SidebarSettings,
    SidebarNotificationActivity
  }
})

export default class SidebarHeader extends Vue {
  @Prop(Boolean)
  private readonly pageReady!: boolean

  @Prop(Boolean)
  private readonly collapseState!: boolean

  toggleCollapse () {
    this.$emit('toggle-collapse')
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
        color: #A9B1C4;
      }
    }
  }

  .activities-header {
    padding: 0;
    cursor: pointer;
    border-radius: 3px;
    height: 40px;
    align-items: center;

    &:hover {
      background: #F8F9FD;
    }
  }

  .settings-header {
    padding: 0;
  }

  .sidebar-icon {
    padding-left: 8px;
    transition: 300ms;
  }
}
</style>
