<template>
  <Popover top="48px">
    <template>
      <div class="member-input">
        <input type="text" placeholder="Search members" class="input" v-model="memberInput"/>
      </div>
      <ul class="members">
        <li class="member" v-for="(member, index) in filteredMembers" :key="index" @click="input(member)">
          <div class="member-name">
            <avatar :username="memberName(member)"></avatar>
            <span>{{ memberName(member) }}</span>
          </div>
        </li>
      </ul>
    </template>
    <template v-slot:trigger>
      <slot name="trigger"></slot>
    </template>
  </Popover>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import Popover from '@/components/Popover.vue'
import SpaceService from '@/services/space'
import { UserResource } from '@/types/resource'
import Avatar from 'vue-avatar'

  @Component({
    name: 'MemberPopover',
    components: { Popover, Avatar }
  })
export default class TagsPopover extends Vue {
    private memberInput = ''
    private memberList: Array<UserResource> = []

    mounted () {
      this.getSpaceMember()
    }

    get currentSpace () {
      return this.$store.state.auth.currentSpace || {}
    }

    get filteredMembers () {
      return this.memberList.filter(
        member => this.memberName(member).toLowerCase().indexOf(this.memberInput.toLowerCase()) !== -1
      )
    }

    // get isIntentNewTag () {
    //   const match = this.filteredMembers.find(tag => tag.label.toLowerCase() === this.memberInput.toLowerCase())
    //   return !match && this.memberInput.trim().length > 0
    // }

    memberName (member: UserResource) {
      return `${member.firstName} ${member.lastName}`
    }

    // async addMember () {
    //   await this.$store.dispatch('task/tag/create', {
    //     color: this.colorInput,
    //     label: this.tagInput
    //   } as TagResource)
    //   await this.$store.dispatch('task/tag/fetch', null)
    //   this.tagInput = ''
    // }

    async getSpaceMember () {
      const id = this.currentSpace.id
      const viewUserAtSpace = await SpaceService.userAtSpace(id)

      this.memberList = viewUserAtSpace.data
    }

    @Emit('input')
    input (member: object) {
      return member
    }
}
</script>

<style lang="postcss" scoped>
  .member-input {
    @apply p-2;
  }

  .members {
    @apply py-2;
    max-height: 30vh;
    overflow-y:auto;
  }

  .member {
    @apply py-2 px-6;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: theme("colors.gray.100");
    }
  }

  .member-name {
    @apply p-2 rounded;
    color: theme("colors.gray.900");

    .vue-avatar--wrapper {
      width: 30px !important;
      height: 30px !important;
      font: 10px / 20px Helvetica, Arial, sans-serif !important;
      margin-top: -5px;
      float: left;
    }

    span {
      margin-left: 10px;
    }
  }
</style>
