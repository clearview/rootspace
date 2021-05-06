<template>
  <form
    @submit.prevent="submit"
    class="form-space"
  >
    <v-field label="Space Name" name="spacename">
      <input
        class="input"
        id="spacename"
        ref="titleInput"
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

    <div class="form-action">
      <button
        v-show="!nobutton"
        class="btn btn-primary"
        type="submit"
        :disabled="$v.payload.$invalid"
      >
        {{ button }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { required, maxLength } from 'vuelidate/lib/validators'
import Alert from '@/components/Alert.vue'
import VField from '@/components/Field.vue'

@Component({
  name: 'FormSpace',
  components: {
    VField,
    Alert
  },
  validations: {
    payload: {
      title: {
        required,
        maxLength: maxLength(100)
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

    private payload = {
      title: ''
    }

    @Ref('titleInput')
    private readonly titleInputRef!: HTMLInputElement;

    mounted () {
      this.titleInputRef.focus()
    }

    @Watch('value')
    watchValue (newVal: any) {
      this.payload = {
        title: newVal.title
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
  .form-action {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
</style>
