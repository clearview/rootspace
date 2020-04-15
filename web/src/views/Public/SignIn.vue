<template>
  <div id="signinup-page">
    <root-header></root-header>

    <div id="signinup-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Sign In</h2>
        <p class="text-center mb-2 text-gray-800">Enter your information below to continue</p>

        <div class="alert alert-danger hidden">
          <span class="mr-1">
            <v-icon name="warning" size="1.3em" viewbox="20"/>
          </span>
          Your email is incorect. Please try again
        </div>

        <form class="mt-10">
          <div class="form-group mb-2">
            <label class="block text-gray-800 text-sm" for="username">Email</label>
            <input
              class="input w-full leading-tight mx-0"
              id="username"
              type="text"
              placeholder="Username"
            />
            <span class="icon">
              <v-icon name="email" size="1.5em" />
            </span>
          </div>
          <div class="form-group">
            <label class="block text-gray-800 text-sm" for="password">Password</label>
            <input
              class="input w-full leading-tight mx-0"
              id="password"
              type="password"
              placeholder="******************"
            />
            <span class="icon">
              <v-icon name="password" size="1.5em" />
            </span>
          </div>

          <a class="forgot-password float-right mb-8">Forgot Password?</a>

          <button class="btn btn-primary w-full mx-0" type="button" disabled>Sign In</button>
        </form>

        <div class="my-10">
          <p class="text-horizontal-line">
            <span>or</span>
          </p>
        </div>

        <button class="btn w-full mx-0" type="button" v-on:click="authWithGoogle()">
          <span class="mr-1">
            <v-icon name="google" size="1.1em" viewbox="25"/>
          </span>
          Sign in with Google
        </button>

        <p class="w-full mt-16 mb-5 text-center">
          Don't have an account yet?
          <router-link :to="{ name: 'SignUp'}" class="signup">Sign Up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VIcon from '@/components/icons/Index.vue'
import RootHeader from '@/components/RootHeader.vue'

// import AuthService from '@/services/auth'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'Signin',
  components: {
    VIcon,
    RootHeader
  },
  computed: mapState('auth', ['token']),
  methods: {
    // eslint-disable-next-line
    popupWindow (url: string, title: string, win: any, w: number, h: number) {
      const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2)
      const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2)

      return win.open(url, title, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`)
    },
    authWithGoogle () {
      const API: string = process.env.VUE_APP_API_URL
      // this.popupWindow(`${API}/auth/google`, 'Sign In', window, 400, 600)
      location.href = `${API}/auth/google`
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
