<template>
  <iframe class="Link-embed" :src="link.value" />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import parseURL from 'url-parse'

@Component({
  name: 'Link'
})
export default class Link extends Vue {
  get link () {
    return this.$store.state.link.item
  }

  redirect () {
    try {
      const source = window.location
      const target = parseURL(this.link.value)

      const isSameSite = target.origin === source.origin

      if (isSameSite && target.pathname.includes('link')) {
        return
      }

      window.open(target.href, '_blank')
    } finally {
      this.$router.replace('/')
    }
  }

  async created () {
    const id = this.$route.params.id

    await this.$store.dispatch('link/view', id)

    if (this.link.newTab) {
      this.redirect()
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
