<template>
  <form class="form" @submit.prevent="submit">
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

      <template #feedback v-if="$v.payload.firstName.$error">
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

      <template #feedback v-if="$v.payload.lastName.$error">
        <div
          v-if="!$v.payload.lastName.required"
          class="feedback is-danger"
        >
          Last Name is required.
        </div>
      </template>
    </v-field>

    <v-field
      label="Email"
      name="email"
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

      <template #feedback v-if="$v.payload.email.$error">
        <p
          v-if="!$v.payload.email.required"
          class="feedback is-danger"
        >
          Email is required.
        </p>
        <p
          v-if="!$v.payload.email.email"
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
        id="password"
        type="password"
        placeholder="Enter your password"
        v-model.trim="$v.payload.password.$model"
      />
      <span class="icon is-right">
        <v-icon
          name="lock"
          size="1.5em"
        />
      </span>

      <template #feedback v-if="$v.payload.password.$dirty">
        <p
          v-if="!$v.payload.password.required"
          class="feedback is-danger"
        >
          Password is required.
        </p>
        <div
          v-if="!$v.payload.password.minLength"
          class="feedback is-danger"
        >
          Password must have at least {{ $v.payload.password.$params.minLength.min }} letters.
        </div>
      </template>
    </v-field>

    <v-field
      label="Repeat Password"
      name="repeatpassword"
      has-icon-right
    >
      <input
        class="input"
        id="repeatpassword"
        type="password"
        placeholder="Enter your password again"
        v-model.trim="$v.payload.passwordConfirmation.$model"
      />
      <v-icon
        class="icon is-right"
        name="lock"
        size="1.5em"
      />

      <template #feedback v-if="$v.payload.passwordConfirmation.$error">
        <p
          v-if="!$v.payload.passwordConfirmation.sameAsPassword"
          class="feedback is-danger"
        >
          Passwords must be identical.
        </p>
      </template>
    </v-field>

    <button
      class="btn btn-primary w-full mx-0 mt-5"
      type="submit"
      :disabled="$v.payload.$invalid"
    >
      Sign Up
    </button>
  </form>
</template>

<script lang="ts">
import { email, minLength, required, sameAs } from 'vuelidate/lib/validators'

import { SignupResource } from '@/types/resource'

import VField from '@/components/Field.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormSignup',
  components: {
    VField
  },
  validations: {
    payload: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      password: {
        required,
        minLength: minLength(8)
      },
      passwordConfirmation: { // eslint-disable-line
        required,
        minLength: minLength(8),
        sameAsPassword: sameAs('password')
      }
    }
  }
})
export default class FormSignup extends Vue {
  private payload: SignupResource = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '' // eslint-disable-line
  }

  submit (): void {
    this.$v.payload.$touch()

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload)
    }
  }
}
</script>
