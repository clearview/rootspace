<template>
  <form class="form" @submit.prevent="submit">
    <v-field
      label="Current Password"
      name="oldpassword"
      has-icon-right
      v-if="this.user.authProvider !== 'google'"
    >
      <input
        class="input w-full leading-tight mx-0"
        id="oldpassword"
        type="password"
        placeholder="Enter current password"
        v-model.trim="$v.payload.password.$model"
      />
      <v-icon
        class="icon is-right"
        name="lock"
        size="1.5em"
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
        v-model.trim="$v.payload.newPassword.$model"
      />
      <v-icon
        class="icon is-right"
        name="lock"
        size="1.5em"
      />

      <template #feedback v-if="$v.payload.newPassword.$error">
        <p
          v-if="!$v.payload.newPassword.required"
          class="feedback is-danger"
        >
          Password is required.
        </p>

        <p
          v-if="!$v.payload.newPassword.minLength"
          class="feedback is-danger"
        >
          Password must have at least {{ $v.payload.newPassword.$params.minLength.min }} letters.
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
        v-model.trim="$v.payload.newPassword_confirmation.$model"
      />
        <v-icon
          class="icon is-right"
          name="lock"
          size="1.5em"
        />

      <template #feedback v-if="$v.payload.newPassword_confirmation.$error">
        <p
          v-if="!$v.payload.newPassword_confirmation.sameAsPassword"
          class="feedback is-danger"
        >
          Passwords must be identical.
        </p>
      </template>
    </v-field>

    <p class="password-hint">Password must contain at least 8 characters</p>
  </form>
</template>

<script lang="ts">
import { minLength, required, sameAs, maxLength, requiredIf } from 'vuelidate/lib/validators'

import { PasswordResource } from '@/types/resource'

import VField from '@/components/Field.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormChangePassword',
  components: {
    VField
  },
  validations: {
    payload: {
      password: {
        required: requiredIf(function (): boolean {
          return this.user.authProvider !== 'google'
        }),
        minLength: minLength(8),
        maxLength: maxLength(100)
      },
      newPassword: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(100)
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      newPassword_confirmation: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(100),
        sameAsPassword: sameAs('newPassword')
      }
    }
  }
})

export default class FormSetPassword extends Vue {
  private payload: PasswordResource = {
    password: '',
    newPassword: '',
    // eslint-disable-next-line @typescript-eslint/camelcase
    newPassword_confirmation: ''
  }

  get user () {
    return this.$store.state.auth.user
  }

  submit (): void {
    this.$v.payload.$touch()
    console.log('submit passwords', this.$v.payload)

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload)

      this.$v.payload.$reset()

      this.user.authProvider = 'local'

      this.payload = {
        password: '',
        newPassword: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        newPassword_confirmation: ''
      }
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
