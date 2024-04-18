const webpack = require('webpack')
const merge = require('webpack-merge')
const options = require('./options')

module.exports = merge(require('./webpack.base'), {
  bail: true,
  output: {
    publicPath: options.build.assetsPublicPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env.NODE_ENV': options.build.env,
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
})