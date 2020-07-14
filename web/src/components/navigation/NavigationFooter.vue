<template>
  <div class="nav-footer">
    <div class="nav-actions flex-row relative">
      <button
        class="btn btn-mute flex-grow p-1 mr-2 justify-between truncate"
        @click.stop="showMenu = !showMenu"
      >
        <div class="flex flex-row items-center truncate">
          <img
            class="bg-white rounded mr-2"
            srcset="
              @/assets/images/space.png 1x,
              @/assets/images/space@2x.png 2x
            "
            src="@/assets/images/space.png"
            alt="Space"
          >
          <span class="truncate">{{ activeSpace.title }}</span>
        </div>
        <v-icon
          name="down"
          class="flex flex-none ml-1 text-gray-400"
        />
      </button>

      <div class="btn-group">
        <button
          class="btn btn-mute btn-icon"
          @click="settingsPage()"
        >
          <v-icon
            name="settings"
            class="icon"
          />
        </button>
        <button
          class="btn btn-mute btn-icon"
          :class="{ 'btn-active': editable }"
          @click="$emit('edit')"
        >
          <v-icon
            name="edit"
            class="icon"
          />
        </button>
      </div>

      <navigation-space v-model="showMenu" @add="$emit('addSpace')"/>
    </div>
    <div class="nav-actions">
      <button
        class="btn btn-primary flex-grow"
        @click="$emit('add')"
      >
        <v-icon
          name="plus"
          class="mr-1"
        />
        Add New
      </button>
    </div>

    <div class="nav-expand">
      <button class="btn btn-icon bg-transparent hover:bg-transparent">
        <v-icon
          name="right"
          size="1em"
          viewbox="36"
          class="text-white"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import { SpaceResource } from '@/types/resource'

import NavigationSpace from '@/components/navigation/NavigationSpace.vue'

@Component({
  name: 'NavigationFooter',
  components: {
    NavigationSpace
  }
})
export default class NavigationFooter extends Vue {
  @Prop({ type: Boolean })
  private readonly editable!: boolean;

  private showMenu = false

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  settingsPage () {
    this.$router.push({ name: 'Settings' })
  }
}
</script>

<style lang="postcss" scoped>
.btn-active {
  .icon {
    @apply text-primary;
  }
}
</style>
