<template>
  <Popover title="Add Member" :offset="5" position="bottom-start">
    <template>
      <div class="add-member">
        <v-input @input="search" placeholder="Search members" :value="memberInput" class="member-input"/>
        <ul class="members">
          <li class="member" v-for="(member, index) in filteredMembers" :key="index" @click="input(member)">
            <div class="member-name flex" :class="{selected : isSelectedTag(member)}">
              <avatar :username="memberName(member)"></avatar>
              <span class="self-center">{{ memberName(member) }}</span>
              <span class="icon-checkmark"><v-icon size="9.33 6.67" name="checkmark" viewbox="12 9" /></span>
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

  get activeSpace () {
    return this.$store.getters['space/activeSpace'] || {}
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
    const id = this.activeSpace.id
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
    @apply px-4 pb-4;
  }

  .members {
    @apply py-2;
    max-height: 30vh;
    overflow-y:auto;
  }

  .member {
    @apply py-1;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    padding-left: 12px;
    padding-right: 12px;

    &:hover {
      background: #F9FAFF;
    }
  }

  .member-name {
    color: theme("colors.gray.800");
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;

    .vue-avatar--wrapper {
      width: 24px !important;
      height: 24px !important;
      font: 10px / 13px theme("fontFamily.primary") !important;
      float: left;
      border: 0;
      letter-spacing: 0.03em;
      color: #fff !important;
    }

    span {
      margin-left: 10px;
    }

    .icon-checkmark {
      border: 0;
      top: 8px;
    }

    &.selected {
      .icon-checkmark {
        opacity: 1;
      }

      span {
        color: theme("colors.gray.900");
      }
    }
  }
</style>
