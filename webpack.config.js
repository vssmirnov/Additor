const path = require("path");

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
      src: path.resolve(__dirname, "src"),
      audio_module_manager$: path.resolve(__dirname, "src/audio_module_manager/audio-module-manager.js"),
      audio_modules: path.resolve(__dirname, "src/audio_modules"),
      audio_patches: path.resolve(__dirname, "src/audio_patches"),
      controller_modules: path.resolve(__dirname, "src/controller_modules"),
      controller_patches: path.resolve(__dirname, "src/controller_patches"),
      dom_maps: path.resolve(__dirname, "src/dom_maps"),
      ui: path.resolve(__dirname, "src/ui"),
      util: path.resolve(__dirname, "src/util")
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["babel-preset-env"],
          plugins: ["transform-object-rest-spread"]
        }
      }
    ]
  }
}];
