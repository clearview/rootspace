<template>
  <form @submit.prevent="submit">
    <v-field
      label="First Name"
      name="firstname"
      has-icon-right
    >
      <input
        class="input"
        id="firstName"
        type="text"
        placeholder="Enter your first name"
        v-model.trim="$v.payload.firstName.$model"
      />
      <v-icon
        class="icon is-right"
        name="user"
        size="1.5em"
      />

      <template
        #feedback
        v-if="$v.payload.firstName.$error"
      >
        <p
          v-if="!$v.payload.firstName.required"
          class="feedback is-danger"
        >
          First Name is required.
        </p>
      </template>
    </v-field>

    <v-field
      label="Last Name"
      name="lastName"
      has-icon-right
    >
      <input
        class="input"
        id="lastName"
        type="text"
        placeholder="Enter your last name"
        v-model.trim="$v.payload.lastName.$model"
      />
      <v-icon
        class="icon is-right"
        name="user"
        size="1.5em"
      />

      <template
        #feedback
        v-if="$v.payload.lastName.$error"
      >
        <p
          v-if="!$v.payload.lastName.required"
          class="feedback is-danger"
        >
          Last Name is required.
        </p>
      </template>
    </v-field>

    <v-field
      label="Email"
      name="email"
      has-icon-right
    >
      <input
        class="input"
        id="email"
        type="text"
        placeholder="Enter your email"
        v-model.trim="$v.payload.email.$model"
      />
      <v-icon
        class="icon is-right"
        name="email"
        size="1.5em"
      />

      <template
        #feedback
        v-if="$v.payload.email.$error"
      >
        <div
          v-if="!$v.payload.email.required"
          class="feedback is-danger"
        >
          Email is required.
        </div>
        <div
          class="error"
          v-if="$v.payload.email.$error && !$v.payload.email.email"
        >
          Email format is not valid.
        </div>
      </template>
    </v-field>

    <div class="divider"></div>

    <v-field
      label="Old Password"
      name="oldpassword"
      has-icon-right
      v-if="this.user.authProvider !== 'google'"
    >
      <input
        class="input w-full leading-tight mx-0"
        id="oldpassword"
        type="password"
        placeholder="Enter current password"
        v-model.trim="$v.password.password.$model"
      />
      <v-icon
        class="icon is-right"
        name="lock"
        size="1.5em"
      />

      <template #feedback>
        <p
          v-if="$v.password.password.$error && !$v.password.password.required"
          class="feedback is-danger"
        >
          Password is required.
        </p>
        <p
          v-if="$v.password.password.$error && !$v.password.password.minLength"
          class="feedback is-danger"
        >
          Password must have at least {{ $v.password.password.$params.minLength.min }} letters.
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
        v-model.trim="$v.password.newPassword.$model"
      />
      <v-icon
        class="icon is-right"
        name="lock"
        size="1.5em"
      />

      <template #feedback v-if="$v.password.newPassword.$error">
        <p
          v-if="!$v.password.newPassword.required"
          class="feedback is-danger"
        >
          Password is required.
        </p>

        <p
          v-if="!$v.password.newPassword.minLength"
          class="feedback is-danger"
        >
          Password must have at least {{ $v.password.newPassword.$params.minLength.min }} letters.
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
        v-model.trim="$v.password.newPassword_confirmation.$model"
      />
        <v-icon
          class="icon is-right"
          name="lock"
          size="1.5em"
        />

      <template #feedback v-if="$v.password.newPassword_confirmation.$error">
        <p
          v-if="!$v.password.newPassword_confirmation.sameAsPassword"
          class="feedback is-danger"
        >
          Passwords must be identical.
        </p>
      </template>
    </v-field>

    <p class="password-hint">Password must contain at least 8 characters</p>

    <button
      class="btn btn-primary w-full mx-0 mt-5"
      type="submit"
      :disabled="$v.payload.$invalid"
    >
      Save
    </button>
  </form>
</template>

<script lang="ts">
import { email, minLength, required, sameAs } from 'vuelidate/lib/validators'

import { PasswordResource } from '@/types/resource'

import VField from '@/components/Field.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormSettings',
  components: {
    VField
  },
  validations: {
    payload: {
      firstName: { required },
      lastName: { required },
      email: { required, email }
    },
    password: {
      password: {
        required,
        minLength: minLength(8)
      },
      newPassword: {
        required,
        minLength: minLength(8)
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      newPassword_confirmation: {
        required,
        minLength: minLength(8),
        sameAsPassword: sameAs('newPassword')
      }
    }
  }
})
export default class FormSettings extends Vue {
  private payload = {
    firstName: '',
    lastName: '',
    email: ''
  }

  private password: PasswordResource = {
    password: '',
    newPassword: '',
    // eslint-disable-next-line @typescript-eslint/camelcase
    newPassword_confirmation: ''
  }

  get user () {
    return this.$store.state.auth.user
  }

  created () {
    this.payload = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email
    }
  }

  submit (): void {
    this.$v.payload.$touch()

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload, this.password)

      this.$v.password.$reset()
      this.password = {
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
.divider {
  @apply my-8 border-b-2;

  border-color: theme("colors.secondary.default");
}

.password-hint {
  @apply mb-8 mt-5;

  color: theme("colors.gray.400");
}
</style>
