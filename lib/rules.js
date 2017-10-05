/**
 * Retrieves rule's index in webpack configuration by test property
 * @param {Object} config - webpack configuration
 * @param {string} test - exact value of test property
 * @returns {number|null}
 */
function getRuleIndexByTest(config, test) {
  const index = config.module.rules.findIndex((rule) => String(rule.test) === String(test))
  return index !== -1 ? index : null
}

/**
 * Retrieves rule's index in webpack configuration by loader. 
 * Returns first found result.
 * @param {Object} config - webpack configuration
 * @param {string} loader - loader name
 * @returns {number|null}
 */
function getRuleIndexByLoader(config, loaderName) {
  const index = config.module.rules.findIndex((rule) => {
    const loaders = rule.use || 
                    rule.loaders || 
                    (typeof rule.loader !== 'undefined' ? [rule.loader] : [])

    // Match by exact name or do non-exact matching if loader name is a path
    // This sucks but there isn't much we can do without breaking special configurations
    const matchName = (loader) => loader === loaderName || loader[0] === '/' && loader.match(loaderName)

    if(typeof loaders === 'string') {
      return matchName(loaders)
    }

    if(loaders.constructor === Array) {
      return loaders.find((loader) => 
        // if loader is name (e.g "file-loader") or path (e.g. "/foo/node_modules/file-loader/lib/index.js")
        (typeof loader === 'string' && matchName(loader)) || 
        // or if it's an object ({ loader: 'foo-loader' })
        (typeof loader.loader !== 'undefined' && matchName(loader.loader))
      )
    }
  })
  return index !== -1 ? index : null
}

/**
 * Modifies webpack rule in place. You can pass either test property 
 * (ex. `{ test: /\.css$/ })` or loader (ex. `{ loader: 'css-loader' }`)` 
 * to the second argument.
 *
 * @example
 *
 * modifyRule(appConfig, { test: /\.css$/ }, (rule) => {
 *   rule.test = /\.s?css/
 *   rule.use.push({ loader: 'scss-loader' })
 * })
 *
 * @param {Object} config - webpack configuration
 * @param {Object} rule - webpack rule
 * @param {string|RegExp} rule.test - rule's test property
 * @param {string} rule.loader - rule's loader
 * @param {modifyRuleFn} fn
 * @throws {Error} an exception if it cannot find requested rule
 * @returns result of the callback
 */
function modifyRule(config, { test, loader }, fn) {
  if(test && loader) {
    throw 'You have tried to use modifyRule with both test and loader. This is not supported. Feel free to send a PR! https://github.com/d4rky-pl/razzle-config-utils/pulls'
  }

  const index = test ? getRuleIndexByTest(config, test) : getRuleIndexByLoader(config, loader)

  if(index === null) {
    throw "Could not find rule by " + (test || loader) + "\nCheck your razzle.config.js"
  }

  return fn(config.module.rules[index], index)
}

/**
 * Replaces webpack rule. You can pass either test property 
 * (ex. `{ test: /\.css/ })` or loader (ex. `{ loader: 'css-loader' }`)` 
 * to the second argument. If the rule cannot be found, it's ignored.
 *
 * @example
 *
 * replaceRule(appConfig, { test: /\.css$/ }, {
 *   test: /\.s?css/,
 *   use: [
 *     // ... etc
 *   ]
 * })
 *
 * @param {Object} config - webpack configuration
 * @param {string|RegExp} rule.test - rule's test property
 * @param {string} rule.loader - rule's loader
 * @returns rule
 */
function replaceRule(config, { test, loader }, rule) {
  if(test && loader) {
    throw 'You have tried to use replaceRule with both test and loader. This is not supported. Feel free to send a PR! https://github.com/d4rky-pl/razzle-config-utils/pulls'
  }

  const index = test ? getRuleIndexByTest(config, test) : getRuleIndexByLoader(config, loader)
  return index !== null ? config.module.rules[index] = rule : null
}

/**
 * Adds file extension to the list of extensions ignored by file-loader
 * This is useful if you're adding support for something that Razzle does
 * not support yet (SASS/Less, Handlebars, you name it)
 *
 * @example
 *
 * ignoreFileExtension(appConfig, /\.hbs$/)
 *
 * @param {Object} config - webpack configuration
 * @param {RegExp} extension - file extension
 * @returns rule
 */
function ignoreFileExtension(config, extension) {
  const index = getRuleIndexByLoader(config, 'file-loader')
  if(index !== null) {
    config.module.rules[index].exclude.push(extension)
  } else {
    throw 'I could not find the default file-loader. This should never happen, file an issue please! https://github.com/d4rky-pl/razzle-config-utils/issues'
  }
}

/**
 * Callback that will be invoked with found rule.
 *
 * @callback modifyRuleFn
 * @param {Object} rule rule
 * @param {number} index rule's index
 */

module.exports = {
  getRuleIndexByTest, 
  getRuleIndexByLoader,
  modifyRule, 
  replaceRule,
  ignoreFileExtension
}