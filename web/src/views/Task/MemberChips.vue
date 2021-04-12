<template>
  <div class="chips">
    <avatar
      v-for="(user, index) in list"
      :key="index"
      :user="user"
      class="chip"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import Avatar from '@/components/Avatar.vue'
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
