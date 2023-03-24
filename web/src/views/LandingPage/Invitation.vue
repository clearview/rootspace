<template>
  <div id="confirm-email-page">
    <root-header></root-header>

    <div id="confirm-email-content" class="flex flex-col items-center justify-center">
      <h5 v-if="isLoading">Checking your invitation...</h5>
      <h5 v-if="!isLoading && message" v-html="message"/>
      <h6 v-if="!isLoading && code !== 401 && message">
        <router-link :to="{ name: 'Main'}" class="signin">click here to go back...</router-link>
      </h6>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'

import UserService from '@/services/user'
import RootHeader from '@/components/RootHeader.vue'
import SpaceMixin from '@/mixins/SpaceMixin'

@Component({
  name: 'ConfirmEmail',
  components: {
    RootHeader
  }
})
export default class Invitation extends Mixins(SpaceMixin) {
    private isLoading = false
    private message = ''
    private code = 0

    private get isLoggedIn () {
      return this.$store.state.auth.token !== null
    }

    async created () {
      if (this.isLoggedIn) {
        window.localStorage.removeItem('root:invite:token')
        return this.submit()
      } else {
        window.localStorage.setItem('root:invite:token', this.$route.params.token)
        return this.$router.push({ name: 'SignIn', query: { redirectTo: `/invitation/${this.$route.params.token}` } })
      }
    }

    async submit () {
      try {
        const { token } = this.$route.params
        const payload = {
          token: token
        }

        this.isLoading = true

        const data = await UserService.acceptInvitation(payload)
        await this.$store.dispatch('space/fetch')
        await this.$store.dispatch('auth/whoami')
        await this.activateSpace(data.data[0].spaceId)

        this.$router.push({ name: 'Main', query: { from: 'invitation', accept: '1' } })
      } catch (err) {
        const user = this.$store.state.auth.user
        const message = err.message.includes('invalid input syntax for type uuid') ? 'The invitation token is invalid' : err.message
        this.message = user ? `Hi <b>${[user.firstName, user.lastName].join(' ')}</b>, ${message}` : message
        this.code = err.code
      } finally {
        this.isLoading = false
      }
    }
}
</script>

<style lang="postcss" scoped>
  #confirm-email-page {
    @apply border-t-4;
    border-color: theme("colors.primary.default");
  }

  #confirm-email-content {
    height: calc(100vh - 100px);
  }

  a {
    border-bottom: 1px dotted;
    color: theme("colors.primary.default");
    cursor: pointer;
  }
</style>
