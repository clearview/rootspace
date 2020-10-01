<template>
  <div class="task-activity">
    <div class="avatar">
      <avatar :src="activity.actor.avatar && activity.actor.avatar.versions ? activity.actor.avatar.versions.default.location : ''" :username="`${activity.actor.firstName} ${activity.actor.lastName}`" :size="32"></avatar>
    </div>
    <div class="content">
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.AttachmentAdded">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action" v-if="activity.context && activity.context.length === 1">added an attachment to this task</span>&nbsp;
        <span class="action" v-else>added {{activity.context.length}} attachments to this task</span>&nbsp;
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.AttachmentRemoved">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action" v-if="activity.context && activity.context.length === 1">removed an attachment from this task</span>&nbsp;
        <span class="action" v-else>removed {{activity.context.length}} attachments from this task</span>&nbsp;
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.Updated">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;

        <span class="action" v-if="Object.keys(activity.context.new).length === 0">updated the task</span>&nbsp;
        <span class="action" v-else-if="activity.context.new.list">moved this task from <strong>{{activity.context.old.list.title}}</strong> to <strong>{{activity.context.new.list.title}}</strong></span>&nbsp;
        <span class="action" v-else-if="activity.context.new.position">reordered this task</span>&nbsp;
        <span class="action" v-else-if="activity.context.new.dueDate">updated the task due date to <strong>{{activity.context.new.dueDate | formatDueDate}}</strong></span>&nbsp;
        <span class="action" v-else-if="activity.context.new.dueDate === null">removed the task due date </span>
        <span class="action" v-else-if="activity.context.new.title">updated the task title to <strong>{{activity.context.new.title}}</strong></span>&nbsp;
        <span class="action" v-else-if="activity.context.new.title === null">removed the task title</span>
        <span class="action" v-else-if="activity.context.new.description">updated the task description</span>&nbsp;
        <span class="action" v-else-if="activity.context.new.description.length === 0">removed the task description</span>
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.TagAdded">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action">tagged this task with </span>&nbsp;
        <span class="subject" v-for="(tag, index) in contextWithoutLast" :key="tag.label">
          <strong>{{tag.label}}</strong><span v-if="index < contextWithoutLast.length - 1">, </span>
        </span>
        <span class="subject" v-if="activity.context && activity.context.length > 1"> and <strong>{{activity.context[activity.context.length-1].label}}</strong></span>
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.TagRemoved">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action"> removed tag </span>&nbsp;
        <span class="subject" v-for="(tag, index) in contextWithoutLast" :key="tag.label">
          <strong>{{tag.label}}</strong><span v-if="index < contextWithoutLast.length - 1">, </span>
        </span>
        <span class="subject" v-if="activity.context && activity.context.length > 1"> and <strong>{{activity.context[activity.context.length-1].label}}</strong></span>
        <span class="subject"> from this task</span>
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.AssigneeAdded">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action">assigned </span>&nbsp;
        <span class="subject" v-for="(assignee, index) in contextWithoutLast" :key="assignee.label">
          <strong>{{assignee.firstName}} {{assignee.lastName}}</strong><span v-if="index < contextWithoutLast.length - 1">, </span>
        </span>
        <span class="subject" v-if="activity.context && activity.context.length > 1"> and <strong>{{activity.context[activity.context.length-1].firstName}} {{activity.context[activity.context.length-1].lastName}}</strong></span>
        <span class="subject"> to this task</span>
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.AssigneeRemoved">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action">removed </span>&nbsp;
        <span class="subject" v-for="(assignee, index) in contextWithoutLast" :key="assignee.label">
          <strong>{{assignee.firstName}} {{assignee.lastName}}</strong><span v-if="index < contextWithoutLast.length - 1">, </span>
        </span>
        <span class="subject" v-if="activity.context && activity.context.length > 1"> and <strong>{{activity.context[activity.context.length-1].firstName}} {{activity.context[activity.context.length-1].lastName}}</strong></span>
        <span class="subject"> from this task</span>
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.CommentCreated">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action"> commented on this task</span>&nbsp;
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.CommentUpdated">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action"> updated a comment on this task</span>&nbsp;
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.CommentDeleted">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action"> removed a comment from this task</span>&nbsp;
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.Created">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action"> created this task</span>&nbsp;
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.Archived">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action"> archived this task</span>&nbsp;
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.Restored">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action"> restored this task</span>&nbsp;
      </div>
      <div class="title" v-if="activity.action === ACTIVITY_TYPE.Deleted">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action"> deleted this task</span>&nbsp;
      </div>
      <div class="time">
        <time :datetime="activity.createdAt" :title="activity.createdAt">
          {{activity.createdAt | formatDate}}
        </time>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatDueDate, formatRelativeTo } from '@/utils/date'
import Avatar from 'vue-avatar'
import { TaskActivityResource } from '@/types/resource'

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

  get contextWithoutLast () {
    if (this.activity.context) {
      if (this.activity.context.length === 1) {
        return this.activity.context
      } else {
        return [...this.activity.context].slice(0, this.activity.context.length - 1)
      }
    }
  }

  get ACTIVITY_TYPE () {
    return {
      Created: 'Created',
      Updated: 'Updated',
      Archived: 'Archived',
      Restored: 'Restored',
      Deleted: 'Deleted',
      AssigneeAdded: 'Assignee_Added',
      AssigneeRemoved: 'Assignee_Removed',
      CommentCreated: 'Comment_Created',
      CommentUpdated: 'Comment_Updated',
      CommentDeleted: 'Comment_Deleted',
      TagAdded: 'Tag_Added',
      TagRemoved: 'Tag_Removed',
      AttachmentAdded: 'Attachment_Added',
      AttachmentRemoved: 'Attachment_Removed'
    }
  }
}
</script>

<style lang="postcss" scoped>
.task-activity{
  display: flex;
  align-items: center;
  margin-bottom: 24px;
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
.actor, .object {
  font-weight: bold;
}
.unstrong {
  font-weight: normal;
}
</style>
