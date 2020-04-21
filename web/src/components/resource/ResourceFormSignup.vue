<template>
  <form
    class="mt-10"
    @submit.prevent="submit"
  >
    <v-field label="Full Name" name="fullname">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="fullname"
          type="text"
          placeholder="Enter your full name"
          v-model.trim="$v.payload.name.$model"
        />
        <span class="icon">
          <v-icon name="user" size="1.5em" />
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.payload.name.$dirty && !$v.payload.name.required"
        >Full Name is required.</div>
      </div>
    </v-field>

    <v-field label="Email" name="email">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="email"
          type="text"
          placeholder="Enter your email"
          v-model.trim="$v.payload.email.$model"
        />
        <span class="icon">
          <v-icon name="email" size="1.5em" />
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.payload.email.$dirty && !$v.payload.email.required"
        >Email is required.</div>
        <div
          class="error"
          v-if="$v.payload.email.$dirty && !$v.payload.email.email"
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
          v-model.trim="$v.payload.password.$model"
        />
        <span class="icon">
          <v-icon name="lock" size="1.5em" />
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.payload.password.$dirty && !$v.payload.password.required"
        >Password is required.</div>
        <div
          class="error"
          v-if="$v.payload.password.$dirty && !$v.payload.password.minLength"
        >Password must have at least {{ $v.payload.password.$params.minLength.min }} letters.</div>
      </div>
    </v-field>

    <v-field label="Repeat Password" name="repeatpassword">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="repeatpassword"
          type="password"
          placeholder="******"
          v-model.trim="$v.payload.password_confirmation.$model"
        />
        <span class="icon">
          <v-icon name="lock" size="1.5em" />
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="!$v.payload.password_confirmation.sameAsPassword"
        >Passwords must be identical.</div>
      </div>
    </v-field>

    <button
      class="btn btn-primary w-full mx-0 mt-5"
      type="button"
      :disabled="$v.payload.$invalid"
      v-on:click="submit()"
    >Sign Up</button>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

import { SignupResource } from '@/types/resource'

import VField from '@/components/Field.vue'
import VIcon from '@/components/icons/Index.vue'

type ComponentData = {
  payload: SignupResource;
}

export default Vue.extend({
  name: 'ResourceFormSignup',
  mixins: [validationMixin],
  components: {
    VField,
    VIcon
  },
  data (): ComponentData {
    return {
      payload: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '' // eslint-disable-line
      }
    }
  },
  validations: {
    payload: {
      name: { required },
      email: { required, email },
      password: {
        required,
        minLength: minLength(6)
      },
      password_confirmation: { // eslint-disable-line
        required,
        minLength: minLength(6),
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    submit (): void {
      this.$v.payload.$touch()

      if (!this.$v.payload.$invalid) {
        this.$emit('submit', this.payload)
      }
    }
  }
})
</script>
