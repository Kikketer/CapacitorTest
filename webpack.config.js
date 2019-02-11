/**
 * Chris Weed (chris@cjweed.com)
 */
require('dotenv').config()
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve('./src/index.js'),
  // Don't attempt to continue if there are any errors.
  bail: false,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',
  resolve: {
    alias: {
      // // https://github.com/lodash/lodash-webpack-plugin/issues/101
      // ...transform(_, (acc, val, key) => {
      //   if (['noConflict', 'runInContext', 'VERSION', '_'].includes(key)) return
      //   acc[`lodash.${toLower(key)}`] = require.resolve(`lodash/${key}`)
      // })
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: require.resolve('source-map-loader')
      },
      {
        test: /\.js$/,
        // include: paths.appSrc,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader')
      },
      {
        test: /\.svg$/,
        loader: require.resolve('svg-react-loader')
      }
    ]
  },
  plugins: [
    new CircularDependencyPlugin({
      // `onDetected` is called for each module that is cyclical
      onDetected({ webpackModuleRecord, paths, compilation }) {
        console.log('circular dependencies', paths)
      },
      // set the current working directory for displaying module paths
      cwd: process.cwd()
    }),
    new HtmlWebpackPlugin({ template: path.resolve('./public/index.html') }),
    // process.env.NODE_ENV !== 'development' &&
    //   new BundleAnalyzerPlugin({
    //     analyzerMode: 'static',
    //     openAnalyzer: false
    //   }),
    new webpack.DefinePlugin({
      'process.env.APP_DOMAIN': JSON.stringify(process.env.APP_DOMAIN),
      'process.env.APP_CLIENT_ID': JSON.stringify(process.env.APP_CLIENT_ID),
      'process.env.SIGN_IN_URL': JSON.stringify(process.env.SIGN_IN_URL),
      'process.env.SIGN_OUT_URL': JSON.stringify(process.env.SIGN_OUT_URL),
      'process.env.WEB_DOMAIN': JSON.stringify(process.env.WEB_DOMAIN)
    })

    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ].filter(Boolean),
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true
      })
    ]
  },
  // stats: false,
  performance: false
}
