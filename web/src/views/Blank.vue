<template>
  <div>
    <v-alert v-model="alert" />

    <div class="main-container">
      <h1>Get Started</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>

      <h2 class="subtitle">Introduction</h2>
      <div class="box"></div>

      <h2 class="subtitle">Title</h2>
      <div class="box"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { isEmpty } from 'lodash/fp'

import VAlert from '@/components/Alert.vue'
import PageMixin from '@/mixins/PageMixin'
import SpaceMixin from '@/mixins/SpaceMixin'

type AlertData = {
  type: string;
  message: string;
  noicon: boolean;
}

@Component({
  components: {
    VAlert
  }
})
export default class Blank extends Mixins(PageMixin, SpaceMixin) {
  private alert: AlertData | null = null

  async created () {
    const query = this.$route.query

    if (query.from === 'invitation' && query.accept === '1') {
      this.alert = {
        type: 'success',
        message: `Welcome to ${this.activeSpace.title}, you are invited to this space`,
        noicon: true
      }
    }

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
