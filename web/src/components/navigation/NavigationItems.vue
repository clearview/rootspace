<template>
  <div class="nav-items">
    <div class="nav-item">
      <label class="nav-item-section">Section 1</label>

      <ul class="nav-item-tree">
        <li>
          <label class="flex flex-row items-center">
            <v-icon
              name="down"
              class="mr-1 text-gray-400"
            />
            <v-icon
              name="folder"
              class="mr-1 text-gray-400"
            />
            Main Item
          </label>

          <ul>
            <li>
              <label class="flex flex-row items-center">
                <v-icon
                  name="down"
                  class="mr-1 text-gray-400"
                />
                <v-icon
                  name="folder"
                  class="mr-1 text-gray-400"
                />
                Folder Name
              </label>

              <ul>
                <li>
                  <label
                    class="flex flex-row items-center"
                    @click="open('https://google.com')"
                  >
                    <v-icon
                      name="file"
                      class="ml-4 mr-1 text-gray-400"
                    />
                    Get Started
                  </label>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'NegotiationItems',
  components: {
    VIcon
  },
  methods: {
    open (link: string): void {
      this.$emit('open', link)
    }
  }
})
</script>

<style lang="postcss" scoped>
.nav-items {
  @apply flex-1;
}

.nav-item-section {
  @apply font-bold;
}

.nav-item-tree {
  li > ul {
    @apply ml-4;
  }

  li {
    @apply mt-1 leading-normal;

    label {
      @apply rounded p-2;
    }

    label:hover {
      @apply bg-gray-100;
    }
  }
}
</style>
