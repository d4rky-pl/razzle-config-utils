# razzle-config-utils

razzle-config-utils is a set of utilities for razzle.config.js

If there's a snippet of code that you keep reusing in your own razzle config, consider sending a pull request!

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### getPluginIndex

Retrieves plugin's index in webpack configuration or returns null

**Parameters**

-   `config` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** webpack configuration
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Plugin name

Returns **([number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | null)** 

### isPluginLoaded

Checks if plugin is loaded

**Parameters**

-   `config` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** webpack configuration
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Plugin name

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### modifyPluginFn

Function that will be invoked with found plugin

Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

**Parameters**

-   `plugin` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `plugin` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 's index

### modifyPlugin

Modifies webpack plugin in place.

**Parameters**

-   `config` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** webpack configuration
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Plugin name
-   `fn` **[modifyPluginFn](#modifypluginfn)** 

**Examples**

```javascript
modifyPlugin(appConfig, 'StartServerPlugin', (plugin) => {
      plugin.options.nodeArgs = ['--inspect']
    })
```

-   Throws **any** an exception if it cannot find requested plugin

Returns **any** result of the callback

### replacePlugin

Replaces webpack plugin.

**Parameters**

-   `config` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** webpack configuration
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Plugin name
-   `plugin`  
-   `fn` **[modifyPluginFn](#modifypluginfn)** 

**Examples**

```javascript
replacePlugin(appConfig, 'UglifyJsPlugin', new MinifyPlugin())
```

Returns **any** plugin