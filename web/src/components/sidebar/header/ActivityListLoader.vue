<template>
  <div class="list-loader-container">
    <ContentLoader viewBox="0 0 447 43">
      <circle cx="16" cy="16" r="16" />
      <rect x="40" y="2" rx="3" ry="3" width="300" height="10" />
      <rect x="40" y="18" rx="3" ry="3" width="100" height="10" />
    </ContentLoader>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  components: {
    ContentLoader
  }
}
</script>
<style lang="postcss" scoped>
.list-loader-container {
  padding: 1rem;
  height: 43px;
  box-sizing: content-box;
  overflow: hidden;
  border-bottom: 1px solid theme('colors.gray.100');
}
</style>
