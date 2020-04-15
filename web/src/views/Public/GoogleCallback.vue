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

import RootHeader from '@/components/RootHeader.vue'
import { mapActions } from 'vuex'

export default Vue.extend({
  name: 'GoogleCallback',
  components: {
    RootHeader
  },
  created () {
    this.submit()
  },
  methods: {
    async submit () {
      try {
        await this.withGoogle(this.$route.query)

        this.$router.push({ name: 'CreateWorkspace' })
      } catch (err) {
        console.log(err)
      }
    },

    ...mapActions({
      withGoogle: 'auth/withGoogle'
    })
  }
})
</script>

<style scoped>
#google-callback-page {
  @apply border-t-4;
  border-color: theme("colors.primary.default");
}
#google-callback-content {
  height: calc(100vh - 100px);
}
</style>
