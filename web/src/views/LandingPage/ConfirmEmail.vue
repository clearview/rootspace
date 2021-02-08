<template>
  <div id="confirm-email-page">
    <root-header></root-header>

    <div id="confirm-email-content" class="flex flex-col items-center justify-center">
      <h5 v-if="isLoading">Activating your account...</h5>
      <h5 v-if="!isLoading && !message">Your account is active!</h5>
      <h5 v-if="!isLoading && message">{{ message }}!</h5>
      <h6 v-if="!isLoading">
        <router-link :to="{ name: 'SignIn'}" class="signin">click here</router-link>
        to login to the Root App
      </h6>

    </div>
  </div>
</template>

<script lang="ts">

import UserService from '@/services/user'

import RootHeader from '@/components/RootHeader.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'ConfirmEmail',
  components: {
    RootHeader
  }
})
export default class ConfirmEmail extends Vue {
    private isLoading = false
    private message = ''

    created () {
      this.submit()
    }

    async submit () {
      try {
        const { token } = this.$route.params
        const { id } = this.$route.params
        const payload = {
          token: token,
          userId: id
        }

        this.isLoading = true
        await UserService.confirmEmail(payload)
      } catch (err) {
        this.message = err.message.includes('invalid input syntax for type uuid') ? 'The email confirmation token is invalid' : err.message
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
