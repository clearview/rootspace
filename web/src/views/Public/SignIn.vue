<template>
  <layout-public>
    <div class="max-w-xs mx-auto p-4 mt-20">
      <h2 class="text-center">Sign In</h2>
      <p class="text-center mb-2">Enter your information below to continue</p>

      <v-alert v-model="alert"/>

      <form-signin class="mt-10" @submit="userSignin"/>

      <div class="my-10">
        <p class="separator">
          <span class="separator-text">or</span>
        </p>
      </div>

      <button-auth-google text="Sign In with Google"/>

      <p class="w-full mt-16 mb-5 text-center">
        Don't have an account yet?
        <router-link
          :to="{ name: 'SignUp', query: redirectTo }"
          class="font-semibold text-primary"
        >Sign Up
        </router-link>
      </p>
    </div>

    <v-loading :loading="isLoading">
      <p>Login to RootApp...</p>
    </v-loading>
  </layout-public>
</template>

<script lang="ts">

import { SigninResource } from '@/types/resource'

import VAlert from '@/components/Alert.vue'
import LayoutPublic from '@/components/LayoutPublic.vue'
import VLoading from '@/components/Loading.vue'
import FormSignin from '@/components/form/FormSignin.vue'
import ButtonAuthGoogle from '@/components/ButtonAuthGoogle.vue'
import { Component, Vue } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'

@Component({
  name: 'Signin',
  components: {
    VAlert,
    LayoutPublic,
    VLoading,
    FormSignin,
    ButtonAuthGoogle
  }
})
export default class SignIn extends Vue {
    private isLoading = false
    private alert: any = null
    private redirectTo: any = null

    mounted () {
      this.redirectTo = this.$route.query ? this.$route.query : {}
      this.$store.commit('option/setRedirect', this.redirectTo)
    }

    created () {
      const query = this.$route.query

      if (query.from === 'passwordreset' && query.text === 'tokenexpired') {
        this.alert = {
          type: 'danger',
          message: 'Reset password token has expired, please request a new one',
          noicon: true
        }
        // this.$router.replace({ query: undefined })
      } else if (query.from === 'passwordreset') {
        this.alert = {
          type: 'success',
          message: 'Password has been changed successfully',
          noicon: true
        }
        // eslint-disable-next-line
        const { from, ...redirectQuery } = query
        this.$router.replace({ query: redirectQuery })
      }
    }

    async userSignin (data: SigninResource) {
      const { redirectTo } = this.$route.query
      const inviteToken = window.localStorage.getItem('root:invite:token')

      this.isLoading = true

      try {
        await this.$store.dispatch('auth/signin', {
          type: 'email',
          payload: data
        })

        let target: RawLocation

        if (inviteToken) {
          target = {
            name: 'Invitation',
            params: {
              token: inviteToken
            }
          }
        } else if (redirectTo) {
          target = { path: redirectTo.toString() }
        } else {
          target = { name: 'Main' }
        }

        await this.$router.push(target)
      } catch (err) {
        const message = err.message === 'Unauthorized' ? 'Incorrect email or password entered.' : err.message

        this.alert = {
          type: 'danger',
          message: message
        }
      } finally {
        this.isLoading = false
      }
    }
}
</script>
