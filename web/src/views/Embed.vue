<template>
  <div class="w-full h-full">
    <iframe
      v-if="payload"
      :src="url"
      width="100%"
      height="100%"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import getUrls from 'get-urls'
import PageMixin from '@/mixins/PageMixin'
import { EmbedResource } from '@/services/embed'

@Component
export default class Embed extends Mixins(PageMixin) {
  get id () {
    return Number(this.$route.params.id)
  }

  get payload (): EmbedResource {
    return this.$store.state.embed.item
  }

  get url (): string {
    const data = getUrls(this.payload.content)
    const item = data.values()

    return item.next().value
  }

  @Watch('id', { immediate: true })
  async watchId (id: number) {
    await this.$store.dispatch('embed/view', id)

    this.pageTitle = this.payload.title
    this.pageReady = true
  }
}
</script>

<style lang="postcss" scoped>
.content {
}
</style>
