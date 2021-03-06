var path = require('path');
var webpack = require('webpack');

var config = {
  devtool: 'inline-source-map',
  entry: {
    javascript: [
      'webpack-dev-server/client?http://localhost:3000/',
      'webpack/hot/only-dev-server',
      './src/index'
    ],
    html: './src/index.html'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'http://localhost:3000/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    noParse: /\/levelup\//,
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        configFile: './.eslintrc',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot-loader/webpack', 'babel'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?name=[path][name].[ext]&limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(png|jpg|cur)$/,
        loader: 'url-loader?name=[path][name].[ext]&limit=8192'
      },
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  }
};

if ('production' === process.env.NODE_ENV) {
  config.entry.javascript = ['./src/index'];
  delete config.output.publicPath;
}

module.exports = config;
