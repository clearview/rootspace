<template>
  <div
    id="app"
    class="relative h-screen overflow-y-auto"
  >
    <router-view />
    <portal-target name="default" />
    <portal-target name="secondary" />
    <v-modal
      :title="confirmData.title"
      :visible="confirmData.visible"
      :loading="confirmData.loading"
      confirmText="Yes"
      @cancel="handleConfirmCancel"
      @confirm="handleConfirm"
    >
      <div class="modal-body text-center" v-text="confirmData.text">
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VModal from '@/components/Modal.vue'
@Component({
  components: { VModal }
})
export default class App extends Vue {
  async created () {
    this.$store.subscribe(async (mutation, state) => {
      if (mutation.type === 'auth/setToken' && !state.auth.token) {
        this.$router.push({ name: 'SignIn' })
      }
    })
    window.app = this
  }

  private confirmData: {
    title?: string;
    text?: string;
    onOk?: () => Promise<void>;
    onCancel?: () => void;
    visible: boolean;
    loading: boolean;
  } = {
    visible: false,
    loading: false
  }

  public confirm (title: string, text: string, onOk: () => Promise<void>, onCancel?: () => void) {
    this.confirmData.title = title
    this.confirmData.text = text
    this.confirmData.onOk = onOk
    this.confirmData.onCancel = onCancel
    this.confirmData.visible = true
  }

  private handleConfirmCancel () {
    if (this.confirmData.onCancel) {
      this.confirmData.onCancel()
    }
    this.confirmData.visible = false
  }

  private async handleConfirm () {
    if (this.confirmData.onOk) {
      try {
        this.confirmData.loading = true
        await this.confirmData.onOk()
      } finally {
        this.confirmData.loading = false
      }
    }
    this.confirmData.visible = false
  }
}

declare global {
  interface Window {
    app: App;
  }
}

</script>

<style src="@/assets/css/index.css" />
