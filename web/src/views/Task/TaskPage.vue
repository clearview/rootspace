<template>
  <section class="task-board">
    <header class="header" v-if="board || boardCache">
      <h3 class="header-title">
        {{(board && board.title) || (boardCache && boardCache.title)}}
      </h3>
      <div class="header-actions">
        <div class="action action-search">
          <v-icon name="search" class="action-search-icon"/>
          <input
            type="text"
            class="action-search-input"
            placeholder="Search"
            v-model="search"
            @keypress.enter="fetchTask"
          >
        </div>
        <div class="action action-filter">
          <Popover title="Filter" with-close>
            <template #default>
              <div class="filters">
                <div class="filter-field" v-if="tags">
                  <label class="filter-field-label">Filter by tag</label>
                  <v-select :reduce="(opt)=>opt.id" :options="tags" multiple  class="select grid filter-field-select"
                            placeholder="Select Tag" v-model="filters.tags" @input="fetchTask">
                    <template slot="option" slot-scope="option">
                      <div class="tag-color" :style="{background: option.color, color: textColor(option.color)}">
                      {{ option.label }}
                      </div>
                    </template>
                    <template #selected-option-container="{ option}">
                      <div class="tag-color" :style="{background: option.color, color: textColor(option.color)}">
                        <span>{{ option.label }}</span>
                      </div>
                    </template>
                  </v-select>
                </div>
                <div class="filter-field" v-if="memberList">
                  <label class="filter-field-label">Filter by member</label>
                  <v-select label="id" :filter-by="filterMember" clearable :reduce="(opt)=>opt.id" :options="memberList" multiple
                            class="select filter-field-select" placeholder="Select Member" v-model="filters.assignees"
                            @input="fetchTask">
                    <template slot="option" slot-scope="option">
                      <div class="member-option">
                        <avatar :size="32" :username="`${option.firstName}  ${option.lastName}`"></avatar>
                        <span>{{ `${option.firstName}  ${option.lastName}`}}</span>
                      </div>
                    </template>
                    <template #selected-option-container="{ option, deselect}">
                      <div class="member-option-display">
                        <avatar :size="32" :username="`${option.firstName}  ${option.lastName}`" @click="deselect()"></avatar>
                      </div>
                    </template>
                  </v-select>
                </div>
                <div class="filter-action">
                  <button class="btn btn-link" @click="resetFilters">Reset Filters</button>
                </div>
              </div>
            </template>
            <template #trigger="{ visible }">
              <div class="action-wrapper" :class="{'active': visible}">
                <v-icon name="filter" class="action-filter-icon" size="1.5em"/>
                <div class="action-label">
                  Filter
                </div>
              </div>
            </template>
          </Popover>
        </div>
        <div class="action action-type">
          <v-icon
            name="list"
            size="2.5em"
            class="icon-circle"
            :class="{active: !isKanban}"
          />
          <v-icon
            name="kanban"
            size="2.5em"
            class="icon-circle"
            :class="{active: isKanban}"
          />
        </div>
      </div>
    </header>
    <main class="board">
      <Ghost v-if="isFetching || !board" active></Ghost>
      <BoardManager :can-drag="!isSearching" v-else :board="board"/>
    </main>
  </section>
</template>

<script lang="ts">
import Icon from '@/components/icon/Icon.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TagResource, TaskBoardResource, TaskBoardType, UserResource } from '@/types/resource'
import BoardManager from '@/views/Task/BoardManager.vue'
import Ghost from '@/components/Ghost.vue'
import Popover from '@/components/Popover.vue'
import VSelect from 'vue-select'
import SpaceService from '@/services/space'
import Avatar from 'vue-avatar'

@Component({
  name: 'TaskPage',
  components: {
    Ghost,
    BoardManager,
    Icon,
    Popover,
    VSelect,
    Avatar
  }
})
export default class TaskPage extends Vue {
  private search = ''
  private filters = {
    tags: [],
    assignees: []
  }

  private boardCache: TaskBoardResource | null = null
  private memberList: Array<UserResource> = []
  private isSearching = false

  get currentSpace () {
    return this.$store.state.auth.currentSpace || {}
  }

  async getSpaceMember () {
    const id = this.currentSpace.id
    const viewUserAtSpace = await SpaceService.spaceUsers(id)

    this.memberList = viewUserAtSpace.data
  }

  get tags (): TagResource[] | null {
    return this.$store.state.task.tag.data
  }

  get isFetching (): boolean {
    return this.$store.state.task.board.isFetching
  }

  get board (): TaskBoardResource | null {
    return this.$store.state.task.board.current
  }

  get isKanban (): boolean {
    return this.board?.type === TaskBoardType.Kanban
  }

  get boardId (): number {
    return parseInt(this.$route.params.id)
  }

  @Watch('boardId')
  async clearAndFetchTask () {
    this.search = ''
    this.filters = {
      tags: [],
      assignees: []
    }
    await this.fetchTask()
  }

  async fetchTask () {
    if (this.memberList.length === 0) {
      await this.getSpaceMember()
    }
    await this.$store.dispatch('task/board/search', { boardId: this.boardId, search: this.search, filters: this.filters })
    await this.$store.dispatch('task/tag/fetch', null)
    if (this.search.length > 0 || this.filters.assignees.length > 0 || this.filters.tags.length > 0) {
      this.isSearching = true
    } else {
      this.isSearching = false
    }
    if (this.board) {
      this.boardCache = this.board
    }
  }

  async resetFilters () {
    this.filters.assignees = []
    this.filters.tags = []
    await this.fetchTask()
  }

  filterMember (option: UserResource, label: string, search: string) {
    const rx = new RegExp(search, 'gi')
    return rx.test(option.firstName) || rx.test(option.lastName)
  }

  mounted (): void {
    this.fetchTask()
  }

  get colors () {
    return ['#DEFFD9', '#FFE8E8', '#FFEAD2', '#DBF8FF', '#F6DDFF', '#FFF2CC', '#FFDDF1', '#DFE7FF', '#D5D1FF', '#D2E4FF']
  }

  textColor (bgColor: string) {
    const textColor = ['#64a55a', '#ab5d5d', '#9a7a56', '#588f9c', '#733988', '#8c7940', '#883b68', '#394c84', '#47408c', '#5c89cc']
    const getBgPosition = this.colors.indexOf(bgColor)

    return textColor[getBgPosition]
  }
}
</script>

<style lang="postcss" scoped>
  .task-board {
    @apply flex flex-col h-full;
    flex: 1 0 auto;
  }

  .board {
    flex: 1 0 auto;
    height: 0;
  }

  .header {
    @apply flex flex-row px-6 py-2 items-center;
    background: #FFFFFF;
    color: theme('colors.gray.900');
    border-bottom: solid 1px theme("colors.gray.100");
  }

  .header-title {
    @apply text-lg;
    flex: 1 1 auto;
  }

  .header-actions {
    @apply flex flex-row items-center;
    flex: 0 0 auto;
  }

  .action {
    @apply px-4;
    border-right: solid 1px theme('colors.gray.100');
  }

  .action-search {
    @apply flex flex-row items-center;
  }

  .action-search-icon {
    flex: 0 0 auto;
  }

  .action-search-input {
    @apply bg-transparent text-gray-400 px-2 py-2 outline-none w-auto;
    border-bottom: solid 1px transparent;
    flex: 1 1 auto;
    width: 72px;
    transition: all 0.3s ease;

    &:focus, &:hover, &:active {
      border-bottom: solid 1px rgba(theme('colors.white.default'), 0.3);
    }
    &:focus {
      width: 128px;
    }
  }

  .action-filter {
    @apply flex flex-row items-center py-2;
  }

  .action-type {
    @apply flex flex-row items-center;
  }

  .icon-circle {
    @apply rounded-full p-2;
    color: transparent;
    stroke: theme('colors.gray.900');

    &.active {
      background: theme("colors.primary.default");
    }
  }

  .empty {
    @apply m-4 p-4 rounded shadow text-center;
    color: theme('colors.gray.800');
    background: rgba(theme("colors.gray.100"),0.25);
  }
  .action-wrapper {
    @apply flex items-center;
    cursor: pointer;
    font-weight: 600;
    &.active{
      color: theme("colors.primary.default");
    }
  }

  .filter-field {
    @apply m-4 mt-0;
    color: theme('colors.gray.900');
    & ~ & {
      @apply mb-4;
    }
  }
  .filters {
    min-width:320px;
  }
  .filter-action {
    text-align: right;
    @apply m-4;
    .btn {
      @apply m-0 p-4 inline-block;
      opacity: 0.3;
    }
  }
  .tag-color {
    @apply py-1 px-2 rounded flex items-center;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    span {
      flex: 1 1 auto;
    }
    .icon {
      @apply ml-4;
      cursor: pointer;
      flex: 0 0 auto;
      stroke: white;
    }
  }

  .member-option {
    @apply flex items-center;
    span {
      @apply ml-2;
      flex:1 1 auto;
    }
  }
  .member-option-display {

  }

  .search-notice{
    @apply mr-4 p-2 rounded;
    background: theme("colors.danger.default");
    color: white;
  }

</style>
