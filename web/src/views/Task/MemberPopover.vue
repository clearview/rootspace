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
    @apply px-4 py-1;
  }

  .members {
    @apply py-2;
    max-height: 30vh;
    overflow-y:auto;
  }

  .member {
    @apply px-4 py-1;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;

    &:hover {
      background: theme("colors.gray.100");
    }
  }

  .member-name {
    color: theme("colors.gray.800");

    .vue-avatar--wrapper {
      width: 35px !important;
      height: 35px !important;
      font: 13px / 24px theme("fontFamily.primary") !important;
      float: left;
      border: 2px solid #FFF;
      letter-spacing: 0.03em;
    }

    span {
      margin-left: 10px;
    }

    .icon-checkmark {
      color: theme("colors.primary.default");
      position: absolute;
      right: 16px;
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
