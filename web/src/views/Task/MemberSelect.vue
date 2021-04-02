<template>
  <div class="select">
    <div class="search">
      <mono-icon
        name="search"
        class="search-icon"
      />
      <input
        type="text"
        v-model="keyword"
        class="search-input"
        placeholder="Search..."
      >
    </div>

    <h4 class="title">Member</h4>

    <div class="members">
      <div
        v-for="member in filteredList"
        :key="member.id"
        class="member"
        @click="() => handleSelect(member)"
      >
        <avatar
          :username="getUsername(member)"
          :src="getImage(member)"
          :size="16"
          class="member-avatar"
        />
        <div class="member-name">{{getUsername(member)}}</div>

        <mono-icon
          v-if="isSelected(member)"
          name="check"
          class="member-check"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { UserResource } from '@/types/resource'
import { computed, defineComponent, PropType, ref } from '@vue/composition-api'
import Avatar from 'vue-avatar'

export default defineComponent({
  name: 'MemberSelect',
  components: {
    Avatar
  },
  model: {
    prop: 'selected'
  },
  props: {
    list: {
      type: Array as PropType<UserResource[]>,
      default: () => ([])
    },
    selected: {
      type: Array as PropType<UserResource[]>,
      default: () => ([])
    }
  },
  setup (props, { emit }) {
    const keyword = ref('')
    const filteredList = computed(() => props.list.filter(
      member => {
        const fullName = (member.firstName + ' ' + member.lastName).toLowerCase()
        const _keyword = keyword.value.toLowerCase()

        return fullName.includes(_keyword)
      }
    ))

    const getUsername = (member: UserResource) => (
      (member.firstName + ' ' + member.lastName).trim()
    )

    const getImage = (member: UserResource) => (
      member.avatar?.versions?.default?.location || ''
    )

    const isSelected = (member: UserResource) => (
      props.selected.findIndex(x => x.id === member.id) >= 0
    )

    const handleSelect = (member: UserResource) => {
      const list = [...props.selected]
      const index = props.selected.findIndex(
        (x) => x.id === member.id
      )

      if (index >= 0) {
        list.splice(index, 1)
      } else {
        list.push(member)
      }

      emit('input', list)
    }

    return {
      keyword,
      filteredList,
      getUsername,
      getImage,
      handleSelect,
      isSelected
    }
  }
})
</script>

<style lang="postcss" scoped>
.select {
  width: 216px;
  background: #ffffff;
  padding: 0;
  border: none;
  border-radius: 4px;
  box-shadow: 0px 2px 12px 0px rgba(#000000, 16%);
}

.title {
  padding: 16px;
  padding-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.search {
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e2e7;
}

.search-icon {
  font-size: 20px;
}

.search-input {
  padding: 0 8px;
  border: none;
  outline: none;
  font-size: 12px;
}

.member {
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f4f5f7;
  }
}

.member-avatar {
  flex: initial;
  margin-right: 8px;
}

.member-name {
  flex: 1;
}

.member-check {
  flex: initial;
  font-size: 16px;
}
</style>
