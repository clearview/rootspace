<template>
  <base-modal :size="528" v-on="$listeners">
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

    <Activities
      class="mb-2"
      :value="activities"
      @click="$emit('close')"
    />

    <button v-if="canLoadMore" class="btn btn-mute w-full" @click="fetchMoreActivities">View More</button>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Avatar from 'vue-avatar'
import Activities from '@/components/Activities.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import ActivityService from '@/services/activity.ts'
import UserService from '@/services/user'
import { ActivityResource, UserResource } from '@/types/resource.ts'

const spaceStore = createNamespacedHelpers('space')

export default defineComponent({
  components: {
    Avatar,
    Activities,
    BaseModal
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
      lastName: '',
      hasRole: false,
      hasRoleId: 1
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

    &:before {
      position: absolute;
      top: -40px;
      left: -40px;
      content: '';
      display: block;
      width: calc(100% + 80px);
      height: 147px;
      background-color: #4574D3;
      border-radius: 100%;

      clip-path: inset(40px 40px 0 40px round 8px);
    }
  }

  .card-header {
    @apply relative flex-col items-center;
    @apply overflow-hidden;
  }

  .close {
    @apply absolute top-0 right-0;
    @apply text-white;
  }
}
</style>
