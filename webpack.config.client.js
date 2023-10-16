// const merge = require('webpack-merge')
// const webpack = require('webpack')
// const baseConfig = require('./webpack.base.config.js')
const path = require('path')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = function createClientConfig (config) {
  return {
    // 将 entry 指向应用程序的 server entry 文件
    entry: path.resolve(__dirname, './ssr/entry-client.js'),
    output: {
      path: path.resolve(__dirname, 'tmp'),
      filename: 'assets/js/[name].[chunkhash:8].js',
      publicPath: config.sub,
    },
    optimization: {
      splitChunks: {
        // include all types of chunks
        chunks: 'all',
      },
    },
    plugins: [
      new VueLoaderPlugin(),
      // 生成 `vue-ssr-client-manifest.json`, 可改名如 `client-manifest.json`
      new VueSSRClientPlugin({filename: 'client-manifest.json'}),
      new CopyPlugin({
        patterns: [
          { 
            from: path.resolve(__dirname, 'tmp'), 
            to: path.resolve(config.dest)
          },
        ],
      }),
    ],

    module: {
        rules: [
          { test: /\.vue$/, use: 'vue-loader' },
        ]
    },
  }
}