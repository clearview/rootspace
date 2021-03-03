<template>
  <div
    class="SelectSpace"
    v-click-outside="() => optionsVisible = false"
  >
    <button
      class="btn truncate"
      @click="toggleOptionsVisibility"
    >
      <div class="SelectSpace-header truncate">
        <div>
          <img
            class="space-logo"
            v-if="activeSpace.avatar"
            :src="activeSpace.avatar.versions.default.location"
            alt="Space"
          >
          <img src="@/assets/images/default-space.png" alt="Space Logo" class="space-logo" v-else>
        </div>
        <span
          v-if="!hideLabel"
          v-text="activeSpace.title"
          class="title collapse-hidden truncate"
        />
      </div>
      <span class="collapse-hidden">
        <v-icon
          name="down2"
          size="20px"
          viewbox="16"
          class="flex flex-none text-gray-400"
        />
      </span>
    </button>

    <transition name="menu">
      <div
        v-if="optionsVisible"
        class="SelectSpace-options"
      >
        <div class="SelectSpace-options-lists">
          <div
            v-for="(item, index) in spaces"
            :key="index"
            class="SelectSpace-option"
            :class="{
              'is-active': item.id === activeSpace.id
            }"
            @click="activateSpace(item.id)"
          >
            <div class="SelectSpace-option-content">
              <div class="SelectSpace-option-logo">
                <img
                  class="space-logo"
                  v-if="item.avatar && item.avatar.versions"
                  :src="item.avatar.versions.default.location"
                  alt="Space"
                >
                <img src="../assets/images/default-space.png" alt="Space Logo" class="space-logo" v-else>
              </div>
              <div class="SelectSpace-option-label">
                <strong
                  class="truncate"
                  v-text="item.title"
                />
                <span class="members-count">
                  {{item.countMembers}}
                  <span v-if="item.countMembers > 1">members</span>
                  <span v-else>member</span>
                </span>
              </div>
            </div>

            <div class="SelectSpace-option-icon">
              <svg
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 1L4.125 7.875L1 4.75"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <button
          class="SelectSpace-create"
          @click="modal.visible = true"
        >
          <v-icon name="plus2" size="16px" viewbox="16" class="icon" />
          <span>Add New Space</span>
        </button>

        <div class="divider mx-4"></div>

        <button
          class="SelectSpace-logout"
          @click="signout"
        >
          <v-icon name="logout" size="16px" viewbox="16" class="icon" />
          <span>Logout</span>
        </button>
      </div>
    </transition>

    <modal
      title="Add Space"
      :visible="modal.visible"
      :is-loading="modal.loading"
      :content-style="{ width: '456px' }"
      confirmText="Add"
      @cancel="modal.visible = false"
      @confirm="() => $refs.formSpace.submit()"
    >
      <div class="modal-body">
        <form-space
          nobutton
          ref="formSpace"
          @submit="addSpace"
        />
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Mixins } from 'vue-property-decorator'
import Avatar from 'vue-avatar'

import { SpaceResource, UserResource } from '@/types/resource'

import FormSpace from '@/components/form/FormSpace.vue'
import Modal from '@/components/legacy/Modal.vue'
import SpaceMixin from '@/mixins/SpaceMixin'

@Component({
  name: 'SelectSpace',
  components: {
    Avatar,
    FormSpace,
    Modal
  }
})
export default class SelectSpace extends Mixins(SpaceMixin) {
  @Prop(Boolean)
  private readonly hideLabel!: boolean

  @Prop(Boolean)
  private readonly collapseState!: boolean

  private optionsVisible = false

  private modal = {
    visible: false,
    loading: false
  }

  get user (): UserResource {
    return this.$store.state.auth.user || {}
  }

  @Watch('activeSpace')
  async watchActiveSpace (activeSpace: SpaceResource, prevActiveSpace: SpaceResource) {
    this.$nextTick(() => {
      const hasChange = (activeSpace.id === prevActiveSpace.id)

      this.optionsVisible = this.optionsVisible && hasChange
    })
  }

  @Watch('optionsVisible')
  async watchOptionsVisible (value: boolean) {
    if (!value) {
      return
    }

    await this.$store.dispatch('space/fetch')
  }

  @Watch('collapseState')
  async watchCollapseState (value: boolean) {
    if (value) {
      this.optionsVisible = !value
    }
  }

  toggleOptionsVisibility () {
    this.optionsVisible = !this.optionsVisible
  }

  signout () {
    this.$store.dispatch('auth/signout')
  }

  async addSpace (data: SpaceResource) {
    this.modal.loading = true

    try {
      const space = await this.$store.dispatch('space/create', data)

      await this.activateSpace(space.id)
    } catch { }

    this.modal.loading = false
    this.modal.visible = false
  }
}
</script>

<style lang="postcss" scoped>
.SelectSpace {
  @apply flex flex-1;
}

.SelectSpace-options {
  @apply absolute z-10;
  @apply py-2;
  @apply bg-white;

  @apply rounded;
  top: 100%;
  width: 250px;
  box-shadow: 0px 1px 12px rgba(0, 0, 0, 0.2);

  .SelectSpace-options-lists {
    @apply px-2 pb-2;
    overflow-y: scroll;
    max-height: 70vh;
  }
}

.SelectSpace-option {
  @apply flex flex-row justify-between items-center;

  @apply pb-3 pr-2 pl-4 pt-2;

  @apply cursor-pointer;

  .SelectSpace-option-icon {
    svg {
      display: none;
    }
  }

  &.is-active {
    .SelectSpace-option-icon {
      background-color: #444754;
      border-color: #444754;

      svg {
        display: inherit;
      }
    }
  }

  &:hover {
    background: #F6F6F6;
    border-radius: 3px;
  }
}

.SelectSpace-option-content {
  @apply flex flex-row flex-1 items-center;

  @apply truncate;
}

.SelectSpace-option-logo {
  @apply flex flex-none;
}

.SelectSpace-option-label {
  @apply flex flex-col;

  @apply ml-2;

  @apply truncate;

  font-size: 16px;
  line-height: 19px;

  .members-count {
    @apply mt-1;

    font-size: 12px;
    line-height: 14px;
    color: #444754;
  }
}

.SelectSpace-option-icon {
  @apply flex justify-center items-center;

  @apply border rounded-full border-gray-100 bg-white;
  width: 20px;
  height: 20px;
}

.SelectSpace-create {
  @apply flex flex-row items-center;

  @apply w-full px-4 py-2 my-2;

  @apply outline-none;

  color: #2C2B35;

  &:hover {
    @apply text-primary;

    background: inherit;

    .icon {
      @apply text-primary;
    }
  }

  .icon {
    @apply text-gray-400 mr-2;
  }
}

.SelectSpace-logout {
  @apply flex flex-row items-center;

  @apply w-full px-4 py-2 my-2;

  @apply outline-none;

  color: #2C2B35;

  &:hover {
    @apply text-primary;

    background: inherit;

    .icon {
      @apply text-primary;
    }
  }

  .icon {
    @apply text-gray-400 mr-2;
  }
}

.SelectSpace-email {
  @apply inline-block truncate;

  max-width: calc(100% - 60px);
}
.space-logo {
  width: 24px;
  height: 24px;
  max-width: 24px;
  max-height: 24px;
  border-radius: 24px;
}

.divider {
  @apply border-b border-gray-100;
}

button {
  @apply flex items-center;

  border: 0;
  padding: 0;
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    background: #F8F9FD;
  }

  .SelectSpace-header {
    @apply flex items-center;

    padding-left: 8px;
    transition: 300ms;

    .title {
      margin-left: 8px;
    }
  }

}
</style>
