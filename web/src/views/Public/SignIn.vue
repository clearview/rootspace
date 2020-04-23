<template>
  <div id="signinup-page">
    <root-header></root-header>

    <div id="signinup-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Sign In</h2>
        <p class="text-center mb-2 text-gray-800">Enter your information below to continue</p>

        <v-alert />

        <resource-form-signin @submit="userSignin" ref="signin" />

        <div class="my-10">
          <p class="text-horizontal-line">
            <span>or</span>
          </p>
        </div>

        <google-signin text="Sign In"/>

        <p class="w-full mt-16 mb-5 text-center">
          Don't have an account yet?
          <router-link :to="{ name: 'SignUp'}" class="signup">Sign Up</router-link>
        </p>
      </div>
    </div>

    <v-loading :loading="isLoading">
      <p>Login to RootApp...</p>
    </v-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, email, minLength } from 'vuelidate/lib/validators'

import { SigninResource } from '@/types/resource'

import VAlert from '@/components/Alert.vue'
import RootHeader from '@/components/RootHeader.vue'
import VLoading from '@/components/Loading.vue'
import ResourceFormSignin from '@/components/resource/ResourceFormSignin.vue'
import GoogleSignin from '@/components/GoogleSignin.vue'

type ComponentData = {
  isLoading: boolean;
}

export default Vue.extend({
  name: 'Signin',
  mixins: [validationMixin],
  components: {
    VAlert,
    RootHeader,
    VLoading,
    ResourceFormSignin,
    GoogleSignin
  },
  data (): ComponentData {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState('auth', ['spaces']),
    ...mapState('error', ['showErrorMessage', 'errorMessage'])
  },
  validations: {
    signin: {
      email: { required, email },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  methods: {
    async userSignin (data: SigninResource) {
      try {
        this.isLoading = true
        await this.whoami({
          action: 'withEmail',
          params: data
        })

        this.isLoading = false
        if (this.spaces && this.spaces.length > 0) {
          this.$router.push({ name: 'Main' })
          return
        }

        this.$router.push({ name: 'CreateWorkspace' })
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },

    ...mapActions({
      whoami: 'auth/whoami'
    })
  }
})
</script>

<style scoped>
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
.forgot-password,
.signup {
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
