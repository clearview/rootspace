<template>
  <div id="signinup-page">
    <root-header></root-header>

    <div id="signinup-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Sign Up</h2>
        <p class="text-center mb-2 text-gray-800">Enter your information below to continue</p>

        <v-alert v-model="alert" />

        <form-signup @submit="userSignup" ref="signup" />

        <div class="my-10">
          <p class="text-horizontal-line">
            <span>or</span>
          </p>
        </div>

        <google-signin text="Sign Up"/>

        <p class="w-full mt-16 mb-5 text-center">
          Already have an account?
          <router-link :to="{ name: 'SignIn'}" class="signin">Sign In</router-link>
        </p>
      </div>
    </div>

    <v-loading :loading="isLoading">
      <p>Creating RootApp Account ...</p>
    </v-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { SignupResource } from '@/types/resource'

import VAlert from '@/components/Alert.vue'
import RootHeader from '@/components/RootHeader.vue'
import VLoading from '@/components/Loading.vue'
import FormSignup from '@/components/form/FormSignup.vue'
import GoogleSignin from '@/components/GoogleSignin.vue'

type ComponentData = {
  isLoading: boolean;
  alert: object | null;
}

export default Vue.extend({
  name: 'SignUp',
  components: {
    VAlert,
    RootHeader,
    VLoading,
    FormSignup,
    GoogleSignin
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

<style lang="postcss" scoped>
#signinup-page {
  @apply border-t-4;
  border-color: theme("colors.primary.default");
}
#signinup-content {
  @apply bg-local bg-cover bg-no-repeat;
  background-image: url("~@/assets/images/root-bg.png");
  background-position: top 150px right;
  height: calc(100vh - 100px);
}
.signin {
  @apply font-semibold text-primary;
}
.text-horizontal-line {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid theme("colors.secondary.default");
  line-height: 0.1em;
  margin: 10px 0 20px;

  span {
    background: #fff;
    padding: 0 10px;
  }
}
</style>
