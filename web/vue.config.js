module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/scss/main.scss";`
      }
    },
    extract: true
  }
}
