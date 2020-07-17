<template>
  <Popover top="48px" title="Add Member">
    <template>
      <div class="add-member">
        <v-input @input="search" placeholder="Search members" :value="memberInput" class="member-input"/>
        <ul class="members">
          <li class="member" v-for="(member, index) in filteredMembers" :key="index" @click="input(member)">
            <div class="member-name" :class="{selected : isSelectedTag(member)}">
              <avatar :username="memberName(member)"></avatar>
              <span>{{ memberName(member) }}</span>
              <span class="icon-checkmark"><v-icon size="1.2rem" name="checkmark" viewbox="18" /></span>
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
import { Component, Emit, Vue, Prop } from 'vue-property-decorator'
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
  @Prop({ type: Array, required: true })
  private readonly selectedMembers!: UserResource[];

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

  memberName (member: UserResource) {
    return `${member.firstName} ${member.lastName}`
  }

  search (value: string) {
    this.memberInput = value
  }

  async getSpaceMember () {
    const id = this.currentSpace.id
    const viewSpaceUsers = await SpaceService.spaceUsers(id)

    this.memberList = viewSpaceUsers.data
  }

  isSelectedTag (member: UserResource) {
    return this.selectedMembers?.find(itemMember => itemMember.id === member.id)
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
  }

  .member-input {
    @apply p-2;
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

    .icon-checkmark {
      color: theme("colors.primary.default");
      position: absolute;
      right: 10px;
      opacity: 0;
    }

    &.selected {
      .icon-checkmark {
        opacity: 1;
        color: theme("colors.primary.default");
      }

      span {
        color: theme("colors.gray.900");
      }
    }
  }
</style>
