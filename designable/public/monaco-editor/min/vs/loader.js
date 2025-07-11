'use strict'
/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(0316a754aa4c25208bef91937efbce2ab1e3ce37)
 * Released under the MIT license
 * https://github.com/microsoft/vscode/blob/main/LICENSE.txt
 *-----------------------------------------------------------*/ var _amdLoaderGlobal =
    this,
  _commonjsGlobal = typeof global == 'object' ? global : {},
  AMDLoader
;(function (l) {
  l.global = _amdLoaderGlobal
  var E = (function () {
    function p() {
      ;(this._detected = !1),
        (this._isWindows = !1),
        (this._isNode = !1),
        (this._isElectronRenderer = !1),
        (this._isWebWorker = !1),
        (this._isElectronNodeIntegrationWebWorker = !1)
    }
    return (
      Object.defineProperty(p.prototype, 'isWindows', {
        get: function () {
          return this._detect(), this._isWindows
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(p.prototype, 'isNode', {
        get: function () {
          return this._detect(), this._isNode
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(p.prototype, 'isElectronRenderer', {
        get: function () {
          return this._detect(), this._isElectronRenderer
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(p.prototype, 'isWebWorker', {
        get: function () {
          return this._detect(), this._isWebWorker
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(p.prototype, 'isElectronNodeIntegrationWebWorker', {
        get: function () {
          return this._detect(), this._isElectronNodeIntegrationWebWorker
        },
        enumerable: !1,
        configurable: !0,
      }),
      (p.prototype._detect = function () {
        this._detected ||
          ((this._detected = !0),
          (this._isWindows = p._isWindows()),
          (this._isNode = typeof module != 'undefined' && !!module.exports),
          (this._isElectronRenderer =
            typeof process != 'undefined' &&
            typeof process.versions != 'undefined' &&
            typeof process.versions.electron != 'undefined' &&
            process.type === 'renderer'),
          (this._isWebWorker = typeof l.global.importScripts == 'function'),
          (this._isElectronNodeIntegrationWebWorker =
            this._isWebWorker &&
            typeof process != 'undefined' &&
            typeof process.versions != 'undefined' &&
            typeof process.versions.electron != 'undefined' &&
            process.type === 'worker'))
      }),
      (p._isWindows = function () {
        return typeof navigator != 'undefined' &&
          navigator.userAgent &&
          navigator.userAgent.indexOf('Windows') >= 0
          ? !0
          : typeof process != 'undefined'
          ? process.platform === 'win32'
          : !1
      }),
      p
    )
  })()
  l.Environment = E
})(AMDLoader || (AMDLoader = {}))
var AMDLoader
;(function (l) {
  var E = (function () {
    function a(n, v, s) {
      ;(this.type = n), (this.detail = v), (this.timestamp = s)
    }
    return a
  })()
  l.LoaderEvent = E
  var p = (function () {
    function a(n) {
      this._events = [new E(1, '', n)]
    }
    return (
      (a.prototype.record = function (n, v) {
        this._events.push(
          new E(n, v, l.Utilities.getHighPerformanceTimestamp())
        )
      }),
      (a.prototype.getEvents = function () {
        return this._events
      }),
      a
    )
  })()
  l.LoaderEventRecorder = p
  var g = (function () {
    function a() {}
    return (
      (a.prototype.record = function (n, v) {}),
      (a.prototype.getEvents = function () {
        return []
      }),
      (a.INSTANCE = new a()),
      a
    )
  })()
  l.NullLoaderEventRecorder = g
})(AMDLoader || (AMDLoader = {}))
var AMDLoader
;(function (l) {
  var E = (function () {
    function p() {}
    return (
      (p.fileUriToFilePath = function (g, a) {
        if (((a = decodeURI(a).replace(/%23/g, '#')), g)) {
          if (/^file:\/\/\//.test(a)) return a.substr(8)
          if (/^file:\/\//.test(a)) return a.substr(5)
        } else if (/^file:\/\//.test(a)) return a.substr(7)
        return a
      }),
      (p.startsWith = function (g, a) {
        return g.length >= a.length && g.substr(0, a.length) === a
      }),
      (p.endsWith = function (g, a) {
        return g.length >= a.length && g.substr(g.length - a.length) === a
      }),
      (p.containsQueryString = function (g) {
        return /^[^\#]*\?/gi.test(g)
      }),
      (p.isAbsolutePath = function (g) {
        return /^((http:\/\/)|(https:\/\/)|(file:\/\/)|(\/))/.test(g)
      }),
      (p.forEachProperty = function (g, a) {
        if (g) {
          var n = void 0
          for (n in g) g.hasOwnProperty(n) && a(n, g[n])
        }
      }),
      (p.isEmpty = function (g) {
        var a = !0
        return (
          p.forEachProperty(g, function () {
            a = !1
          }),
          a
        )
      }),
      (p.recursiveClone = function (g) {
        if (
          !g ||
          typeof g != 'object' ||
          g instanceof RegExp ||
          (!Array.isArray(g) && Object.getPrototypeOf(g) !== Object.prototype)
        )
          return g
        var a = Array.isArray(g) ? [] : {}
        return (
          p.forEachProperty(g, function (n, v) {
            v && typeof v == 'object'
              ? (a[n] = p.recursiveClone(v))
              : (a[n] = v)
          }),
          a
        )
      }),
      (p.generateAnonymousModule = function () {
        return '===anonymous' + p.NEXT_ANONYMOUS_ID++ + '==='
      }),
      (p.isAnonymousModule = function (g) {
        return p.startsWith(g, '===anonymous')
      }),
      (p.getHighPerformanceTimestamp = function () {
        return (
          this.PERFORMANCE_NOW_PROBED ||
            ((this.PERFORMANCE_NOW_PROBED = !0),
            (this.HAS_PERFORMANCE_NOW =
              l.global.performance &&
              typeof l.global.performance.now == 'function')),
          this.HAS_PERFORMANCE_NOW ? l.global.performance.now() : Date.now()
        )
      }),
      (p.NEXT_ANONYMOUS_ID = 1),
      (p.PERFORMANCE_NOW_PROBED = !1),
      (p.HAS_PERFORMANCE_NOW = !1),
      p
    )
  })()
  l.Utilities = E
})(AMDLoader || (AMDLoader = {}))
var AMDLoader
;(function (l) {
  function E(a) {
    if (a instanceof Error) return a
    var n = new Error(a.message || String(a) || 'Unknown Error')
    return a.stack && (n.stack = a.stack), n
  }
  l.ensureError = E
  var p = (function () {
    function a() {}
    return (
      (a.validateConfigurationOptions = function (n) {
        function v(e) {
          if (e.phase === 'loading') {
            console.error('Loading "' + e.moduleId + '" failed'),
              console.error(e),
              console.error('Here are the modules that depend on it:'),
              console.error(e.neededBy)
            return
          }
          if (e.phase === 'factory') {
            console.error(
              'The factory function of "' +
                e.moduleId +
                '" has thrown an exception'
            ),
              console.error(e),
              console.error('Here are the modules that depend on it:'),
              console.error(e.neededBy)
            return
          }
        }
        if (
          ((n = n || {}),
          typeof n.baseUrl != 'string' && (n.baseUrl = ''),
          typeof n.isBuild != 'boolean' && (n.isBuild = !1),
          typeof n.buildForceInvokeFactory != 'object' &&
            (n.buildForceInvokeFactory = {}),
          typeof n.paths != 'object' && (n.paths = {}),
          typeof n.config != 'object' && (n.config = {}),
          typeof n.catchError == 'undefined' && (n.catchError = !1),
          typeof n.recordStats == 'undefined' && (n.recordStats = !1),
          typeof n.urlArgs != 'string' && (n.urlArgs = ''),
          typeof n.onError != 'function' && (n.onError = v),
          Array.isArray(n.ignoreDuplicateModules) ||
            (n.ignoreDuplicateModules = []),
          n.baseUrl.length > 0 &&
            (l.Utilities.endsWith(n.baseUrl, '/') || (n.baseUrl += '/')),
          typeof n.cspNonce != 'string' && (n.cspNonce = ''),
          typeof n.preferScriptTags == 'undefined' && (n.preferScriptTags = !1),
          Array.isArray(n.nodeModules) || (n.nodeModules = []),
          n.nodeCachedData &&
            typeof n.nodeCachedData == 'object' &&
            (typeof n.nodeCachedData.seed != 'string' &&
              (n.nodeCachedData.seed = 'seed'),
            (typeof n.nodeCachedData.writeDelay != 'number' ||
              n.nodeCachedData.writeDelay < 0) &&
              (n.nodeCachedData.writeDelay = 1e3 * 7),
            !n.nodeCachedData.path || typeof n.nodeCachedData.path != 'string'))
        ) {
          var s = E(
            new Error("INVALID cached data configuration, 'path' MUST be set")
          )
          ;(s.phase = 'configuration'),
            n.onError(s),
            (n.nodeCachedData = void 0)
        }
        return n
      }),
      (a.mergeConfigurationOptions = function (n, v) {
        n === void 0 && (n = null), v === void 0 && (v = null)
        var s = l.Utilities.recursiveClone(v || {})
        return (
          l.Utilities.forEachProperty(n, function (e, t) {
            e === 'ignoreDuplicateModules' &&
            typeof s.ignoreDuplicateModules != 'undefined'
              ? (s.ignoreDuplicateModules = s.ignoreDuplicateModules.concat(t))
              : e === 'paths' && typeof s.paths != 'undefined'
              ? l.Utilities.forEachProperty(t, function (r, o) {
                  return (s.paths[r] = o)
                })
              : e === 'config' && typeof s.config != 'undefined'
              ? l.Utilities.forEachProperty(t, function (r, o) {
                  return (s.config[r] = o)
                })
              : (s[e] = l.Utilities.recursiveClone(t))
          }),
          a.validateConfigurationOptions(s)
        )
      }),
      a
    )
  })()
  l.ConfigurationOptionsUtil = p
  var g = (function () {
    function a(n, v) {
      if (
        ((this._env = n),
        (this.options = p.mergeConfigurationOptions(v)),
        this._createIgnoreDuplicateModulesMap(),
        this._createNodeModulesMap(),
        this._createSortedPathsRules(),
        this.options.baseUrl === '')
      ) {
        if (
          this.options.nodeRequire &&
          this.options.nodeRequire.main &&
          this.options.nodeRequire.main.filename &&
          this._env.isNode
        ) {
          var s = this.options.nodeRequire.main.filename,
            e = Math.max(s.lastIndexOf('/'), s.lastIndexOf('\\'))
          this.options.baseUrl = s.substring(0, e + 1)
        }
        if (this.options.nodeMain && this._env.isNode) {
          var s = this.options.nodeMain,
            e = Math.max(s.lastIndexOf('/'), s.lastIndexOf('\\'))
          this.options.baseUrl = s.substring(0, e + 1)
        }
      }
    }
    return (
      (a.prototype._createIgnoreDuplicateModulesMap = function () {
        this.ignoreDuplicateModulesMap = {}
        for (var n = 0; n < this.options.ignoreDuplicateModules.length; n++)
          this.ignoreDuplicateModulesMap[
            this.options.ignoreDuplicateModules[n]
          ] = !0
      }),
      (a.prototype._createNodeModulesMap = function () {
        this.nodeModulesMap = Object.create(null)
        for (var n = 0, v = this.options.nodeModules; n < v.length; n++) {
          var s = v[n]
          this.nodeModulesMap[s] = !0
        }
      }),
      (a.prototype._createSortedPathsRules = function () {
        var n = this
        ;(this.sortedPathsRules = []),
          l.Utilities.forEachProperty(this.options.paths, function (v, s) {
            Array.isArray(s)
              ? n.sortedPathsRules.push({ from: v, to: s })
              : n.sortedPathsRules.push({ from: v, to: [s] })
          }),
          this.sortedPathsRules.sort(function (v, s) {
            return s.from.length - v.from.length
          })
      }),
      (a.prototype.cloneAndMerge = function (n) {
        return new a(this._env, p.mergeConfigurationOptions(n, this.options))
      }),
      (a.prototype.getOptionsLiteral = function () {
        return this.options
      }),
      (a.prototype._applyPaths = function (n) {
        for (var v, s = 0, e = this.sortedPathsRules.length; s < e; s++)
          if (
            ((v = this.sortedPathsRules[s]), l.Utilities.startsWith(n, v.from))
          ) {
            for (var t = [], r = 0, o = v.to.length; r < o; r++)
              t.push(v.to[r] + n.substr(v.from.length))
            return t
          }
        return [n]
      }),
      (a.prototype._addUrlArgsToUrl = function (n) {
        return l.Utilities.containsQueryString(n)
          ? n + '&' + this.options.urlArgs
          : n + '?' + this.options.urlArgs
      }),
      (a.prototype._addUrlArgsIfNecessaryToUrl = function (n) {
        return this.options.urlArgs ? this._addUrlArgsToUrl(n) : n
      }),
      (a.prototype._addUrlArgsIfNecessaryToUrls = function (n) {
        if (this.options.urlArgs)
          for (var v = 0, s = n.length; v < s; v++)
            n[v] = this._addUrlArgsToUrl(n[v])
        return n
      }),
      (a.prototype.moduleIdToPaths = function (n) {
        if (this._env.isNode) {
          var v =
            this.nodeModulesMap[n] === !0 ||
            (this.options.amdModulesPattern instanceof RegExp &&
              !this.options.amdModulesPattern.test(n))
          if (v) return this.isBuild() ? ['empty:'] : ['node|' + n]
        }
        var s = n,
          e
        if (!l.Utilities.endsWith(s, '.js') && !l.Utilities.isAbsolutePath(s)) {
          e = this._applyPaths(s)
          for (var t = 0, r = e.length; t < r; t++)
            (this.isBuild() && e[t] === 'empty:') ||
              (l.Utilities.isAbsolutePath(e[t]) ||
                (e[t] = this.options.baseUrl + e[t]),
              !l.Utilities.endsWith(e[t], '.js') &&
                !l.Utilities.containsQueryString(e[t]) &&
                (e[t] = e[t] + '.js'))
        } else
          !l.Utilities.endsWith(s, '.js') &&
            !l.Utilities.containsQueryString(s) &&
            (s = s + '.js'),
            (e = [s])
        return this._addUrlArgsIfNecessaryToUrls(e)
      }),
      (a.prototype.requireToUrl = function (n) {
        var v = n
        return (
          l.Utilities.isAbsolutePath(v) ||
            ((v = this._applyPaths(v)[0]),
            l.Utilities.isAbsolutePath(v) || (v = this.options.baseUrl + v)),
          this._addUrlArgsIfNecessaryToUrl(v)
        )
      }),
      (a.prototype.isBuild = function () {
        return this.options.isBuild
      }),
      (a.prototype.shouldInvokeFactory = function (n) {
        return this.options.isBuild
          ? this.options.buildForceInvokeFactory[n] ||
              l.Utilities.isAnonymousModule(n)
          : !0
      }),
      (a.prototype.isDuplicateMessageIgnoredFor = function (n) {
        return this.ignoreDuplicateModulesMap.hasOwnProperty(n)
      }),
      (a.prototype.getConfigForModule = function (n) {
        if (this.options.config) return this.options.config[n]
      }),
      (a.prototype.shouldCatchError = function () {
        return this.options.catchError
      }),
      (a.prototype.shouldRecordStats = function () {
        return this.options.recordStats
      }),
      (a.prototype.onError = function (n) {
        this.options.onError(n)
      }),
      a
    )
  })()
  l.Configuration = g
})(AMDLoader || (AMDLoader = {}))
var AMDLoader
;(function (l) {
  var E = (function () {
      function e(t) {
        ;(this._env = t), (this._scriptLoader = null), (this._callbackMap = {})
      }
      return (
        (e.prototype.load = function (t, r, o, i) {
          var u = this
          if (!this._scriptLoader)
            if (this._env.isWebWorker) this._scriptLoader = new a()
            else if (this._env.isElectronRenderer) {
              var f = t.getConfig().getOptionsLiteral().preferScriptTags
              f
                ? (this._scriptLoader = new p())
                : (this._scriptLoader = new n(this._env))
            } else
              this._env.isNode
                ? (this._scriptLoader = new n(this._env))
                : (this._scriptLoader = new p())
          var c = { callback: o, errorback: i }
          if (this._callbackMap.hasOwnProperty(r)) {
            this._callbackMap[r].push(c)
            return
          }
          ;(this._callbackMap[r] = [c]),
            this._scriptLoader.load(
              t,
              r,
              function () {
                return u.triggerCallback(r)
              },
              function (d) {
                return u.triggerErrorback(r, d)
              }
            )
        }),
        (e.prototype.triggerCallback = function (t) {
          var r = this._callbackMap[t]
          delete this._callbackMap[t]
          for (var o = 0; o < r.length; o++) r[o].callback()
        }),
        (e.prototype.triggerErrorback = function (t, r) {
          var o = this._callbackMap[t]
          delete this._callbackMap[t]
          for (var i = 0; i < o.length; i++) o[i].errorback(r)
        }),
        e
      )
    })(),
    p = (function () {
      function e() {}
      return (
        (e.prototype.attachListeners = function (t, r, o) {
          var i = function () {
              t.removeEventListener('load', u),
                t.removeEventListener('error', f)
            },
            u = function (c) {
              i(), r()
            },
            f = function (c) {
              i(), o(c)
            }
          t.addEventListener('load', u), t.addEventListener('error', f)
        }),
        (e.prototype.load = function (t, r, o, i) {
          if (/^node\|/.test(r)) {
            var u = t.getConfig().getOptionsLiteral(),
              f = v(t.getRecorder(), u.nodeRequire || l.global.nodeRequire),
              c = r.split('|'),
              d = null
            try {
              d = f(c[1])
            } catch (m) {
              i(m)
              return
            }
            t.enqueueDefineAnonymousModule([], function () {
              return d
            }),
              o()
          } else {
            var h = document.createElement('script')
            h.setAttribute('async', 'async'),
              h.setAttribute('type', 'text/javascript'),
              this.attachListeners(h, o, i)
            var y = t.getConfig().getOptionsLiteral().trustedTypesPolicy
            y && (r = y.createScriptURL(r)), h.setAttribute('src', r)
            var _ = t.getConfig().getOptionsLiteral().cspNonce
            _ && h.setAttribute('nonce', _),
              document.getElementsByTagName('head')[0].appendChild(h)
          }
        }),
        e
      )
    })()
  function g(e) {
    var t = e.getConfig().getOptionsLiteral().trustedTypesPolicy
    try {
      var r = t ? self.eval(t.createScript('', 'true')) : new Function('true')
      return r.call(self), !0
    } catch {
      return !1
    }
  }
  var a = (function () {
      function e() {
        this._cachedCanUseEval = null
      }
      return (
        (e.prototype._canUseEval = function (t) {
          return (
            this._cachedCanUseEval === null && (this._cachedCanUseEval = g(t)),
            this._cachedCanUseEval
          )
        }),
        (e.prototype.load = function (t, r, o, i) {
          if (/^node\|/.test(r)) {
            var u = t.getConfig().getOptionsLiteral(),
              f = v(t.getRecorder(), u.nodeRequire || l.global.nodeRequire),
              c = r.split('|'),
              d = null
            try {
              d = f(c[1])
            } catch (_) {
              i(_)
              return
            }
            t.enqueueDefineAnonymousModule([], function () {
              return d
            }),
              o()
          } else {
            var h = t.getConfig().getOptionsLiteral().trustedTypesPolicy,
              y =
                /^((http:)|(https:)|(file:))/.test(r) &&
                r.substring(0, self.origin.length) !== self.origin
            if (!y && this._canUseEval(t)) {
              fetch(r)
                .then(function (_) {
                  if (_.status !== 200) throw new Error(_.statusText)
                  return _.text()
                })
                .then(function (_) {
                  _ =
                    _ +
                    `
//# sourceURL=` +
                    r
                  var m = h ? self.eval(h.createScript('', _)) : new Function(_)
                  m.call(self), o()
                })
                .then(void 0, i)
              return
            }
            try {
              h && (r = h.createScriptURL(r)), importScripts(r), o()
            } catch (_) {
              i(_)
            }
          }
        }),
        e
      )
    })(),
    n = (function () {
      function e(t) {
        ;(this._env = t),
          (this._didInitialize = !1),
          (this._didPatchNodeRequire = !1)
      }
      return (
        (e.prototype._init = function (t) {
          this._didInitialize ||
            ((this._didInitialize = !0),
            (this._fs = t('fs')),
            (this._vm = t('vm')),
            (this._path = t('path')),
            (this._crypto = t('crypto')))
        }),
        (e.prototype._initNodeRequire = function (t, r) {
          var o = r.getConfig().getOptionsLiteral().nodeCachedData
          if (!o || this._didPatchNodeRequire) return
          this._didPatchNodeRequire = !0
          var i = this,
            u = t('module')
          function f(c) {
            var d = c.constructor,
              h = function (_) {
                try {
                  return c.require(_)
                } finally {
                }
              }
            return (
              (h.resolve = function (_, m) {
                return d._resolveFilename(_, c, !1, m)
              }),
              (h.resolve.paths = function (_) {
                return d._resolveLookupPaths(_, c)
              }),
              (h.main = process.mainModule),
              (h.extensions = d._extensions),
              (h.cache = d._cache),
              h
            )
          }
          u.prototype._compile = function (c, d) {
            var h = u.wrap(c.replace(/^#!.*/, '')),
              y = r.getRecorder(),
              _ = i._getCachedDataPath(o, d),
              m = { filename: d },
              R
            try {
              var P = i._fs.readFileSync(_)
              ;(R = P.slice(0, 16)),
                (m.cachedData = P.slice(16)),
                y.record(60, _)
            } catch {
              y.record(61, _)
            }
            var b = new i._vm.Script(h, m),
              I = b.runInThisContext(m),
              U = i._path.dirname(d),
              w = f(this),
              O = [
                this.exports,
                w,
                this,
                d,
                U,
                process,
                _commonjsGlobal,
                Buffer,
              ],
              C = I.apply(this.exports, O)
            return (
              i._handleCachedData(b, h, _, !m.cachedData, r),
              i._verifyCachedData(b, h, _, R, r),
              C
            )
          }
        }),
        (e.prototype.load = function (t, r, o, i) {
          var u = this,
            f = t.getConfig().getOptionsLiteral(),
            c = v(t.getRecorder(), f.nodeRequire || l.global.nodeRequire),
            d =
              f.nodeInstrumenter ||
              function (I) {
                return I
              }
          this._init(c), this._initNodeRequire(c, t)
          var h = t.getRecorder()
          if (/^node\|/.test(r)) {
            var y = r.split('|'),
              _ = null
            try {
              _ = c(y[1])
            } catch (I) {
              i(I)
              return
            }
            t.enqueueDefineAnonymousModule([], function () {
              return _
            }),
              o()
          } else {
            r = l.Utilities.fileUriToFilePath(this._env.isWindows, r)
            var m = this._path.normalize(r),
              R = this._getElectronRendererScriptPathOrUri(m),
              P = Boolean(f.nodeCachedData),
              b = P ? this._getCachedDataPath(f.nodeCachedData, r) : void 0
            this._readSourceAndCachedData(m, b, h, function (I, U, w, O) {
              if (I) {
                i(I)
                return
              }
              var C
              U.charCodeAt(0) === e._BOM
                ? (C = e._PREFIX + U.substring(1) + e._SUFFIX)
                : (C = e._PREFIX + U + e._SUFFIX),
                (C = d(C, m))
              var M = { filename: R, cachedData: w },
                N = u._createAndEvalScript(t, C, M, o, i)
              u._handleCachedData(N, C, b, P && !w, t),
                u._verifyCachedData(N, C, b, O, t)
            })
          }
        }),
        (e.prototype._createAndEvalScript = function (t, r, o, i, u) {
          var f = t.getRecorder()
          f.record(31, o.filename)
          var c = new this._vm.Script(r, o),
            d = c.runInThisContext(o),
            h = t.getGlobalAMDDefineFunc(),
            y = !1,
            _ = function () {
              return (y = !0), h.apply(null, arguments)
            }
          return (
            (_.amd = h.amd),
            d.call(
              l.global,
              t.getGlobalAMDRequireFunc(),
              _,
              o.filename,
              this._path.dirname(o.filename)
            ),
            f.record(32, o.filename),
            y
              ? i()
              : u(
                  new Error("Didn't receive define call in " + o.filename + '!')
                ),
            c
          )
        }),
        (e.prototype._getElectronRendererScriptPathOrUri = function (t) {
          if (!this._env.isElectronRenderer) return t
          var r = t.match(/^([a-z])\:(.*)/i)
          return r
            ? 'file:///' + (r[1].toUpperCase() + ':' + r[2]).replace(/\\/g, '/')
            : 'file://' + t
        }),
        (e.prototype._getCachedDataPath = function (t, r) {
          var o = this._crypto
              .createHash('md5')
              .update(r, 'utf8')
              .update(t.seed, 'utf8')
              .update(process.arch, '')
              .digest('hex'),
            i = this._path.basename(r).replace(/\.js$/, '')
          return this._path.join(t.path, i + '-' + o + '.code')
        }),
        (e.prototype._handleCachedData = function (t, r, o, i, u) {
          var f = this
          t.cachedDataRejected
            ? this._fs.unlink(o, function (c) {
                u.getRecorder().record(62, o),
                  f._createAndWriteCachedData(t, r, o, u),
                  c && u.getConfig().onError(c)
              })
            : i && this._createAndWriteCachedData(t, r, o, u)
        }),
        (e.prototype._createAndWriteCachedData = function (t, r, o, i) {
          var u = this,
            f = Math.ceil(
              i.getConfig().getOptionsLiteral().nodeCachedData.writeDelay *
                (1 + Math.random())
            ),
            c = -1,
            d = 0,
            h = void 0,
            y = function () {
              setTimeout(function () {
                h ||
                  (h = u._crypto.createHash('md5').update(r, 'utf8').digest())
                var _ = t.createCachedData()
                if (!(_.length === 0 || _.length === c || d >= 5)) {
                  if (_.length < c) {
                    y()
                    return
                  }
                  ;(c = _.length),
                    u._fs.writeFile(o, Buffer.concat([h, _]), function (m) {
                      m && i.getConfig().onError(m),
                        i.getRecorder().record(63, o),
                        y()
                    })
                }
              }, f * Math.pow(4, d++))
            }
          y()
        }),
        (e.prototype._readSourceAndCachedData = function (t, r, o, i) {
          if (!r) this._fs.readFile(t, { encoding: 'utf8' }, i)
          else {
            var u = void 0,
              f = void 0,
              c = void 0,
              d = 2,
              h = function (y) {
                y ? i(y) : --d == 0 && i(void 0, u, f, c)
              }
            this._fs.readFile(t, { encoding: 'utf8' }, function (y, _) {
              ;(u = _), h(y)
            }),
              this._fs.readFile(r, function (y, _) {
                !y && _ && _.length > 0
                  ? ((c = _.slice(0, 16)), (f = _.slice(16)), o.record(60, r))
                  : o.record(61, r),
                  h()
              })
          }
        }),
        (e.prototype._verifyCachedData = function (t, r, o, i, u) {
          var f = this
          !i ||
            t.cachedDataRejected ||
            setTimeout(function () {
              var c = f._crypto.createHash('md5').update(r, 'utf8').digest()
              i.equals(c) ||
                (u
                  .getConfig()
                  .onError(
                    new Error(
                      "FAILED TO VERIFY CACHED DATA, deleting stale '" +
                        o +
                        "' now, but a RESTART IS REQUIRED"
                    )
                  ),
                f._fs.unlink(o, function (d) {
                  d && u.getConfig().onError(d)
                }))
            }, Math.ceil(5e3 * (1 + Math.random())))
        }),
        (e._BOM = 65279),
        (e._PREFIX = '(function (require, define, __filename, __dirname) { '),
        (e._SUFFIX = `
});`),
        e
      )
    })()
  function v(e, t) {
    if (t.__$__isRecorded) return t
    var r = function (i) {
      e.record(33, i)
      try {
        return t(i)
      } finally {
        e.record(34, i)
      }
    }
    return (r.__$__isRecorded = !0), r
  }
  l.ensureRecordedNodeRequire = v
  function s(e) {
    return new E(e)
  }
  l.createScriptLoader = s
})(AMDLoader || (AMDLoader = {}))
var AMDLoader
;(function (l) {
  var E = (function () {
    function s(e) {
      var t = e.lastIndexOf('/')
      t !== -1
        ? (this.fromModulePath = e.substr(0, t + 1))
        : (this.fromModulePath = '')
    }
    return (
      (s._normalizeModuleId = function (e) {
        var t = e,
          r
        for (r = /\/\.\//; r.test(t); ) t = t.replace(r, '/')
        for (
          t = t.replace(/^\.\//g, ''),
            r =
              /\/(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//;
          r.test(t);

        )
          t = t.replace(r, '/')
        return (
          (t = t.replace(
            /^(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//,
            ''
          )),
          t
        )
      }),
      (s.prototype.resolveModule = function (e) {
        var t = e
        return (
          l.Utilities.isAbsolutePath(t) ||
            ((l.Utilities.startsWith(t, './') ||
              l.Utilities.startsWith(t, '../')) &&
              (t = s._normalizeModuleId(this.fromModulePath + t))),
          t
        )
      }),
      (s.ROOT = new s('')),
      s
    )
  })()
  l.ModuleIdResolver = E
  var p = (function () {
    function s(e, t, r, o, i, u) {
      ;(this.id = e),
        (this.strId = t),
        (this.dependencies = r),
        (this._callback = o),
        (this._errorback = i),
        (this.moduleIdResolver = u),
        (this.exports = {}),
        (this.error = null),
        (this.exportsPassedIn = !1),
        (this.unresolvedDependenciesCount = this.dependencies.length),
        (this._isComplete = !1)
    }
    return (
      (s._safeInvokeFunction = function (e, t) {
        try {
          return { returnedValue: e.apply(l.global, t), producedError: null }
        } catch (r) {
          return { returnedValue: null, producedError: r }
        }
      }),
      (s._invokeFactory = function (e, t, r, o) {
        return e.shouldInvokeFactory(t)
          ? e.shouldCatchError()
            ? this._safeInvokeFunction(r, o)
            : { returnedValue: r.apply(l.global, o), producedError: null }
          : { returnedValue: null, producedError: null }
      }),
      (s.prototype.complete = function (e, t, r, o) {
        this._isComplete = !0
        var i = null
        if (this._callback)
          if (typeof this._callback == 'function') {
            e.record(21, this.strId)
            var u = s._invokeFactory(t, this.strId, this._callback, r)
            ;(i = u.producedError),
              e.record(22, this.strId),
              !i &&
                typeof u.returnedValue != 'undefined' &&
                (!this.exportsPassedIn || l.Utilities.isEmpty(this.exports)) &&
                (this.exports = u.returnedValue)
          } else this.exports = this._callback
        if (i) {
          var f = l.ensureError(i)
          ;(f.phase = 'factory'),
            (f.moduleId = this.strId),
            (f.neededBy = o(this.id)),
            (this.error = f),
            t.onError(f)
        }
        ;(this.dependencies = null),
          (this._callback = null),
          (this._errorback = null),
          (this.moduleIdResolver = null)
      }),
      (s.prototype.onDependencyError = function (e) {
        return (
          (this._isComplete = !0),
          (this.error = e),
          this._errorback ? (this._errorback(e), !0) : !1
        )
      }),
      (s.prototype.isComplete = function () {
        return this._isComplete
      }),
      s
    )
  })()
  l.Module = p
  var g = (function () {
      function s() {
        ;(this._nextId = 0),
          (this._strModuleIdToIntModuleId = new Map()),
          (this._intModuleIdToStrModuleId = []),
          this.getModuleId('exports'),
          this.getModuleId('module'),
          this.getModuleId('require')
      }
      return (
        (s.prototype.getMaxModuleId = function () {
          return this._nextId
        }),
        (s.prototype.getModuleId = function (e) {
          var t = this._strModuleIdToIntModuleId.get(e)
          return (
            typeof t == 'undefined' &&
              ((t = this._nextId++),
              this._strModuleIdToIntModuleId.set(e, t),
              (this._intModuleIdToStrModuleId[t] = e)),
            t
          )
        }),
        (s.prototype.getStrModuleId = function (e) {
          return this._intModuleIdToStrModuleId[e]
        }),
        s
      )
    })(),
    a = (function () {
      function s(e) {
        this.id = e
      }
      return (
        (s.EXPORTS = new s(0)), (s.MODULE = new s(1)), (s.REQUIRE = new s(2)), s
      )
    })()
  l.RegularDependency = a
  var n = (function () {
    function s(e, t, r) {
      ;(this.id = e), (this.pluginId = t), (this.pluginParam = r)
    }
    return s
  })()
  l.PluginDependency = n
  var v = (function () {
    function s(e, t, r, o, i) {
      i === void 0 && (i = 0),
        (this._env = e),
        (this._scriptLoader = t),
        (this._loaderAvailableTimestamp = i),
        (this._defineFunc = r),
        (this._requireFunc = o),
        (this._moduleIdProvider = new g()),
        (this._config = new l.Configuration(this._env)),
        (this._hasDependencyCycle = !1),
        (this._modules2 = []),
        (this._knownModules2 = []),
        (this._inverseDependencies2 = []),
        (this._inversePluginDependencies2 = new Map()),
        (this._currentAnonymousDefineCall = null),
        (this._recorder = null),
        (this._buildInfoPath = []),
        (this._buildInfoDefineStack = []),
        (this._buildInfoDependencies = [])
    }
    return (
      (s.prototype.reset = function () {
        return new s(
          this._env,
          this._scriptLoader,
          this._defineFunc,
          this._requireFunc,
          this._loaderAvailableTimestamp
        )
      }),
      (s.prototype.getGlobalAMDDefineFunc = function () {
        return this._defineFunc
      }),
      (s.prototype.getGlobalAMDRequireFunc = function () {
        return this._requireFunc
      }),
      (s._findRelevantLocationInStack = function (e, t) {
        for (
          var r = function (m) {
              return m.replace(/\\/g, '/')
            },
            o = r(e),
            i = t.split(/\n/),
            u = 0;
          u < i.length;
          u++
        ) {
          var f = i[u].match(/(.*):(\d+):(\d+)\)?$/)
          if (f) {
            var c = f[1],
              d = f[2],
              h = f[3],
              y = Math.max(c.lastIndexOf(' ') + 1, c.lastIndexOf('(') + 1)
            if (((c = c.substr(y)), (c = r(c)), c === o)) {
              var _ = { line: parseInt(d, 10), col: parseInt(h, 10) }
              return (
                _.line === 1 &&
                  (_.col -=
                    '(function (require, define, __filename, __dirname) { '.length),
                _
              )
            }
          }
        }
        throw new Error('Could not correlate define call site for needle ' + e)
      }),
      (s.prototype.getBuildInfo = function () {
        if (!this._config.isBuild()) return null
        for (var e = [], t = 0, r = 0, o = this._modules2.length; r < o; r++) {
          var i = this._modules2[r]
          if (!!i) {
            var u = this._buildInfoPath[i.id] || null,
              f = this._buildInfoDefineStack[i.id] || null,
              c = this._buildInfoDependencies[i.id]
            e[t++] = {
              id: i.strId,
              path: u,
              defineLocation:
                u && f ? s._findRelevantLocationInStack(u, f) : null,
              dependencies: c,
              shim: null,
              exports: i.exports,
            }
          }
        }
        return e
      }),
      (s.prototype.getRecorder = function () {
        return (
          this._recorder ||
            (this._config.shouldRecordStats()
              ? (this._recorder = new l.LoaderEventRecorder(
                  this._loaderAvailableTimestamp
                ))
              : (this._recorder = l.NullLoaderEventRecorder.INSTANCE)),
          this._recorder
        )
      }),
      (s.prototype.getLoaderEvents = function () {
        return this.getRecorder().getEvents()
      }),
      (s.prototype.enqueueDefineAnonymousModule = function (e, t) {
        if (this._currentAnonymousDefineCall !== null)
          throw new Error(
            'Can only have one anonymous define call per script file'
          )
        var r = null
        this._config.isBuild() &&
          (r = new Error('StackLocation').stack || null),
          (this._currentAnonymousDefineCall = {
            stack: r,
            dependencies: e,
            callback: t,
          })
      }),
      (s.prototype.defineModule = function (e, t, r, o, i, u) {
        var f = this
        u === void 0 && (u = new E(e))
        var c = this._moduleIdProvider.getModuleId(e)
        if (this._modules2[c]) {
          this._config.isDuplicateMessageIgnoredFor(e) ||
            console.warn("Duplicate definition of module '" + e + "'")
          return
        }
        var d = new p(c, e, this._normalizeDependencies(t, u), r, o, u)
        ;(this._modules2[c] = d),
          this._config.isBuild() &&
            ((this._buildInfoDefineStack[c] = i),
            (this._buildInfoDependencies[c] = (d.dependencies || []).map(
              function (h) {
                return f._moduleIdProvider.getStrModuleId(h.id)
              }
            ))),
          this._resolve(d)
      }),
      (s.prototype._normalizeDependency = function (e, t) {
        if (e === 'exports') return a.EXPORTS
        if (e === 'module') return a.MODULE
        if (e === 'require') return a.REQUIRE
        var r = e.indexOf('!')
        if (r >= 0) {
          var o = t.resolveModule(e.substr(0, r)),
            i = t.resolveModule(e.substr(r + 1)),
            u = this._moduleIdProvider.getModuleId(o + '!' + i),
            f = this._moduleIdProvider.getModuleId(o)
          return new n(u, f, i)
        }
        return new a(this._moduleIdProvider.getModuleId(t.resolveModule(e)))
      }),
      (s.prototype._normalizeDependencies = function (e, t) {
        for (var r = [], o = 0, i = 0, u = e.length; i < u; i++)
          r[o++] = this._normalizeDependency(e[i], t)
        return r
      }),
      (s.prototype._relativeRequire = function (e, t, r, o) {
        if (typeof t == 'string') return this.synchronousRequire(t, e)
        this.defineModule(
          l.Utilities.generateAnonymousModule(),
          t,
          r,
          o,
          null,
          e
        )
      }),
      (s.prototype.synchronousRequire = function (e, t) {
        t === void 0 && (t = new E(e))
        var r = this._normalizeDependency(e, t),
          o = this._modules2[r.id]
        if (!o)
          throw new Error(
            "Check dependency list! Synchronous require cannot resolve module '" +
              e +
              "'. This is the first mention of this module!"
          )
        if (!o.isComplete())
          throw new Error(
            "Check dependency list! Synchronous require cannot resolve module '" +
              e +
              "'. This module has not been resolved completely yet."
          )
        if (o.error) throw o.error
        return o.exports
      }),
      (s.prototype.configure = function (e, t) {
        var r = this._config.shouldRecordStats()
        t
          ? (this._config = new l.Configuration(this._env, e))
          : (this._config = this._config.cloneAndMerge(e)),
          this._config.shouldRecordStats() && !r && (this._recorder = null)
      }),
      (s.prototype.getConfig = function () {
        return this._config
      }),
      (s.prototype._onLoad = function (e) {
        if (this._currentAnonymousDefineCall !== null) {
          var t = this._currentAnonymousDefineCall
          ;(this._currentAnonymousDefineCall = null),
            this.defineModule(
              this._moduleIdProvider.getStrModuleId(e),
              t.dependencies,
              t.callback,
              null,
              t.stack
            )
        }
      }),
      (s.prototype._createLoadError = function (e, t) {
        var r = this,
          o = this._moduleIdProvider.getStrModuleId(e),
          i = (this._inverseDependencies2[e] || []).map(function (f) {
            return r._moduleIdProvider.getStrModuleId(f)
          }),
          u = l.ensureError(t)
        return (u.phase = 'loading'), (u.moduleId = o), (u.neededBy = i), u
      }),
      (s.prototype._onLoadError = function (e, t) {
        var r = this._createLoadError(e, t)
        this._modules2[e] ||
          (this._modules2[e] = new p(
            e,
            this._moduleIdProvider.getStrModuleId(e),
            [],
            function () {},
            null,
            null
          ))
        for (
          var o = [], i = 0, u = this._moduleIdProvider.getMaxModuleId();
          i < u;
          i++
        )
          o[i] = !1
        var f = !1,
          c = []
        for (c.push(e), o[e] = !0; c.length > 0; ) {
          var d = c.shift(),
            h = this._modules2[d]
          h && (f = h.onDependencyError(r) || f)
          var y = this._inverseDependencies2[d]
          if (y)
            for (var i = 0, u = y.length; i < u; i++) {
              var _ = y[i]
              o[_] || (c.push(_), (o[_] = !0))
            }
        }
        f || this._config.onError(r)
      }),
      (s.prototype._hasDependencyPath = function (e, t) {
        var r = this._modules2[e]
        if (!r) return !1
        for (
          var o = [], i = 0, u = this._moduleIdProvider.getMaxModuleId();
          i < u;
          i++
        )
          o[i] = !1
        var f = []
        for (f.push(r), o[e] = !0; f.length > 0; ) {
          var c = f.shift(),
            d = c.dependencies
          if (d)
            for (var i = 0, u = d.length; i < u; i++) {
              var h = d[i]
              if (h.id === t) return !0
              var y = this._modules2[h.id]
              y && !o[h.id] && ((o[h.id] = !0), f.push(y))
            }
        }
        return !1
      }),
      (s.prototype._findCyclePath = function (e, t, r) {
        if (e === t || r === 50) return [e]
        var o = this._modules2[e]
        if (!o) return null
        var i = o.dependencies
        if (i)
          for (var u = 0, f = i.length; u < f; u++) {
            var c = this._findCyclePath(i[u].id, t, r + 1)
            if (c !== null) return c.push(e), c
          }
        return null
      }),
      (s.prototype._createRequire = function (e) {
        var t = this,
          r = function (o, i, u) {
            return t._relativeRequire(e, o, i, u)
          }
        return (
          (r.toUrl = function (o) {
            return t._config.requireToUrl(e.resolveModule(o))
          }),
          (r.getStats = function () {
            return t.getLoaderEvents()
          }),
          (r.hasDependencyCycle = function () {
            return t._hasDependencyCycle
          }),
          (r.config = function (o, i) {
            i === void 0 && (i = !1), t.configure(o, i)
          }),
          (r.__$__nodeRequire = l.global.nodeRequire),
          r
        )
      }),
      (s.prototype._loadModule = function (e) {
        var t = this
        if (!(this._modules2[e] || this._knownModules2[e])) {
          this._knownModules2[e] = !0
          var r = this._moduleIdProvider.getStrModuleId(e),
            o = this._config.moduleIdToPaths(r),
            i = /^@[^\/]+\/[^\/]+$/
          this._env.isNode &&
            (r.indexOf('/') === -1 || i.test(r)) &&
            o.push('node|' + r)
          var u = -1,
            f = function (c) {
              if ((u++, u >= o.length)) t._onLoadError(e, c)
              else {
                var d = o[u],
                  h = t.getRecorder()
                if (t._config.isBuild() && d === 'empty:') {
                  ;(t._buildInfoPath[e] = d),
                    t.defineModule(
                      t._moduleIdProvider.getStrModuleId(e),
                      [],
                      null,
                      null,
                      null
                    ),
                    t._onLoad(e)
                  return
                }
                h.record(10, d),
                  t._scriptLoader.load(
                    t,
                    d,
                    function () {
                      t._config.isBuild() && (t._buildInfoPath[e] = d),
                        h.record(11, d),
                        t._onLoad(e)
                    },
                    function (y) {
                      h.record(12, d), f(y)
                    }
                  )
              }
            }
          f(null)
        }
      }),
      (s.prototype._loadPluginDependency = function (e, t) {
        var r = this
        if (!(this._modules2[t.id] || this._knownModules2[t.id])) {
          this._knownModules2[t.id] = !0
          var o = function (i) {
            r.defineModule(
              r._moduleIdProvider.getStrModuleId(t.id),
              [],
              i,
              null,
              null
            )
          }
          ;(o.error = function (i) {
            r._config.onError(r._createLoadError(t.id, i))
          }),
            e.load(
              t.pluginParam,
              this._createRequire(E.ROOT),
              o,
              this._config.getOptionsLiteral()
            )
        }
      }),
      (s.prototype._resolve = function (e) {
        var t = this,
          r = e.dependencies
        if (r)
          for (var o = 0, i = r.length; o < i; o++) {
            var u = r[o]
            if (u === a.EXPORTS) {
              ;(e.exportsPassedIn = !0), e.unresolvedDependenciesCount--
              continue
            }
            if (u === a.MODULE) {
              e.unresolvedDependenciesCount--
              continue
            }
            if (u === a.REQUIRE) {
              e.unresolvedDependenciesCount--
              continue
            }
            var f = this._modules2[u.id]
            if (f && f.isComplete()) {
              if (f.error) {
                e.onDependencyError(f.error)
                return
              }
              e.unresolvedDependenciesCount--
              continue
            }
            if (this._hasDependencyPath(u.id, e.id)) {
              ;(this._hasDependencyCycle = !0),
                console.warn(
                  "There is a dependency cycle between '" +
                    this._moduleIdProvider.getStrModuleId(u.id) +
                    "' and '" +
                    this._moduleIdProvider.getStrModuleId(e.id) +
                    "'. The cyclic path follows:"
                )
              var c = this._findCyclePath(u.id, e.id, 0) || []
              c.reverse(),
                c.push(u.id),
                console.warn(
                  c.map(function (y) {
                    return t._moduleIdProvider.getStrModuleId(y)
                  }).join(` => 
`)
                ),
                e.unresolvedDependenciesCount--
              continue
            }
            if (
              ((this._inverseDependencies2[u.id] =
                this._inverseDependencies2[u.id] || []),
              this._inverseDependencies2[u.id].push(e.id),
              u instanceof n)
            ) {
              var d = this._modules2[u.pluginId]
              if (d && d.isComplete()) {
                this._loadPluginDependency(d.exports, u)
                continue
              }
              var h = this._inversePluginDependencies2.get(u.pluginId)
              h ||
                ((h = []), this._inversePluginDependencies2.set(u.pluginId, h)),
                h.push(u),
                this._loadModule(u.pluginId)
              continue
            }
            this._loadModule(u.id)
          }
        e.unresolvedDependenciesCount === 0 && this._onModuleComplete(e)
      }),
      (s.prototype._onModuleComplete = function (e) {
        var t = this,
          r = this.getRecorder()
        if (!e.isComplete()) {
          var o = e.dependencies,
            i = []
          if (o)
            for (var u = 0, f = o.length; u < f; u++) {
              var c = o[u]
              if (c === a.EXPORTS) {
                i[u] = e.exports
                continue
              }
              if (c === a.MODULE) {
                i[u] = {
                  id: e.strId,
                  config: function () {
                    return t._config.getConfigForModule(e.strId)
                  },
                }
                continue
              }
              if (c === a.REQUIRE) {
                i[u] = this._createRequire(e.moduleIdResolver)
                continue
              }
              var d = this._modules2[c.id]
              if (d) {
                i[u] = d.exports
                continue
              }
              i[u] = null
            }
          var h = function (P) {
            return (t._inverseDependencies2[P] || []).map(function (b) {
              return t._moduleIdProvider.getStrModuleId(b)
            })
          }
          e.complete(r, this._config, i, h)
          var y = this._inverseDependencies2[e.id]
          if (((this._inverseDependencies2[e.id] = null), y))
            for (var u = 0, f = y.length; u < f; u++) {
              var _ = y[u],
                m = this._modules2[_]
              m.unresolvedDependenciesCount--,
                m.unresolvedDependenciesCount === 0 && this._onModuleComplete(m)
            }
          var R = this._inversePluginDependencies2.get(e.id)
          if (R) {
            this._inversePluginDependencies2.delete(e.id)
            for (var u = 0, f = R.length; u < f; u++)
              this._loadPluginDependency(e.exports, R[u])
          }
        }
      }),
      s
    )
  })()
  l.ModuleManager = v
})(AMDLoader || (AMDLoader = {}))
var define, AMDLoader
;(function (l) {
  var E = new l.Environment(),
    p = null,
    g = function (s, e, t) {
      typeof s != 'string' && ((t = e), (e = s), (s = null)),
        (typeof e != 'object' || !Array.isArray(e)) && ((t = e), (e = null)),
        e || (e = ['require', 'exports', 'module']),
        s
          ? p.defineModule(s, e, t, null, null)
          : p.enqueueDefineAnonymousModule(e, t)
    }
  g.amd = { jQuery: !0 }
  var a = function (s, e) {
      e === void 0 && (e = !1), p.configure(s, e)
    },
    n = function () {
      if (arguments.length === 1) {
        if (arguments[0] instanceof Object && !Array.isArray(arguments[0])) {
          a(arguments[0])
          return
        }
        if (typeof arguments[0] == 'string')
          return p.synchronousRequire(arguments[0])
      }
      if (
        (arguments.length === 2 || arguments.length === 3) &&
        Array.isArray(arguments[0])
      ) {
        p.defineModule(
          l.Utilities.generateAnonymousModule(),
          arguments[0],
          arguments[1],
          arguments[2],
          null
        )
        return
      }
      throw new Error('Unrecognized require call')
    }
  ;(n.config = a),
    (n.getConfig = function () {
      return p.getConfig().getOptionsLiteral()
    }),
    (n.reset = function () {
      p = p.reset()
    }),
    (n.getBuildInfo = function () {
      return p.getBuildInfo()
    }),
    (n.getStats = function () {
      return p.getLoaderEvents()
    }),
    (n.define = g)
  function v() {
    if (
      typeof l.global.require != 'undefined' ||
      typeof require != 'undefined'
    ) {
      var s = l.global.require || require
      if (typeof s == 'function' && typeof s.resolve == 'function') {
        var e = l.ensureRecordedNodeRequire(p.getRecorder(), s)
        ;(l.global.nodeRequire = e),
          (n.nodeRequire = e),
          (n.__$__nodeRequire = e)
      }
    }
    E.isNode && !E.isElectronRenderer && !E.isElectronNodeIntegrationWebWorker
      ? ((module.exports = n), (require = n))
      : (E.isElectronRenderer || (l.global.define = g), (l.global.require = n))
  }
  ;(l.init = v),
    (typeof l.global.define != 'function' || !l.global.define.amd) &&
      ((p = new l.ModuleManager(
        E,
        l.createScriptLoader(E),
        g,
        n,
        l.Utilities.getHighPerformanceTimestamp()
      )),
      typeof l.global.require != 'undefined' &&
        typeof l.global.require != 'function' &&
        n.config(l.global.require),
      (define = function () {
        return g.apply(null, arguments)
      }),
      (define.amd = g.amd),
      typeof doNotInitLoader == 'undefined' && v())
})(AMDLoader || (AMDLoader = {}))

//# sourceMappingURL=../../min-maps/vs/loader.js.map
