<template>
  <div class="task-activity">
    <div class="avatar">
      <avatar :src="activity.actor.avatar && activity.actor.avatar.versions ? activity.actor.avatar.versions.default.location : ''" :username="`${activity.actor.firstName} ${activity.actor.lastName}`" :size="32"></avatar>
    </div>
    <div class="content">
      <div class="title">
        <span class="actor">{{ activity.actor.firstName }} {{activity.actor.lastName}}</span>&nbsp;
        <span class="action">{{ activity.action | formatAction}}</span>&nbsp;
        <span class="object"></span>&nbsp;
        <span class="subject" v-if="activity.action === 'Updated' || activity.action === 'Created'">this card</span>
        <span class="subject" v-else-if="activity.action === 'Tag_Removed'">from this card</span>
        <span class="subject" v-else>to this card</span>
      </div>
      <div class="time">
        {{activity.createdAt | formatDate}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatRelativeTo } from '@/utils/date'
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
      formatAction (action: string) {
        return action.split('_').reverse().join(' ').toLowerCase()
      }
    }
  }
)
export default class TaskActivity extends Vue {
  @Prop({ type: Object, required: true })
  private readonly activity!: TaskActivityResource;
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
</style>
