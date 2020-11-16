<template>
  <div class="cloak" @click.self="$emit('cancel')">
    <ul class="user-list" :style="{top: coords.top+'px', left: coords.left + 5 + 'px'}">
      <li class="user-search">
        <input type="text" v-model="search" placeholder="Search" ref="search" @keydown="handleKeypress"/>
      </li>
      <li class="user" v-for="(user, index) in filteredUsers" :key="user.id" :class="{selected: index === selectedIndex}" @click="$emit('confirm', reference)">
        {{ user.firstName }} {{ user.lastName }}
      </li>
      <li class="empty" v-if="filteredUsers.length === 0">
        No matching users found
      </li>
      <li class="help">
        Press esc to cancel, enter to choose
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { UserResource } from '../../../types/resource'

@Component
export default class UserList extends Vue {
  @Prop({ type: Array, required: true })
  private readonly users!: UserResource[];

  @Prop({ type: Object, required: true })
  private readonly coords!: {top: number;left: number;bottom: number;right: number};

  @Ref('search')
  private readonly searchRef!: HTMLInputElement;

  private search = '';
  private selectedIndex = -1

  get filteredUsers () {
    const regex = new RegExp(this.search, 'gi')
    return this.users.filter(user => regex.test(user.firstName) || regex.test(user.lastName))
  }

  mounted () {
    Vue.nextTick(() => {
      this.searchRef.focus()
    })
  }

  handleKeypress (evt: KeyboardEvent) {
    evt.stopPropagation()
    if (evt.key === 'ArrowDown') {
      evt.preventDefault()
      this.selectedIndex++
      if (this.selectedIndex > this.filteredUsers.length) {
        this.selectedIndex = 0
      }
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault()
      this.selectedIndex--
      if (this.selectedIndex < 0) {
        this.selectedIndex = this.filteredUsers.length
      }
    } else if (evt.key === 'Escape') {
      evt.preventDefault()
      this.$emit('cancel')
    } else if (evt.key === 'Enter') {
      evt.preventDefault()
      if (this.filteredUsers[this.selectedIndex]) {
        this.$emit('confirm', this.filteredUsers[this.selectedIndex])
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.cloak {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
}
.user-list {
  z-index: 51;
  margin: 0;
  padding: 0;
  background: #fff;
  position: fixed;
  color: #333;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,.1), 0 4px 8px rgba(0,0,0,.05);
}
.user, .empty {
  padding: 6px;
  margin: 0;
  list-style: none;
  &.selected, &:hover{
    background: #146493;
    color: #fff;
  }
}
.empty {
  opacity: 0.5;
}
.user-search {
  list-style: none;
  padding: 6px;
}
.user-search input{
  outline: none;
  background: transparent;
  padding: 6px;
  box-sizing: border-box;
  display: block;
}
.help {
  opacity: 0.75;
  padding: 6px;
  list-style: none;
  font-size: 12px;
}
</style>
