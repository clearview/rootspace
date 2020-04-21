<template>
  <div id="signinup-page">
    <root-header></root-header>

    <div id="signinup-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Sign Up</h2>
        <p class="text-center mb-2 text-gray-800">Enter your information below to continue</p>

        <div class="alert alert-danger signup-alert" v-if="showErrorMessage">
          <div>
            <div class="message">
              <span class="mr-1">
                <v-icon name="warning" size="1.5em" />
              </span>
              <p>{{ errorMessage.message }}:</p>
            </div>

            <ul v-if="formatErrorMessage">
              <li v-for="(message, index) in formatErrorMessage" :key="index">{{ message }}</li>
            </ul>
          </div>
        </div>

        <resource-form-signup
          @submit="userSignup"
          ref="signup"
        />

        <div class="my-10">
          <p class="text-horizontal-line">
            <span>or</span>
          </p>
        </div>

        <button class="btn w-full mx-0" type="button" v-on:click="authWithGoogle()">
          <span class="mr-1">
            <v-icon name="google" size="1.1em" />
          </span>
          Sign up with Google
        </button>

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
import { mapState } from 'vuex'

import UserService from '@/services/user'
import { SignupResource } from '@/types/resource'

import VIcon from '@/components/icons/Index.vue'
import RootHeader from '@/components/RootHeader.vue'
import VLoading from '@/components/Loading.vue'
import ResourceFormSignup from '@/components/resource/ResourceFormSignup.vue'

type ComponentData = {
  isLoading: boolean;
}

type TheField = {
  message: string;
  validation: string;
  field: string;
}

export default Vue.extend({
  name: 'Signin',
  components: {
    VIcon,
    RootHeader,
    VLoading,
    ResourceFormSignup
  },
  data (): ComponentData {
    return {
      isLoading: false
    }
  },
  computed: {
    formatErrorMessage () {
      const messages: Array<string> = []

      if (this.errorMessage) {
        const fields = this.errorMessage.fields
        fields.forEach((thefield: TheField) => {
          if (thefield.field === 'email' && thefield.validation === 'unique') {
            messages.push('Email is already exist')
          }
          if (thefield.validation === 'required') {
            switch (thefield.field) {
              case 'name':
                messages.push('Name is required')
                break
              case 'email':
                messages.push('Email is required')
                break
              case 'password':
                messages.push('Password is required')
                break
              case 'password_confirmation':
                messages.push('Password Confirmation is required')
                break
            }
          }
        })
      }

      return messages
    },

    ...mapState('error', ['showErrorMessage', 'errorMessage'])
  },
  methods: {
    authWithGoogle () {
      const API: string = process.env.VUE_APP_API_URL
      location.href = `${API}/auth/google`
    },
    async userSignup (data: SignupResource) {
      try {
        this.isLoading = true
        await UserService.signup(data)

        this.isLoading = false
        this.$router.push({ name: 'SignUpSuccess' })
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    }
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
.signup-alert {
  line-height: 1.5;

  .message {
    @apply flex flex-row;
  }

  ul {
    @apply list-disc;

    margin: 0 1rem 0.3rem 2.8rem;
  }
}
</style>
