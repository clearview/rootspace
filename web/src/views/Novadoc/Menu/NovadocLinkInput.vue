<template>
  <div class="novadoc-link-input">
    <LinkIcon size="16"></LinkIcon>
    <input title="Link URL" type="text" class="link-input" v-model="href" placeholder="Paste link"
           ref="input" @mousedown.capture.stop=""
           @keydown.esc="$emit('cancel')" @keypress.prevent.enter="$emit('submit', href);href = ''">
    <div class="buttons">
      <NovadocMenuButton active @click="$emit('submit', href); href = ''">
        <v-icon name="checkmark3" viewbox="16" size="16"></v-icon>
      </NovadocMenuButton>
      <NovadocMenuButton @click="$emit('cancel')">
        <v-icon name="close3" viewbox="16" size="16"></v-icon>
      </NovadocMenuButton>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import { LinkIcon } from 'vue-feather-icons'
import NovadocMenuButton from '@/views/Novadoc/Menu/NovadocMenuButton'

export default {
  components: {
    NovadocMenuButton,
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

  > svg {
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
  .buttons {
    display: flex;
    align-items: center;
    button:first-child {
      margin-right: 4px;
    }
  }
}
</style>
