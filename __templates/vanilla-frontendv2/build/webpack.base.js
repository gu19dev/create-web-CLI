/* eslint-env node */
const webpack = require('webpack')
const {resolve} = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const options = require('./options')
const pkg = require('../package.json')

const IS_PROD = process.env.NODE_ENV === 'production'
const context = resolve(__dirname, '../')
const assetsName = 'assets/[name]-[hash:8].[ext]'
const autoprefixer = require('autoprefixer')({browsers: ['last 2 versions'] })

module.exports = {
  context,

  entry: options.entry,
  output: {
    path: resolve(context, options.build.outputDirectory),
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer]
      }
    }),
    new ExtractTextPlugin({
      filename: '[name]-[contenthash].css',
      allChunks: true,
      disable: !IS_PROD
    }),
  ].concat(
    Object.keys(options.entry).map(name => new HtmlWebpackPlugin({
      template: resolve(context, 'index.html'),
      filename: name === 'main' ? 'index.html' : `${name}.html`,
      chunks: [name],
      title: pkg.name,
      chunksSortMode: 'dependency',
      minify: IS_PROD && {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }))
  ),
  module: {
    noParse: /\.min\.js/,
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader']
        })
      },
      {
        test: /\.s(a|c)ss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader', 'less-loader']
        })
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: resolve(context, 'src'),
        query: {
          cacheDirectory: !IS_PROD
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [autoprefixer]
        }
      },
      {
        test: /\.(png|gif|pdf|jpg|jpeg|otf|mp4|webm)$/,
        loader: `url-loader?name=${assetsName}&limit=10240`,
      },
      {test: /\.(ttf|woff|woff2|eot|svg)$/, loader: `file-loader?name${assetsName}`},
      {test: /\.html$/, loader: 'html-loader'},
      {test: /favicon\.ico$/, loader: 'file-loader?name=[name].ico'},
    ],
  },
  resolve: {
    modules: ['node_modules', 'src'],
    alias: options.alias
  },
  stats: {
    children: false
  }
}