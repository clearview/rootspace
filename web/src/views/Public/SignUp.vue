<template>
  <div id="signinup-page">
    <root-header></root-header>

    <div id="signinup-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Sign Up</h2>
        <p class="text-center mb-2 text-gray-800">Enter your information below to continue</p>

        <div class="alert alert-danger hidden">
          <span class="mr-1">
            <v-icon name="warning" size="1.3em" />
          </span>
          Your email is incorect. Please try again
        </div>

        <p v-if="isLoading">Creating Account...</p>

        <form class="mt-10">
          <div class="form-group mb-2">
            <label class="block text-gray-800 text-sm" for="fullname">Full Name</label>
            <input
              class="input w-full leading-tight mx-0"
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              v-model.trim="$v.signup.name.$model"
            />
            <span class="icon">
              <v-icon name="user" size="1.5em" />
            </span>
          </div>
          <div class="form-group mb-2">
            <label class="block text-gray-800 text-sm" for="email">Email</label>
            <input
              class="input w-full leading-tight mx-0"
              id="email"
              type="text"
              placeholder="Enter your email"
              v-model.trim="$v.signup.email.$model"
            />
            <span class="icon">
              <v-icon name="email" size="1.5em" />
            </span>
          </div>
          <div class="form-group mb-2">
            <label class="block text-gray-800 text-sm" for="password">Password</label>
            <input
              class="input w-full leading-tight mx-0"
              id="password"
              type="password"
              placeholder="******************"
              v-model.trim="$v.signup.password.$model"
            />
            <span class="icon">
              <v-icon name="lock" size="1.5em" />
            </span>
          </div>
          <div class="error-group">
            <div class="error" v-if="$v.signup.password.$dirty && !$v.signup.password.required">Password is required.</div>
            <div class="error" v-if="$v.signup.password.$dirty && !$v.signup.password.minLength">Password must have at least {{ $v.signup.password.$params.minLength.min }} letters.</div>
          </div>

          <div class="form-group mb-5">
            <label class="block text-gray-800 text-sm" for="password">Repeat Password</label>
            <input
              class="input w-full leading-tight mx-0"
              id="password"
              type="password"
              placeholder="******************"
              v-model.trim="$v.signup.password_confirmation.$model"
            />
            <span class="icon">
              <v-icon name="lock" size="1.5em" />
            </span>
          </div>
          <div class="error-group">
            <div class="error" v-if="!$v.signup.password_confirmation.sameAsPassword">Passwords must be identical.</div>
          </div>

          <button
            class="btn btn-primary w-full mx-0"
            type="button"
            :disabled="$v.signup.$invalid"
            v-on:click="submit()"
          >
            Sign Up
          </button>
        </form>

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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

import UserService from '@/services/user'

import VIcon from '@/components/icons/Index.vue'
import RootHeader from '@/components/RootHeader.vue'

type ComponentData = {
  signup: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string; // eslint-disable-line
  };
  isLoading: boolean;
}

export default Vue.extend({
  name: 'Signin',
  mixins: [validationMixin],
  components: {
    VIcon,
    RootHeader
  },
  data (): ComponentData {
    return {
      signup: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '' // eslint-disable-line
      },
      isLoading: false
    }
  },
  validations: {
    signup: {
      name: { required },
      email: { required, email },
      password: {
        required,
        minLength: minLength(6)
      },
      password_confirmation: { // eslint-disable-line
        required,
        minLength: minLength(6),
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    authWithGoogle () {
      const API: string = process.env.VUE_APP_API_URL
      location.href = `${API}/auth/google`
    },
    submit (): void {
      this.$v.signup.$touch()

      if (this.$v.signup.$invalid) {
        return
      }

      this.$emit('submit', this.userSignup())
    },
    async userSignup () {
      this.isLoading = true
      const data = await UserService.signup(this.signup)

      if (data.status === 200) {
        this.isLoading = false
        this.signup = {
          name: '',
          email: '',
          password: '',
          password_confirmation: '' // eslint-disable-line
        }
        this.$router.push({ name: 'SignUpSuccess' })
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
</style>
