<template>
  <div>
    <div class="flex flex-none">
      <img
        srcset="
          @/assets/logo.png,
          @/assets/logo@2x.png 2x
        "
        src="@/assets/logo.png"
        alt="Root Logo"
      />
    </div>

    <div class="flex flex-1 mx-5">
      <v-searchbar @input="search"/>
    </div>

    <div class="flex flex-none">
      <button-lock v-model="lock"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import ButtonLock from '@/components/ButtonLock.vue'
import VSearchbar from '@/components/Searchbar.vue'

interface ComponentData {
  lock: boolean;
}

export default Vue.extend({
  name: 'NavigationHeader',
  components: {
    ButtonLock,
    VSearchbar
  },
  data (): ComponentData {
    return {
      lock: false
    }
  },
  methods: {
    search (keyword: string): void {
      this.$emit('search', keyword)
    }
  }
})
</script>
