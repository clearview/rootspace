<template>
  <layout-public>
    <div class="max-w-xs mx-auto p-4 mt-20">
      <h2 class="text-center">Set New Password</h2>
      <p class="text-center mb-2">Enter your new password below to continue</p>

      <v-alert v-model="alert"/>

      <form-setpassword class="mt-10" @submit="userPasswordReset"/>
    </div>

    <v-loading :loading="isLoading">
      <p>Send an email...</p>
    </v-loading>
  </layout-public>
</template>

<script lang="ts">
import VAlert from '@/components/Alert.vue'
import LayoutPublic from '@/components/LayoutPublic.vue'
import VLoading from '@/components/Loading.vue'
import FormSetpassword from '@/components/form/FormSetPassword.vue'
import { Component, Vue } from 'vue-property-decorator'

import AuthService from '@/services/auth'

import { PasswordResetResource } from '@/types/resource'

@Component({
  name: 'Forgotpassword',
  components: {
    VAlert,
    LayoutPublic,
    VLoading,
    FormSetpassword
  }
})
export default class Forgotpassword extends Vue {
    private isLoading = false
    private showSuccessPage = false
    private alert: any = null
    private redirectTo: any = null

    async mounted () {
      this.redirectTo = this.$route.query ? this.$route.query : {}
      this.$store.commit('option/setRedirect', this.redirectTo)

      await this.passwordResetVerify()
    }

    async userPasswordReset (data: PasswordResetResource) {
      this.isLoading = true

      try {
        await this.$store.dispatch('auth/passwordReset', { data })
        this.$router.push({ name: 'SignIn', query: { from: 'passwordreset' } })
      } catch (err) {
        this.alert = {
          type: 'danger',
          message: err.message,
          fields: err.fields
        }
      } finally {
        this.isLoading = false
      }
    }

    async passwordResetVerify () {
      this.isLoading = true

      try {
        const { data } = await AuthService.passwordResetVerify(this.$route.params.token)

        if (!data.result) {
          this.$router.push({ name: 'SignIn', query: { from: 'passwordreset', text: 'tokenexpired' } })
        }
      } catch (err) {
        this.alert = {
          type: 'danger',
          message: err.message,
          fields: err.fields
        }
      } finally {
        this.isLoading = false
      }
    }
}
</script>

<style lang="postcss" scoped>
.email-success {
  position: relative;
  display: inline-block;
  color: theme("colors.primary.default");

  .checkmark {
    position: absolute;
    background: theme("colors.primary.default");
    padding: 5px;
    bottom: 0;
    right: 0;
    border-radius: 26px;
  }
}
</style>
