<template>
  <layout-public>
    <div class="max-w-xs mx-auto p-4 mt-10">
      <h2 class="text-center">Sign Up</h2>
      <p class="text-center mb-2 text-gray-800">Enter your information below to continue</p>

      <v-alert v-model="alert" />

      <form-signup @submit="userSignup" />

      <div class="my-10">
        <p class="separator">
          <span class="separator-text">or</span>
        </p>
      </div>

      <button-auth-google text="Sign Up with Google" />

      <p class="w-full mt-16 mb-5 text-center">
        Already have an account?
        <router-link
          :to="{ name: 'SignIn'}"
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
import Vue from 'vue'

import { SignupResource } from '@/types/resource'

import VAlert from '@/components/Alert.vue'
import LayoutPublic from '@/components/LayoutPublic.vue'
import VLoading from '@/components/Loading.vue'
import FormSignup from '@/components/resource/ResourceFormSignup.vue'
import ButtonAuthGoogle from '@/components/ButtonAuthGoogle.vue'

type ComponentData = {
  isLoading: boolean;
  alert: object | null;
}

export default Vue.extend({
  name: 'SignUp',
  components: {
    VAlert,
    LayoutPublic,
    VLoading,
    FormSignup,
    ButtonAuthGoogle
  },
  data (): ComponentData {
    return {
      isLoading: false,
      alert: null
    }
  },
  methods: {
    async userSignup (data: SignupResource) {
      this.isLoading = true

      try {
        await this.$store.dispatch('auth/signup', data)

        const queryParams = this.$route.query ? this.$route.query : {}
        this.$router.push({ name: 'SignIn', query: queryParams })
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
})
</script>
