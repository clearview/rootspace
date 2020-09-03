<template>
  <div
    class="SelectSpace"
    v-click-outside="() => optionsVisible = false"
  >
    <button
      class="btn btn-mute flex-grow p-1 justify-between truncate"
      @click="toggleOptionsVisibility"
    >
      <div class="flex flex-row items-center truncate">
        <div class="mr-2">
          <img
            class="space-logo"
            v-if="activeSpace.avatar"
            :src="activeSpace.avatar.versions.default.path"
            alt="Space"
          >
          <img src="../assets/images/default-space.png" alt="Space Logo" class="space-logo" v-else>
        </div>
        <span
          v-if="!hideLabel"
          v-text="activeSpace.title"
          class="truncate"
        />
      </div>
      <v-icon
        name="down"
        class="flex flex-none ml-1 text-gray-400"
      />
    </button>

    <transition name="menu">
      <div
        v-if="optionsVisible"
        class="SelectSpace-options"
      >
        <div
          v-for="(item, index) in spaces"
          :key="index"
          class="SelectSpace-option"
          :class="{
            'is-active': item.id === activeSpace.id
          }"
          @click="switchSpace(item)"
        >
          <div class="SelectSpace-option-content">
            <div class="SelectSpace-option-logo">
              <img
                class="space-logo"
                v-if="activeSpace.avatar"
                :src="activeSpace.avatar.versions.default.path"
                alt="Space"
              >
              <img src="../assets/images/default-space.png" alt="Space Logo" class="space-logo" v-else>
            </div>
            <div class="SelectSpace-option-label">
              <strong
                class="truncate"
                v-text="item.title"
              />
              <span class="text-gray-400">
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

        <button
          class="SelectSpace-create"
          @click="modal.visible = true"
        >
          <v-icon name="plus" />
          <span>Add New Space</span>
        </button>

        <button
          class="SelectSpace-logout"
          @click="signout"
        >
          <strong>Logout</strong>
          (<span class="SelectSpace-email">{{ user.email }}</span>)
        </button>
      </div>
    </transition>

    <modal
      title="Add Space"
      :visible="modal.visible"
      :loading="modal.loading"
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
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import Avatar from 'vue-avatar'

import { SpaceResource, SpaceMetaResource, UserResource } from '@/types/resource'

import FormSpace from '@/components/form/FormSpace.vue'
import Modal from '@/components/Modal.vue'

interface ModalState {
  visible: boolean;
  loading: boolean;
}

@Component({
  name: 'SelectSpace',
  components: {
    Avatar,
    FormSpace,
    Modal
  }
})
export default class SelectSpace extends Vue {
  @Prop(Boolean)
  private readonly hideLabel!: boolean

  private optionsVisible = false

  private modal = {
    visible: false,
    loading: false
  }

  get spaces (): SpaceResource[] {
    return this.$store.state.space.spaces
  }

  get spacesMeta (): SpaceMetaResource[] {
    return this.$store.state.space.spacesMeta
  }

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
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

  toggleOptionsVisibility () {
    this.optionsVisible = !this.optionsVisible
  }

  signout () {
    this.$store.dispatch('auth/signout')
  }

  async switchSpace (space: SpaceResource) {
    const index = this.spaces.findIndex(item => space.id === item.id)
    const { activePage } = this.spacesMeta[index] || {}

    this.$store.commit('space/setActive', { space })

    try {
      await this.$router.push(activePage || '/')
    } catch { }
  }

  async addSpace (data: SpaceResource) {
    this.modal.loading = true

    try {
      await this.$store.dispatch('space/create', data)
    } catch { }

    this.modal.loading = false
    this.modal.visible = false
  }
}
</script>

<style lang="postcss" scoped>
.SelectSpace {
  @apply flex flex-1 mr-2;
}

.SelectSpace-options {
  @apply absolute z-10;
  @apply w-full p-4;
  @apply bg-white;

  @apply border rounded border-gray-400;
  bottom: calc(100% + 16px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);

  &::after {
    @apply absolute block;

    @apply bg-white;

    @apply border-r border-b border-gray-400;
    content: "";
    left: 1.5em;
    width: 1em;
    height: 1em;
    transform: translateY(0.7em) rotate(45deg);
  }
}

.SelectSpace-option {
  @apply flex flex-row justify-between items-center;

  @apply border-b border-gray-100;

  @apply pb-3 mb-3;

  @apply cursor-pointer;

  &.is-active {
    .SelectSpace-option-icon {
      @apply bg-success border-success;
    }
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
}

.SelectSpace-option-icon {
  @apply flex justify-center items-center;

  @apply border rounded-full border-gray-100;
  width: 20px;
  height: 20px;
}

.SelectSpace-create {
  @apply flex flex-row items-center justify-center;

  @apply border rounded border-dashed border-gray-400;

  @apply w-full p-3 mb-3;

  @apply outline-none;
  transition: 0.3s;

  &:hover {
    @apply border-primary text-primary;
  }
}

.SelectSpace-logout {
  @apply flex w-full;

  transition: 0.3s;

  &:hover {
    @apply text-primary;
  }
}

.SelectSpace-email {
  @apply inline-block truncate;

  max-width: calc(100% - 60px);
}
.space-logo {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}
</style>
