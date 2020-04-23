<template>
  <button class="btn w-full mx-0" type="button" v-on:click="authWithGoogle()">
    <span class="mr-1">
      <v-icon name="google" size="1.1em" />
    </span>
    {{ text }} with Google
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'ButtonLock',
  components: {
    VIcon
  },
  props: {
    text: {
      type: String
    }
  },
  methods: {
    authWithGoogle () {
      const API: string = process.env.VUE_APP_API_URL
      location.href = `${API}/auth/google`
    }
  }
})
</script>
