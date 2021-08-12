<template>
  <button class="btn btn-auth-google w-full mx-0" type="button" @click="authWithGoogle()">
    <span class="mr-1">
      <legacy-icon name="google" size="1.1em"/>
    </span>
    <span v-text="text"/>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { isEmpty } from 'lodash'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'ButtonLock'

})
export default class ButtonAuthGoogle extends Vue {
    @Prop({ type: String, default: 'Google' })
    private readonly text!: string;

    private query: any = {
      redirectTo: ''
    }

    mounted () {
      this.query = this.$route.query ? this.$route.query : {}
    }

    authWithGoogle () {
      const API: string = process.env.VUE_APP_API_URL
      let queryRedirectTo = ''

      if (!isEmpty(this.query)) {
        queryRedirectTo = `?redirectTo=${this.query.redirectTo}`
      }

      location.href = `${API}/auth/google${queryRedirectTo}`
    }
}
</script>
<style lang="postcss" scoped>
.btn-auth-google {
  white-space: nowrap;
}
</style>
