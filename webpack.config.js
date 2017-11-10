module.exports = [{
  context: __dirname,
  entry: {
    "/dist/app": "./src/app.js",
    "/doc/ui": "./doc/ui.js"
  },
  output: {
    path: __dirname + "/",
    filename: "[name]-bundle.js"
  },
  resolve: {
    alias: {
      src: __dirname + "/src",
      audio_modules: __dirname + "/src/audio_modules",
      ui: __dirname + "/src/ui",
      util: __dirname + "/src/util"
    }
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
