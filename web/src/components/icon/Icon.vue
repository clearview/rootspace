<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    :viewBox="_viewbox"
    class="fill-current stroke-current"
  >
    <title>{{ name }}</title>
    <component :is="`icon-${name}`" />
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

import IconAdd from './IconAdd.vue'
import IconClose from './IconClose.vue'
import IconDots from './IconDots.vue'
import IconDown from './IconDown.vue'
import IconEdit from './IconEdit.vue'
import IconEmail from './IconEmail.vue'
import IconFile from './IconFile.vue'
import IconFilter from './IconFilter.vue'
import IconFolder from './IconFolder.vue'
import IconLeft from './IconLeft.vue'
import IconLink from './IconLink.vue'
import IconLinkEdit from './IconLinkEdit.vue'
import IconLock from './IconLock.vue'
import IconPlus from './IconPlus.vue'
import IconRandom from './IconRandom.vue'
import IconRight from './IconRight.vue'
import IconSearch from './IconSearch.vue'
import IconSettings from './IconSettings.vue'
import IconTrash from './IconTrash.vue'
import IconUnlock from './IconUnlock.vue'
import IconUp from './IconUp.vue'
import IconUser from './IconUser.vue'
import IconWarning from './IconWarning.vue'
import IconGoogle from './IconGoogle.vue'
import IconWorkspace from './IconWorkspace.vue'
import IconLoading from './IconLoading.vue'
import IconKanban from '@/components/icon/IconKanban.vue'
import IconList from '@/components/icon/IconList.vue'

export default Vue.extend({
  name: 'Icon',
  components: {
    IconAdd,
    IconClose,
    IconDots,
    IconDown,
    IconEdit,
    IconEmail,
    IconFile,
    IconFilter,
    IconKanban,
    IconFolder,
    IconLeft,
    IconLink,
    IconList,
    IconLinkEdit,
    IconLock,
    IconPlus,
    IconRandom,
    IconRight,
    IconSearch,
    IconSettings,
    IconTrash,
    IconUnlock,
    IconUp,
    IconUser,
    IconWarning,
    IconGoogle,
    IconWorkspace,
    IconLoading
  },
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: '1em'
    },
    viewbox: {
      type: [String, Number],
      default: 32
    }
  },
  computed: {
    _viewbox () {
      return `0 0 ${this.viewbox} ${this.viewbox}`
    }
  }
})
</script>
