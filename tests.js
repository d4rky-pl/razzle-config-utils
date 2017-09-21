const assert = require('assert');
const sinon = require('sinon')
const utils = require('./index')

function FakeWebpackPlugin(opts) { this.options = opts }
function OtherFakePlugin(){}

const webpackConfig = {
  entry: "./entry.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  plugins: [
    new FakeWebpackPlugin({ fake: true })
  ],
  module: {
    rules: [
      { test: /\.css$/, use: [ "style-loader", "css-loader" ] }
    ]
  }
}

// test getPluginIndex
assert.equal(utils.getPluginIndex(webpackConfig, 'FakeWebpackPlugin'), 0)

// test modifyPlugin
utils.modifyPlugin(webpackConfig, 'FakeWebpackPlugin', function(plugin) {
  plugin.options.fake = false
})

assert.equal(webpackConfig.plugins[0].options.fake, false)

// test replacePlugin

const pluginInstance = new OtherFakePlugin()
utils.replacePlugin(webpackConfig, 'FakeWebpackPlugin', pluginInstance)

assert.equal(webpackConfig.plugins[0], pluginInstance)

console.info("All tests have passed successfully")