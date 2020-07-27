<template>
  <portal
    :to="portal"
    v-if="visible"
  >
    <div class="modal" @click.self="cancel">
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
              class="btn btn-small"
              @click="cancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="btn btn-small btn-primary"
              @click="confirm"
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
export default class Modal extends Vue {
    @Prop({ type: String, default: 'default' })
    private readonly portal!: string;

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

    @Emit('cancel')
    cancel () {
    }

    @Emit('confirm')
    confirm () {
    }
}
</script>
