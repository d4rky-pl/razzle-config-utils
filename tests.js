const assert = require('assert');
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
assert.equal(utils.getPluginIndex(webpackConfig, 'NonExistentPlugin'), null)

// test isPluginLoaded
assert.ok(utils.isPluginLoaded(webpackConfig, 'FakeWebpackPlugin'))

// test modifyPlugin
utils.modifyPlugin(webpackConfig, 'FakeWebpackPlugin', function(plugin) {
  plugin.options.fake = false
})

assert.equal(webpackConfig.plugins[0].options.fake, false)

assert.throws(() => utils.modifyPlugin(webpackConfig, 'NonExistentPlugin', function(){}))

// test replacePlugin

const pluginInstance = new OtherFakePlugin()
utils.replacePlugin(webpackConfig, 'FakeWebpackPlugin', pluginInstance)

assert.equal(webpackConfig.plugins[0], pluginInstance)

console.info("All tests have passed successfully")