module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Root'
    }
  },
  devServer: {
    port: process.env.VUE_APP_PORT || 3000
  }
}
