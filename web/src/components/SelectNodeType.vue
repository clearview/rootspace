<template>
  <div class="SelectNodeType">
    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'folder')"
    >
      <v-icon
        name="folder"
        size="3.5em"
        class="SelectNodeType-icon"
      />

      <div class="SelectNodeType-desc">
        <h5>Folder</h5>
        <p>GROUP EVERYTING INTO A FOLDER.</p>
      </div>
    </a>
    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'link')"
    >
      <v-icon
        name="link"
        size="3.5em"
        class="SelectNodeType-icon"
      />

      <div class="SelectNodeType-desc">
        <h5>Link</h5>
        <p>ADD A LINK TO ANYTHING YOU’D LIKE.</p>
      </div>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'document')"
    >
      <v-icon
        name="file"
        size="3.5em"
        class="SelectNodeType-icon"
      />

      <div class="SelectNodeType-desc">
        <h5>Document</h5>
        <p>WRITE NOTES, THOUGHTS OR IDEAS.</p>
      </div>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'task')"
    >
      <v-icon
        name="edit"
        size="3.5em"
        class="SelectNodeType-icon"
      />

      <div class="SelectNodeType-desc">
        <h5>Task</h5>
        <p>CREATE BOARD, LIST OR IDEAS.</p>
      </div>
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
.SelectNodeType {
}

.SelectNodeType-option {
  @apply flex flex-row border p-3 rounded;

  & + & {
    @apply mt-4;
  }

  border-color: theme("colors.gray.400");
  cursor: pointer;

  &:hover {
    background-color: rgba(theme("colors.gray.100"), 0.5);
  }
}

.SelectNodeType-icon {
  @apply rounded-full text-white p-2;

  background: theme("colors.primary.default");
}

.SelectNodeType-desc {
  @apply pl-2;

  font-size: 12px;
}
</style>
