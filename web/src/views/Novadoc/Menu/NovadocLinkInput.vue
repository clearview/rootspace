<template>
  <div class="novadoc-link-input">
    <LinkIcon size="16"></LinkIcon>
    <input title="Link URL" type="text" class="link-input" v-model="href" placeholder="Paste link"
           ref="input"
           @keydown.esc="$emit('cancel')" @keypress.prevent.enter="$emit('submit', href);href = ''">
  </div>
</template>

<script>

import Vue from 'vue'
import { LinkIcon } from 'vue-feather-icons'

export default {
  components: {
    LinkIcon
  },
  props: {
    value: String
  },
  name: 'NovadocLinkInput',
  data () {
    return {
      href: this.value
    }
  },
  mounted () {
    Vue.nextTick(() => {
      this.$refs.input.focus()
    })
  }
}
</script>

<style lang="postcss" scoped>
.novadoc-link-input {
  padding: 4px;
  display: flex;
  align-items: center;

  svg {
    margin-left: 8px;
  }

  .link-input {
    display: block;
    border: none;
    outline: none;
    margin: 0 0 0 8px;
    padding: 4px;
    min-width: 320px;
  }
}
</style>
