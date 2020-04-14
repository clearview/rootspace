<template>
  <div>
    <h1>Sign in to Root System</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
// import AuthService from '@/services/auth'

export default Vue.extend({
  name: 'GoogleCallback',
  computed: mapState('auth', ['token']),
  created () {
    this.submit()
  },
  methods: {
    async submit () {
      try {
        await this.withGoogle(this.$route.query)

        window.close()
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
