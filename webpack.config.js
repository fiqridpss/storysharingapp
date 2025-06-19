const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // bersihin dist dulu tiap build
  },
  module: {
    rules: [
      {
        test: /\.js$/, // semua .js
        exclude: /node_modules/, // kecuali node_modules
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // untuk .css
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // pakai html dari sini
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/public/app.webmanifest', to: '' },  // salin app.webmanifest ke dist/
        { from: 'src/public/favicon.jpg', to: '' },       // salin favicon.png ke dist/
        { from: 'src/public/images', to: 'images' },      // salin folder images ke dist/images
      ],
    }),
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'src/sw.js'),
      swDest: 'sw.js',
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: true, // supaya hash routing tetap jalan
  },
};
