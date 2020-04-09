<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    class="fill-current"
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
import IconFolder from './IconFolder.vue'
import IconLeft from './IconLeft.vue'
import IconLink from './IconLink.vue'
import IconLinkEdit from './IconLinkEdit.vue'
import IconPassword from './IconPassword.vue'
import IconPlus from './IconPlus.vue'
import IconRandom from './IconRandom.vue'
import IconRight from './IconRight.vue'
import IconSearch from './IconSearch.vue'
import IconSettings from './IconSettings.vue'
import IconTrash from './IconTrash.vue'
import IconUp from './IconUp.vue'
import IconUser from './IconUser.vue'

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
    IconFolder,
    IconLeft,
    IconLink,
    IconLinkEdit,
    IconPassword,
    IconPlus,
    IconRandom,
    IconRight,
    IconSearch,
    IconSettings,
    IconTrash,
    IconUp,
    IconUser
  },
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: 32
    }
  }
})
</script>
