<template>
  <section class="board">
    <header
      class="header"
      v-if="board || boardCache"
    >
      <h3 class="title">
        {{(board && board.title) || (boardCache && boardCache.title)}}
      </h3>

      <div class="actions">
        <div class="action-group">
          <div class="action action--search">
            <mono-icon
              name="search"
              class="action--icon"
            />
            <!--
            <div class="action--body">
              <input
                type="text"
                class="action--search--input"
                placeholder="Search"
                v-model="search"
                @keypress.enter="fetchTask"
              >
            </div>
            -->
          </div>
        </div>
        <div class="action-group">
          <div
            class="action action--filter"
            :class="{ 'action__active': showFilter }"
            @click="showFilter = !showFilter"
          >
            <mono-icon
              name="filter"
              class="action--icon"
            />
            <div class="action--body">
              Filter
            </div>
          </div>

          <div class="action action--archive action__disabled">
            <mono-icon
              name="archive"
              class="action--icon"
            />
            <div class="action--body">
              Archived
            </div>
          </div>
        </div>
        <div class="action-group action-group--view">
          <Tip
            :active="shouldShowTip"
            @close="markTipAsSeen"
          >
            <template #tip>
              You can change your view preference between Kanban Board or List using this button
            </template>

            <div
              class="action"
              :class="{ 'action__active': isKanban }"
              @click="viewAsBoard"
            >
              <mono-icon
                name="board"
                class="action--icon"
              />
              <div class="action-body">
                Board
              </div>
            </div>

            <div
              class="action"
              :class="{ 'action__active': !isKanban }"
              @click="viewAsList"
            >
              <mono-icon
                name="menu"
                class="action--icon"
              />
              <div class="action--body">
                List
              </div>
            </div>
          </Tip>
        </div>
      </div>
    </header>

    <filter-bar
      v-if="showFilter"
      v-model="filters"
      :member-list="memberList"
      :tag-list="tags"
      @input="(x) => filters = x"
    />

    <div class="view--kanban" v-if="isKanban">
      <TaskGhost
        v-if="isFetching"
        active
      />
      <BoardManager
        :can-drag="!isSearching"
        v-if="!isFetching && board"
        :board="board"
      />
    </div>

    <div class="view--list" v-else>
      <ListGhost
        v-if="isFetching"
        active
      />
      <ListManager
        :can-drag="!isSearching"
        v-if="!isFetching && board"
        :board="board"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { debounce } from 'helpful-decorators'
import VSelect from 'vue-select'
import Avatar from 'vue-avatar'

import { TagResource, TaskBoardResource, TaskBoardType, UserResource } from '@/types/resource'

import SpaceService from '@/services/space'
import SpaceMixin from '@/mixins/SpaceMixin'
import PageMixin from '@/mixins/PageMixin'
import { TaskSettings } from '@/store/modules/task/settings'
import EventBus from '@/utils/eventBus'
import FilterBar from './FilterBar.vue'

import BoardManager from '@/views/Task/Kanban/BoardManager.vue'
import ListManager from '@/views/Task/List/ListManager.vue'
import Popover from '@/components/Popover.vue'
import TaskGhost from '@/components/TaskGhost.vue'
import VField from '@/components/Field.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import ListGhost from '@/components/ListGhost.vue'
import Tip from '@/components/Tip.vue'

@Component({
  name: 'TaskPage',
  components: {
    ListManager,
    Tip,
    ListGhost,
    TaskGhost,
    BoardManager,
    Popover,
    VSelect,
    VField,
    ButtonSwitch,
    Avatar,
    FilterBar
  }
})
export default class TaskPage extends Mixins(SpaceMixin, PageMixin) {
  private search = ''
  private filters = {
    tags: [],
    assignees: [],
    unassigned: false
  }

  private boardCache: TaskBoardResource | null = null
  private memberList: Array<UserResource> = []
  private isSearching = false
  private isFetching = false
  private showFilter = false

  @Watch('boardId')
  async getSpaceMember () {
    try {
      const id = this.activeSpace.id
      const viewUserAtSpace = await SpaceService.spaceUsers(id)

      this.memberList = viewUserAtSpace.data
    } catch { }
  }

  get tags (): TagResource[] | null {
    return this.$store.state.task.tag.data
  }

  get board (): TaskBoardResource | null {
    return this.$store.state.task.board.current
  }

  get isKanban (): boolean {
    return this.prefferedView === TaskBoardType.Kanban
  }

  get boardId (): number {
    return parseInt(this.$route.params.id)
  }

  get prefferedView (): TaskBoardType {
    if (!this.$store.state.task.settings.viewAs[this.boardId]) {
      return this.board?.type || TaskBoardType.Kanban
    }
    return this.$store.state.task.settings.viewAs[this.boardId] ?? TaskBoardType.Kanban
  }

  get shouldShowTip (): boolean {
    return !this.$store.state.task.settings.seenViewTip
  }

  async clearMembers (payload: boolean) {
    if (payload) {
      this.filters.assignees = []
    }
    await this.fetchTask()
  }

  viewAsList () {
    this.$store.commit('task/settings/setData', (state: TaskSettings) => {
      if (!isNaN(state.viewAs as any)) {
        state.viewAs = {}
      }

      state.viewAs = {
        ...state.viewAs,
        [this.boardId]: TaskBoardType.List
      }
    })
  }

  markTipAsSeen () {
    this.$store.commit('task/settings/setData', (state: TaskSettings) => {
      state.seenViewTip = true
    })
  }

  viewAsBoard () {
    this.$store.commit('task/settings/setData', (state: TaskSettings) => {
      if (!isNaN(state.viewAs as any)) {
        state.viewAs = {}
      }

      state.viewAs = {
        ...state.viewAs,
        [this.boardId]: TaskBoardType.Kanban
      }
    })
  }

  @Watch('boardId')
  async clearAndFetchTask () {
    this.search = ''
    this.filters = {
      tags: [],
      assignees: [],
      unassigned: false
    }
    await this.fetchTask()
  }

  idExistsOn (array: number[], id: number) {
    return array.findIndex(v => v === id) !== -1
  }

  removeTag (tag: TagResource) {
    this.filters.tags = this.filters.tags.filter((t: number) => t !== tag.id)
  }

  removeMember (member: UserResource) {
    this.filters.assignees = this.filters.assignees.filter((m: number) => m !== member.id)
  }

  async fetchTask () {
    this.isFetching = true
    try {
      await this.$store.dispatch('task/board/search', { boardId: this.boardId, search: this.search, filters: this.filters })
      await this.$store.dispatch('task/tag/fetch', null)
      if (this.search.length > 0 || this.filters.assignees.length > 0 || this.filters.tags.length > 0) {
        this.isSearching = true
      } else {
        this.isSearching = false
      }
      if (this.board) {
        this.boardCache = this.board

        if (!this.pageReady) {
          await this.activateSpace(this.board.spaceId)
        }

        this.pageTitle = this.board.title
        this.pageReady = true
      }
    } catch { }

    this.isFetching = false
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

  syncTaskAttr (payload: any) {
    this.pageTitle = payload.title

    if (this.board) {
      this.board.title = payload.title
    }

    if (this.boardCache) {
      this.boardCache.title = payload.title
    }
  }

  async mounted () {
    await this.getSpaceMember()
    await this.fetchTask()

    EventBus.$on('BUS_TASKBOARD_UPDATE', this.syncTaskAttr)
  }

  get colors () {
    return ['#DEFFD9', '#FFE8E8', '#FFEAD2', '#DBF8FF', '#F6DDFF', '#FFF2CC', '#FFDDF1', '#DFE7FF', '#D5D1FF', '#D2E4FF']
  }

  beforeDestroy () {
    EventBus.$off('BUS_TASKBOARD_UPDATE', this.syncTaskAttr)
  }

  textColor (bgColor: string) {
    const textColor = ['#3A932C', '#C94747', '#DD8435', '#588f9c', '#9C3DBF', '#8c7940', '#883b68', '#394c84', '#47408c', '#2D6FD6']
    const getBgPosition = this.colors.indexOf(bgColor)

    return textColor[getBgPosition]
  }

  @Watch('filters')
  @debounce(500)
  async watchFilters () {
    await this.fetchTask()
  }
}
</script>

<style lang="postcss" scoped>
.board {
  @apply flex flex-col h-full;
  flex: 1 1 0;
  width: 0;
}

.header {
  @apply flex flex-row items-center;
  margin-left: 72px;
  margin-right: 24px;
  margin-top: 24px;
  margin-bottom: 24px;
  background: #ffffff;
  color: theme("colors.gray.900");
}

.title {
  display: flex;
  flex: 1 auto;
  font-size: 24px;
  font-weight: 700;
}

.actions {
  display: flex;
  flex-flow: row;
  align-items: center;
  flex: 0 auto;
}

.action-group {
  display: flex;
  flex-flow: row;
  padding: 0 8px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
}

.action-group + .action-group {
  border-left: 1px solid #dee2ee;
}

.action-group--search {
  @apply flex flex-row items-center;
}

.action-group--filter {
  @apply flex flex-row items-center py-2;
}

.action-group--view >>> .target {
  display: flex;
  flex-flow: row;
  align-items: center;
}

.action {
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 300ms;

  &:hover {
    background-color: #f4f5f7;
  }
}

.action + .action {
  margin-left: 4px;
}

.action__active {
  background-color: #ddf3ff;
  color: #146493;
}

.action__disabled {
  pointer-events: none;
  color: theme("colors.gray.400");
}

.action--icon {
  margin-right: 4px;
  font-size: 20px;
}

.action-group--view .action__active {
  background: #444754;
  color: white;
}

.view--kanban {
  flex: 1;
  overflow-x: auto;
  padding-left: 72px;
}

.view--list {
  flex: 1;
  padding-left: 52px;
  padding-bottom: 52px;
}
</style>
