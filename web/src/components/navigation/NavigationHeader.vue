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
      <search-field @input="search"/>
    </div>

    <div class="flex flex-none">
      <lock-button v-model="lock"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import LockButton from '@/components/LockButton.vue'
import SearchField from '@/components/SearchField.vue'

interface ComponentData {
  lock: boolean;
}

export default Vue.extend({
  name: 'NavigationHeader',
  components: {
    LockButton,
    SearchField
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
