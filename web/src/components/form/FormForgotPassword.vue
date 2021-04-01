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

    <button
      class="btn btn-primary w-full mx-0 mt-8"
      type="submit"
      :disabled="$v.payload.$invalid"
    >
      Send
    </button>

    <v-field align="center"  class="mt-6">
      <router-link
        :to="{ name: 'SignIn', query: redirectTo }"
        class="text-primary font-bold"
      >Back to Login
      </router-link>
    </v-field>
  </form>
</template>

<script lang="ts">
import { email, required } from 'vuelidate/lib/validators'

import VField from '@/components/Field.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormForgotPassword',
  components: {
    VField
  },
  validations: {
    payload: {
      email: { required, email }
    }
  }
})
export default class FormForgotPassword extends Vue {
  private payload = {
    email: ''
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
