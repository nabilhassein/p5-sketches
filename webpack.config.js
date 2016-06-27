var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
var webpack = require('webpack');

var data = {
  title: 'p5-sketches',
  routes: [
    '/',
    '/matrix-green-rain/',
    '/boxing-timer/'
  ],
};

module.exports = {
  devtool: 'eval-source-map',

  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: './dist/',
    libraryTarget: 'umd',
  },

  devServer: {
    contentBase: 'static',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: __dirname + '/src/',
        loader: 'babel-loader',
      }
    ]
  },

  plugins: [
    new StaticSiteGeneratorPlugin('bundle.js', data.routes, data),
    new webpack.NoErrorsPlugin(),
  ],


  watch: true,
}
