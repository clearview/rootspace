<template>
  <div class="activities">
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="{
        'activity': 'true',
        'is-clickable': item.link
      }"
      @click="open(item)"
    >
      <div class="activity-content" v-html="item.content"></div>
      <div class="activity-time">{{item.time}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api'
import { Location } from 'vue-router'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { ActivityResource } from '@/types/resource'
import { textFormat } from '@/utils/textFormat'
import { getEntityLink } from '@/utils/activity'

interface ActivityItem {
  link: Location | string;
  content: string;
  time: string;
}

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<ActivityResource[]>,
      default: () => ([])
    }
  },
  setup (props, { emit, root }) {
    const list = computed<ActivityItem[]>(() => props.value.map(
      (item) => ({
        link: getEntityLink(item),
        content: textFormat(item).text,
        time: formatDistanceToNowStrict(parseISO(item.createdAt), { addSuffix: true })
      })
    ))

    const open = (item: ActivityItem) => {
      if (!item.link) return

      emit('click', item)
      root.$router.push(item.link)
    }

    return {
      list,
      open
    }
  }
})
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

  &:hover {
    background-color: #F8F9FD;
  }

  &.is-clickable {
    @apply cursor-pointer;
  }
}
</style>
