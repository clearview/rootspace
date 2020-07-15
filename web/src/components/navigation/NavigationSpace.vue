<template>
  <transition name="menu">
    <div
      v-if="value"
      v-click-outside="() => $emit('input', false)"
      class="nav-menu"
    >
      <div
        v-for="(item, key) in spaces"
        class="nav-menu-item"
        :class="{ 'nav-menu-item--active': key === spaceActiveIndex }"
        :key="key"
        @click="select(item)"
      >
        <div class="nav-menu-item-content">
          <div class="nav-menu-item-logo">
            <img
              srcset="
                @/assets/images/space.png 1x,
                @/assets/images/space@2x.png 2x
              "
              src="@/assets/images/space.png"
              alt="Space"
            >
          </div>
          <div class="nav-menu-item-label">
            <strong
              class="truncate"
              v-text="item.title"
            />
            <span class="text-gray-400">
              {{item.countMembers}}
              <span v-if="item.countMembers > 1">members</span>
              <span v-else>member</span>
            </span>
          </div>
        </div>

        <div class="nav-menu-item-check">
          <svg
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 1L4.125 7.875L1 4.75"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

        </div>
      </div>

      <button class="nav-menu-create" @click="$emit('add')">
        <v-icon name="plus" />
        <span>Add New Space</span>
      </button>

      <button
        class="nav-menu-logout"
        @click="signout"
      >
        <strong>Logout</strong>
        <span>({{ user.email }})</span>
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import { SpaceResource } from '@/types/resource'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'NavigationSpace'

})
export default class NavigationSpace extends Vue {
  @Prop({ type: Boolean })
  private readonly value!: boolean;

  get user () {
    return this.$store.state.auth.user || {}
  }

  get spaceActiveIndex () {
    return this.$store.state.space.activeIndex
  }

  get spaces () {
    return this.$store.state.space.spaces
  }

  async select (space: SpaceResource) {
    this.$store.commit('space/setActive', { space })
    this.$emit('input', null)

    const { activePage } = this.$store.getters['space/activeSpaceMeta']

    try {
      await this.$router.push(activePage || '/')
    } catch { }
  }

  signout () {
    this.$store.dispatch('auth/signout')
  }

  async created () {
    await this.$store.dispatch('space/fetch')
  }
}
</script>
