<template>
  <div
    class="sidebar"
    :class="{
      'sidebar--collapse': collapse,
      'sidebar--noanimate': noanimate
    }"
    @click="collapse && toggleCollapse()"
  >
    <sidebar-header
      :page-ready="pageReady"
      :collapse-state="collapse"
      @toggle-collapse="toggleCollapse()">
    </sidebar-header>

    <div class="sidebar-items">
      <sidebar-tree
        v-if="pageReady"
        class="py-4"
        :menu-open="isMenuOpen"
        @menu-selected="menuSelected"
        @addNew="addNew"/>
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-actions">
        <div class="flex flex-1">
          <button
            class="btn add-button flex-grow"
            @click="toggleMenu()"
          >
              <v-icon
                :name="iconAddMenu"
                size="16px"
                viewbox="16"
                class="mr-2 add-icon"
              />
            <div>
              {{ textAddMenu }}
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Ref } from 'vue-property-decorator'

import ButtonNodeAdd from '@/components/ButtonNodeAdd.vue'

import SidebarTree from '@/components/sidebar/SidebarTree.vue'
import SidebarHeader from '@/components/sidebar/SidebarHeader.vue'

import { NodeResource, SpaceResource } from '@/types/resource'
import PageMixin from '@/mixins/PageMixin'

@Component({
  name: 'Sidebar',
  components: {
    ButtonNodeAdd,
    SidebarTree,
    SidebarHeader
  }
})
export default class Sidebar extends Mixins(PageMixin) {
  private isMenuOpen = false
  private iconAddMenu = 'plus3'
  private textAddMenu = 'Add New'

  @Prop(Boolean)
  private readonly noanimate!: boolean

  @Ref('buttonAdd')
  private readonly buttonAddRef!: ButtonNodeAdd;

  get collapse () {
    return this.$store.state.sidebar.collapse
  }

  get activeSpace (): SpaceResource {
    return this.$store.getters['space/activeSpace']
  }

  toggleCollapse () {
    this.$store.commit('sidebar/setCollapse', !this.collapse)

    if (this.collapse && this.isMenuOpen) {
      this.toggleMenu()
    }
  }

  async gotoSetting () {
    try {
      await this.$router.push({ name: 'Settings' })
    } catch { }
  }

  toggleMenu () {
    this.isMenuOpen = !this.isMenuOpen
    this.iconAddMenu = this.isMenuOpen ? 'close3' : 'plus3'
    this.textAddMenu = this.isMenuOpen ? 'Close' : 'Add New'
  }

  menuSelected (state: boolean) {
    this.isMenuOpen = state
    this.iconAddMenu = this.isMenuOpen ? 'close3' : 'plus3'
    this.textAddMenu = this.isMenuOpen ? 'Close' : 'Add New'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addNew (path: [], payload: NodeResource) {
    this.isMenuOpen = true
    this.iconAddMenu = this.isMenuOpen ? 'close3' : 'plus3'
    this.textAddMenu = this.isMenuOpen ? 'Close' : 'Add New'
  }
}
</script>

<style lang="postcss" scoped>
.add-button {
  @apply flex pl-4 w-full justify-start;

  cursor: pointer;
  border: 0;
  min-width: 232px;
  color: #2C2B35;
  height: auto;

  span {
     @apply mr-2;
  }
  .add-icon {
    color: #AAB1C5;
    transition: all 0.3s ease;
  }
  div {
    line-height: 19px;
    font-weight: 500;
    font-size: 16px;
  }

  &:focus {
    background: transparent;
  }
  &:hover {
    color: theme("colors.primary.default");
    background: transparent;
    box-shadow: none;
    .add-icon {
      color: theme("colors.primary.default");
    }
  }
}
</style>
