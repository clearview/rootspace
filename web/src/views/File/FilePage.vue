<template>
  <div>
    <div class="main-container">
      <h1>Files</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { isEmpty } from 'lodash/fp'

import PageMixin from '@/mixins/PageMixin'
import SpaceMixin from '@/mixins/SpaceMixin'

@Component({
  components: {
    // component list
  }
})
export default class Blank extends Mixins(PageMixin, SpaceMixin) {
  async created () {
    await this.$nextTick()

    this.pageTitle = null
    this.pageReady = true
  }

  @Watch('$route')
  watchRoute (newval: Route) {
    if (isEmpty(newval.query)) {
      this.alert = null
    }
  }
}
</script>

<style lang="postcss" scoped>
p {
  @apply text-base;
  color: theme("colors.gray.400");
}

.subtitle {
  @apply font-bold text-base mt-8;
}

.box {
  @apply w-full h-64 mt-4;

  background-color: theme("colors.gray.100");
}
</style>
