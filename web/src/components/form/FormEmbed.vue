<template>
  <form
    class="flex flex-col flex-1"
    @submit.prevent="submit"
  >
    <div class="types">
      <img
        v-for="item in types"
        draggable="false"
        :class="{
          'type': true,
          'is-active': payload.type === item.key
        }"
        :key="item.key"
        :src="item.image"
        :title="item.label"
        :alt="item.label"
        @click="payload.type = item.key"
      />
    </div>

    <field
      class="mt-6"
      label="Title"
    >
      <input
        v-model="payload.title"
        class="input w-full"
        placeholder="Enter title"
      />
    </field>

    <field class="mb-6">
      <textarea
        v-model="payload.content"
        class="textarea w-full"
        placeholder="Paste embed code here..."
      />
      </field>

    <a
      class="help"
      :class="{
        visible: typeData.help,
        invisible: !typeData.help
      }"
      target="_blank"
      :href="typeData.help"
    >
      How to find {{ typeData.label }} embed code?
    </a>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { required } from 'vuelidate/lib/validators'
import Field from '@/components/Field.vue'

import { EmbedResource, EmbedType } from '@/services/embed'

interface EmbedTypeData {
  key: EmbedType;
  label: string;
  image: string;
  help?: string;
}

const embedTypeData: EmbedTypeData[] = [
  {
    key: EmbedType.AIRTABLE,
    label: 'Airtable',
    image: require('@/assets/images/embed-airtable.svg'),
    help: 'https://support.airtable.com/hc/en-us/articles/217846478'
  },
  {
    key: EmbedType.GOOGLE_SHEETS,
    label: 'Google Sheets',
    image: require('@/assets/images/embed-google-sheets.svg'),
    help: 'https://support.google.com/docs/answer/183965?co=GENIE.Platform%3DDesktop&hl=en'
  },
  {
    key: EmbedType.FIGMA,
    label: 'Figma',
    image: require('@/assets/images/embed-figma.svg'),
    help: 'https://help.figma.com/hc/en-us/articles/360039827134-Embed-files-and-prototypes'
  },
  {
    key: EmbedType.CUSTOM,
    label: 'Custom',
    image: require('@/assets/images/embed-custom.svg')
  }
]

@Component({
  components: {
    Field
  },
  validations: {
    payload: {
      type: { required },
      content: { required }
    }
  }
})
export default class FormEmbed extends Vue {
  @Prop(Object)
  readonly value!: EmbedResource

  @Prop(Number)
  readonly space!: number

  payload = {
    id: 0,
    spaceId: this.space,
    title: '',
    type: '',
    content: ''
  }

  get types (): EmbedTypeData[] {
    return embedTypeData
  }

  get typeData (): Partial<EmbedTypeData> {
    return Object.values(embedTypeData).find(x => this.payload.type === x.key) || {}
  }

  submit () {
    this.$v.payload.$touch()

    if (!this.$v.payload.$invalid) {
      this.$emit('submit', this.payload)
    }
  }

  @Watch('value', { immediate: true })
  watchValue (value: EmbedResource) {
    this.payload = {
      ...this.payload,
      ...value
    }
  }
}
</script>

<style lang="postcss" scoped>
.types {
  @apply flex flex-wrap justify-between;
}

.type {
  @apply border border-gray-400 rounded;
  @apply cursor-pointer;

  transition: 0.3s;

  &:nth-child(n + 3) {
    @apply mt-4;
  }

  &.is-active {
    @apply border-primary;

    background-color: rgba(theme("colors.primary.default"), 0.08);
  }
}

.textarea {
  height: 104px;
}

.help {
  @apply text-primary font-bold underline leading-none;
}
</style>
