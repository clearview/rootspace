<template>
  <layout-public>
    <div class="max-w-xs mx-auto p-4 mt-20" v-if="!showSuccessPage">
      <h2 class="text-center">Forgot Password</h2>
      <p class="text-center mb-2">Enter your email address below to continue</p>

      <v-alert v-model="alert"/>

      <form-forgotpassword class="mt-10" @submit="userForgotPassword"/>
    </div>

    <div v-if="showSuccessPage" class="max-w-md mx-auto p-4 mt-20" >
      <div class="flex justify-center mb-4">
        <div class="email-success">
          <span class="email">
            <v-icon name="email-success" size="56px" viewbox="56" />
          </span>
          <span class="checkmark"><v-icon size="16" name="checkmark" viewbox="12" /></span>
        </div>
      </div>
      <h2 class="text-center">Check your Email</h2>
      <p class="text-center mb-2">We’ve sent you an email with password recovery instructions.</p>
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
import FormForgotpassword from '@/components/form/FormForgotPassword.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Forgotpassword',
  components: {
    VAlert,
    LayoutPublic,
    VLoading,
    FormForgotpassword
  }
})
export default class Forgotpassword extends Vue {
    private isLoading = false
    private showSuccessPage = false
    private alert: any = null
    private redirectTo: any = null

    mounted () {
      this.redirectTo = this.$route.query ? this.$route.query : {}
      this.$store.commit('option/setRedirect', this.redirectTo)
    }

    async userForgotPassword (data: object) {
      this.isLoading = true

      try {
        await this.$store.dispatch('auth/recoverPassword', { data })
        this.showSuccessPage = true
      } catch (err) {
        this.alert = {
          type: 'danger',
          message: err.message
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
