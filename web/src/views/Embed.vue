<template>
  <div class="w-full h-full">
    <iframe :src="url" width="100%" height="100%"/>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import getUrls from 'get-urls'
import PageMixin from '@/mixins/PageMixin'

@Component
export default class Embed extends Mixins(PageMixin) {
  get id () {
    return Number(this.$route.params.id)
  }

  get payload () {
    return {
      title: 'Untitled',
      type: 'figma',
      content: '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FLU0VwmpT92fDc89NSVk3iK%2FRoot-App-UI-Copy%3Fnode-id%3D3850%253A17165&chrome=DOCUMENTATION" allowfullscreen></iframe>'
    }
  }

  get url (): string {
    const data = getUrls(this.payload.content)
    const item = data.values()

    return item.next().value
  }

  @Watch('id', { immediate: true })
  watchId () {
    this.pageTitle = this.payload.title
    this.pageReady = true
  }
}
</script>

<style lang="postcss" scoped>
.content {

}
</style>
