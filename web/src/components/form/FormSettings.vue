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
      {{ passwordModalTitle }}
    </a>

    <button
      class="btn btn-primary w-full mx-0 mt-5 btn-submit"
      type="submit"
      :disabled="$v.payload.$invalid"
    >
      Save
    </button>

    <modal
      :title="passwordModalTitle"
      :visible="isModalVisible('changePassword')"
      :is-loading="modal.loading"
      :contentStyle="{ width: '456px' }"
      @cancel="changePasswordModal(false, 'changePassword')"
      @confirm="() => $refs.changePasswordForm.submit()"
    >
      <div class="modal-body">
        <Alert v-model="password.alert"/>
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
import Modal from '@/components/legacy/Modal.vue'
import FormChangePassword from '@/components/form/FormChangePassword.vue'
import UserService from '@/services/user'
import Alert from '@/components/Alert.vue'

import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'FormSettings',
  components: {
    VField,
    Modal,
    FormChangePassword,
    Alert
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
  private loadingMessage = 'Update Password...'
  private isLoading = false;

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

  private password: any = {
    alert: null
  };

  get user () {
    return this.$store.state.auth.user
  }

  get passwordModalTitle () {
    return this.user.authProvider === 'local' ? 'Change Password' : 'Set Password'
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
      this.$emit('submit-account', this.payload)
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
    this.password.alert = null
  }

  async changePassword (data: PasswordResource) {
    try {
      await this.updatePassword(data)
    } catch {
      this.modal.loading = false
    }
  }

  async updatePassword (password: PasswordResource) {
    try {
      this.modal.loading = true
      let message = ''

      await UserService.passwordChange(password)
      message += 'Your password have been saved'

      // await this.$store.dispatch('auth/whoami')

      this.password.alert = {
        type: 'success',
        message: message
      }
    } catch (err) {
      const message = err.message === 'Unauthorized' ? 'You have entered an incorrect current password' : err.message

      this.password.alert = {
        type: 'danger',
        message: message,
        fields: err.fields
      }
    } finally {
      this.modal.loading = false
    }
  }
}
</script>

<style lang="postcss" scoped>
.btn-submit {
  margin-left: 0;
}
</style>
