module.exports = [{
  context: __dirname,
  entry: {
    "/dist/app": "./src/app.js",
    "/test/widgets/test-widgets": "./test/widgets/test-widgets.js"
  },
  output: {
    path: __dirname + "/",
    filename: "[name]-bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["babel-preset-env"]
        }
      }
    ]
  }
}]
