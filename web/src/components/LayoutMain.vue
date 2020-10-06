<template>
  <div class="layout">
    <sidebar
      class="pane-left"
      :style="sidebarStyle"
      :noanimate="resizing"
    />
    <div
      class="pane-resizer"
      @mousedown="start"
    />
    <div
      class="pane-right content"
    >
      <v-alert class="alert" v-model="alert" />
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { throttle } from 'lodash'

import VAlert from '@/components/Alert.vue'
import Sidebar from '@/components/sidebar'

@Component({
  name: 'LayoutMain',
  components: {
    VAlert,
    Sidebar
  }
})
export default class LayoutMain extends Vue {
  private alert: any = null
  private resizing = false

  get size () {
    return this.$store.state.sidebar.size
  }

  get sidebarStyle (): object {
    return {
      width: `${this.size}px`
    }
  }

  start (e: MouseEvent) {
    e.preventDefault()

    this.resizing = true

    document.addEventListener('mousemove', this.resize)
    document.addEventListener('mouseup', this.end)

    document.body.style.setProperty('cursor', 'col-resize')
  }

  end () {
    this.resizing = false

    document.removeEventListener('mousemove', this.resize)

    document.body.style.removeProperty('cursor')
  }

  resize (e: MouseEvent) {
    e.preventDefault()

    this.$store.commit('sidebar/setSize', e.pageX)
  }

  created () {
    this.start = this.start.bind(this)
    this.end = this.end.bind(this)
    this.resize = throttle(this.resize.bind(this), 15)

    if (!this.$store.state.auth.user.emailConfirmed) {
      this.alert = {
        type: 'secondary',
        message: 'Please remember to verify your email address',
        noicon: true
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.layout {
  @apply flex flex-row;
}

.pane-left {
  margin-right: -0.25rem;
}

.pane-right {
  margin-left: -0.25rem;
  width: 0;
  flex: 1 1 0;
}

.pane-resizer {
  @apply h-screen px-1;
  @apply z-10;

  cursor: col-resize;

  &:after {
    @apply block h-full;

    content: "";
    background: #EAEAEA;
    width: 1px;
  }

  .sidebar--collapse ~ & {
    pointer-events: none;
  }
}

.content {
  @apply flex flex-row flex-grow h-screen;
  overflow-y: scroll;

  .alert {
    @apply mx-4;
  }
}
</style>
