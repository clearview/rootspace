<template>
  <div
    class="editor"
    :class="{readonly}"
  >
    <header
      class="header"
      v-if="!readonly"
    >
      <div class="menu">
        <editor-menu-bar
          ref="menuBar"
          :editor="editor"
          v-slot="{ commands, isActive, getMarkAttrs }"
        >
          <div class="menu-bar">
            <MenuButton
              @click="commands.bold"
              :active="isActive.bold()"
            >
              <legacy-icon
                name="bold"
                viewbox="16"
                size="16"
              />
            </MenuButton>
            <MenuButton
              @click="commands.italic"
              :active="isActive.italic()"
            >
              <legacy-icon
                name="italic"
                viewbox="16"
                size="16"
              />
            </MenuButton>
            <MenuButton
              @click="commands.underline"
              :active="isActive.underline()"
            >
              <legacy-icon
                name="underline"
                viewbox="16"
                size="16"
              />
            </MenuButton>
            <MenuButton
              @click="commands.strike"
              :active="isActive.strike()"
            >
              <legacy-icon
                name="strike"
                viewbox="16"
                size="16"
              />
            </MenuButton>

            <MenuGroup
              :value="getMarkAttrs('link').href"
              :show-arrow="false"
              v-tippy="{ placement : 'top',  arrow: true }"
              content="Link"
              v-if="!isActive.link()"
            >
              <template #default>
                <legacy-icon
                  name="link2"
                  viewbox="16"
                  size="16"
                />
              </template>
              <template #options="{ hide }">
                <LinkInput
                  @cancel="hide()"
                  @submit="commands.link({href: $event});hide();"
                />
              </template>
            </MenuGroup>

            <MenuButton
              @click="commands.link({})"
              :active="isActive.link()"
              v-if="isActive.link()"
            >
              <legacy-icon
                name="unlink"
                viewbox="16"
                size="16"
              />
            </MenuButton>

            <MenuButton
              @click="commands.blockquote"
              :active="isActive.blockquote()"
            >
              <legacy-icon
                viewbox="16"
                name="quote"
                size="16"
              />
            </MenuButton>
            <MenuButton
              @click="commands.code"
              :active="isActive.code()"
            >
              <TerminalIcon size="16"></TerminalIcon>
            </MenuButton>

            <MenuButton
              @click="commands.bullet_list"
              :active="getCurrentActiveNode(2) === 'bullet_list'"
            >
              <ListIcon size="16"></ListIcon>
            </MenuButton>
            <MenuButton
              @click="commands.ordered_list"
              :active="getCurrentActiveNode(2) === 'ordered_list'"
            >
              <legacy-icon
                name="ordered-list"
                viewbox="16"
                size="16"
                class="fill-as-stroke"
              />
            </MenuButton>
          </div>
        </editor-menu-bar>
      </div>
    </header>
    <div
      class="content"
      v-if="editor"
    >
      <EditorContent
        key="editor"
        :editor="editor"
      />
    </div>
    <footer
      class="footer"
      v-if="!readonly"
    >
      <button
        class="btn btn-link"
        @click="cancel"
      >
        Cancel
      </button>
      <button
        class="btn btn-link-primary"
        @click="save"
      >
        Save
      </button>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api'
import { EditorContent, EditorMenuBar } from 'tiptap'
import { ListIcon, TerminalIcon } from 'vue-feather-icons'

import MenuGroup from './MenuGroup.vue'
import MenuButton from './MenuButton.vue'
import LinkInput from './LinkInput.vue'

import { createEditor } from './lib'

export default defineComponent({
  name: 'Editor',
  components: {
    MenuButton,
    EditorContent,
    EditorMenuBar,
    MenuGroup,
    LinkInput,
    TerminalIcon,
    ListIcon
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Object, String],
      default: () => ({})
    }
  },
  setup (props, { emit }) {
    const editor = ref<any>()

    const destroyEditor = () => {
      if (editor.value) {
        editor.value.destroy()
      }
    }

    const cancel = () => {
      editor.value.setContent(props.value)

      emit('cancel')
    }

    const save = () => {
      const content = editor.value.getJSON()

      emit('save', content)
    }

    const getCurrentActiveNode = (depth = 1) => {
      const sel = editor.value.state.selection
      if (sel) {
        const node = sel.$from.node(sel.$from.depth - depth)
        if (node) {
          return node.type.name
        }
      }
    }

    // Watch

    watch(
      () => props.readonly,
      (val) => {
        if (editor.value) {
          editor.value.setOptions({
            editable: !val
          })
        }
      }
    )

    // Hooks

    onMounted(() => {
      destroyEditor()
      editor.value = createEditor({
        content: props.value,
        editable: !props.readonly
      })
    })

    onUnmounted(() => {
      destroyEditor()
    })

    return {
      editor,
      cancel,
      save,
      getCurrentActiveNode
    }
  }
})
</script>

<style lang="postcss" scoped>
.editor {
  background: #fff;
}
.menu-bar {
  display: flex;
  align-items: center;
  border: solid 1px #ccc;
  border-radius: 4px 4px 0 0;
  border-bottom: none;
  padding: 4px;

  .stroke-current {
    stroke: transparent;
  }
  .active .stroke-current {
    stroke: transparent;
  }
}

.content {
  border: solid 1px #ccc;
  border-radius: 0 0 4px 4px;
  padding: 8px;
  min-height: 18em;
}

.readonly {
  .content {
    border: none;
    padding: 8px 0;
    min-height: 0;
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  .btn {
    padding-left: 8px;
    padding-right: 8px;
  }
}

.content >>> .ProseMirror {
  outline: none;
  font-size: 14px;

  a {
    text-decoration: underline;
    color: #4574d3;
  }

  ol {
    list-style: decimal;
  }
  ul {
    list-style: circle;
  }
  ol,
  ul {
    margin-left: 24px;
    margin-bottom: 8px;
  }

  code {
    background: #dedede;
    padding: 4px;
  }

  .is-editor-empty::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
  }
}
</style>
