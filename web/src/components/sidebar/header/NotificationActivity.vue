<template>
  <Popover
    :with-close="false"
    :offset="-24"
    @trigger="notificationActivityTrigger"
    position="right"
    class="settings-contextmenu header activities-header"
    borderless
    with-top>
    <template #default="{ hide }">
      <div class="notification-activity">
        <div class="notification-activity-header relative">
          <ul class="tab list-reset">
            <li class="pointer" :class="{ active: state === 'notifications' }" @click="naOpen('notifications')">
              <span>Notifications</span><span class="dot more-left" v-if="showDot"></span>
            </li>
            <li class="pointer" :class="{ active: state === 'activities' }" @click="naOpen('activities')">
              <span>Activities</span>
            </li>
          </ul>
          <div class="action-lists">
            <span v-if="state === 'notifications'" @click="markAllSeen">
              <legacy-icon
                name="checkmark2"
                size="20px"
                viewbox="20"
                class="flex flex-none pr-1"
              />
              Mark all as read
            </span>

            <Popover
              :with-close="false"
              position="bottom-end"
              :sub="true">
              <template #default>
                <div class="notif-activity-filters">
                  <div class="filter">
                    <label><input type="checkbox" id="link" value="link" class="checkbox" v-model="filters">Link</label>
                  </div>
                  <div class="filter">
                    <label><input type="checkbox" id="embed" value="embed" class="checkbox" v-model="filters">Embed</label>
                  </div>
                  <div class="filter">
                    <label><input type="checkbox" id="taskboard" value="taskboard,tasklist,task" class="checkbox" v-model="filters">Task Board</label>
                  </div>
                  <div class="filter">
                    <label><input type="checkbox" id="document" value="doc" class="checkbox" v-model="filters">Document</label>
                  </div>
                  <div class="divider"></div>
                  <div class="filter">
                    <label><input type="checkbox" id="myactivities" value="myactivities" class="checkbox" v-model="mineOnly">My Activities</label>
                  </div>
                </div>
              </template>
              <template #trigger="{ visible }">
                <span :class="{'btn-link-primary': visible}">
                  <legacy-icon
                    name="filter2"
                    size="20px"
                    viewbox="20"
                    class="flex flex-none pr-1"
                  />
                  Filter
                </span>
              </template>
            </Popover>
          </div>
        </div>
        <div class="notification-activity-content">
          <div class="task-notifications content-lists" v-if="state === 'notifications'">
            <div v-if="loadingNotifications">
              <ActivityListLoader v-for="index in 2" :key="index"></ActivityListLoader>
            </div>
            <div v-else>
              <div class="empty-list" v-if="notifications.length === 0">
                No notifications
              </div>
              <ActivityList v-for="notif in notifications" :activity="notif" :key="notif.id" @click.native="markRead(notif, hide)"></ActivityList>
              <div class="view-more" v-if="!peakNotif">
                <div class="view-more-content" @click="loadMoreNotifications">
                <legacy-icon class="more-icon" name="down" viewbox="32" size="20px"></legacy-icon>
                <span class="more-label">
                  View More
                </span>
                </div>
              </div>
            </div>
          </div>
          <div class="task-activities content-lists" v-if="state === 'activities'">
            <div v-if="loadingActivities">
              <ActivityListLoader v-for="index in 2" :key="index"></ActivityListLoader>
            </div>
            <div v-else>
              <div class="empty-list" v-if="activities.length === 0">
                No activities
              </div>
              <ActivityList v-for="act in activities" :activity="act" :key="act.id" @click.native="shouldHide(act, hide)"></ActivityList>
              <div class="view-more" v-if="!peakAct">
                <div class="view-more-content" @click="loadMoreActivities">
                <legacy-icon class="more-icon" name="down" viewbox="32" size="20px"></legacy-icon>
                <span class="more-label">
                  View More
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #trigger="{ visible }">
      <span class="sidebar-icon">
        <legacy-icon
          name="grid"
          size="16px"
          viewbox="16"
          class="flex flex-none text-gray-400"
        />
      </span>
      <span class="title flex-grow collapse-hidden">
        Notifications & Activities
        <span class="dot" v-if="showDot"></span>
      </span>
      <span class="more-menu collapse-hidden" :class="{'btn-link-primary': visible}">
        <legacy-icon
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
import ActivityList from '@/components/sidebar/header/ActivityList.vue'
import ActivityListLoader from '@/components/sidebar/header/ActivityListLoader.vue'
import FilterPopover from '@/components/sidebar/header/FilterPopover.vue'
import { ActivityResource, TaskActivityResource, UserResource } from '@/types/resource'
import api from '@/utils/api'

@Component({
  name: 'SidebarHeaderNotifActivity',
  components: {
    Popover,
    ActivityList,
    ActivityListLoader,
    FilterPopover
  }
})

export default class SidebarHeaderNotifActivity extends Vue {
  @Prop(Boolean)
  private readonly collapseState!: boolean

  private state = 'notifications'
  readonly LIMIT = 10
  private offsetAct = 0
  private offsetNotif = 0
  private peakAct = false
  private peakNotif = false
  private filters = []
  private mineOnly = false
  private loadingActivities = false;
  private loadingNotifications = false;

  @Watch('collapseState')
  async watchCollapseState (value: boolean) {
    if (value) {
      // this.optionsVisible = !value
    }
  }

  @Watch('filters')
  @Watch('mineOnly')
  refetchOnFiltersChanged () {
    if (this.state === 'activities') {
      this.fetchActivities()
    } else {
      this.fetchNotifications()
    }
  }

  private activities: TaskActivityResource[] = [];
  private notifications: TaskActivityResource[] = [];

  async loadMoreActivities () {
    this.offsetAct += this.LIMIT
    const currentSpace = this.$store.getters['space/activeSpace'] || {}
    const res = await api.get(
      `activities/space/${currentSpace.id}?type=content&offset=${this.offsetAct}&limit=${this.LIMIT}&${this.entityParameters}&${this.userIdParameter}`
    )
    this.activities = this.activities.concat(res.data.data)
    if (res.data.data.length === 0) {
      this.peakAct = true
    }
  }

  async loadMoreNotifications () {
    this.offsetNotif += this.LIMIT
    const currentSpace = this.$store.getters['space/activeSpace'] || {}
    const res = await api.get(
      `notifications/space/${currentSpace.id}?type=content&offset=${this.offsetNotif}&limit=${this.LIMIT}&${this.entityParameters}&${this.userIdParameter}`
    )
    this.notifications = this.notifications.concat(res.data.data)
    if (res.data.data.length === 0) {
      this.peakNotif = true
    }
  }

  async mounted () {
    await this.fetchNotifications()
    await this.fetchActivities()
  }

  async notificationActivityTrigger (visible: boolean) {
    if (visible) {
      await this.fetchActivities()
      await this.fetchNotifications()
    }
  }

  get entityParameters () {
    if (this.filters.length === 0) {
      return ''
    }
    return `entity=${this.filters.join(',')}`
  }

  get currentUser (): UserResource {
    return this.$store.state.auth.user
  }

  get userIdParameter () {
    if (!this.mineOnly) {
      return ''
    }
    return `userId=${this.currentUser.id}`
  }

  get showDot () {
    return this.notifications.length > 0
  }

  async fetchNotifications () {
    this.loadingNotifications = true
    this.offsetNotif = 0
    const currentSpace = this.$store.getters['space/activeSpace'] || {}
    const res = await api.get(
      `notifications/space/${currentSpace.id}?type=content&offset=${this.offsetNotif}&limit=${this.LIMIT}&${this.entityParameters}&${this.userIdParameter}`
    )
    this.notifications = res.data.data
    this.loadingNotifications = false
    if (res.data.data.length === 0) {
      this.peakNotif = true
      this.state = 'activities'
    }
  }

  async fetchActivities () {
    this.loadingActivities = true
    this.offsetAct = 0
    const currentSpace = this.$store.getters['space/activeSpace'] || {}
    const res = await api.get(
      `activities/space/${currentSpace.id}?type=content&offset=${this.offsetAct}&limit=${this.LIMIT}&${this.entityParameters}&${this.userIdParameter}`
    )
    this.activities = res.data.data
    this.loadingActivities = false
    if (res.data.data.length === 0) {
      this.peakAct = true
    }
  }

  naOpen (menu: string) {
    this.state = menu
  }

  async markAllSeen () {
    const currentSpace = this.$store.getters['space/activeSpace'] || {}

    await api.patch(
      `notifications/seen/space/${currentSpace.id}`
    )
    this.fetchNotifications()
  }

  async markRead (notif: ActivityResource, hider: Function) {
    if (notif.notification) {
      await api.patch(
        `notifications/seen/${notif.notification.join(',')}`
      )
      this.shouldHide(notif, hider)
      this.notifications = this.notifications.filter(n => n.id !== notif.id)
    }
  }

  async shouldHide (act: ActivityResource, hider: Function) {
    if (act.entity !== 'Folder' && act.entity !== 'TaskList' && act.action !== 'ARCHIVED') {
      hider()
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
      line-height: 19px;
      margin-left: 8px;
    }
  }
}

.activities-header {
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

.notification-activity {
  width: 480px;

  .notification-activity-header {
    .tab {
      @apply px-4;

      .active {
        color: #2C2B35;
      }
    }

    .action-lists {
      @apply flex absolute;

      bottom: 8px;
      right: 16px;

      span {
        @apply flex pr-3 pl-2 items-center;

        cursor: pointer;
        font-size: 12px;
        line-height: 14.32px;

        &:hover {
          color: theme("colors.primary.default");
        }
      }
    }
  }

  .notification-activity-content {
    min-height: 100px;
    max-height: calc(100vh - 75px);
    overflow-y: auto;

    .content-lists {
      .task-activity {
        padding: 1rem;
        border-bottom: 1px solid theme("colors.gray.100");
        margin-bottom: 0;
      }
    }
  }
}

.notif-activity-filters {
  @apply my-1 flex flex-col;

  width: 160px;

  .filter {
    @apply flex cursor-pointer;

    label {
      @apply px-4 py-1 w-full flex-grow cursor-pointer;

      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;

      .checkbox {
        margin-right: 8px;
      }
    }

    &:hover {
      background-color: #F8F9FD;

      .checkbox {
        border-color: theme("colors.gray.900");

        &:checked {
          border-color: theme("colors.primary.default");
        }
      }
    }
  }

  .divider {
    @apply my-1;

    border-top: 1px solid theme("colors.gray.100");
  }
}

.empty-list {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 12px;
  font-size: 14px;
  color: #444754;
}
.dot {
  width: 6px;
  height: 6px;
  background: #D83750;
  border-radius: 100%;
  position: relative;
  top: -8px;
  display: inline-block;
  padding: 0;
  margin: 0;
  &.more-left{
    left: -16px;
    top: -10px;
  }
}
.notification-activity .list-reset {
  padding-top: 11px;
}
</style>

<style lang="postcss">
.notification-activity-content {
  .content-lists {
    .task-activity {
      .time {
        font-size: 12px;
        margin-top: 8px;
        color: theme("colors.gray.900");
      }
    }

    .view-more-content {
      @apply flex pl-4 pt-2 pb-4;

      cursor: pointer;
    }
  }
}
</style>
