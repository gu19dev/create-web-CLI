const webpack = require('webpack')
const merge = require('webpack-merge')
const options = require('./options')

module.exports = merge(require('./webpack.base'), {
  output: {
    publicPath: options.dev.assetsPublicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env.NODE_ENV': options.dev.env,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],
  devtool: 'eval',
  devServer: {
    stats: 'minimal',
    hot: true,
    historyApiFallback: true,
    headers: options.dev.headers,
    host: options.dev.host,
    port: options.dev.port,
    proxy: options.dev.proxy
  }
})