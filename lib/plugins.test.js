const utils = require('./plugins')

function FakeWebpackPlugin(opts) { 
  this.options = opts 
}
function OtherFakePlugin() {}

let webpackConfig

describe('plugins', () => {
  beforeEach(() => {
    webpackConfig = {
      entry: "./entry.js",
      output: {
        path: __dirname,
        filename: "bundle.js"
      },
      plugins: [
        new FakeWebpackPlugin({ fake: true })
      ]
    }
  })

  describe('getPluginIndex', () => {
    it('returns index for plugin', () => {
      const index = utils.getPluginIndex(webpackConfig, 'FakeWebpackPlugin')
      expect(index).toEqual(0)
    })
    it('returns null for non-existing plugin', () => {
      const index = utils.getPluginIndex(webpackConfig, 'NonExistentPlugin')
      expect(index).toBeNull()
    })
  })

  describe('isPluginLoaded', () => {
    it('returns true for loaded plugin', () => {
      const loaded = utils.isPluginLoaded(webpackConfig, 'FakeWebpackPlugin')
      expect(loaded).toBe(true)
    })
    it('returns false for not loaded plugin', () => {
      const loaded = utils.isPluginLoaded(webpackConfig, 'NonExistentPlugin')
      expect(loaded).toBe(false)
    })
  })

  describe('modifyPlugin', () => {
    it('modifies plugin', () => {
      utils.modifyPlugin(webpackConfig, 'FakeWebpackPlugin', function(plugin) {
        plugin.options.fake = false
      })
      expect(webpackConfig.plugins[0].options.fake).toBe(false)
    })

    it('throws when plugin cannot be found', () => {
      expect(() => {
        utils.modifyPlugin(webpackConfig, 'NonExistentPlugin', function(){})
      }).toThrowError(/Could not find plugin/)
    })
  })

  describe('replacePlugin', () => {
    it('replaces plugin', () => {
      const pluginInstance = new OtherFakePlugin()
      utils.replacePlugin(webpackConfig, 'FakeWebpackPlugin', pluginInstance)
      expect(webpackConfig.plugins[0]).toBe(pluginInstance)
    })

    it('does not throw when plugin cannot be found', () => {
      const pluginInstance = new OtherFakePlugin()
      expect(() => {
        utils.replacePlugin(webpackConfig, 'NonExistentPlugin', pluginInstance)
      }).not.toThrow()
    })
  })
})