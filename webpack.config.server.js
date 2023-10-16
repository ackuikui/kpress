// const merge = require('webpack-merge')
// const baseConfig = require('./webpack.base.config.js')
const path = require('path')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports =  {
  // 将 entry 指向应用程序的 server entry 文件
  entry: path.resolve(__dirname, './ssr/entry-server.js'),

  // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',

  // 对 bundle renderer 提供 source map 支持
  devtool: 'source-map',

  // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'tmp'),
  },

  // 默认文件名为 `vue-ssr-server-bundle.json`
  plugins: [
    new VueLoaderPlugin(),
    new VueSSRServerPlugin({filename: 'server-bundle.json'}),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: "manifest",
    //     minChunks: Infinity
    // }),
  ],

  module: {
      rules: [
        { test: /\.vue$/, use: 'vue-loader' },
      ]
  },
}