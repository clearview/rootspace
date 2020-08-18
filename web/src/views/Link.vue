<template>
  <iframe class="Link-embed" :src="location" />
</template>

<script lang="ts">
import { Vue, Component, Watch, Mixins } from 'vue-property-decorator'
import parseURL from 'url-parse'

import { LinkResource } from '@/types/resource'
import PageMixin from '@/mixins/PageMixin'

@Component({
  name: 'Link'
})
export default class Link extends Mixins(PageMixin) {
  get id () {
    return Number(this.$route.params.id)
  }

  get link (): LinkResource {
    return this.$store.state.link.item || {}
  }

  get location () {
    const source = window.location
    const target = parseURL(this.link.value)

    const isSameSite = target.origin === source.origin

    if (isSameSite && target.pathname.includes('link')) {
      return null
    }

    return target.href
  }

  @Watch('id', { immediate: true })
  async watchId (id: number) {
    await this.$store.dispatch('link/view', id)

    this.pageTitle = this.link.title

    if (this.link.newTab && this.location) {
      window.open(this.location, '_blank')

      await this.$router.replace('/')
    }
  }
}
</script>

<style lang="postcss" scoped>
.Link-embed {
  width: 100%;
  height: 100%;
}
</style>
