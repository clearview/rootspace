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
        v-click-outside="menuOutside"
      >
        <template v-slot:header>
          <h6>
            Page Lock
            <button-switch v-model="lockEditor" class="switch" />
          </h6>
        </template>

        <h6 id="doc-share-button" class="link" @click="share">
          <v-icon name="share" viewbox="20" />
          <span id="doc-share-button-span">
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

    <transition name="menu">
      <context-menu
        v-if="showShareMenu"
        v-click-outside="shareMenuOutside"
        class="share-menu"
      >

        <template v-slot:header>
          <h6 id="doc-share-button-back" class="link" @click="backMenu">
            <v-icon
              name="left"
              size="2em"
              viewbox="36"
              id="doc-share-button-svg"
            />
            Share
          </h6>
        </template>

        <h6 class="link three-col" @click="share">
          <v-icon name="share-globe" viewbox="20" class="text-gray-800" />
          <div class="text-block">
            Make Public
            <span>Anyone with link can view</span>
          </div>
          <button-switch v-model="lockShare" class="switch" />
        </h6>

        <div class="input-group" v-if="lockShare">
          <input
            type="text"
            class="input-group-component flex-grow w-px flex-1 border h- px-3 relative text-inherit"
            value="https://root.app/doc/123"
            readonly
          />
          <div class="flex">
            <button
              type="button"
              class="button input-group-component flex items-center justify-center"
            >Copy Link</button>
          </div>
        </div>

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
  lockShare: boolean;
  showMenu: boolean;
  showShareMenu: boolean;
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
      lockShare: false,
      showMenu: false,
      showShareMenu: false
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
      this.showMenu = false
      this.showShareMenu = true
    },
    shareMenuOutside (event: Event) {
      // console.log('shareMenuOutside event', event, event.srcElement.id, event.toElement.id, event.target.id)

      if (event && event.srcElement.id !== 'doc-share-button' &&
          event.srcElement.id !== 'doc-share-button-span'
      ) {
        this.showShareMenu = false
      }
    },
    backMenu () {
      this.showShareMenu = false
      this.showMenu = true
    },
    menuOutside (event: Event) {
      // console.log('menuOutside event', event, event.srcElement.id, event.toElement.id, event.target.id)

      if (event.srcElement.id !== 'doc-share-button-back' &&
          event.srcElement.id !== 'doc-share-button-svg'
      ) {
        this.showMenu = false
      }
    },
    history () {
      console.log('history')
    },
    trash () {
      this.$emit('delete-document')
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
      color: theme("colors.gray.900");

      &:hover {
        background: theme("colors.gray.100");
      }

      &.three-col {
        @apply flex flex-row;

        cursor: auto;

        svg {
          margin: .2rem .5rem 0 .5rem;
        }

        .text-block {
          @apply flex-grow;

          span {
            display: block;
            margin: 0;
            color: theme("colors.gray.800");
          }
        }

        .switch {
          @apply self-center;
        }

        &:hover {
          background: none;
        }
      }
    }

    &.trash {
      color: theme("colors.primary.default");
    }
  }

  .switch {
    float: right;
  }

  .share-menu {
    width: 352px;

    .input-group {
      margin: 1rem;
      margin-top: 0;
      width: 92%;
      padding-left: 5px;

      .input-group-component.button {
        width: 100px;
        border-radius: 0.25rem;
        border-left-color: theme("colors.gray.400");

        &:hover {
          background: theme("colors.primary.default");
        }
      }
    }
  }
}
</style>
