<template>
  <div id="google-callback-page">
    <root-header></root-header>

    <div
      id="google-callback-content"
      class="flex flex-col items-center justify-center"
    >
      <h5>Sign in success!</h5>
      <h6>we will redirect you to our system</h6>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { isEmpty } from 'lodash/fp'

import RootHeader from '@/components/RootHeader.vue'

export default Vue.extend({
  name: 'GoogleCallback',
  components: {
    RootHeader
  },
  computed: {
    redirect () {
      return this.$store.state.option.redirect || {}
    }
  },
  created () {
    this.submit()
  },
  methods: {
    async submit () {
      await this.$store.dispatch('auth/signin', {
        type: 'google',
        payload: this.$route.query
      })

      if (!isEmpty(this.redirect)) {
        this.$router.replace({ path: this.redirect.redirectTo.toString() })
        this.$store.commit('option/setRedirect', null)
      } else {
        this.$router.replace({ name: 'Main' })
      }
    }
  }
})
</script>

<style lang="postcss" scoped>
#google-callback-page {
  @apply border-t-4;
  border-color: theme("colors.primary.default");
}
#google-callback-content {
  height: calc(100vh - 100px);
}
</style>
