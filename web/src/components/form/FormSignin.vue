<template>
  <form class="form" @submit.prevent="submit">
    <v-field
      label="Email"
      name="email"
      has-icon-right
    >
      <input
        class="input"
        :class="{
          'is-danger': $v.payload.email.$error
        }"
        type="text"
        placeholder="Enter your email"
        v-model.trim="$v.payload.email.$model"
      />
      <legacy-icon
        class="icon is-right"
        name="email"
      />

      <template #feedback>
        <p
          v-if="$v.payload.email.$error && !$v.payload.email.required"
          class="feedback is-danger"
        >
          Field is required.
        </p>
        <p
          v-if="$v.payload.email.$error && !$v.payload.email.email"
          class="feedback is-danger"
        >
          Email format is not valid.
        </p>
      </template>
    </v-field>

    <v-field
      label="Password"
      name="password"
      has-icon-right
    >
      <input
        class="input"
        type="password"
        placeholder="Enter your password"
        v-model.trim="$v.payload.password.$model"
      />
      <legacy-icon
        class="icon is-right"
        name="lock"
      />

      <template #feedback>
        <p
          v-if="$v.payload.password.$error && !$v.payload.password.required"
          class="feedback is-danger"
        >
          Password is required.
        </p>
        <p
          v-if="$v.payload.password.$error && !$v.payload.password.minLength"
          class="feedback is-danger"
        >
          Password must have at least {{ $v.payload.password.$params.minLength.min }} letters.
        </p>
      </template>
    </v-field>

    <v-field align="right">
      <router-link
        :to="{ name: 'ForgotPassword', query: redirectTo }"
        class="text-primary font-bold"
      >Forgot Password?
      </router-link>
    </v-field>

    <button
      class="btn btn-primary w-full mx-0 mt-8"
      type="submit"
      :disabled="$v.payload.$invalid"
    >
      Sign In
    </button>
  </form>
</template>

<script lang="ts">
import { email, minLength, required } from 'vuelidate/lib/validators'

import { SigninResource } from '@/types/resource'

import VField from '@/components/Field.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormSignin',
  components: {
    VField
  },
  validations: {
    payload: {
      email: { required, email },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  }
})
export default class FormSignin extends Vue {
  private payload: SigninResource = {
    email: '',
    password: ''
  }

  private redirectTo: any = null

  mounted () {
    this.redirectTo = this.$route.query ? this.$route.query : {}
    this.$store.commit('option/setRedirect', this.redirectTo)
  }

  submit (): void {
    this.$v.payload.$touch()

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload)
    }
  }
}
</script>
