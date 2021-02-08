<template>
  <div class="SelectNodeType">

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'novadoc')"
    >
      <v-icon
        name="menu-document"
        size="24px"
        viewbox="24"
        class="SelectNodeType-icon"
      />

      <div class="SelectNodeType-desc">
        <h5>Document</h5>
        <p>WRITE NOTES, THOUGHTS OR IDEAS.</p>
      </div>

      <span class="arrow">
        <v-icon
          name="down2"
          size="20px"
          viewbox="16"
          class="text-gray-400"
        />
      </span>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'task')"
    >
      <v-icon
        name="menu-task"
        size="24px"
        viewbox="24"
        class="SelectNodeType-icon"
      />

      <div class="SelectNodeType-desc">
        <h5>Task Board</h5>
        <p>CREATE BOARD, LIST OR IDEAS.</p>
      </div>

      <span class="arrow">
        <v-icon
          name="down2"
          size="20px"
          viewbox="16"
          class="text-gray-400"
        />
      </span>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'folder')"
    >
      <v-icon
        name="menu-folder"
        size="24px"
        viewbox="24"
        class="SelectNodeType-icon"
      />

      <div class="SelectNodeType-desc">
        <h5>Folder</h5>
        <p>GROUPS AND ORGANIZE YOUR FILES.</p>
      </div>

      <span class="arrow">
        <v-icon
          name="down2"
          size="20px"
          viewbox="16"
          class="text-gray-400"
        />
      </span>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'embed')"
    >
      <v-icon
        name="menu-embed"
        size="24px"
        viewbox="24"
        class="SelectNodeType-icon"
      />

      <div class="SelectNodeType-desc">
        <h5>Embed</h5>
        <p>EMBED ANY THIRD-PART APP...</p>
      </div>

      <span class="arrow">
        <v-icon
          name="down2"
          size="20px"
          viewbox="16"
          class="text-gray-400"
        />
      </span>
    </a>

    <a
      class="SelectNodeType-option"
      @click="$emit('select', 'link')"
    >
      <v-icon
        name="menu-link"
        size="24px"
        viewbox="24"
        class="SelectNodeType-icon"
      />

      <div class="SelectNodeType-desc">
        <h5>Link</h5>
        <p>ADD A LINK TO ANYTHING YOU’D LIKE.</p>
      </div>

      <span class="arrow">
        <v-icon
          name="down2"
          size="20px"
          viewbox="16"
          class="text-gray-400"
        />
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
.SelectNodeType {
}

.SelectNodeType-option {
  @apply flex flex-row rounded bg-white border border-white;

  & + & {
    @apply mt-4;
  }

  cursor: pointer;
  padding: 10px 16px;

  &:hover {
    @apply border;

    border-color: theme("colors.primary.default");

    .arrow {
      visibility: initial;
    }
  }
}

.SelectNodeType-icon {
  @apply self-center;
}

.SelectNodeType-desc {
  @apply flex-grow;
  padding-left: 8px;

  h5 {
    font-size: 16px;
  }

  p {
    font-size: 10px;
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
