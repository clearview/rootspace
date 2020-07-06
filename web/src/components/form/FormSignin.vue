<template>
  <form
    class="mt-10"
    @submit.prevent="submit"
  >
    <v-field label="Email" name="email">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="email"
          type="text"
          placeholder="Email"
          v-model.trim="$v.payload.email.$model"
        />
        <span class="icon">
          <v-icon name="email" size="1.5em"/>
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.payload.email.$dirty && !$v.payload.email.required"
        >Email is required.
        </div>
        <div
          class="error"
          v-if="$v.payload.email.$dirty && !$v.payload.email.email"
        >Email format is not valid.
        </div>
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
          <v-icon name="lock" size="1.5em"/>
        </span>
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.payload.password.$dirty && !$v.payload.password.required"
        >Password is required.
        </div>
        <div
          class="error"
          v-if="$v.payload.password.$dirty && !$v.payload.password.minLength"
        >Password must have at least {{ $v.payload.password.$params.minLength.min }} letters.
        </div>
      </div>
    </v-field>

    <a class="forgot-password float-right mb-8">Forgot Password?</a>

    <button
      class="btn btn-primary w-full mx-0"
      type="button"
      :disabled="$v.payload.$invalid"
      @click="submit()"
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
        minLength: minLength(6)
      }
    }
  }
})
export default class FormSignin extends Vue {
    private payload: SigninResource = {
      email: '',
      password: ''
    }

    submit (): void {
      this.$v.payload.$touch()

      if (!this.$v.payload.$invalid) {
        this.$emit('submit', this.payload)
      }
    }
}
</script>
