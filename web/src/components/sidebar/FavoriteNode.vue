<template>
  <div v-if="favorites.length" class="sidebar-favorites">
    <sidebar-title>Favorites</sidebar-title>
    <tree
      v-if="favorites.length > 0"
      ref="tree"
      v-model="favorites"
      class="tree"
      :indent="16"
      #default="{ node, path }"
    >
      <tree-node
        :value="node"
        :path="path"
        :hideSecondaryMenu="true"
        v-on="$listeners"
      />
    </tree>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Tree, Node } from '@adityapurwa/he-tree-vue'
import TreeNode from '@/components/sidebar/SidebarTreeNode.vue'
import SidebarTitle from '@/components/sidebar/SidebarTitle.vue'
import store from '@/store'

@Component({
  name: 'FavoriteNode',
  components: {
    SidebarTitle,
    Tree,
    TreeNode
  }
})
export default class FavoriteNode extends Vue {
  get favorites (): Node[] {
    const state = this.$store.state.tree
    const favorites = [...state.favorites]

    return favorites
  }
}
</script>

<style lang="postcss" scoped>
.sidebar-favorites {
  border-bottom: 1px solid #EAEAEA;
  padding-bottom: 10px;
  margin-bottom: 16px;
}
</style>
