<template>
  <div class="SelectNodeType">

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'novadoc')"
    >
      <div class="SelectNodeType-icon">
        <mono-icon name="document" />
      </div>

      <div class="SelectNodeType-desc">
        <h5>Document</h5>
        <p>Write notes, thoughts or ideas.</p>
      </div>

      <span class="arrow">
        <mono-icon name="arrow-right" />
      </span>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'task')"
    >
      <div class="SelectNodeType-icon">
        <mono-icon name="board" />
      </div>

      <div class="SelectNodeType-desc">
        <h5>Task Board</h5>
        <p>Create board, list or table view.</p>
      </div>

      <span class="arrow">
        <mono-icon name="arrow-right" />
      </span>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'folder')"
    >
      <div class="SelectNodeType-icon">
        <mono-icon name="folder" />
      </div>

      <div class="SelectNodeType-desc">
        <h5>Folder</h5>
        <p>Groups and organize your files.</p>
      </div>

      <span class="arrow">
        <mono-icon name="arrow-right" />
      </span>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'embed')"
    >
      <div class="SelectNodeType-icon">
        <mono-icon name="code-embed" />
      </div>

      <div class="SelectNodeType-desc">
        <h5>Embed</h5>
        <p>Embed any third-part application.</p>
      </div>

      <span class="arrow">
        <mono-icon name="arrow-right" />
      </span>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'link')"
    >
      <div class="SelectNodeType-icon">
        <mono-icon name="link" />
      </div>

      <div class="SelectNodeType-desc">
        <h5>Link</h5>
        <p>Add a link to anything you’d like.</p>
      </div>

      <span class="arrow">
        <mono-icon name="arrow-right" />
      </span>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'storage')"
    >
      <div class="SelectNodeType-icon">
        <mono-icon name="database" />
      </div>

      <div class="SelectNodeType-desc">
        <h5>Storage</h5>
        <p>Add a storage anything you’d like.</p>
      </div>

      <span class="arrow">
        <mono-icon name="arrow-right" />
      </span>
    </a>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'SelectNodeType'
})
export default class SelectNodeype extends Vue { }
</script>

<style lang="postcss" scoped>
.SelectNodeType-option {
  @apply flex flex-row;

  height: 80px;
  border-radius: 8px;
  transition: all 300ms;

  & + & {
    margin-top: 8px;
  }

  cursor: pointer;
  padding: 10px 16px;

  &:hover {
    @apply  bg-white;

    .arrow {
      visibility: initial;
    }
  }
}

.SelectNodeType-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: #EDEFF3;
  border-radius: 50%;
  transition: all 500ms;
  font-size: 18px;
  color: theme('colors.gray.900');;

  .SelectNodeType-option:hover & {
    color: white;
    background: #444754;
  }
}

.SelectNodeType-desc {
  @apply flex-grow;
  padding-left: 8px;

  h5 {
    font-size: 16px;
  }

  p {
    font-size: 13px;
  }
}

.arrow {
  @apply self-center;

  visibility: hidden;

  svg {
    transform: rotate(-90deg);
  }
}
</style>
