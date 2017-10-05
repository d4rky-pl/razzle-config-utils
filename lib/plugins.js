/**
 * Retrieves plugin's index in webpack configuration or returns null
 * @param {Object} config - webpack configuration
 * @param {string} name - Plugin name
 * @returns {number|null}
 */
function getPluginIndex(config, name) {
  const index = config.plugins.findIndex((plugin) => plugin.constructor.name === name)
  return index !== -1 ? index : null
}

/**
 * Checks if plugin is loaded
 * @param {Object} config - webpack configuration
 * @param {string} name - Plugin name
 * @returns {boolean}
 */
function isPluginLoaded(config, name) {
  return getPluginIndex(config,name) !== null
}

/**
 * Modifies webpack plugin in place.
 *
 * @example
 *
 * modifyPlugin(appConfig, 'StartServerPlugin', (plugin) => {
 *   plugin.options.nodeArgs = [Object']plugin - Plugin  
 * })
 *
 * @param {Object} config - webpack configuration
 * @param {string} name - Plugin name
 * @param {modifyPluginFn} fn
 * @throws {Error} an exception if it cannot find requested plugin
 * @returns result of the callback
 */
function modifyPlugin(config, name, fn) {
  const index = getPluginIndex(config, name)
  if(index === null) {
    throw "Could not find plugin: " + name + "\nCheck your razzle.config.js"
  }

  return fn(config.plugins[index], index)
}

/**
 * Replaces webpack plugin. If the plugin cannot be found, it's ignored.
 *
 * @example
 *
 * replacePlugin(appConfig, 'UglifyJsPlugin', new MinifyPlugin())
 *
 * @param {Object} config - webpack configuration
 * @param {string} name - Plugin name
 * @param {Object} plugin - Plugin instance (ex. new MinifyPlugin())
 * @returns plugin
 */
function replacePlugin(config, name, plugin) {
  const index = getPluginIndex(config, name)
  return index !== null ? config.plugins[index] = plugin : null
}

/**
 * Callback that will be invoked with found plugin.
 *
 * @callback modifyPluginFn
 * @param {Object} plugin plugin
 * @param {number} index plugin's index
 */

module.exports = {
  getPluginIndex, 
  isPluginLoaded,
  modifyPlugin, 
  replacePlugin
}