<template>
  <div id="editor-menu">
    <v-icon v-if="loading" name="loading" size="2em" viewbox="100" />
    <span @click.stop="showMenu = !showMenu">
    <v-icon v-if="!loading"
      name="context-menu"
      size="1.5em"
      viewbox="20"
      class="text-primary pointer"
    />
    </span>

    <transition name="menu">
      <context-menu
        v-if="showMenu"
        v-click-outside="() => showMenu = false"
      >
        <template v-slot:header>
          <h6>
            Page Lock
            <button-switch v-model="lockEditor" class="switch" />
          </h6>
        </template>

        <h6 class="link" @click="share">
          <v-icon name="share" viewbox="20" />
          <span>
            Share
          </span>
        </h6>
        <h6 class="link" @click="history">
          <v-icon name="history" viewbox="20" />
          <span>
            Page History
          </span>
        </h6>

        <template v-slot:footer>
          <h6 class="link trash" @click="trash">
            <v-icon name="trash" />
            <span>
              Delete
            </span>
          </h6>
        </template>
      </context-menu>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ContextMenu from '@/components/base/ContextMenu.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'

type ComponentData = {
  lockEditor: boolean;
  showMenu: boolean;
}

export default Vue.extend({
  name: 'EditorMenu',
  components: {
    ContextMenu,
    ButtonSwitch
  },
  props: {
    loading: {
      type: Boolean
    }
  },
  data (): ComponentData {
    return {
      lockEditor: false,
      showMenu: false
    }
  },
  watch: {
    lockEditor (newVal) {
      this.$emit('change-readonly', newVal)
      this.showMenu = false
    }
  },
  methods: {
    share () {
      console.log('share')
    },
    history () {
      console.log('history')
    },
    trash () {
      console.log('delete')
    }
  }
})
</script>

<style lang="postcss" scoped>
#editor-menu {
  position: relative;

  h6 {
    font-size: 13px;
    padding: .5rem;

    svg {
      display: inline-block;
    }

    span {
      margin-left: .5rem;
    }

    &.link {
      cursor: pointer;

      &:hover {
        background: theme("colors.gray.100");
      }
    }

    &.trash {
      color: theme("colors.primary.default");
    }
  }

  .switch {
    float: right;
  }
}
</style>
