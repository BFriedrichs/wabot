var webpack = require('webpack');
var path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    'babel-polyfill',
    app: ['./src/app/Main.jsx'],
  },
  output: {
    path: path.resolve('src/dist'),
    filename: 'bundle.js',
    library: '',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      'comm': path.resolve('src/app/comm'),
      'components': path.resolve('src/app/components'),
    }
  },
  target: 'electron-main',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve('src/app')
        ],
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-stage-0'],
          babelrc: false,
        }
      },
      { test: /\.css$/,
        include: [
          path.resolve('src/app')
        ],
        use: ExtractTextPlugin.extract({
          fallback: "file-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css"),
  ]
}