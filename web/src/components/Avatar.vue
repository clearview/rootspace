<template>
  <avatar
    :username="username"
    :src="image"
    :size="size"
    :customStyle="{
      backgroundPosition: 'center center'
    }"
  />
</template>

<script lang="ts">
import { UserResource } from '@/types/resource'
import { computed, defineComponent, PropType } from '@vue/composition-api'
import Avatar from 'vue-avatar'

export default defineComponent({
  components: {
    Avatar
  },
  props: {
    user: {
      type: Object as PropType<UserResource>,
      required: true
    },
    size: {
      type: Number,
      default: 24
    }
  },
  setup (props) {
    const username = computed(() => (
      (props.user.firstName + ' ' + props.user.lastName).trim()
    ))

    const image = computed(() => (
      props.user.avatar?.versions?.default?.location || ''
    ))

    return {
      username,
      image
    }
  }
})
</script>
