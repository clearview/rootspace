<template>
  <form
    @submit.prevent="submit"
  >
    <v-field label="Space Name" name="spacename">
      <div class="form-group">
        <input
          class="input w-full leading-tight mx-0"
          id="spacename"
          type="text"
          placeholder="My Space"
          v-model.trim="$v.payload.title.$model"
        />
      </div>
      <div class="error-group">
        <div
          class="error"
          v-if="$v.payload.title.$dirty && !$v.payload.title.required"
        >Title is required.
        </div>
      </div>
    </v-field>

    <v-field label="Team" name="team">
      <div class="input-group">
        <div class="flex -mr-px">
          <span class="input-group-component flex items-center">
            <v-icon name="plus" size="1.3em" viewbox="32"/>
          </span>
        </div>
        <input
          type="email"
          class="input-group-component flex-grow w-px flex-1 border h- px-3 relative text-inherit"
          v-model.trim="$v.invitation.$model"
          @keyup.enter="addInvitationList($v.invitation.$model)"
        />
        <div class="flex">
          <button
            type="button"
            class="button input-group-component flex items-center justify-center"
            :class="{ filled: !$v.invitation.$invalid }"
            :disabled="$v.invitation.$invalid"
            @click="addInvitationList($v.invitation.$model)"
          >Add
          </button>
        </div>
      </div>

      <div class="error-group">
        <div
          class="error"
          v-if="$v.invitation.$dirty && !$v.invitation.email"
        >Email format is not valid.
        </div>
      </div>
      <div class="success-group">
        <div class="success" v-if="duplicateMessage">{{ duplicateMessage }}</div>
      </div>
    </v-field>

    <div class="list-invitation" v-if="payload.invites.length > 0">
      <div
        class="invitation flex items-center"
        v-for="(invitation, index) in payload.invites"
        :key="index"
      >
        <div class="flex-grow text-sm">
          <p class="text-gray-900">{{ invitation }}</p>
        </div>
        <span class="close-icon" @click="deleteInvitation(index, invitation)">
          <v-icon name="close" size=".9em" viewbox="32"/>
        </span>
      </div>
    </div>

    <slot></slot>

    <button
      v-show="!nobutton"
      class="btn btn-primary w-full mx-0 mt-5"
      type="button"
      :disabled="$v.payload.$invalid"
      @click="submit()"
    >{{ button }}
    </button>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { email, required } from 'vuelidate/lib/validators'

import { find } from 'lodash'

import { SpaceResource } from '@/types/resource'

import VField from '@/components/Field.vue'

@Component({
  name: 'FormSpace',
  components: {
    VField
  },
  validations: {
    payload: {
      title: {
        required
      }
    },
    invitation: {
      required,
      email
    }
  }
})
export default class FormSpace extends Vue {
    @Prop({ type: Object })
    private readonly value?: any;

    @Prop({ type: String, default: 'create' })
    private readonly button!: string;

    @Prop({ type: Boolean })
    private readonly nobutton!: boolean;

    @Prop({ type: Boolean })
    private readonly isEdit!: boolean;

    private payload: Omit<SpaceResource, 'id'> = {
      title: '',
      invites: []
    };

    private invitation = '';
    private duplicateMessage = '';

    @Watch('value')
    watchValue (newVal: any) {
      this.payload = {
        title: newVal.title,
        invites: newVal.invites
      }
    }

    @Watch('invitation')
    watchInvitation (newVal: string) {
      if (newVal) {
        this.duplicateMessage = ''
      }
    }

    addInvitationList (email: string): void {
      this.invitation = ''
      const getUser = find(this.payload.invites, (o) => {
        return o === email
      })

      if (getUser) {
        this.duplicateMessage = 'Sending a new invitation to this user...'
      } else {
        this.payload.invites.push(email)
      }

      if (this.isEdit
      ) {
        this.$emit('addUser', email)
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
}

</script>

<style lang="postcss" scoped>
  .list-invitation {
    @apply border-t border-b border-gray-100 text-gray-400 mb-5 mt-3;

    .invitation {
      @apply py-2;

      cursor: pointer;

      &:hover {
        .close-icon {
          @apply visible;
        }
      }
    }

    .close-icon {
      @apply rounded-full bg-gray-100;
      @apply invisible;

      /* transition: all .01s;
      transition-timing-function: ease; */
      padding: 0.15rem;
    }
  }
</style>
