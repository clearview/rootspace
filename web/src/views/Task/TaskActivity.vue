<template>
  <div class="task-activity">
    <div class="avatar">
      <avatar :src="activity.actor.avatar && activity.actor.avatar.versions ? activity.actor.avatar.versions.default.location : ''" :username="`${activity.actor.firstName} ${activity.actor.lastName}`" :size="32"></avatar>
    </div>
    <div class="content">
      <div class="title">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;

        <span class="action" v-if="activity.action === ACTIVITY_TYPE.Created"> created this task</span>
        <span class="action" v-if="activity.action === ACTIVITY_TYPE.Archived"> archived this task</span>
        <span class="action" v-if="activity.action === ACTIVITY_TYPE.Restored"> restored this task</span>

        <template v-if="activity.action === ACTIVITY_TYPE.Updated">
          <span class="action" v-if="activity.context.updatedAttributes.length === 0"> updated this task</span>
          <template v-if="activity.context.updatedAttributes.length === 1" >
            <span class="action" v-for="(attribute) in activity.context.updatedAttributes" :key="attribute">
              <span v-if="attribute === 'title'">updated the task title to <strong>{{activity.context.updatedEntity.title}}</strong></span>
              <span v-else-if="attribute === 'description'">updated description</span>
              <span v-else-if="attribute === 'dueDate'">
                <span v-if="activity.context.updatedEntity.dueDate !== null">updated the task due date to <strong>{{activity.context.updatedEntity.dueDate | formatDueDate}}</strong></span>
                <span v-else>removed the task due date </span>
              </span>
            </span>
          </template>
          <template v-if="activity.context.updatedAttributes.length > 1" >
            <ul class="action" v-for="(attribute) in activity.context.updatedAttributes" :key="attribute">
              <li v-if="attribute === 'title'">Updated the task title to <strong>{{activity.context.updatedEntity.title}}</strong></li>
              <li v-else-if="attribute === 'description'">Updated description</li>
              <li v-else-if="attribute === 'dueDate'">
                <span v-if="activity.context.updatedEntity.dueDate !== null">Updated the task due date to <strong>{{activity.context.updatedEntity.dueDate | formatDueDate}}</strong></span>
                <span v-else>removed the task due date </span>
              </li>
            </ul>
          </template>
        </template>

        <span class="action" v-if="activity.action === ACTIVITY_TYPE.ListMoved"> moved this task from <strong>{{activity.context.fromList.title}}</strong> to <strong>{{activity.context.toList.title}}</strong></span>

        <span class="action" v-if="activity.action === ACTIVITY_TYPE.CommentCreated"> commented on this task</span>

        <span class="action" v-if="activity.action === ACTIVITY_TYPE.AssigneeAdded">
          <span>assigned</span>&nbsp;
          <span v-html="assignees"></span>
          <span class="subject"> to this task</span>
        </span>

        <span class="action" v-if="activity.action === ACTIVITY_TYPE.AssigneeRemoved">
          <span>removed</span>&nbsp;
          <span v-html="assignees"></span>
          <span class="subject"> from this task</span>
        </span>

        <span class="action" v-if="activity.action === ACTIVITY_TYPE.TagAdded">
          <span>tagged this task with</span>&nbsp;
          <span v-html="tags"></span>
        </span>

        <span class="action"  v-if="activity.action === ACTIVITY_TYPE.TagRemoved">
          <span>removed tag</span>&nbsp;
          <span v-html="tags"></span>
          <span class="subject"> from this task</span>
        </span>

        <span class="action" v-if="activity.action === ACTIVITY_TYPE.AttachmentAdded">
          <span v-if="activity.context && activity.context.attachment.length === 1">added an attachment to this task</span>
          <span v-else>added {{activity.context.attachment.length}} attachments to this task</span>
        </span>

        <span class="action" v-if="activity.action === ACTIVITY_TYPE.AttachmentRemoved">
          <span v-if="activity.context && activity.context.attachment.length === 1">removed an attachment from this task</span>
          <span v-else>removed {{activity.context.attachment.length}} attachments from this task</span>
        </span>
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

  get assignees () {
    return this.getContextListOutput('assignee', 'fullName', 'strong')
  }

  get tags () {
    return this.getContextListOutput('tag', 'label', 'strong')
  }

  getContextListOutput (listName: string, property: string, tag: string) {
    if (!this.activity.context || !this.activity.context[listName]) {
      return ''
    }

    const list = this.activity.context[listName]

    if (list.length === 0) {
      return ''
    }

    const last = `<${tag}>` + list.pop()[property] + `</${tag}>`

    if (list.length === 0) {
      return last
    }

    const entries = []

    for (const item of list) {
      entries.push(`<${tag}>` + item[property] + `</${tag}>`)
    }

    return entries.join(', ') + ' and ' + last
  }

  get ACTIVITY_TYPE () {
    return {
      Created: 'Created',
      Updated: 'Updated',
      Archived: 'Archived',
      Restored: 'Restored',
      Deleted: 'Deleted',
      ListMoved: 'List_Moved',
      CommentCreated: 'Comment_Created',
      AssigneeAdded: 'Assignee_Added',
      AssigneeRemoved: 'Assignee_Removed',
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
