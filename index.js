/**
 * Retrieves plugin's index in webpack configuration
 * @param {Object} config - webpack configuration
 * @param {string} name - Plugin name
 */
function getPluginIndex(config, name) {
  const index = config.plugins.findIndex((plugin) => plugin.constructor.name === name)

  if(index === -1) {
    throw "Could not find plugin: " + name + "\nCheck your razzle.config.js"
  }
  return index
}

/**
 * Function that will be invoked with found plugin
 *
 * @callback modifyPluginFn
 * @param {Object} plugin
 * @param {number} plugin's index
 */
/**
 * Modifies webpack plugin in place.
 *
 * @example
 *
 *     modifyPlugin(appConfig, 'StartServerPlugin', (plugin) => {
 *       plugin.options.nodeArgs = ['--inspect']
 *     })
 *
 * @param {Object} config - webpack configuration
 * @param {string} name - Plugin name
 * @param {modifyPluginFn} fn
 */
function modifyPlugin(config, name, fn) {
  const index = getPluginIndex(config, name)
  return fn(config.plugins[index], index)
}

/**
 * Replaces webpack plugin.
 *
 * @example
 *
 *     replacePlugin(appConfig, 'UglifyJsPlugin', new MinifyPlugin())
 *
 * @param {Object} config - webpack configuration
 * @param {string} name - Plugin name
 * @param {modifyPluginFn} fn
 */
function replacePlugin(config, name, plugin) {
  const index = getPluginIndex(config, name)
  return config.plugins[index] = plugin
}

module.exports = {
  getPluginIndex: getPluginIndex, 
  modifyPlugin: modifyPlugin, 
  replacePlugin: replacePlugin
}