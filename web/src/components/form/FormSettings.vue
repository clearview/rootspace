<template>
  <form
    @submit.prevent="submit"
  >
    <v-field label="First Name" name="firstname">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          v-model.trim="$v.payload.firstName.$model"
        />
        <span class="icon">
          <v-icon name="user" size="1.5em" />
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.payload.firstName.$error && !$v.payload.firstName.required"
        >First Name is required.</div>
      </div>
    </v-field>

    <v-field label="Last Name" name="lastName">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="lastName"
          type="text"
          placeholder="Enter your last name"
          v-model.trim="$v.payload.lastName.$model"
        />
        <span class="icon">
          <v-icon name="user" size="1.5em" />
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.payload.lastName.$error && !$v.payload.lastName.required"
        >Last Name is required.</div>
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
          v-if="$v.payload.email.$error && !$v.payload.email.required"
        >Email is required.</div>
        <div
          class="error"
          v-if="$v.payload.email.$error && !$v.payload.email.email"
        >Email format is not valid.</div>
      </div>
    </v-field>

    <div class="divider"></div>

    <v-field label="Old Password" name="oldpassword">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="oldpassword"
          type="password"
          placeholder="******"
          v-model.trim="$v.password.password.$model"
        />
        <span class="icon">
          <v-icon name="lock" size="1.5em" />
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.password.password.$error && !$v.password.password.required"
        >Password is required.</div>
        <div
          class="error"
          v-if="$v.password.password.$error && !$v.password.password.minLength"
        >Password must have at least {{ $v.password.password.$params.minLength.min }} letters.</div>
      </div>
    </v-field>

    <v-field label="New Password" name="password">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="password"
          type="password"
          placeholder="******"
          v-model.trim="$v.password.newPassword.$model"
        />
        <span class="icon">
          <v-icon name="lock" size="1.5em" />
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.password.newPassword.$error && !$v.password.newPassword.required"
        >Password is required.</div>

        <div
          class="error"
          v-if="$v.password.newPassword.$error && !$v.password.newPassword.minLength"
        >Password must have at least {{ $v.password.newPassword.$params.minLength.min }} letters.</div>
      </div>
    </v-field>

    <v-field label="Repeat New Password" name="repeatpassword">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="repeatpassword"
          type="password"
          placeholder="******"
          v-model.trim="$v.password.newPassword_confirmation.$model"
        />
        <span class="icon">
          <v-icon name="lock" size="1.5em" />
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="!$v.password.newPassword_confirmation.sameAsPassword"
        >Passwords must be identical.</div>
      </div>
    </v-field>

    <button
      class="btn btn-primary w-full mx-0 mt-5"
      type="button"
      :disabled="$v.payload.$invalid"
      @click="submit()"
    >Save</button>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

import { SettingsResource, PasswordResource } from '@/types/resource'

import VField from '@/components/Field.vue'

type ComponentData = {
  payload: SettingsResource;
  password: PasswordResource;
}

export default Vue.extend({
  name: 'FormSettings',
  components: {
    VField
  },
  data (): ComponentData {
    return {
      payload: {
        firstName: '',
        lastName: '',
        email: ''
      },
      password: {
        password: '',
        newPassword: '',
        newPassword_confirmation: '' // eslint-disable-line
      }
    }
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
        minLength: minLength(6)
      },
      newPassword: {
        required,
        minLength: minLength(6)
      },
      newPassword_confirmation: { // eslint-disable-line
        required,
        minLength: minLength(6),
        sameAsPassword: sameAs('newPassword')
      }
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  created () {
    this.payload = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email
    }
  },
  methods: {
    submit (): void {
      this.$v.payload.$touch()

      if (!this.$v.payload.$invalid) {
        this.$emit('submit', this.payload, this.password)

        this.$v.password.$reset()
        this.password = {
          password: '',
          newPassword: '',
          newPassword_confirmation: '' // eslint-disable-line
        }
      }
    }
  }
})
</script>

<style lang="postcss" scoped>
.divider {
  @apply my-10 border-b-2;
  border-color: theme("colors.secondary.default");
}
</style>
