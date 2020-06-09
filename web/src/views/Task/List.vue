<template>
    <section class="task-list">
        <header class="header" v-if="task">
            <h3 class="header-title">
                {{task.name}}
            </h3>
            <div class="header-actions">
                 <div class="action action-search">
                     <Icon name="search" class="action-search-icon"/>
                        <input
                            type="text"
                            class="action-search-input"
                            placeholder="Search"
                        >
                </div>
                <div class="action action-filter">
                    <Icon name="filter" class="action-filter-icon" size="1.5em"/>
                    <div class="action-label">
                        Filter
                    </div>
                </div>
                <div class="action action-type">
                    <Icon
                        name="list"
                        size="2.5em"
                        class="icon-circle active"
                    />
                    <Icon
                        name="kanban"
                        size="2.5em"
                        class="icon-circle"
                    />
                </div>
            </div>
        </header>
      <main class="list">
        <ListEntry/>
      </main>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Icon from '@/components/icon/Icon.vue'
import { mapState } from 'vuex'
import ListEntry from '@/views/Task/ListEntry.vue'
interface ComponentData {
    x_: null;
}
export default Vue.extend({
  components: {
    ListEntry,
    Icon
  },
  data (): ComponentData {
    return {
      x_: null
    }
  },
  computed: {
    ...mapState('task', {
      task: 'current'
    })
  },
  methods: {
    async fetchTask () {
      const id = parseInt(this.$route.params.id)
      await this.$store.dispatch('task/view', id)
    }
  },
  async mounted () {
    await this.fetchTask()
  }
})
</script>

<style lang="postcss" scoped>
.header{
    background: theme('colors.gray.900');
    color: theme('colors.white.default');
    @apply flex flex-row px-6 py-2 items-center;
}
.header-title{
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
.action-search-input{
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
