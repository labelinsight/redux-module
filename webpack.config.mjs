import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  entry: './src/index.mjs',
  output: {
    library: 'ReduxModule',
    libraryTarget: 'umd',
    filename: 'index.js',
    path: `${__dirname}/dist`,
  },
}
