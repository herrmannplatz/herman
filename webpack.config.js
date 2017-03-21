var path = require('path')

module.exports = {
  entry: './src/herman.js',
  output: {
    filename: 'herman.js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      }
    ]
  }
}
