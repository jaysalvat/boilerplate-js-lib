/* eslint-disable camelcase */
import { terser } from 'rollup-plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import Case from 'case'
import pkg from './package.json'

const NAME = Case.pascal(pkg.name)
const FILENAME = Case.kebab(pkg.name)
const SRC = './src'
const DIST = './build'
const EXPORT = 'default'
const FORMATS = [
  'iife',
  'esm',
  'cjs',
  'umd'
]

const configs = []
const now = new Date().toISOString()
const watched = process.env.ROLLUP_WATCH
const mutedWarnings = [ 'CIRCULAR_DEPENDENCY' ]

const bannerMinify = `/*! ${NAME} v${pkg.version} */`
const bannerBeautify = `
/**!
* ${NAME}
* https://github.com/jaysalvat/${FILENAME}
* @version ${pkg.version} built ${now}
* @license ${pkg.license}
* @author Jay Salvat http://jaysalvat.com
*/`

const config = {
  filesize: {
    showMinifiedSize: false
  },
  terser: {
    minified: {
      mangle: {
        toplevel: true
      },
      compress: {
        toplevel: true,
        reduce_funcs: true,
        keep_infinity: true,
        pure_getters: true,
        passes: 3
      }
    },
    pretty: {
      mangle: false,
      compress: false,
      output: {
        beautify: true,
        indent_level: 2,
        braces: true
      }
    }
  }
}

FORMATS.forEach((format) => {
  const filename = FILENAME + '.' + format
  const extension = format === 'cjs' ? '.cjs' : '.js'

  configs.push({
    input: SRC + '/index.js',
    output: [
      {
        format: format,
        file: DIST + '/' + filename + extension,
        name: NAME,
        exports: EXPORT,
        banner: !watched && bannerBeautify,
        plugins: [
          terser(config.terser.pretty),
          filesize(config.filesize)
        ]
      },
      {
        format: format,
        file: DIST + '/' + filename + '.min' + extension,
        name: NAME,
        exports: EXPORT,
        banner: !watched && bannerMinify,
        plugins: [
          terser(config.terser.minified),
          filesize(config.filesize)
        ]
      }
    ],
    plugins: [
      commonjs(),
      nodeResolve()
    ],
    onwarn: (warning, warn) => {
      if (mutedWarnings.includes(warning.code)) {
        return
      }
      warn(warning)
    }
  })
})

export default configs
