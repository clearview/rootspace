<template>
  <portal to="default">
    <div class="modal">
      <div class="p-4 bg-white rounded-lg" v-if="loading">
        <legacy-icon v-if="loading" name="loading" size="5em" viewbox="100"/>
      </div>

      <div class="modal-inner" v-else>
        <header>
          <Avatar
            :src="user.avatar.location"
            :username="user | showFullName"
            :size="96"
          />
          <h2 class="text-lg font-bold mt-4">{{ user | showFullName }}</h2>
          <p class="font-grey-900 mt-2">{{ user.email }}</p>
        </header>

        <main>
          <h3 class="text-base font-bold mb-2">Activities</h3>

          <div class="activities-container">
            <Activities :value="activities" />

            <button v-if="canLoadMore" class="btn btn-mute w-full" @click="fetchMoreActivities">View More</button>
          </div>
        </main>
      </div>
    </div>
  </portal>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import Avatar from 'vue-avatar'
import { ActivityResource, UserResource } from '@/types/resource'
import SpaceMixin from '@/mixins/SpaceMixin'
import ActivityService from '@/services/activity'
import Activities from '@/components/Activities.vue'
import UserService from '@/services/user'

@Component({
  components: {
    Avatar,
    Activities
  },
  filters: {
    showFullName (user: UserResource) {
      return user.firstName + ' ' + user.lastName
    }
  }
})
export default class ModalProfile extends Mixins(SpaceMixin) {
  loading = false
  offset = 0
  canLoadMore = true
  activities: ActivityResource[] = []
  user: UserResource = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    hasRole: false,
    hasRoleId: 1
  }

  @Prop({ type: Number })
  userId!: number

  async created () {
    this.loading = true

    await Promise.all([
      this.fetchActivities(),
      this.fetchProfile()
    ])

    this.loading = false
  }

  async fetchActivities () {
    this.activities = await ActivityService.bySpace(this.activeSpace.id, {
      userId: this.userId
    })
  }

  async fetchMoreActivities () {
    const offset = this.offset + 10

    const activities = await ActivityService.bySpace(this.activeSpace.id, {
      userId: this.userId,
      offset
    })

    if (activities.length) {
      this.offset = offset
      this.activities = [
        ...this.activities,
        ...activities
      ]
    } else {
      this.canLoadMore = false
    }
  }

  async fetchProfile () {
    this.user = await UserService.getProfile(this.userId)
  }
}
</script>

<style lang="postcss" scoped>
.modal-inner {
  @apply flex flex-col items-center relative;

  width: 472px;
  height: 100%;
  max-height: calc(100vh - 6rem);
  overflow: hidden;
}

.modal-inner:before {
  @apply block absolute;

  top: -40px;

  content: '';
  height: 147px;
  width: 550px;
  margin: 0 auto;
  background-color: #4574D3;
  border-radius: 100%;
  z-index: 0;
}

header {
  @apply flex flex-col items-center z-10;

  padding: 40px 40px 0 40px;
}

main {
  @apply flex flex-col w-full overflow-hidden;

  padding: 40px;
}

.activities-container {
  @apply overflow-auto;
}
</style>
