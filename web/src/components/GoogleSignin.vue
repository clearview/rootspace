<template>
  <button class="btn w-full mx-0" type="button" @click="authWithGoogle()">
    <span class="mr-1">
      <v-icon name="google" size="1.1em" />
    </span>
    {{ text }} with Google
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { isEmpty } from 'lodash/fp'

import VIcon from '@/components/icons/Index.vue'

type ComponentData = {
  query: {
    redirectTo?: string;
  };
};

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
  data (): ComponentData {
    return {
      query: {
        redirectTo: ''
      }
    }
  },
  mounted () {
    this.query = this.$route.query ? this.$route.query : {}
  },
  methods: {
    authWithGoogle () {
      const API: string = process.env.VUE_APP_API_URL
      let queryRedirectTo = ''

      if (!isEmpty(this.query)) {
        queryRedirectTo = `?redirectTo=${this.query.redirectTo}`
      }

      location.href = `${API}/auth/google${queryRedirectTo}`
    }
  }
})
</script>
