<template>
  <div class="activities">
    <div class="activity" v-for="(item, index) in value" :key="index">
      <div class="activity-content" v-html="formatActivity(item)"></div>
      <div class="activity-time">{{item.createdAt | elapsedTime}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { ActivityResource } from '@/types/resource'
import { textFormat } from '@/utils/textFormat'

@Component({
  filters: {
    elapsedTime (date: string) {
      return formatDistanceToNowStrict(parseISO(date), { addSuffix: true })
    },
    formatActivity (activity: ActivityResource) {
      return textFormat(activity).text
    }
  }
})
export default class Activities extends Vue {
  @Prop({ type: Array })
  readonly value!: ActivityResource[]

  formatActivity (activity: ActivityResource) {
    return textFormat(activity).text
  }
}
</script>

<style lang="postcss" scoped>
.activities {
  @apply overflow-auto;
}

.activity {
  @apply py-4;

  & + & {
    border-top: 1px solid #EDEFF3;
  }
}

</style>
