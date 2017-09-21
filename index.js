/**
 * Retrieves plugin's index in webpack configuration
 * @param {Object} config - webpack configuration
 * @param {string} name - Plugin name
 * @throws an exception if it cannot find requested plugin
 * @returns {number}
 */
function getPluginIndex(config, name) {
  const index = config.plugins.findIndex((plugin) => plugin.constructor.name === name)

  if(index === -1) {
    throw "Could not find plugin: " + name + "\nCheck your razzle.config.js"
  }
  return index
}

/**
 * Checks if plugin is loaded
 * @param {Object} config - webpack configuration
 * @param {string} name - Plugin name
 * @returns {boolean}
 */
function isPluginLoaded(config, name) {
  return config.plugins.findIndex((plugin) => plugin.constructor.name === name) !== -1
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
 * @returns result of the callback
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
 * @returns plugin
 */
function replacePlugin(config, name, plugin) {
  const index = getPluginIndex(config, name)
  return config.plugins[index] = plugin
}

module.exports = {
  getPluginIndex: getPluginIndex, 
  isPluginLoaded: isPluginLoaded,
  modifyPlugin: modifyPlugin, 
  replacePlugin: replacePlugin
}