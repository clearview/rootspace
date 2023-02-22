<template>
  <div
    v-if="visible"
    class="alert"
    :class="`alert-${value.type}`"
    @click="close"
  >
    <div>
      <div class="message">
        <span v-if="!value.noicon" class="mr-1">
          <legacy-icon
            name="warning"
            size="1.5em"
          />
        </span>
        <p>{{ value.message }}</p>
      </div>

      <ul v-if="value.fields">
        <li
          v-for="(field, key) in value.fields"
          v-text="field"
          :key="key"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

type AlertModel = {
  type: string;
  message: string;
  fields: string[];
}

@Component({
  name: 'Alert'
})
export default class Alert extends Vue {
  @Prop({ type: Object })
  private readonly value!: AlertModel

  get visible () {
    return !!this.value
  }

  close () {
    this.$emit('input', null)
  }
}
</script>

<style lang="postcss" scoped>
.alert {
  line-height: 1.5;

  .message {
    @apply flex flex-row;
  }

  ul {
    @apply list-disc;

    margin: 0 1rem 0.3rem 2.8rem;
  }
}
</style>
