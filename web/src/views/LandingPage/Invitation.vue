<template>
  <div id="confirm-email-page">
    <root-header></root-header>

    <div id="confirm-email-content" class="flex flex-col items-center justify-center">
      <h5 v-if="isLoading">Checking your invitation...</h5>
      <h5 v-if="!isLoading">{{ message }}!</h5> {{  }}
      <h6 v-if="!isLoading && code !== 401">
        <router-link :to="{ name: 'Main'}" class="signin">click here</router-link>
        to going to the Root App
      </h6>
      <h6 v-if="!isLoading && code === 401">
        <router-link :to="{ name: 'SignIn'}" class="signin">click here</router-link>
        to login to the Root App
      </h6>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import UserService from '@/services/user'

import RootHeader from '@/components/RootHeader.vue'

type ComponentData = {
  isLoading: boolean;
  message: string;
  code: number;
}

export default Vue.extend({
  name: 'ConfirmEmail',
  components: {
    RootHeader
  },
  data (): ComponentData {
    return {
      isLoading: false,
      message: '',
      code: 0
    }
  },
  created () {
    this.submit()
  },
  methods: {
    async submit () {
      try {
        const { token } = this.$route.params
        const { id } = this.$route.params
        const payload = {
          token: token,
          id: id
        }

        this.isLoading = true
        const data = await UserService.invitation(payload)
        console.log(data)

        if (data.status === 200) {
          this.message = data.data.message
          this.code = data.status
          this.isLoading = false
        }
      } catch (err) {
        console.log(err.message)
        this.message = err.message
        this.code = err.code
        this.isLoading = false
      }
    }
  }
})
</script>

<style scoped>
#confirm-email-page {
  @apply border-t-4;
  border-color: theme("colors.primary.default");
}
#confirm-email-content {
  height: calc(100vh - 100px);
}
a {
  border-bottom: 1px dotted;
  color: theme("colors.primary.default");
  cursor: pointer;
}
</style>
