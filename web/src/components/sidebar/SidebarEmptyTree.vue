<template>
  <div class="flex justify-center">
    <div class="empty-content">
      <div class="space-logo">
        <img
          v-if="activeSpace.avatar"
          :src="activeSpace.avatar.versions.default.path"
          alt="Space"
        >
        <img src="@/assets/images/default-space.png" alt="Space Logo" v-else>
      </div>
      <h3>Welcome to your Space</h3>
      <p>Here you can create different types of content,
        start by creating your first content on Root</p>

      <button class="btn add-button flex-grow">
        Add New
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

import {
  SpaceResource
} from '@/types/resource'

@Component({
  name: 'SidebarHeader'
})

export default class SidebarHeader extends Vue {
  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }
}
</script>

<style lang="postcss" scoped>
.empty-content {
  @apply flex flex-col relative;

  padding: 36px 24px 16px 24px;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 44px;
  background-color: #EFF1F6;
  width: 272px;

  h3 {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    text-align: center;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    margin-bottom: 16px;
  }

  button {
    @apply w-full;

    background-color: #EFF1F6;
    font-size: 14px;
    line-height: 17px;

    &:hover {
      background-color: #F8F9FD;
    }
  }

  .space-logo {
    @apply absolute;

    background-color: #EFF1F6;
    padding: 12px;
    top: -38px;
    border-radius: 56px;
    border: 5px solid #FFF;
    right: 108px;

    img {
      width: 32px;
      height: 32px;
      border-radius: 32px;
    }
  }
}
</style>
