<template>
  <div id="google-callback-page">
    <root-header></root-header>

    <div id="google-callback-content" class="flex flex-col items-center justify-center">
      <h5>Sign in success!</h5>
      <h6>we will redirect you to our system</h6>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import RootHeader from '@/components/RootHeader.vue'

export default Vue.extend({
  name: 'GoogleCallback',
  components: {
    RootHeader
  },
  computed: mapState('auth', ['spaces']),
  created () {
    this.submit()
  },
  methods: {
    async submit () {
      try {
        await this.$store.dispatch('auth/withGoogle', this.$route.query)

        if (this.spaces && this.spaces.length > 0) {
          this.$router.push({ name: 'Main' })
          return
        }

        this.$router.push({ name: 'CreateWorkspace' })
      } catch (err) {
        console.log(err)
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
