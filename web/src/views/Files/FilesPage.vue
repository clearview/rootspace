<template>
  <section class="file-page">
    <header class="header">
      <h3 class="header-title">
        Files
      </h3>
    </header>
    <emptyFileView />
  </section>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { isEmpty } from 'lodash/fp'

import PageMixin from '@/mixins/PageMixin'
import SpaceMixin from '@/mixins/SpaceMixin'

import EmptyFileView from '@/views/Files/EmptyFile.vue'

@Component({
  components: {
    EmptyFileView
  }
})
export default class File extends Mixins(PageMixin, SpaceMixin) {
  async created () {
    await this.$nextTick()

    this.pageTitle = null
    this.pageReady = true
  }
}
</script>

<style lang="postcss" scoped>
.file-page {
  @apply flex flex-col h-full;
  flex: 1 1 0;
  width: 0;
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
</style>
