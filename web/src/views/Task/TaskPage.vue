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
                  <v-select :options="tags" multiple  class="select filter-field-select" placeholder="Select Tag">
                    <template slot="option" slot-scope="option">
                      <div class="tag-color" :style="{background: option.color}">
                      {{ option.label }}
                      </div>
                    </template>
                    <template #selected-option-container="{ option, deselect}">
                      <div class="tag-color" :style="{background: option.color}">
                        <span>{{ option.label }}</span>
                        <v-icon class="icon" name="close2" viewbox="20" @click.capture.prevent.stop="deselect()"></v-icon>
                      </div>
                    </template>
                  </v-select>
                </div>
                <div class="filter-field" v-if="tags">
                  <label class="filter-field-label">Filter by tag</label>
                  <v-select :options="tags" multiple  class="select filter-field-select" placeholder="Select Tag">
                    <template slot="option" slot-scope="option">
                      <div class="tag-color" :style="{background: option.color}">
                        {{ option.label }}
                      </div>
                    </template>
                    <template #selected-option-container="{ option, deselect}">
                      <div class="tag-color" :style="{background: option.color}">
                        <span>{{ option.label }}</span>
                        <v-icon class="icon" name="close2" viewbox="20" @click.capture.prevent.stop="deselect()"></v-icon>
                      </div>
                    </template>
                  </v-select>
                </div>
              </div>
            </template>
            <template #trigger>
              <div class="action-wrapper">
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
      <div class="empty" v-if="!board && search.trim().length > 0">
        No cards that matched the "{{search}}" query
      </div>
      <Ghost v-else-if="isFetching || !board" active></Ghost>
      <BoardManager v-else :board="board"/>
    </main>
  </section>
</template>

<script lang="ts">
import Icon from '@/components/icon/Icon.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TagResource, TaskBoardResource, TaskBoardType } from '@/types/resource'
import BoardManager from '@/views/Task/BoardManager.vue'
import Ghost from '@/components/Ghost.vue'
import Popover from '@/components/Popover.vue'
import VSelect from 'vue-select'

@Component({
  name: 'TaskPage',
  components: {
    Ghost,
    BoardManager,
    Icon,
    Popover,
    VSelect
  }
})
export default class TaskPage extends Vue {
  private search = ''
  private boardCache: TaskBoardResource | null = null

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
  async fetchTask () {
    await this.$store.dispatch('task/board/search', { boardId: this.boardId, search: this.search })
    await this.$store.dispatch('task/tag/fetch', null)
    if (this.board) {
      this.boardCache = this.board
    }
  }

  mounted (): void {
    this.fetchTask()
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
    background: theme('colors.gray.900');
    color: theme('colors.white.default');
    @apply flex flex-row px-6 py-2 items-center;
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
    border-right: solid 1px rgba(theme('colors.white.default'), 0.3);
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
  .tag-color {
    @apply p-2 rounded flex items-center;
    color: #fff;
    & ~ & {
      @apply ml-2;
    }
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

</style>
