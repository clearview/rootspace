<template>
  <div>
    <v-alert v-model="alert" />
    <v-alert v-model="secondAlert" class="mx-4" />

    <div class="main-container">
      <h1>Welcome to {{ currentSpace.title }}</h1>

      <div class="row">
        <div>
          <div class="subtitle">
            <h2>Notifications</h2>
            <div class="action-lists">
              <span @click="markAllSeen">
                <mono-icon name="check" class="pr-1" />
                Mark all as read
              </span>
              <Popover
                :with-close="false"
                position="bottom-end"
                :sub="true">
                <template #default>
                  <div class="notif-activity-filters">
                    <div class="filter">
                      <label><input type="checkbox" id="link" value="link" class="checkbox" v-model="notificationFilters">Link</label>
                    </div>
                    <div class="filter">
                      <label><input type="checkbox" id="embed" value="embed" class="checkbox" v-model="notificationFilters">Embed</label>
                    </div>
                    <div class="filter">
                      <label><input type="checkbox" id="taskboard" value="taskboard,tasklist,task" class="checkbox" v-model="notificationFilters">Task Board</label>
                    </div>
                    <div class="filter">
                      <label><input type="checkbox" id="document" value="doc" class="checkbox" v-model="notificationFilters">Document</label>
                    </div>
                    <div class="divider"></div>
                    <div class="filter">
                      <label><input type="checkbox" id="myactivities" value="myactivities" class="checkbox" v-model="notificationMineOnly">My Activities</label>
                    </div>
                  </div>
                </template>
                <template #trigger="{ visible }">
                  <span :class="{'btn-link-primary': visible}">
                    <mono-icon name="filter" class="pr-1" />
                    Filter
                  </span>
                </template>
              </Popover>
            </div>
          </div>
          <div>
            <div v-if="loadingNotifications">
              <ActivityListLoader v-for="index in 2" :key="index"></ActivityListLoader>
            </div>
            <div v-else>
              <div class="empty-list" v-if="!loadingNotifications && notifications.length === 0">
                No notifications
              </div>
              <ActivityList v-for="notif in notifications" :activity="notif" :key="notif.id" @click.native="markRead(notif, hide)"></ActivityList>
              <div v-if="loadingMoreNotifications">
                <ActivityListLoader></ActivityListLoader>
              </div>
              <div class="view-more" v-if="!loadingMoreNotifications && hasMoreNotifications">
                <div class="view-more-content" @click="fetchMoreNotifications">
                  <legacy-icon class="more-icon" name="down" viewbox="32" size="20px"></legacy-icon>
                  <span class="more-label">
                    View More
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="subtitle">
            <h2>Activities</h2>
            <div class="action-lists">
              <Popover
                :with-close="false"
                position="bottom-end"
                :sub="true">
                <template #default>
                  <div class="notif-activity-filters">
                    <div class="filter">
                      <label><input type="checkbox" id="link" value="link" class="checkbox" v-model="activityFilters">Link</label>
                    </div>
                    <div class="filter">
                      <label><input type="checkbox" id="embed" value="embed" class="checkbox" v-model="activityFilters">Embed</label>
                    </div>
                    <div class="filter">
                      <label><input type="checkbox" id="taskboard" value="taskboard,tasklist,task" class="checkbox" v-model="activityFilters">Task Board</label>
                    </div>
                    <div class="filter">
                      <label><input type="checkbox" id="document" value="doc" class="checkbox" v-model="activityFilters">Document</label>
                    </div>
                    <div class="divider"></div>
                    <div class="filter">
                      <label><input type="checkbox" id="myactivities" value="myactivities" class="checkbox" v-model="activityMineOnly">My Activities</label>
                    </div>
                  </div>
                </template>
                <template #trigger="{ visible }">
                  <span :class="{'btn-link-primary': visible}">
                    <mono-icon name="filter" class="pr-1" />
                    Filter
                  </span>
                </template>
              </Popover>
            </div>
          </div>
          <div>
            <div v-if="loadingActivities">
              <ActivityListLoader v-for="index in 2" :key="index"></ActivityListLoader>
            </div>
            <div v-else>
              <div class="empty-list" v-if="!loadingActivities && activities.length === 0">
                No activities
              </div>
              <ActivityList v-for="act in activities" :activity="act" :key="act.id" @click.native="shouldHide(act, hide)"></ActivityList>
              <div v-if="loadingMoreActivities">
                <ActivityListLoader></ActivityListLoader>
              </div>
              <div class="view-more" v-if="!loadingMoreActivities && hasMoreActivities">
                <div class="view-more-content" @click="fetchMoreActivities">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { ActivityResource, TaskActivityResource, UserResource } from '@/types/resource'
import { Route } from 'vue-router'
import { isEmpty } from 'lodash/fp'
import api from '@/utils/api'

import ActivityList from '@/components/sidebar/header/ActivityList.vue'
import ActivityListLoader from '@/components/sidebar/header/ActivityListLoader.vue'
import PageMixin from '@/mixins/PageMixin'
import Popover from '@/components/Popover.vue'
import SpaceMixin from '@/mixins/SpaceMixin'
import VAlert from '@/components/Alert.vue'

type AlertData = {
  type: string;
  message: string;
  noicon: boolean;
}

@Component({
  components: {
    ActivityList,
    ActivityListLoader,
    VAlert,
    Popover
  }
})
export default class Blank extends Mixins(PageMixin, SpaceMixin) {
  readonly LIMIT = 10

  private alert: AlertData | null = null
  private secondAlert: AlertData | null = null
  private activities: TaskActivityResource[] = [];
  private notifications: TaskActivityResource[] = [];
  private notificationFilters = []
  private activityFilters = []
  private notificationMineOnly = false
  private activityMineOnly = false
  private offsetAct = 0
  private offsetNotif = 0
  private hasMoreActivities = false
  private hasMoreNotifications = false
  private loadingActivities = false;
  private loadingNotifications = false;
  private loadingMoreActivities = false;
  private loadingMoreNotifications = false;

  async created () {
    const query = this.$route.query

    if (query.from === 'invitation' && query.accept === '1') {
      this.alert = {
        type: 'success',
        message: `Welcome to ${this.activeSpace.title}, you are invited to this space`,
        noicon: true
      }
    }
    if (query.from === 'document' && query.message) {
      this.secondAlert = {
        type: 'danger',
        message: `${query.message}`,
        noicon: true
      }
    }

    await this.$nextTick()

    this.pageTitle = null
    this.pageReady = true
  }

  async mounted () {
    this.fetchNotifications()
    this.fetchActivities()
  }

  @Watch('$route')
  watchRoute (newval: Route) {
    if (isEmpty(newval.query)) {
      this.alert = null
    }
  }

  @Watch('notificationFilters')
  @Watch('notificationMineOnly')
  refetchNotificationOnFiltersChanged () {
    this.fetchNotifications()
  }

  @Watch('activityFilters')
  @Watch('activityMineOnly')
  refetchActivitiesOnFiltersChanged () {
    this.fetchActivities()
  }

  @Watch('currentSpace')
  resetNotificationsActivities () {
    this.fetchNotifications()
    this.fetchActivities()
  }

  get currentSpace () {
    return this.$store.getters['space/activeSpace'] || {}
  }

  get currentUser (): UserResource {
    return this.$store.state.auth.user
  }

  get notificationUserIdParameter () {
    if (!this.notificationMineOnly) {
      return ''
    }
    return `userId=${this.currentUser.id}`
  }

  get activityUserIdParameter () {
    if (!this.activityMineOnly) {
      return ''
    }
    return `userId=${this.currentUser.id}`
  }

  get notificationEntityParameters () {
    if (this.notificationFilters.length === 0) {
      return ''
    }
    return `entity=${this.notificationFilters.join(',')}`
  }

  get activityEntityParameters () {
    if (this.activityFilters.length === 0) {
      return ''
    }
    return `entity=${this.activityFilters.join(',')}`
  }

  async markAllSeen () {
    await api.patch(
      `notifications/seen/space/${this.currentSpace.id}`
    )
    this.fetchNotifications()
  }

  async fetchNotifications () {
    this.loadingNotifications = true
    this.offsetNotif = 0
    const res = await api.get(
      `notifications/space/${this.currentSpace.id}?type=content&offset=${this.offsetNotif}&limit=${this.LIMIT}&${this.notificationEntityParameters}&${this.notificationUserIdParameter}`
    )
    this.notifications = res.data.data
    this.loadingNotifications = false

    if (res.data.data.length === 0) {
      this.hasMoreNotifications = false
    } else {
      this.fetchMoreNotifications({ updateData: false })
    }
  }

  async fetchMoreNotifications ({ updateData = true }) {
    if (updateData) {
      this.loadingMoreNotifications = true
    }
    this.hasMoreNotifications = false
    const offset = this.offsetNotif + this.LIMIT
    const res = await api.get(
      `notifications/space/${this.currentSpace.id}?type=content&offset=${offset}&limit=${this.LIMIT}&${this.notificationEntityParameters}&${this.notificationUserIdParameter}`
    )

    if (updateData) {
      this.offsetNotif = offset
      this.loadingMoreNotifications = false
      this.notifications = this.notifications.concat(res.data.data)
    }

    if (res.data.data.length === 0) {
      this.hasMoreNotifications = false
    } else if (updateData) {
      this.fetchMoreNotifications({ updateData: false })
    } else {
      this.hasMoreNotifications = true
    }
  }

  async fetchActivities () {
    this.loadingActivities = true
    this.offsetAct = 0
    const res = await api.get(
      `activities/space/${this.currentSpace.id}?type=content&offset=${this.offsetAct}&limit=${this.LIMIT}&${this.activityEntityParameters}&${this.activityUserIdParameter}`
    )
    this.activities = res.data.data
    this.loadingActivities = false

    if (res.data.data.length === 0) {
      this.hasMoreActivities = false
    } else {
      this.fetchMoreActivities({ updateData: false })
    }
  }

  async fetchMoreActivities ({ updateData = true }) {
    if (updateData) {
      this.loadingMoreActivities = true
    }
    this.hasMoreActivities = false
    const offset = this.offsetAct + this.LIMIT
    const res = await api.get(
      `activities/space/${this.currentSpace.id}?type=content&offset=${offset}&limit=${this.LIMIT}&${this.activityEntityParameters}&${this.activityUserIdParameter}`
    )

    if (updateData) {
      this.offsetAct = offset
      this.loadingMoreActivities = false
      this.activities = this.activities.concat(res.data.data)
    }

    if (res.data.data.length === 0) {
      this.hasMoreActivities = false
    } else if (updateData) {
      this.fetchMoreActivities({ updateData: false })
    } else {
      this.hasMoreActivities = true
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
p {
  @apply text-base;
  color: theme("colors.gray.400");
}

.row {
  display: grid;
  grid-template-columns: 480px 480px;
  column-gap: 30px;
}

.view-more-content {
  @apply flex;

  cursor: pointer;
  padding-bottom: 30px;
}

.popover-trigger {
  display: flex;
}

.subtitle {
  margin-top: 40px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: solid 1px theme("colors.gray.100");
  position: relative;

  h2 {
    @apply font-bold text-base;
  }
}

.action-lists {
  margin-left: 10px;
  position: absolute;
  right: 0;
  top: 7px;
  display: flex;

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
</style>
