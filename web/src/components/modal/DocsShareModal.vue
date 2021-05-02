<template>
  <base-modal :size="528" v-on="$listeners">
    <template #header>
      <b>Sharing Options</b>
    </template>
    <div class="share-body">
      <div class="share-item">
        <div class="share-input">
          <input id="radio-share-open" v-model="permission" value="open" name="share" type="radio">
        </div>
        <label for="radio-share-open">
          <b>Open</b>
          <div class="desc">
            anyone in space can view, edit and delete
          </div>
        </label>
      </div>
      <div class="share-item">
        <div class="share-input">
          <input id="radio-share-restricted" v-model="permission" value="restricted" name="share" type="radio">
        </div>
        <label for="radio-share-restricted">
          <b>Restricted</b>
          <div class="desc">
            anyone in space can view, only the owner of doc and admin can edit and delete
          </div>
        </label>
      </div>
      <div class="share-item">
        <div class="share-input">
          <input id="radio-share-private" v-model="permission" value="private" name="share" type="radio">
        </div>
        <label for="radio-share-private">
          <b>Private</b>
          <div class="desc">
            no one but the owner can view, edit, delete
          </div>
        </label>
      </div>
      <div class="share-item">
        <div class="share-input">
          <input id="radio-share-public" v-model="permission" value="public" name="share" type="radio">
        </div>
        <label for="radio-share-public">
          <b>Public</b>
          <div class="desc">
            doc is accessible outside of the Root for view
          </div>
        </label>
      </div>
    </div>
    <div class="share-footer">
      <button :disabled="submitting" @click="updatePermission" class="btn btn-primary">Share</button>
    </div>
  </base-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import BaseModal from '@/components/modal/BaseModal.vue'
import api from '@/utils/api'

export default defineComponent({
  components: {
    BaseModal
  },
  props: {
    id: Number,
    contentAccess: Object,
    onChangeContentAccess: Function
  },
  setup (props, context) {
    const { contentAccess } = props
    const permission = ref(contentAccess?.public ? 'public' : contentAccess?.type || 'open')
    const submitting = ref(false)

    const updatePermission = async () => {
      submitting.value = true
      try {
        const isPublic = permission.value === 'public'
        const type = isPublic ? 'open' : permission.value

        await api.put(`content/access/Doc/${props.id}`, { data: { type, public: isPublic } })
        submitting.value = false
        if (props.onChangeContentAccess) {
          props.onChangeContentAccess({
            type,
            public: isPublic
          })
        }
        context.emit('close')
      } catch (error) {
        submitting.value = false
      }
    }

    return {
      submitting,
      permission,
      updatePermission
    }
  }
})
</script>

<style lang="postcss" scoped>
  .share-item {
    margin: 10px 0;
    display: flex;

    .share-input {
      padding-top: 1px;
      margin-right: 10px;
    }

    .desc {
      font-size: 12px;
    }

    label {
      cursor: pointer;
    }
  }

  .share-footer {
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;

    .btn {
      width: 130px;
    }
  }
</style>
