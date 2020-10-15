<template>
  <form
    @submit.prevent="submit"
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

    <v-field label="Team" name="team" has-addon has-icon-left>
      <v-icon class="icon is-left" name="plus" size="1.3em" viewbox="32"/>
      <input
        type="email"
        class="input"
        v-model.trim="$v.invitation.$model"
        @keypress.enter.stop.prevent="addInvitationList($v.invitation.$model)"
      />

      <template #addon>
        <button
          type="button"
          class="btn"
          :class="{
            'btn-white': $v.invitation.$invalid,
            'btn-success': !$v.invitation.$invalid
          }"
          :disabled="$v.invitation.$invalid"
          @click="addInvitationList($v.invitation.$model)"
        >
          Add
        </button>
      </template>

      <template #feedback v-if="$v.invitation.$error || duplicateMessage">
        <p
          v-if="$v.invitation.$error && !$v.invitation.email"
          class="feedback is-danger"
        >
          Email format is not valid.
        </p>

        <p
          v-if="duplicateMessage"
          v-text="duplicateMessage"
          class="feedback is-success"
        />

        <div
          v-if="$v.invitation.$model.length > 100 && !$v.invitation.email.maxlength"
          class="feedback is-danger"
        >
          Email is too long (maximum is 100 characters)
        </div>
      </template>
    </v-field>

    <div class="list-invitation" v-if="payload.invites.length > 0 || invitationList.length > 0">
      <div
        class="invitation flex"
        v-for="(list, indexList) in invitationList"
        :key="'l-' + indexList"
      >
        <div class="flex flex-grow">
          <avatar :size="28" :src="list.avatar && list.avatar.versions ? list.avatar.versions.default.location : ''"  :username="memberName(list)"></avatar>
          <span class="text-gray-900 pl-2 self-center flex-grow">{{ list.email }}</span>
          <div class="float-right self-center" v-if="list.accepted == false">

            <span class="not-accepted">Not accepted</span>
            <span class="invite-again" @click="addInvitationList(list.email, true)">Invite again</span>
          </div>
        </div>
        <span class="close-icon" v-if="currentUser.email !== list.email" @click="deleteInvitation(indexList, list.email)">
          <v-icon name="close" size=".9em" viewbox="32" title="Remove"/>
        </span>
      </div>

      <div
        class="invitation flex"
        v-for="(invitation, index) in payload.invites"
        :key="index"
      >
        <div class="flex flex-grow">
          <avatar :username="invitation"></avatar>
          <span class="text-gray-900 pl-2 self-center flex-grow">{{ invitation }}</span>
        </div>
        <span class="close-icon" @click="deleteInvitation(index, invitation)">
          <v-icon name="close" size=".9em" viewbox="32" title="Remove"/>
        </span>
      </div>
    </div>

    <slot></slot>

    <button
      v-show="!nobutton"
      class="btn btn-primary w-full mx-0 mt-5"
      type="submit"
      :disabled="$v.payload.$invalid"
    >
      {{ button }}
    </button>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { email, required, maxLength } from 'vuelidate/lib/validators'

import { find } from 'lodash'

import { SpaceResource, UserResource } from '@/types/resource'

import VField from '@/components/Field.vue'
import Avatar from 'vue-avatar'

@Component({
  name: 'FormSpace',
  components: {
    VField,
    Avatar
  },
  validations: {
    payload: {
      title: {
        required,
        maxLength: maxLength(100)
      }
    },
    invitation: {
      required,
      email,
      maxLength: maxLength(100)
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

    private payload: Omit<SpaceResource, 'id'> = {
      title: '',
      invites: []
    };

    get currentUser () {
      return this.$store.state.auth.user
    }

    private invitation = '';
    private duplicateMessage = '';
    private invitationList = [];

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

    @Watch('invitation')
    watchInvitation (newVal: string) {
      if (newVal) {
        this.duplicateMessage = ''
      }
    }

    addInvitationList (email: string, bypassValidation = false): void {
      if (this.$v.invitation.$invalid && !bypassValidation) {
        return
      }
      this.invitation = ''
      let getUser = find(this.payload.invites, (o) => {
        return o === email
      })

      getUser = find(this.invitationList, (o: any) => {
        return o.email === email
      })

      if (getUser) {
        this.duplicateMessage = `A new invitation is sent to ${email}...`
      }

      if (this.isEdit) {
        this.$emit('addUser', email)
      } else {
        this.payload.invites.push(email)
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
}

</script>

<style lang="postcss" scoped>
  .list-invitation {
    @apply border-t border-b border-gray-100 text-gray-400 mb-5 mt-3;

    .invitation {
      @apply py-2;

      &:hover {
        .close-icon {
          @apply visible;
        }
      }

      .vue-avatar--wrapper {
        width: 28px !important;
        height: 28px !important;
        font: 10px / 13px theme("fontFamily.primary") !important;
        float: left;
        border: 2px solid #FFF;
        letter-spacing: 0.03em;
        color: #fff !important;
      }

      .not-accepted {
        @apply px-2 py-1 rounded mr-2 text-xs;

        background: theme("colors.danger.default");
        color: theme("colors.white.default");
      }

      .invite-again {
        @apply mr-2 text-xs;

        color: theme("colors.primary.default");
        cursor: pointer;
      }
    }

    .close-icon {
      @apply rounded-full bg-gray-100 self-center;
      @apply invisible;

      /* transition: all .01s;
      transition-timing-function: ease; */
      padding: 0.15rem;
      cursor: pointer;
    }
  }
</style>
