const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'SmsRenderer',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      { test: /\.hbs$/, loader: 'raw-loader' },
    ],
  }
};