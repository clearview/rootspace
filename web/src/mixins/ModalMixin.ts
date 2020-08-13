import { Vue, Component } from 'vue-property-decorator'

export { default as Modal } from '@/components/Modal.vue'

export interface ModalState {
  visible: boolean;
  loading: boolean;
  type: string | null;
  data: object | null;
}

@Component
export default class ModalMixin extends Vue {
  modal: ModalState = {
    visible: false,
    loading: false,
    type: null,
    data: null
  }

  async modalOpen (type: string, data?: object): Promise<object> {
    this.modal = {
      ...this.modal,
      visible: true,
      data: data || null,
      type
    }

    return new Promise((resolve, reject) => {
      this.$once('modal:close', () => {
        this.modal.visible = false

        reject(new Error('close'))
      })

      this.$once('modal:confirm', (data: object) => {
        this.modal.visible = false

        resolve(data)
      })
    })
  }

  modalClose () {
    this.$emit('modal:close')
  }

  modalConfirm (data: object) {
    this.$emit('modal:confirm', data)
  }
}
