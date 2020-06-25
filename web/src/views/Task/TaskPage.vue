<template>
  <section class="task-board">
    <header class="header" v-if="board">
      <h3 class="header-title">
        {{board.title}}
      </h3>
      <div class="header-actions">
        <div class="action action-search">
          <v-icon name="search" class="action-search-icon"/>
          <input
            type="text"
            class="action-search-input"
            placeholder="Search"
          >
        </div>
        <div class="action action-filter">
          <v-icon name="filter" class="action-filter-icon" size="1.5em"/>
          <div class="action-label">
            Filter
          </div>
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
      <Ghost v-if="!board" active></Ghost>
      <BoardManager v-else :board="board"/>
    </main>
  </section>
</template>

<script lang="ts">
import Icon from '@/components/icon/Icon.vue'
import { mapState } from 'vuex'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TaskBoardResource, TaskBoardType } from '@/types/resource'
import BoardManager from '@/views/Task/BoardManager.vue'
import Ghost from '@/components/Ghost.vue'

  /**
   * This component is responsible for displaying the board header and then pass it to board manager
   */
  @Component({
    name: 'TaskPage',
    components: {
      Ghost,
      BoardManager,
      Icon
    },
    computed: {
      ...mapState('task/board', {
        board: 'current'
      })
    }
  })
export default class TaskPage extends Vue {
    private readonly board?: TaskBoardResource;

    get isKanban (): boolean {
      return this.board?.type === TaskBoardType.Kanban
    }

    get boardId (): number {
      return parseInt(this.$route.params.id)
    }

    @Watch('boardId')
    async fetchTask () {
      await this.$store.dispatch('task/board/view', this.boardId)
      await this.$store.dispatch('task/tag/fetch', null)
    }

    mounted (): void {
      this.fetchTask()
    }
}
</script>

<style lang="postcss" scoped>
  .task-board {
    @apply flex flex-col;
    flex: 1 0 auto;
    margin: -1rem;
  }

  .board {
    flex: 1 0 auto;
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

    &:focus, &:hover, &:active {
      border-bottom: solid 1px rgba(theme('colors.white.default'), 0.3);
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
</style>
