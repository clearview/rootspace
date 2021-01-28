<template>
  <base-modal :size="472" v-on="$listeners">
    <template #header>
      <Avatar
        :src="user | userImageLocation"
        :username="user | userFullName"
        :size="96"
      />
      <h2 class="text-lg font-bold mt-4">{{ user | userFullName }}</h2>
      <p class="font-grey-900 mt-2">{{ user.email }}</p>
    </template>

    <h3 class="text-base font-bold mb-2">Activities</h3>

    <div class="activities-container">
      <Activities :value="activities" />

      <button v-if="canLoadMore" class="btn btn-mute w-full" @click="fetchMoreActivities">View More</button>
    </div>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Avatar from 'vue-avatar'
import Activities from '@/components/Activities.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import Icon from '@/components/icon/Icon.vue'
import ActivityService from '@/services/activity.ts'
import UserService from '@/services/user'
import { ActivityResource, UserResource } from '@/types/resource.ts'

const spaceStore = createNamespacedHelpers('space')

export default defineComponent({
  components: {
    Avatar,
    Activities,
    BaseModal,
    Icon
  },
  props: {
    userId: Number
  },
  filters: {
    userFullName (user: UserResource) {
      return user.firstName + ' ' + user.lastName
    },
    userImageLocation (user: UserResource) {
      return user.avatar?.versions?.default?.location || ''
    }
  },
  setup (props) {
    const loading = ref(false)
    const offset = ref(0)
    const canLoadMore = ref(true)
    const activities = ref<ActivityResource[]>([])
    const { activeSpace } = spaceStore.useGetters(['activeSpace'])
    const user = ref<UserResource>({
      id: 0,
      email: '',
      firstName: '',
      lastName: ''
    })

    const fetchActivities = async () => {
      if (!props.userId) {
        throw new Error('User ID is undefined')
      }

      if (!activeSpace.value) {
        throw new Error('Space ID is undefined')
      }

      activities.value = await ActivityService.bySpace(activeSpace.value.id, {
        userId: props.userId
      })
    }

    const fetchMoreActivities = async () => {
      const params = {
        userId: props.userId,
        offset: offset.value + 10
      }

      const res = await ActivityService.bySpace(activeSpace.value.id, params)

      if (res.length) {
        offset.value = params.offset
        activities.value = [
          ...activities.value,
          ...res
        ]
      } else {
        canLoadMore.value = false
      }
    }

    const fetchProfile = async () => {
      if (!props.userId) {
        throw new Error('User ID is undefined')
      }

      user.value = await UserService.getProfile(props.userId)
    }

    onMounted(async () => {
      loading.value = false

      await Promise.all([
        fetchActivities(),
        fetchProfile()
      ])

      loading.value = true
    })

    return {
      loading,
      offset,
      canLoadMore,
      activities,
      user,
      fetchMoreActivities
    }
  }
})
</script>

<style lang="postcss" scoped>
::v-deep {
  .card {
    @apply relative;
    @apply bg-no-repeat bg-top;

    background-image: url('data:image/png;base64,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');
  }

  .card-header {
    @apply relative flex-col items-center;
    @apply overflow-hidden;

    margin-top: 7px;
  }

  .close {
    @apply absolute top-0 right-0;
    @apply text-white;
  }
}
</style>
