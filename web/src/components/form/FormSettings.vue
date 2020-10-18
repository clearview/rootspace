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
        <p
          v-if="$v.payload.firstName.$model.length > 100 && !$v.payload.firstName.maxlength"
          class="feedback is-danger"
        >
          First name is too long (maximum is 100 characters)
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

        <p
          v-if="$v.payload.lastName.$model && !$v.payload.lastName.maxlength"
          class="feedback is-danger"
        >
          Last name is too long (maximum is 100 characters)
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
        <div
          v-if="$v.payload.email.$model && !$v.payload.email.maxlength"
          class="feedback is-danger"
        >
          Email is too long (maximum is 100 characters)
        </div>
      </template>
    </v-field>

    <a
      class="btn w-full mx-0 mt-5 clear-both pointer"
      @click="changePasswordModal(true)"
    >
      Change Password
    </a>

    <button
      class="btn btn-primary w-full mx-0 mt-5 btn-submit"
      type="submit"
      :disabled="$v.payload.$invalid"
    >
      Save
    </button>

    <modal
      title="Change Password"
      :visible="isModalVisible('changePassword')"
      :contentStyle="{ width: '456px' }"
      @cancel="changePasswordModal(false, 'changePassword')"
      @confirm="() => $refs.changePasswordForm.submit()"
    >
      <div class="modal-body">
        <form-change-password
          ref="changePasswordForm"
          @submit="changePassword"
        />
      </div>
    </modal>
  </form>
</template>

<script lang="ts">
import { email, required, maxLength } from 'vuelidate/lib/validators'

import { PasswordResource } from '@/types/resource'

import VField from '@/components/Field.vue'
import Modal from '@/components/Modal.vue'
import FormChangePassword from '@/components/form/FormChangePassword.vue'

import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'FormSettings',
  components: {
    VField,
    Modal,
    FormChangePassword
  },
  validations: {
    payload: {
      firstName: { required, maxLength: maxLength(100) },
      lastName: { required, maxLength: maxLength(100) },
      email: { required, email, maxLength: maxLength(100) }
    }
  }
})

export default class FormSettings extends Vue {
  private payload = {
    firstName: '',
    lastName: '',
    email: ''
  }

  private modal = {
    visible: false,
    type: '',
    loading: false,
    alert: null
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
    console.log('submit -----', this.payload)
    this.$v.payload.$touch()

    console.log('submit', this.payload)

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload)
    }
  }

  isModalVisible (type: string): boolean {
    return type === 'changePassword' && this.modal.visible
  }

  changePasswordModal (visible: boolean, type = '') {
    this.modal = {
      ...this.modal,

      type,
      visible
    }

    console.log('password')
  }

  async changePassword (data: PasswordResource) {
    this.modal.loading = true

    try {
      console.log('datadatadata', data)
      this.$emit('submit', {}, data)
      // await this.$store.dispatch('tree/createFolder', data)
    } catch { }

    this.modal.loading = false

    this.changePasswordModal(false)
  }
}
</script>

<style lang="postcss" scoped>
.btn-submit {
  margin-left: 0;
}
</style>
