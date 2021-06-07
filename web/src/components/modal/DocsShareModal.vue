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
            Anyone in space can view, edit and delete
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
            Anyone in space can view, only the owner of doc and admin can edit and delete
          </div>
        </label>
      </div>
      <!-- In progress, hide for awhile -->
      <!-- <div class="share-item">
        <div class="share-input">
          <input id="radio-share-private" v-model="permission" value="private" name="share" type="radio">
        </div>
        <label for="radio-share-private">
          <b>Private</b>
          <div class="desc">
            No one but the owner can view, edit, delete
          </div>
        </label>
      </div> -->
    <div class="share-action">
      <button :disabled="isSubmittingUpdatePermission" @click="updateAccessPermission" class="btn btn-primary">Update</button>
    </div>
    <div class="share-item public">
      <div class="share-input">
        <input
          :disabled="isSubmittingPublicPermission"
          id="radio-share-public"
          name="share"
          type="checkbox"
          v-model="isPublic"
          value="public"
          @change="updatePublicPermission"
        >
      </div>
      <div class="share-item-description">
        <label for="radio-share-public">
          <b>Public</b>
          <div class="desc">
            Doc is accessible outside of the Root for view
          </div>
        </label>
        <div id="public-url-loader" v-if="isSubmittingPublicPermission">
          <ContentLoader>
            <rect x="0" y="5" rx="3" ry="3" width="300" height="8" />
            <rect x="0" y="20" rx="3" ry="3" width="100" height="8" />
          </ContentLoader>
        </div>
        <div v-else id="public-url" v-show="isPublic" @click="copyToClipboard">
          <pre>{{ publicUrl }}</pre>
          <mono-icon :class="{ copied: copiedToClipboard }" :name="publicUrlIcon" />
        </div>
      </div>
    </div>
  </div>
  </base-modal>
</template>
<script lang="ts">
import { ContentLoader } from 'vue-content-loader'
import { defineComponent, ref } from '@vue/composition-api'
import BaseModal from '@/components/modal/BaseModal.vue'
import api from '@/utils/api'

export default defineComponent({
  components: {
    BaseModal,
    ContentLoader
  },
  props: {
    id: Number,
    publicId: String,
    contentAccess: Object,
    onChangeContentAccess: Function
  },
  setup (props, context) {
    const { contentAccess } = props
    const permission = ref(contentAccess?.type)
    const isPublic = ref(contentAccess?.public)
    const isSubmittingPublicPermission = ref(false)
    const isSubmittingUpdatePermission = ref(false)
    const publicUrl = `${window.location.origin}/doc/${props.publicId}`
    const copiedToClipboard = ref(false)
    const publicUrlIcon = ref('copy')

    const updatePermission = async () => {
      const type = permission.value

      await api.put(`content/access/Doc/${props.id}`, { data: { type: permission.value, public: isPublic.value } })
      isSubmittingUpdatePermission.value = false
      if (props.onChangeContentAccess) {
        props.onChangeContentAccess({
          type,
          public: isPublic.value
        })
      }
    }

    const updateAccessPermission = async () => {
      isSubmittingUpdatePermission.value = true
      await updatePermission()
      context.emit('close')
    }

    const updatePublicPermission = async () => {
      isSubmittingPublicPermission.value = true
      await updatePermission()
      isSubmittingPublicPermission.value = false
    }

    const copyToClipboard = () => {
      const el = document.createElement('input')
      el.value = publicUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)

      publicUrlIcon.value = 'check'
      copiedToClipboard.value = true

      setTimeout(() => {
        publicUrlIcon.value = 'copy'
        copiedToClipboard.value = false
      }, 2000)
    }

    return {
      copiedToClipboard,
      copyToClipboard,
      isPublic,
      isSubmittingPublicPermission,
      isSubmittingUpdatePermission,
      permission,
      publicUrl,
      publicUrlIcon,
      updateAccessPermission,
      updatePermission,
      updatePublicPermission
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
      font-size: 0.9em;
    }

    label {
      cursor: pointer;
    }

    &.public {
      border-top: solid 1px theme('colors.gray.100');
      margin-top: 20px;
      padding-top: 20px;
    }

    .share-item-description {
      flex: 1;
    }
  }

  .share-action {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;

    .btn {
      width: 130px;
    }
  }

  #public-url-loader {
    margin-top: 10px;
    height: 35px;
    overflow: hidden;
  }

  #public-url {
    display: block;
    margin-top: 10px;
    opacity: 0.8;
    background-color: #F6F8FA;
    padding: 16px;
    cursor: pointer;
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 10px;
    font-size: 0.8em;

    > .icon {
      display: flex;
      align-items: center;

      &.copied {
        color: green;
      }
    }
  }
</style>
