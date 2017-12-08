module.exports = [{
  context: __dirname,
  entry: {
    "/dist/app": "./src/app.js",
    "/doc/ui/ui-doc": "./doc/ui/ui-doc.js"
  },
  output: {
    path: __dirname + "/",
    filename: "[name]-bundle.js"
  },
  resolve: {
    alias: {
      src: __dirname + "/src",
      audio_module_manager + "/src/audio_module_manager",
      audio_modules: __dirname + "/src/audio_modules",
      dom_maps: __dirname + "/src/dom_maps",
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
