<template>
  <div class="alert alert-danger signup-alert" v-if="showErrorMessage">
    <div>
      <div class="message">
        <span class="mr-1">
          <v-icon name="warning" size="1.5em" />
        </span>
        <p>{{ errorMessage.message }}.</p>
      </div>

      <ul v-if="formatFieldMessages">
        <li v-for="(message, index) in formatFieldMessages" :key="index">{{ message }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import VIcon from '@/components/icons/Index.vue'

type TheField = {
  message: string;
  validation: string;
  field: string;
}

export default Vue.extend({
  name: 'ButtonLock',
  components: {
    VIcon
  },
  computed: {
    formatFieldMessages () {
      const messages: Array<string> = []
      const fields = this.errorMessage.fields

      if (fields && fields.length > 0) {
        fields.forEach((thefield: TheField) => {
          if (thefield.field === 'email' && thefield.validation === 'unique') {
            messages.push('Email is already exist')
          }
          if (thefield.validation === 'required') {
            switch (thefield.field) {
              case 'name':
                messages.push('Name is required')
                break
              case 'email':
                messages.push('Email is required')
                break
              case 'password':
                messages.push('Password is required')
                break
              case 'password_confirmation':
                messages.push('Password Confirmation is required')
                break
            }
          }
        })
      }

      return messages
    },
    ...mapState('error', ['showErrorMessage', 'errorMessage'])
  }
})
</script>

<style scoped>
.signup-alert {
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
