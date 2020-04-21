<template>
  <div id="signinup-page">
    <root-header></root-header>

    <div id="signinup-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Sign In</h2>
        <p class="text-center mb-2 text-gray-800">Enter your information below to continue</p>

        <div class="alert alert-danger" v-if="showErrorMessage">
          <span class="mr-1">
            <v-icon name="warning" size="1.5em" />
          </span>
          {{ errorMessage.message }}
        </div>

        <form class="mt-10">
          <v-field label="Username" name="username">
            <div class="form-group">
              <input
                class="input w-full leading-tight mx-0"
                id="username"
                type="text"
                placeholder="Username"
                v-model.trim="$v.signin.email.$model"
              />
              <span class="icon">
                <v-icon name="email" size="1.5em" />
              </span>
            </div>
            <div class="error-group">
              <div
                class="error"
                v-if="$v.signin.email.$dirty && !$v.signin.email.required"
              >Email is required.</div>
              <div
                class="error"
                v-if="$v.signin.email.$dirty && !$v.signin.email.email"
              >Email format is not valid.</div>
            </div>
          </v-field>

          <v-field label="Password" name="password">
            <div class="form-group">
              <input
                class="input w-full leading-tight mx-0"
                id="password"
                type="password"
                placeholder="******"
                v-model.trim="$v.signin.password.$model"
              />
              <span class="icon">
                <v-icon name="lock" size="1.5em" />
              </span>
            </div>
            <div class="error-group">
              <div
                class="error"
                v-if="$v.signin.password.$dirty && !$v.signin.password.required"
              >Password is required.</div>
              <div
                class="error"
                v-if="$v.signin.password.$dirty && !$v.signin.password.minLength"
              >Password must have at least {{ $v.signin.password.$params.minLength.min }} letters.</div>
            </div>
          </v-field>

          <a class="forgot-password float-right mb-8">Forgot Password?</a>

          <button
            class="btn btn-primary w-full mx-0"
            type="button"
            :disabled="$v.signin.$invalid"
            v-on:click="submit()"
          >
            Sign In
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
          Sign in with Google
        </button>

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

import VIcon from '@/components/icons/Index.vue'
import RootHeader from '@/components/RootHeader.vue'
import VField from '@/components/Field.vue'
import VLoading from '@/components/Loading.vue'

type ComponentData = {
  signin: {
    email: string;
    password: string;
  };
  isLoading: boolean;
}

export default Vue.extend({
  name: 'Signin',
  mixins: [validationMixin],
  components: {
    VIcon,
    RootHeader,
    VLoading,
    VField
  },
  data (): ComponentData {
    return {
      signin: {
        email: '',
        password: ''
      },
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
    authWithGoogle () {
      const API: string = process.env.VUE_APP_API_URL
      location.href = `${API}/auth/google`
    },
    submit (): void {
      this.$v.signin.$touch()

      if (this.$v.signin.$invalid) {
        return
      }

      this.$emit('submit', this.userSignup())
    },
    async userSignup () {
      try {
        this.isLoading = true
        await this.whoami({
          action: 'withEmail',
          params: this.signin
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
