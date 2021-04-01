<template>
  <div class="chips">
    <avatar
      v-for="(username, index) in usernames"
      class="chip"
      :key="index"
      :username="username"
      :size="size"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api'
import Avatar from 'vue-avatar'
import { UserResource } from '@/types/resource'

export default defineComponent({
  name: 'MemberChips',
  components: {
    Avatar
  },
  props: {
    list: {
      type: Array as PropType<UserResource[]>,
      default: () => ([])
    },
    size: {
      type: Number,
      default: 24
    }
  },
  setup (props) {
    const usernames = computed(() => props.list.map(
      (item) => item.firstName + ' ' + item.lastName
    ))

    return {
      usernames
    }
  }
})
</script>

<style lang="postcss" scoped>
.chips {
  display: flex;
  flex-flow: row;
  align-items: center;
}

.chip {
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.chip + .chip {
  margin-left: -5px;
}
</style>
