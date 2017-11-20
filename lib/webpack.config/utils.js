'use strict'
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function(config, paths) {
  return {
    assetsPath: function (_path) {
      const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
      return path.posix.join(assetsSubDirectory, _path)
    },

    cssLoaders: function(options) {
      options = options || {}

      const cssLoader = {
        loader: 'css-loader',
        options: {
          minimize: process.env.NODE_ENV === 'production',
          sourceMap: options.sourceMap
        }
      }

      // generate loader string to be used with extract text plugin
      function generateLoaders (loader, loaderOptions) {
        const loaders = [cssLoader]
        if (loader) {
          loaders.push({
            loader: loader + '-loader',
            options: Object.assign({}, loaderOptions, {
              sourceMap: options.sourceMap
            })
          })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
          return ExtractTextPlugin.extract({
            use: loaders,
            fallback: 'vue-style-loader'
          })
        } else {
          return ['vue-style-loader'].concat(loaders)
        }
      }

      // https://vue-loader.vuejs.org/en/configurations/extract-css.html
      return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        // less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass')
        // stylus: generateLoaders('stylus'),
        // styl: generateLoaders('stylus')
      }
    },

    // Generate loaders for standalone style files (outside of .vue)
    styleLoaders: function(options) {
      const output = []
      const loaders = this.cssLoaders(options)
      for (const extension in loaders) {
        const loader = loaders[extension]
        if (extension === 'css') {
          loader.push('postcss-loader')
        } else {
          // postcss-loader 必须在 sass-loader 之前
          loader.splice(process.env.NODE_ENV === 'production' ? 4 : 3, 0, 'postcss-loader')
        }
        output.push({
          test: new RegExp('\\.' + extension + '$'),
          use: loader
        })
      }
      return output
    }
  }
}
