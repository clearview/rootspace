<template>
  <div class="task-activity">
    <div class="avatar">
      <avatar :username="'John Doe'" :size="32"></avatar>
    </div>
    <div class="content">
      <div class="title">
        <span class="actor">John Doe</span>&nbsp;
        <span class="action">added</span>&nbsp;
        <span class="object">Name Nameson</span>&nbsp;
        <span class="subject">to this card</span>
      </div>
      <div class="time">
        {{new Date() | formatDate}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { formatRelativeTo } from '@/utils/date'
import Avatar from 'vue-avatar'

@Component(
  {
    components: {
      Avatar
    },
    filters: {
      formatDate (date: Date | string) {
        const dueDate = date instanceof Date ? date : new Date(date)
        return formatRelativeTo(dueDate, new Date())
      }
    }
  }
)
export default class TaskActivity extends Vue {
}
</script>

<style lang="postcss" scoped>
.task-activity{
  display: flex;
  align-items: center;
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
