<template>
  <section class="task-board">
    <header
      class="header"
      v-if="board || boardCache"
    >
      <h3 class="header-title">
        {{(board && board.title) || (boardCache && boardCache.title)}}
      </h3>
      <div class="header-actions">
        <div class="action action-search">
          <v-icon
            name="search"
            class="action-search-icon"
          />
          <input
            type="text"
            class="action-search-input"
            placeholder="Search"
            v-model="search"
            @keypress.enter="fetchTask"
          >
        </div>
        <div class="action action-filter">
          <Popover title="Filter" with-close position="bottom-end" :offset="16" :skid="16">
            <template #default>
              <div class="filters">
                <div
                  class="filter-field"
                  v-if="tags"
                >
                  <label class="filter-field-label">Filter by tag</label>
                  <v-select :reduce="(opt)=>opt.id" :options="tags" multiple  class="select grid filter-field-select"
                            placeholder="Select Tag" v-model="filters.tags" @input="fetchTask">
                    <template slot="option" slot-scope="option">
                      <div class="tag-container">
                        <div class="tag-color" :style="{background: option.color, color: textColor(option.color)}">
                          {{ option.label }}
                        </div>
                        <span class="icon-checkmark"><v-icon v-if="idExistsOn(filters.tags, option.id)" size="9.33 6.67" name="checkmark" viewbox="12 9" /></span>
                      </div>
                    </template>
                    <template #selected-option-container="{ option}">
                      <div class="tag-container">
                        <div class="tag-color" :style="{background: option.color, color: textColor(option.color)}" @click="removeTag(option)">
                          <span>{{ option.label }}</span>
                        </div>
                      </div>
                    </template>
                  </v-select>
                </div>
                <div
                  class="filter-field"
                  v-if="memberList"
                >
                  <label class="filter-field-label">Filter by member</label>
                  <v-select :disabled="filters.unassigned" label="id" :filter-by="filterMember" clearable :reduce="(opt)=>opt.id" :options="memberList" multiple
                            class="select filter-field-select" placeholder="Select Member" v-model="filters.assignees"
                            @input="fetchTask">
                    <template slot="option" slot-scope="option">
                      <div class="member-option">
                        <avatar :size="32" :username="`${option.firstName}  ${option.lastName}`"></avatar>
                        <span class="member-option-name" :class="{selected: idExistsOn(filters.assignees, option.id)}">{{ `${option.firstName}  ${option.lastName}`}}</span>
                        <span class="icon-checkmark"><v-icon v-if="idExistsOn(filters.assignees, option.id)" size="9.33 6.67" name="checkmark" viewbox="12 9" /></span>
                      </div>
                    </template>
                    <template #selected-option-container="{ option }">
                      <div class="member-option-display" @click="removeMember(option)">
                        <avatar :size="32" :username="`${option.firstName}  ${option.lastName}`"></avatar>
                      </div>
                    </template>
                  </v-select>
                </div>
                <div class="filter-field">
                  <v-field
                    inline
                    border
                    label="Non assigned tasks"
                    align="right"
                    class="mb-0"
                  >
                    <button-switch v-model="filters.unassigned" @input="clearMembers" />
                  </v-field>
                </div>
                <div class="filter-action">
                  <button
                    class="btn btn-link"
                    @click="resetFilters"
                  >Reset Filters</button>
                </div>
              </div>
            </template>
            <template #trigger="{ visible }">
              <div
                class="action-wrapper"
                :class="{'active': visible}"
              >
                <v-icon
                  name="filter"
                  class="action-filter-icon"
                  size="1.5em"
                />
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
      <TaskGhost v-if="isFetching" active></TaskGhost>
      <BoardManager :can-drag="!isSearching" v-if="!isFetching && board" :board="board"/>
    </main>
  </section>
</template>

<script lang="ts">
import Icon from '@/components/icon/Icon.vue'
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { TagResource, TaskBoardResource, TaskBoardType, UserResource } from '@/types/resource'
import BoardManager from '@/views/Task/BoardManager.vue'
import Popover from '@/components/Popover.vue'
import VSelect from 'vue-select'
import SpaceService from '@/services/space'
import Avatar from 'vue-avatar'
import TaskGhost from '@/components/TaskGhost.vue'
import VField from '@/components/Field.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'

import SpaceMixin from '@/mixins/SpaceMixin'
import PageMixin from '@/mixins/PageMixin'

@Component({
  name: 'TaskPage',
  components: {
    TaskGhost,
    BoardManager,
    Icon,
    Popover,
    VSelect,
    VField,
    ButtonSwitch,
    Avatar
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

  @Watch('boardId')
  async getSpaceMember () {
    const id = this.activeSpace.id
    const viewUserAtSpace = await SpaceService.spaceUsers(id)

    this.memberList = viewUserAtSpace.data
  }

  get tags (): TagResource[] | null {
    return this.$store.state.task.tag.data
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

  async clearMembers (payload: boolean) {
    if (payload) {
      this.filters.assignees = []
    }
    await this.fetchTask()
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

        this.setPageTitle(this.board.title)
        this.setActiveSpace(this.board.spaceId, {
          activePage: this.$route.path
        })
      }
    } catch (e) {
      this.setActiveSpace(0)
    }
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

  async mounted () {
    await this.getSpaceMember()
    await this.fetchTask()
  }

  get colors () {
    return ['#DEFFD9', '#FFE8E8', '#FFEAD2', '#DBF8FF', '#F6DDFF', '#FFF2CC', '#FFDDF1', '#DFE7FF', '#D5D1FF', '#D2E4FF']
  }

  textColor (bgColor: string) {
    const textColor = ['#3A932C', '#C94747', '#DD8435', '#588f9c', '#9C3DBF', '#8c7940', '#883b68', '#394c84', '#47408c', '#2D6FD6']
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
  background: #ffffff;
  color: theme("colors.gray.900");
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
  border-right: solid 1px theme("colors.gray.100");
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

  &:focus,
  &:hover,
  &:active {
    border-bottom: solid 1px rgba(theme("colors.white.default"), 0.3);
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
  stroke: theme("colors.gray.900");

  &.active {
    background: theme("colors.primary.default");
  }
}

.empty {
  @apply m-4 p-4 rounded shadow text-center;
  color: theme("colors.gray.800");
  background: rgba(theme("colors.gray.100"), 0.25);
}
.action-wrapper {
  @apply flex items-center;
  cursor: pointer;
  font-weight: 600;
  &.active {
    color: theme("colors.primary.default");
  }
}

.filter-field {
  @apply m-4 mt-0;
  color: theme("colors.gray.900");
  & ~ & {
    @apply mb-4;
  }
  .tag-container{
    @apply flex items-center;
    .tag-color {
      @apply py-1 px-2 rounded;
      flex: 1 1 auto;
      color: #fff;
      text-transform: uppercase;
      border: 1px solid #000;
      font-weight: bold;
      span {
        flex: 1 1 auto;
      }
      .icon {
        @apply ml-4;
        cursor: pointer;
        flex: 0 0 auto;
        stroke: white;
        opacity:0.75;
        &:hover{
          opacity: 1;
        }
      }
    }
    .icon-checkmark {
      @apply ml-2;
      width: 32px;
    }
  }

  .member-option {
    @apply flex items-center;
    .member-option-name {
      @apply ml-2;
      flex: 1 1 auto;
      font-weight: 600;
      color: theme("colors.gray.800");
      &.selected {
        color: theme("colors.gray.900");
      }
    }
    .icon-checkmark {
      @apply ml-2;
      width: 32px;
    }
  }

  .member-option-display {
    @apply relative;
  }
}

.member-option {
  @apply flex items-center;
  span {
    @apply ml-2;
    flex: 1 1 auto;
  }
}
.member-option-display {
}

.search-notice {
  @apply mr-4 p-2 rounded;
  background: theme("colors.danger.default");
  color: white;
}
</style>
