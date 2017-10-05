const utils = require('./rules')

let webpackConfig

describe('rules', () => {
  beforeEach(() => {
    webpackConfig = {
      entry: "./entry.js",
      output: {
        path: __dirname,
        filename: "bundle.js"
      },
      module: {
        rules: [
          { 
            test: /\.css$/, 
            use: [ 
              "style-loader", 
              {
                loader: "css-loader"
              },
              {
                loader: "/home/foo/project/node_modules/postcss-loader/lib/index.js"
              }
            ]
          },
          {
            exclude: [
              /\.html$/
            ],
            loader: "/home/foo/project/node_modules/file-loader/lib/index.js",
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ]
      }
    }
  })

  describe('getRuleIndexByTest', () => {
    it('returns index for rule', () => {
      const index = utils.getRuleIndexByTest(webpackConfig, /\.css$/)
      expect(index).toEqual(0)
    })

    it('returns null for non-existing rule', () => {
      const index = utils.getRuleIndexByTest(webpackConfig, /\.lolcat/)
      expect(index).toBeNull()
    })
  })

  describe('getRuleIndexByLoader', () => {
    it('returns index for loader (string)', () => {
      const index = utils.getRuleIndexByLoader(webpackConfig, 'style-loader')
      expect(index).toEqual(0)
    })

    it('returns index for loader (object)', () => {
      const index = utils.getRuleIndexByLoader(webpackConfig, 'css-loader')
      expect(index).toEqual(0)
    })

    it('returns index for loader (object with path)', () => {
      const index = utils.getRuleIndexByLoader(webpackConfig, 'postcss-loader')
      expect(index).toEqual(0)
    })

    it('returns null for non-existing loader', () => {
      const index = utils.getRuleIndexByLoader(webpackConfig, 'raw-loader')
      expect(index).toBeNull()
    })
  })

  describe('modifyRule', () => {
    it('modifies rule in place', () => {
      utils.modifyRule(webpackConfig, { test: /\.css$/ }, (rule) => {
        rule.test = /\.s?css/
      })
      expect(webpackConfig.module.rules[0].test).toEqual(/\.s?css/)
    })

    it('throws if rule cannot be found', () => {
      expect(() => {
        utils.modifyRule(webpackConfig, { test: /\.lolcat/ }, ()=>{})
      }).toThrowError(/Could not find rule/)
    })
  })

  describe('replaceRule', () => {
    it('replaces rule', () => {
      utils.replaceRule(webpackConfig, { test: /\.css$/ }, {
        test: /\.s?css/,
        use: [ 'raw-loader' ]
      })
      expect(webpackConfig.module.rules[0].use[0]).toEqual('raw-loader')
    })

    it('does not throw for non-existing rule', () => {
      expect(() => {
        utils.replaceRule(webpackConfig, { test: /\.lolcat$/ }, {})
      }).not.toThrow()
    })
  })

  describe('ignoreFileExtension', () => {
    it('adds extension to the list of ignored', () => {
      utils.ignoreFileExtension(webpackConfig, /\.md$/)
      // Comparing RegExps in Javascript, ugh...
      expect(String(webpackConfig.module.rules[1].exclude[1])).toEqual("/\\.md$/")
    })
  })
})