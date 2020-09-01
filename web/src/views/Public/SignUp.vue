<template>
  <layout-public>
    <div class="max-w-xs mx-auto p-4 mt-20">
      <h2 class="text-center">Sign Up</h2>
      <p class="text-center mb-2">Enter your information below to continue</p>

      <v-alert v-model="alert"/>

      <form-signup class="mt-10" @submit="userSignup"/>

      <div class="my-10">
        <p class="separator">
          <span class="separator-text">or</span>
        </p>
      </div>

      <button-auth-google text="Sign Up with Google"/>

      <p class="w-full mt-16 mb-5 text-center">
        Already have an account?
        <router-link
          :to="{ name: 'SignIn', query: redirectTo }"
          class="font-semibold text-primary"
        >
          Sign In
        </router-link>
      </p>
    </div>

    <v-loading :loading="isLoading">
      <p>Creating RootApp Account ...</p>
    </v-loading>
  </layout-public>
</template>

<script lang="ts">

import { SignupResource } from '@/types/resource'

import VAlert from '@/components/Alert.vue'
import LayoutPublic from '@/components/LayoutPublic.vue'
import VLoading from '@/components/Loading.vue'
import FormSignup from '@/components/form/FormSignup.vue'
import ButtonAuthGoogle from '@/components/ButtonAuthGoogle.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'SignUp',
  components: {
    VAlert,
    LayoutPublic,
    VLoading,
    FormSignup,
    ButtonAuthGoogle
  }
})
export default class SignUp extends Vue {
    private isLoading = false
    private alert: any = null
    private redirectTo: any = null

    mounted () {
      this.redirectTo = this.$route.query ? this.$route.query : {}
      this.$store.commit('option/setRedirect', this.redirectTo)
    }

    async userSignup (data: SignupResource) {
      this.isLoading = true

      try {
        await this.$store.dispatch('auth/signup', data)

        const queryParams = this.$route.query ? this.$route.query : {}
        await this.$router.push({ name: 'SignIn', query: queryParams })
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
