/* eslint-disable camelcase */
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import Case from 'case'
import pkg from './package.json'

const NAME = Case.pascal(pkg.name)
const FILENAME = Case.kebab(pkg.name)
const SRC = './src'
const DIST = './build'
const FORMATS = [
  'iife', 'iife.min',
  'esm', 'esm.min',
  'cjs', 'cjs.min',
  'umd', 'umd.min'
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

const terserBeautify = {
  mangle: false,
  compress: false,
  output: {
    beautify: true,
    indent_level: 2,
    braces: true
  }
}

const terserMinify = {
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
}

FORMATS.forEach((type) => {
  const [ format, minify ] = type.split('.')
  const extension = format === 'cjs' ? '.cjs' : '.js'
  const postfix = format === 'iife' ? '' : '.' + format
  const postfixMin = minify ? '.min' : ''
  const filename = FILENAME + postfix + postfixMin + extension

  if (format === 'iife' && minify) {
    terserMinify.mangle.toplevel = false
    terserMinify.compress.toplevel = false
  }

  configs.push({
    input: SRC + '/index.js',
    output: {
      format: format,
      file: DIST + '/' + filename,
      name: NAME,
      exports: 'default',
      banner: !watched && (minify ? bannerMinify : bannerBeautify),
      plugins: [
        !watched && terser(minify ? terserMinify : terserBeautify),
        filesize({
          showMinifiedSize: false
        })
      ]
    },
    onwarn: (warning, warn) => {
      if (mutedWarnings.includes(warning.code)) {
        return
      }
      warn(warning)
    }
  })
})

export default configs
