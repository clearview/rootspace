<template>
  <div class="flex flex-row">
    <div class="nav">
      <div class="flex flex-row items-center mb-4">
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
          <v-icon
            name="search"
            size="1.5em"
            class="text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            class="w-full ml-2 outline-none"
          >
        </div>
        <div class="flex flex-none">
          <v-icon
            name="unlock"
            size="2em"
            class="text-primary"
          />
        </div>
      </div>

      <div class="nav-items">
        <div class="nav-item">
          <label class="nav-item-section">Section 1</label>

          <ul class="nav-item-tree">
            <li>
              <label class="flex flex-row items-center">
                <v-icon name="down" class="mr-1 text-gray-400"/>
                <v-icon name="folder" class="mr-1 text-gray-400"/>
                Main Item
              </label>

              <ul>
                <li>
                  <label class="flex flex-row items-center">
                    <v-icon name="down" class="mr-1 text-gray-400"/>
                    <v-icon name="folder" class="mr-1 text-gray-400"/>
                    Folder Name
                  </label>

                  <ul>
                    <li>
                      <label class="flex flex-row items-center">
                        <v-icon name="file" class="ml-4 mr-1 text-gray-400"/>
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

      <div>
        <div class="flex flex-row mt-4">
          <button class="btn btn-mute flex-grow px-2 mr-2">
            My Workspace
            <v-icon
              name="down"
              class="ml-1 text-gray-400"
            />
          </button>

          <div class="btn-group">
            <button class="btn btn-mute btn-icon">
              <v-icon name="settings" />
            </button>
            <button class="btn btn-mute btn-icon">
              <v-icon name="edit" />
            </button>
          </div>
        </div>
        <div class="flex mt-4">
          <button class="btn btn-primary flex-grow">
            <v-icon
              name="plus"
              class="mr-1"
            />
            Add New Link
          </button>
        </div>
      </div>
    </div>
    <div class="content">Content</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import VIcon from '@/components/icons/Index.vue'

export default Vue.extend({
  name: 'Main',
  components: {
    VIcon
  }
})
</script>

<style lang="postcss" scoped>
.nav {
  @apply flex flex-col min-h-screen p-4;
  @apply border-r border-gray-100;

  width: 282px;
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

.content {
  @apply flex flex-col p-4;
}
</style>
