module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Root'
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/scss/main.scss";`
      }
    },
    extract: true
  }
}
