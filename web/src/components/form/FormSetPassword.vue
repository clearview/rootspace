<template>
  <form class="form" @submit.prevent="submit">
    <v-field
      label="New Password"
      name="password"
      has-icon-right
    >
      <input
        class="input"
        id="password"
        type="password"
        placeholder="Enter new password"
        v-model.trim="$v.payload.password.$model"
      />
      <v-icon
        class="icon is-right"
        name="lock"
        size="1.5em"
      />

      <template #feedback v-if="$v.payload.password.$error">
        <p
          v-if="!$v.payload.password.required"
          class="feedback is-danger"
        >
          Password is required.
        </p>

        <p
          v-if="!$v.payload.password.minLength"
          class="feedback is-danger"
        >
          Password must have at least {{ $v.payload.password.$params.minLength.min }} letters.
        </p>
      </template>
    </v-field>

    <v-field
      label="Repeat New Password"
      name="repeatpassword"
      has-icon-right
    >
      <input
        class="input"
        id="repeatpassword"
        type="password"
        placeholder="Enter new password again"
        v-model.trim="$v.payload.password_confirmation.$model"
      />
        <v-icon
          class="icon is-right"
          name="lock"
          size="1.5em"
        />

      <template #feedback v-if="$v.payload.password_confirmation.$error">
        <p
          v-if="!$v.payload.password_confirmation.sameAsPassword"
          class="feedback is-danger"
        >
          Passwords must be identical.
        </p>
      </template>
    </v-field>

    <p class="password-hint">Password must contain at least 8 characters</p>

    <button
      class="btn btn-primary w-full mx-0 mt-8"
      type="submit"
      :disabled="$v.payload.$invalid"
    >
      Change Password
    </button>
  </form>
</template>

<script lang="ts">
import { email, minLength, required, sameAs } from 'vuelidate/lib/validators'

import { PasswordResetResource } from '@/types/resource'

import VField from '@/components/Field.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormSetPassword',
  components: {
    VField
  },
  validations: {
    payload: {
      password: {
        required,
        minLength: minLength(8)
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      password_confirmation: {
        required,
        minLength: minLength(8),
        sameAsPassword: sameAs('password')
      }
    }
  }
})
export default class FormSetPassword extends Vue {
  private payload: PasswordResetResource = {
    token: '',
    password: '',
    // eslint-disable-next-line @typescript-eslint/camelcase
    password_confirmation: ''
  }

  private redirectTo: any = null

  mounted () {
    this.redirectTo = this.$route.query ? this.$route.query : {}
    this.$store.commit('option/setRedirect', this.redirectTo)
  }

  submit (): void {
    this.$v.payload.$touch()

    this.payload.token = this.$route.params.token

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload)

      this.$v.payload.$reset()
    }
  }
}
</script>

<style lang="postcss" scoped>
.password-hint {
  @apply mb-8 mt-5;

  color: theme("colors.gray.400");
}
</style>
