<template>
  <portal
    :to="portal"
    v-if="visible"
  >
    <div class="modal" @mousedown.self="cancel" :style="modalStyle ? {...modalStyle, zIndex} : {zIndex}">
      <div class="modal-inner" :style="contentStyle">
        <slot
          name="header"
          v-if="!noheader"
        >
          <div class="modal-header">
            <div class="modal-title">{{ title }}</div>
            <button
              class="btn btn-icon rounded-full"
              @click="cancel"
            >
              <v-icon name="close" title="Close"/>
            </button>
          </div>
        </slot>

        <slot/>

        <slot
          name="footer"
          v-if="!nofooter"
        >
          <div class="modal-footer">
            <button
              class="btn btn-ghost btn-small"
              @click="cancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="btn btn-small btn-primary"
              @click="confirm"
              :disabled="isLoading || !canSave"
              v-if="!nosubmit"
            >
              {{ confirmText }}
            </button>
          </div>
        </slot>
      </div>
    </div>
  </portal>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Modal',
  inheritAttrs: false
})
export default class LegacyModal extends Vue {
    @Prop({ type: String, default: 'default' })
    private readonly portal!: string;

    @Prop({ type: Number, default: 1000 })
    private readonly zIndex!: number;

    @Prop({ type: Boolean })
    private readonly visible!: boolean;

    @Prop({ type: String })
    private readonly title!: string;

    @Prop({ type: String, default: 'Save' })
    private readonly confirmText!: string;

    @Prop({ type: String, default: 'Cancel' })
    private readonly cancelText!: string;

    @Prop({ type: Boolean })
    private readonly noheader!: boolean;

    @Prop({ type: Boolean })
    private readonly nofooter!: boolean;

    @Prop({ type: Boolean })
    private readonly nosubmit!: boolean;

    @Prop({ type: Object })
    private readonly contentStyle!: object;

    @Prop({ type: Object })
    private readonly modalStyle!: object;

    @Prop({ type: Boolean, default: false })
    private readonly isLoading!: boolean;

    @Prop({ type: Boolean, default: true })
    private readonly canSave!: boolean;

    @Emit('cancel')
    cancel () {
    }

    @Emit('confirm')
    confirm () {
    }
}
</script>

<style lang="postcss" scoped>
  .modal {
    @apply fixed top-0 left-0;
    @apply w-full;
    @apply overflow-y-scroll;
    z-index: 1000;
    /* Flex is broken when used for centering overflowing modal*/
    height: 100vh;
    display: grid;
    justify-items: center;
    align-items: center;
    background-color: rgba(theme("colors.gray.900"), 0.25);
  }

  .modal::v-deep {
    .modal-inner {
      @apply bg-white rounded relative my-12;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
      border-radius: 6px;
    }

    .modal-header,
    .modal-body,
    .modal-footer {

    }

    .modal-header {
      @apply flex flex-row items-center justify-between;
      @apply text-base;
      padding: 24px 16px 16px 32px;
      font-weight: bold;
      font-size: 18px;
      line-height: 21px;
      color: #2C2B35;

      .btn-icon {
        width: 20px;
        height: 20px;
        border-radius: 0.25rem;
      }
    }

    .modal-body {
      padding: 0 32px 32px 32px;
      font-size: 16px;
      line-height: 160%;
      color: #444754;
    }

    .modal-footer {
      @apply flex flex-row justify-end items-end;
      border-top: 1px solid #E0E2E7;
      padding: 16px 32px;
    }
  }
</style>
