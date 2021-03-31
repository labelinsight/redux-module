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
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
}
