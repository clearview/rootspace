<template>
  <div id="confirm-email-page">
    <root-header></root-header>

    <div id="confirm-email-content" class="flex flex-col items-center justify-center">
      <h5 v-if="isLoading">Checking your invitation...</h5>
      <h5 v-if="!isLoading && message">{{ message }}!</h5>
      <h6 v-if="!isLoading && code !== 401 && message">
        <router-link :to="{ name: 'Main'}" class="signin">click here to go back...</router-link>
      </h6>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { find } from 'lodash'

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

    created () {
      this.submit()
    }

    async submit () {
      try {
        const { token } = this.$route.params
        const payload = {
          token: token
        }

        this.isLoading = true

        const data = await UserService.acceptInvitation(payload)

        await this.$store.dispatch('auth/whoami')

        const space = find(this.spaces, ['id', data.data.spaceId])

        this.$store.commit('space/setActive', { space })
        this.$router.push({ name: 'Main', query: { from: 'invitation', accept: '1' } })
      } catch (err) {
        this.message = err.message.includes('invalid input syntax for type uuid') ? 'The invitation token is invalid' : err.message
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
