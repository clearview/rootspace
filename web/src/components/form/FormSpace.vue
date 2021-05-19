<template>
  <form
    @submit.prevent="submit"
    class="form-space"
    :class="{ 'has-slot': hasSlot }"
  >
    <v-field label="Space Name" name="spacename">
      <input
        class="input"
        id="spacename"
        ref="initialInput"
        type="text"
        placeholder="My Space"
        v-model.trim="$v.payload.title.$model"
      />
      <template #feedback v-if="$v.payload.title.$error">
        <div
          v-if="!$v.payload.title.required"
          class="feedback is-danger"
        >
          Field is required.
        </div>
        <div
          v-if="$v.payload.title.$model && !$v.payload.title.maxlength"
          class="feedback is-danger"
        >
          Space name is too long (maximum is 100 characters)
        </div>
      </template>
    </v-field>

    <v-field label="Team" name="team" id="team-field" has-addon has-icon-left>
      <legacy-icon class="icon is-left" name="plus" size="1.3em" viewbox="32"/>
      <input
        type="email"
        class="input"
        v-model.trim="$v.invitation.$model.email"
        @keypress.enter.stop.prevent="addInvitationList($v.invitation.$model.email, $v.invitation.$model.role)"
      />
      <select
        class="input input-role"
        v-model.trim="$v.invitation.$model.role"
        @keypress.enter.stop.prevent="addInvitationList($v.invitation.$model.email, $v.invitation.$model.role)"
        >
        <option :value="undefined" disabled>Select Role</option>
        <option :value="0">Admin</option>
        <option :value="1">Member</option>
      </select>
      <button
        type="button"
        id="btn-add-member"
        class="btn"
        :class="{
          'btn-white': $v.invitation.$invalid,
          'btn-success': !$v.invitation.$invalid,
        }"
        :disabled="$v.invitation.$invalid"
        @click="addInvitationList($v.invitation.$model.email, $v.invitation.$model.role)"
      >
        Add
      </button>

      <template #feedback v-if="($v.invitation.$invalid && $v.invitation.$dirty) || isFormError">
        <div
          v-if="!$v.invitation.$model.email"
          class="feedback is-danger"
        >
          Email is required.
        </div>
        <div
          v-else-if="!$v.invitation.email.email"
          class="feedback is-danger"
        >
          Email format is not valid.
        </div>
        <div
          v-else-if="$v.invitation.email.maxlength"
          class="feedback is-danger"
        >
          Email is too long (maximum is 100 characters).
        </div>
        <div
          v-else-if="!$v.invitation.role.required"
          class="feedback is-danger"
        >
          Role is required.
        </div>
      </template>
    </v-field>

    <Alert v-model="showAlert"/>

    <div class="list-invitation" v-if="payload.invites.length > 0 || invitationList.length > 0">
      <h4 v-if="invitationList.length" class="members-count">
        {{ invitationList.length }} {{ invitationList.length === 1 ? 'Member' : 'Members' }}
      </h4>
      <div
        class="invitation"
        v-for="(list, indexList) in invitationList"
        :key="'l-' + indexList"
      >
        <div class="flex flex-grow">
          <div class="flex cursor-pointer" @click="openProfile(list)">
            <avatar :size="32" :src="list.avatar && list.avatar.versions ? list.avatar.versions.default.location : ''"  :username="memberName(list)"></avatar>
            <span class="text-gray-900 self-center email">{{ list.email }}</span>
          </div>
          <div class="self-center" v-if="list.accepted == false">

            <span class="pending">PENDING</span>
            <span class="invite-again" @click="addInvitationList(list.email, list.role, true)">Invite again</span>
          </div>
        </div>

        <div>
          <select
            v-if="!list.isOwner"
            v-model="invitationList[indexList].role"
            class="input input-role"
            @change="updateRole(indexList)"
          >
            <option :value="undefined" disabled>Select Role</option>
            <option :value="0">Admin</option>
            <option :value="1">Member</option>
          </select>
        </div>
        <span class="close-icon" v-if="currentUser.email !== list.email" @click="deleteInvitation(indexList, list.email)">
          <legacy-icon name="close" size=".9em" viewbox="32" title="Remove"/>
        </span>
      </div>

      <div
        class="invitation new"
        v-for="(invitation, index) in payload.invites"
        :key="index"
      >
        <div class="flex flex-grow">
          <avatar :size="32" :username="invitation.email"></avatar>
          <span class="text-gray-900 pl-2 self-center flex-grow">{{ invitation.email }}</span>
        </div>
        <select v-model="payload.invites[index].role" class="input input-role">
          <option disabled selected>Select Role</option>
          <option value="0">Admin</option>
          <option value="1">Member</option>
        </select>
        <span class="close-icon" @click="deleteInvitation(index, invitation)">
          <legacy-icon name="close" size=".9em" viewbox="32" title="Remove"/>
        </span>
      </div>
    </div>

    <slot></slot>

    <button
      v-show="!nobutton"
      class="btn btn-primary"
      type="submit"
      :disabled="$v.payload.$invalid"
    >
      {{ button }}
    </button>
  </form>
</template>

<script lang="ts">
import { Component, Inject, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { email, required, maxLength } from 'vuelidate/lib/validators'
import { SpaceResource, UserResource } from '@/types/resource'
import Alert from '@/components/Alert.vue'
import VField from '@/components/Field.vue'
import Avatar from 'vue-avatar'
import { ProfileModal, ModalInjectedContext } from '@/components/modal'

@Component({
  name: 'FormSpace',
  components: {
    VField,
    Avatar,
    Alert
  },
  validations: {
    payload: {
      title: {
        required,
        maxLength: maxLength(100)
      }
    },
    invitation: {
      email: {
        required,
        email,
        maxLength: maxLength(100)
      },
      role: {
        required
      }
    }
  }
})
export default class FormSpace extends Vue {
    @Prop({ type: Object })
    private readonly value?: any;

    @Prop({ type: String, default: 'Create' })
    private readonly button!: string;

    @Prop({ type: Boolean })
    private readonly nobutton!: boolean;

    @Prop({ type: Boolean })
    private readonly isEdit!: boolean;

    @Prop({ type: Object })
    private readonly alert!: any;

    @Inject('modal')
    modal!: ModalInjectedContext

    get activeSpace () {
      return this.$store.getters['space/activeSpace'] || {}
    }

    get hasSlot () {
      return !!this.$slots.default
    }

    get showAlert () {
      return this.alert
    }

    set showAlert (value: any) {
      this.$emit('invitesAlertDisplay', value)
    }

    private payload: Omit<SpaceResource, 'id'> = {
      invites: [],
      title: ''
    };

    get currentUser () {
      return this.$store.state.auth.user
    }

    private invitation = {};
    private invitationList = [];
    private isFormError = false;

    @Ref('initialInput')
    private readonly initialInputRef!: HTMLInputElement;

    mounted () {
      this.initialInputRef.focus()
    }

    @Watch('value')
    watchValue (newVal: any) {
      this.payload = {
        title: newVal.title,
        invites: []
      }

      this.invitationList = newVal.invites
    }

    addInvitationList (email: string, role: number, bypassValidation = false): void {
      if (!bypassValidation && !email) {
        this.isFormError = true
        return
      } else if (!bypassValidation && this.$v.invitation.$error) {
        this.isFormError = true
        return
      } else if (!bypassValidation && (role === undefined || role < 0)) {
        this.isFormError = true
        return
      }

      this.invitation = {}
      this.isFormError = false

      if (this.isEdit) {
        this.$emit('addUser', { email, role })
      } else {
        this.payload.invites.push({ email, role })
      }
    }

    updateRole (index: number): void {
      const data: UserResource = this.invitationList[index]
      const { isSpaceUser } = data

      if (isSpaceUser) {
        this.$emit('updateUserSpaceRole', { index, id: this.activeSpace.id, userId: data.id, role: data.role })
      } else {
        this.$emit('updateInvitationRole', { index, id: data.id, role: data.role })
      }
    }

    deleteInvitation (index: number, email: string): void {
      if (this.isEdit) {
        this.$emit('deleteUser', email)
      } else {
        this.payload.invites.splice(index, 1)
      }
    }

    submit (): void {
      this.$v.payload.$touch()

      if (!this.$v.payload.$invalid) {
        this.$emit('submit', this.payload)
      }
    }

    memberName (member: UserResource) {
      if (member.firstName) {
        return `${member.firstName} ${member.lastName}`
      }

      return member.email
    }

    openProfile (user: UserResource) {
      this.modal.open({
        component: ProfileModal,
        attrs: {
          userId: user.id
        }
      })
    }
}

</script>

<style lang="postcss">
  .field {
    label {
      font-size: 0.8125rem;
    }
  }

  #team-field {
    margin-bottom: 24px;

    .control {
      display: grid;
      grid-template-columns: auto 105px 64px;
      grid-column-gap: 8px;

      .input.input-role {
        padding-left: 8px;
      }
    }
  }

  .input.input-role {
    position: relative;
    padding: 0 8px 0 8px;
    font-size: 0.75rem;
    font-weight: bold;
    appearance: none;

    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.03647 6.5547C4.59343 5.89014 5.06982 5 5.86852 5H10.1315C10.9302 5 11.4066 5.89015 10.9635 6.5547L8.83205 9.75192C8.43623 10.3457 7.56377 10.3457 7.16795 9.75192L5.03647 6.5547Z' fill='%23444754'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: calc(100% - 5px) center;
  }

  #btn-add-member {
    padding-left: 0;
    padding-right: 0;

    &:not([disabled]) {
      background: theme('colors.gray.900');
      border-color: theme('colors.gray.900');
    }
  }

  .list-invitation {
    border-top: solid 1px #E0E2E7;
    margin-bottom: 24px;

    .members-count {
      font-size: 0.875rem;
      font-weight: bold;
      margin-bottom: 8px;
      margin-top: 24px;
    }

    .invitation {
      border-bottom: solid 1px #E0E2E7;
      padding-top: 16px;
      padding-bottom: 16px;
      display: grid;
      grid-template-columns: auto 85px 32px;
      grid-column-gap: 8px;
      align-items: center;

      .email {
        margin-right: 4px;
      }

      &:hover {
        .close-icon {
          @apply visible;
        }

      }

      .vue-avatar--wrapper {
        font: 10px / 13px theme("fontFamily.primary") !important;
        float: left;
        border: 2px solid #FFF;
        letter-spacing: 0.03em;
        color: #fff !important;
        margin-right: 8px;
      }

      .pending {
        @apply px-2 py-1 mr-2 text-xs;

        border-radius: 20px;
        padding-top: 0.18rem;
        padding-bottom: 0.18rem;

        background: #FFEAD2;
        color: #F2994A;
      }

      .invite-again {
        @apply mr-2 text-xs;
        white-space: nowrap;

        color: theme("colors.primary.default");
        cursor: pointer;
      }
    }

    .close-icon {
      @apply flex rounded-full self-center;
      cursor: pointer;
      height: 32px;
      width: 32px;
      align-items: center;
      justify-content: center;
      color: #2C2B35;

      &:hover {
        background: #F4F5F7;
      }
    }
  }

  .form-space {
    button[type="submit"] {
      width: 100%;
    }

    &.has-slot button[type="submit"] {
      width: 82px;
      float: right;
      padding-left: 0px;
      padding-right: 0px;
    }
  }
</style>
