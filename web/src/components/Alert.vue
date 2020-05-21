<template>
  <div
    v-if="visible"
    class="alert"
    :class="`alert-${value.type}`"
    @click="close"
  >
    <div>
      <div class="message">
        <span class="mr-1">
          <v-icon
            name="warning"
            size="1.5em"
          />
        </span>
        <p>{{ value.message }}.</p>
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
import Vue, { PropType } from 'vue'

type AlertModel = {
  type: string;
  message: string;
  fields: string[];
}

export default Vue.extend({
  name: 'Alert',
  props: {
    value: {
      type: Object as PropType<AlertModel>,
      require: true
    }
  },
  computed: {
    visible () {
      return !!this.value
    }
  },
  methods: {
    close () {
      this.$emit('input', null)
    }
  }
})
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
