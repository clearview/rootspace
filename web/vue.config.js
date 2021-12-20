// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
process.env.VUE_APP_VERSION = process.env.npm_package_version

module.exports = {
  runtimeCompiler: true,
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Rootspace'
    }
  },
  devServer: {
    port: process.env.VUE_APP_PORT || 3000
  },
  configureWebpack: config => {
    // get a reference to the existing ForkTsCheckerWebpackPlugin
    const existingForkTsChecker = config.plugins.filter(
      p => p instanceof ForkTsCheckerWebpackPlugin
    )[0]

    // remove the existing ForkTsCheckerWebpackPlugin
    // so that we can replace it with our modified version
    config.plugins = config.plugins.filter(
      p => !(p instanceof ForkTsCheckerWebpackPlugin)
    )

    // copy the options from the original ForkTsCheckerWebpackPlugin
    // instance and add the memoryLimit property
    const forkTsCheckerOptions = existingForkTsChecker ? existingForkTsChecker.options : {}
    forkTsCheckerOptions.memoryLimit = process.env.VUE_MEMORY_LIMIT || 2048

    config.plugins.push(new ForkTsCheckerWebpackPlugin(forkTsCheckerOptions))
  },
  chainWebpack: config => config.resolve.symlinks(false),
  transpileDependencies: [
    /[\\/]node_modules[\\/]tiptap.*/
  ]
}
