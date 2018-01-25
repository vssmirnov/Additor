const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = [{
  context: __dirname,

  entry: {
    "/dist/app": "./src/app.js",
    "/doc/ui/ui-doc": "./doc/ui/ui-doc.js",
    "/test/manual_test/audio_modules/manual-test": "./test/manual_test/audio_modules/manual-test.js",
    "/test/manual_test/audio_modules/stereo-panner-shim": "./test/manual_test/audio_modules/stereo-panner-shim",
    "/test/manual_test/audio_modules/channel-strip": "./test/manual_test/audio_modules/channel-strip",
    "/test/manual_test/audio_modules/envelope": "./test/manual_test/audio_modules/envelope"
  },

  output: {
    path: __dirname + "/",
    filename: "[name]-bundle.js"
  },

  devtool: "source-map",

  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      audio_module_manager$: path.resolve(__dirname, "src/audio_module_manager/audio-module-manager.js"),
      audio_modules: path.resolve(__dirname, "src/audio_modules"),
      audio_patches: path.resolve(__dirname, "src/audio_patches"),
      controller_modules: path.resolve(__dirname, "src/controller_modules"),
      controller_patches: path.resolve(__dirname, "src/controller_patches"),
      dom_maps: path.resolve(__dirname, "src/dom_maps"),
      styles: path.resolve(__dirname, "src/styles"),
      ui: path.resolve(__dirname, "src/ui"),
      util: path.resolve(__dirname, "src/util")
    }
  },

  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "sass-loader"
      }]
    }, {
      test: /\.js$/,
      use : {
        loader: "babel-loader",
        options: {
          presets: ["babel-preset-env"],
          plugins: ["transform-object-rest-spread"]
        }
      }
    }]
  },
  
  plugins: [
    // new UglifyJsPlugin()
  ]
}];