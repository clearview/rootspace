<template>
  <layout-public>
    <div class="flex flex-col items-center justify-center h-full">
      <v-icon class="icon-loading" name="loading" size="5em" viewbox="100"/>
    </div>
  </layout-public>
</template>

<script lang="ts">
import { isEmpty } from 'lodash/fp'

import LayoutPublic from '@/components/LayoutPublic.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'GoogleCallback',
  components: {
    LayoutPublic
  }
})
export default class GoogleCallback extends Vue {
  get redirect () {
    return this.$store.state.option.redirect || {}
  }

  async created () {
    await this.submit()
  };

  async submit () {
    await this.$store.dispatch('auth/signin', {
      type: 'google',
      payload: this.$route.query
    })

    if (!isEmpty(this.redirect)) {
      this.$router.replace({ path: this.redirect.redirectTo.toString() })
      this.$store.commit('option/setRedirect', null)
    } else {
      this.$router.replace({ name: 'Main' })
    }
  }
}
</script>
