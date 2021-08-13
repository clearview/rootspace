<template>
  <component id="actvity-list" class="task-activity" :is="rootComponent" v-bind="rootBindings">
    <div class="avatar">
      <avatar
        v-if="activity.actor"
        :src="activity.actor.avatar && activity.actor.avatar.versions ?
          activity.actor.avatar.versions.default.location : ''"
        :username="`${activity.actor.firstName} ${activity.actor.lastName}`"
        :size="32">
      </avatar>
    </div>
    <div class="content">
      <div class="title" v-html="formatActivity(activity)"></div>
      <div class="time">
        <time :datetime="activity.createdAt" :title="activity.createdAt">
          {{activity.createdAt | formatDate}}
        </time>
      </div>
    </div>
  </component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatDueDate, formatRelativeTo } from '@/utils/date'
import Avatar from 'vue-avatar'
import { ActivityResource, TaskActivityResource } from '@/types/resource'
import { Dictionary, Location } from 'vue-router/types/router'
import textFormat from '@/utils/textFormat'

export const nodeRouteNames: any = {
  Link: 'Link',
  Doc: 'Novadoc',
  TaskBoard: 'TaskPage',
  Task: 'TaskPageWithItem',
  Embed: 'Embed',
  Folder: '',
  Storage: 'Storage'
} as const

@Component(
  {
    components: {
      Avatar
    },
    filters: {
      formatDate (date: Date | string) {
        const dueDate = date instanceof Date ? date : new Date(date)
        return formatRelativeTo(dueDate, new Date())
      },
      formatDueDate (date: Date | string) {
        const dueDate = date instanceof Date ? date : new Date(date)
        return formatDueDate(dueDate, new Date())
      }
    }
  }
)
export default class TaskActivity extends Vue {
  @Prop({ type: Object, required: true })
  private readonly activity!: TaskActivityResource;

  formatActivity (data: ActivityResource) {
    const userID = this.currentUser.id
    return textFormat(data, userID).text
  }

  get currentUser () {
    return this.$store.state.auth.user
  }

  async mounted () {
  }

  get to (): Location {
    const { entityId, context } = this.activity

    const name = nodeRouteNames[this.activity.entity]
    const params: Dictionary<string> = {}

    switch (this.activity.entity) {
      case 'Task': {
        params.id = context.entity?.boardId?.toString()
        params.slug = context.entity?.slug?.toString()
        params.item = entityId.toString()
        break
      }
      case 'Doc': {
        params.id = entityId.toString()
        params.slug = context.entity.slug?.toString()
        break
      }
      default: {
        params.id = entityId.toString()
        break
      }
    }

    return { name, params }
  }

  get linkable () {
    return this.activity.entity !== 'Folder' && this.activity.entity !== 'TaskList' && this.activity.action !== 'Archived'
  }

  get rootComponent () {
    if (this.activity.entity === 'Link') {
      return 'a'
    }
    return this.linkable ? 'router-link' : 'div'
  }

  get rootBindings () {
    if (this.rootComponent === 'a') {
      return {
        href: this.activity.context.entity.value,
        target: '_blank',
        rel: 'noopener nofollower'
      }
    }
    if (this.rootComponent === 'router-link') {
      return {
        to: this.to
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.task-activity{
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  &:hover{
    background: #F8F9FD;
  }
}

.avatar{

}

.content{
  margin-left: 8px;
  font-size: 14px;
  line-height: 17px;
  color: theme("colors.gray.900");
}
.time {
  margin-top: 2px;
  color: theme("colors.gray.800");
}
.debug {
  overflow-y: hidden;
  background: #eee;
  padding: 2px;
}
</style>

<style lang="postcss">
#actvity-list .actor {
  font-weight: bold;
}
#actvity-list a {
  text-decoration: underline;
}
</style>
