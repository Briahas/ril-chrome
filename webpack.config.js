// webpack.config.js
module.exports = {
  entry: {
    options: './src/options.js',
    popup: './src/popup/popup.js',
    background: './src/background/background.js',
    oauthcallback: './src/oauthcallback.js'
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js' // Template based on keys in entry above
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  }
};
