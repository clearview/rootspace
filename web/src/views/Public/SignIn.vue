<template>
  <div id="signinup-page">
    <header class="header">
      <img
        srcset="@/assets/images/logo-inverse.png, @/assets/images/logo-inverse@2x.png 2x"
        src="@/assets/images/logo-inverse.png"
        alt="Root Logo"
        class="object-contain"
      />
      <h1 class="pl-2">RootApp</h1>
    </header>

    <div id="signinup-content">
      <div class="max-w-xs mx-auto p-4 mt-10">
        <h2 class="text-center">Sign In</h2>
        <p class="text-center mb-2 text-gray-800">Enter your information below to continue</p>
        <div class="alert alert-danger invisible">
          <v-icon name="warning" size="2em" />Your email is icorect. Please try again
        </div>

        <form>
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

          <button class="btn btn-primary w-full" type="button" disabled>Sign In</button>
        </form>

        <div class="my-10">
          <p class="text-horizontal-line">
            <span>or</span>
          </p>
        </div>

        <button class="btn w-full" type="button">
          <span class="float-left">
            <v-icon name="google" size="1.1em" />
          </span>
          Sign In with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'Signin',
  components: {
    VIcon
  }
})
</script>

<style scoped>
#signinup-page {
  @apply border-t-4;
  border-color: theme("colors.primary.default");
}
#signinup-content {
  @apply bg-fixed bg-cover bg-no-repeat;
  background-image: url("~@/assets/images/root-bg.png");
  background-position: top 150px right;
  height: calc(100vh - 100px);
}
.header {
  @apply flex justify-center border-b-2 p-2;
  border-color: theme("colors.secondary.default");

  h1 {
    @apply text-2xl;
  }
}
.forgot-password {
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
