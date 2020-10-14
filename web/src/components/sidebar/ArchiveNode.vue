<template>
  <Popover top="38px"
           :with-close="false"
           :offset="-48"
           position="right-end"
           borderless
           v-if="archives.length > 0">
    <template #default="{ }">
      <div class="archive-menu">
        <div class="menu-header">
          <h4 class="menu-title">Archive</h4>
          <Popover sub :offset="12" :with-close="false" position="bottom-start" class="delete-all-archive">
            <template #default="{ hide: subHide }">
              <div class="delete-confirmation">
                <h3>Delete Archive</h3>

                <p>Entire archive will be permanently deleted. You can’t undo this action.</p>

                <div class="delete-action">
                  <button class="btn btn-secondary" @click="subHide();">Cancel</button>
                  <button class="btn btn-primary" @click="removeAll();subHide();">
                    Delete
                  </button>
                </div>
              </div>
            </template>
            <template #trigger="{ visible: subVisible }">
              <button class="delete-all-button" :class="{'active': subVisible}" v-if="archives.length > 0">
                <v-icon class="delete-all-button-icon" name="trash" viewbox="30" size="20px"></v-icon>
                <span class="delete-all-button-text">
                  Delete everything permanently
                </span>
              </button>
            </template>
          </Popover>
        </div>
        <div class="archives">
          <div class="empty-archive" v-if="archives.length === 0">
            No archived items
          </div>
          <tree
            v-if="archives.length > 0"
            ref="tree"
            v-model="archives"
            class="tree readonly"
            :indent="16"
            #default="{ node, path }"
          >
            <tree-node-readonly
              :value="node"
              :path="path"
              @restore="restore(node)"
              @remove="remove(node)"
            />
          </tree>
        </div>
      </div>
    </template>
    <template #trigger="{ visible }">
      <div class="archive-node" :class="{visible}" @click="loadArchive">
        <div class="archive-icon">
          <v-icon
            name="trash-archive"
            size="16px"
            viewbox="16"
          />
        </div>
        <div class="archive-title">
          Archive
        </div>
      </div>
    </template>
  </Popover>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Vue, Watch } from 'vue-property-decorator'
import Popover from '@/components/Popover.vue'
import api from '@/utils/api'
import store from '@/store'
import { NodeResource } from '@/types/resource'
import { Draggable, Fold, Tree } from '@adityapurwa/he-tree-vue'
import TreeNodeReadonly from '@/components/sidebar/SidebarTreeNodeReadonly.vue'

@Component({
  components: {
    Popover,
    Tree: Mixins(Tree as any, Fold),
    TreeNodeReadonly
  }
})
export default class ArchiveNode extends Vue {
  private archives: NodeResource[] = [];

  @Ref('tree')
  private readonly treeRef!: Tree & Fold & Draggable;

  private storeSub: null | (() => void) = null;

  get currentSpaceId () {
    return store.getters['space/activeSpace'].id
  }

  public async loadArchive () {
    const res = await api.get(`spaces/${this.currentSpaceId}/archive`)
    this.archives = res.data.data.data
  }

  async restore (node: NodeResource) {
    await this.$store.dispatch('tree/restore', node)
    await this.loadArchive()
    this.$emit('restore')
  }

  async remove (node: NodeResource) {
    window.app.confirm('Remove permanently?', `Remove ${node.title} permanently?`, async () => {
      await this.$store.dispatch('tree/destroy', node)
      await this.loadArchive()
    })
  }

  mounted () {
    this.loadArchive()
  }

  destroyed () {
    if (this.storeSub) {
      this.storeSub()
    }
  }

  async removeAll () {
    await this.$store.dispatch('tree/clearArchive', this.currentSpaceId)
    await this.loadArchive()
  }

  @Watch('archives')
  private notifyWhenArchiveIsEmpty () {
    if (this.archives.length === 0) {
      this.$emit('emptied')
    }
  }
}
</script>

<style lang="postcss" scoped>
.archive-node {
  margin-top: 24px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #2C2B35;
  width: 100%;
  border-radius: 3px;

  &:hover {
    background: #F8F9FD;
  }
  &.visible {
    background: #EFF1F6;
  }
}

.archive-icon {

}

.archive-title {
  margin-left: 8px;
}

.archive-menu {
  background: #FFFFFF;
  width: 480px;
}
.menu-header {
  padding: 16px 8px;
  display: flex;
  align-items: center;
}
.menu-title {
  margin-left: 8px;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: #2C2B35;
  flex: 1 1 auto;
}
.delete-all-archive {
  flex: 0 0 auto;
}
.popover-trigger .delete-all-button {
  border-radius: 4px;
  padding: 4px 12px 4px 8px;
  display: flex;
  align-items: center;
  color: #FF5A5A;
  cursor: pointer;
  border: 2px solid transparent;
  outline: none;
  &:hover {
    background: #F8F9FD;
  }
  &:active, &:focus, &.active {
    border: 2px solid #F9DFE3;
  }
}
.delete-all-button-text {
  display: block;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  margin-left: 4px;
}
.delete-confirmation {
  width: 272px;
  padding: 16px;
  border-radius: 4px;
  color: theme("colors.gray.900");
  text-align: left;
  border: 1px solid #C72F2F;
  position: relative;

  &::before{
    content: '';
    border-top: 1px solid #C72F2F;
    border-left: 1px solid #C72F2F;
    background: #fff;
    width: 12px;
    height: 12px;
    transform: rotate(45deg);
    position: absolute;
    top: -7px;
    left: 32px;
  }

  h3 {
    font-size: 15px;
    line-height: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    line-height: 17px;
  }

  .delete-action {
    @apply flex items-center justify-end;

    margin-top: 16px;

    p {
      cursor: pointer;
      font-size: 14px;
      line-height: 17px;
      font-weight: bold;
      margin-right: 16px;
    }

    button {
      height: 32px;
      font-size: 14px;
      line-height: 17px;
      font-weight: normal;
      padding: 8px 24px;
    }
    .btn-secondary {
      padding: 8px 24px;
    }
  }
}
.archives {
  overflow-y: scroll;
  border-top: solid 1px #DEE2EE;
  max-height: 70vh;
  min-height: 10vh;
}
.empty-archive {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 12px;
  font-size: 14px;
  color: #444754;
}
</style>
