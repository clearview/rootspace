<template>
  <Popover top="48px" title="Add Member">
    <template>
      <div class="add-member">
        <v-input @input="search" placeholder="Search members" :value="memberInput" class="member-input"/>
        <ul class="members">
          <li class="member" v-for="(member, index) in filteredMembers" :key="index" @click="input(member)">
            <div class="member-name">
              <avatar :username="memberName(member)"></avatar>
              <span>{{ memberName(member) }}</span>
            </div>
          </li>
        </ul>
      </div>
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
import VInput from '@/components/InputIcon.vue'

@Component({
  name: 'MemberPopover',
  components: { Popover, Avatar, VInput }
})
export default class TagsPopover extends Vue {
    private memberInput = ''
    private memberList: Array<UserResource> = []

    mounted () {
      this.getSpaceMember()
    }

    get activeSpace () {
      return this.$store.getters['space/activeSpace'] || {}
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

    search (value: string) {
      this.memberInput = value
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
      const id = this.activeSpace.id
      const viewSpaceUsers = await SpaceService.spaceUsers(id)

      this.memberList = viewSpaceUsers.data
    }

    @Emit('input')
    input (member: object) {
      return member
    }
}
</script>

<style lang="postcss" scoped>
  .add-member {
    width: 240px;
    padding: 1rem;
    padding-top: 0;
  }

  .member-input {
    @apply py-2;
  }

  .members {
    @apply py-2;
    max-height: 30vh;
    overflow-y:auto;
  }

  .member {
    @apply p-2;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: theme("colors.gray.100");
    }
  }

  .member-name {
    .vue-avatar--wrapper {
      width: 20px !important;
      height: 20px !important;
      font: 10px / 20px Helvetica, Arial, sans-serif !important;
      float: left;
    }

    span {
      margin-left: 10px;
    }
  }
</style>
