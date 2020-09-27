<template>
  <div class="list-menu">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>

    <slot></slot>

    <div class="form-button" v-if="!noButton">
      <button
        class="btn btn-small btn-ghost btn-back"
        @click="back"
      >
        Back
      </button>
      <button
        class="btn btn-small btn-primary btn-submit"
        @click="add"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'FormMenu'
})
export default class FormMenu extends Vue {
  @Prop({ type: String })
  private readonly title!: string;

  @Prop({ type: String })
  private readonly description!: string;

  @Prop({ type: Boolean, default: false })
  private readonly noButton!: boolean;

  back () {
    this.$emit('back')
  }

  add () {
    this.$emit('add')
  }
}
</script>

<style lang="postcss" scoped>
.list-menu {
  @apply absolute;

  bottom: 0;
  right: 0;
  left: 0;

  h3 {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
  }

  p {
    @apply mb-4;

    font-size: 14px;
    line-height: 17px;
  }

  .form-button {
    @apply flex mt-4 justify-end;

    button {
      height: 32px;
    }

    .btn-back {
      width: 72px;
    }

    .btn-submit {
      width: 96px;
    }
  }
}
</style>

<style lang="postcss">
.form-menu {
  h3 {
    color: #2C2B35;
  }

  p {
    color: theme("colors.gray.900");
  }

  form {
    color: theme("colors.gray.900");

    .label {
      color: theme("colors.gray.900");
    }

    .input:focus {
      box-shadow: 0 0 0 3px rgb(216 55 80 / 0.3);
      border: 1px solid theme("colors.primary.default");
    }
  }
}
</style>
