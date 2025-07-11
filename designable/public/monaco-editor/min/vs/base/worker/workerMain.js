/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(0316a754aa4c25208bef91937efbce2ab1e3ce37)
 * Released under the MIT license
 * https://github.com/microsoft/vscode/blob/main/LICENSE.txt
 *-----------------------------------------------------------*/ ;(function () {
  var X = [
      'require',
      'exports',
      'vs/base/common/strings',
      'vs/editor/common/core/position',
      'vs/editor/common/core/range',
      'vs/base/common/platform',
      'vs/base/common/types',
      'vs/base/common/event',
      'vs/base/common/lifecycle',
      'vs/base/common/uri',
      'vs/base/common/errors',
      'vs/base/common/iterator',
      'vs/base/common/linkedList',
      'vs/base/common/diff/diff',
      'vs/base/common/uint',
      'vs/editor/common/core/characterClassifier',
      'vs/editor/common/core/wordHelper',
      'vs/base/common/stopwatch',
      'vs/nls',
      'vs/base/common/arrays',
      'vs/base/common/cache',
      'vs/base/common/codicons',
      'vs/base/common/diff/diffChange',
      'vs/base/common/functional',
      'vs/base/common/keyCodes',
      'vs/base/common/lazy',
      'vs/base/common/hash',
      'vs/base/common/objects',
      'vs/editor/common/core/selection',
      'vs/editor/common/core/wordCharacterClassifier',
      'vs/editor/common/diff/diffComputer',
      'vs/editor/common/languages/linkComputer',
      'vs/editor/common/languages/supports/inplaceReplaceSupport',
      'vs/editor/common/model',
      'vs/editor/common/model/prefixSumComputer',
      'vs/editor/common/model/mirrorTextModel',
      'vs/editor/common/model/textModelSearch',
      'vs/editor/common/services/unicodeTextModelHighlighter',
      'vs/editor/common/standalone/standaloneEnums',
      'vs/nls!vs/base/common/platform',
      'vs/base/common/process',
      'vs/base/common/path',
      'vs/base/common/cancellation',
      'vs/editor/common/tokenizationRegistry',
      'vs/editor/common/languages',
      'vs/editor/common/services/editorBaseApi',
      'vs/nls!vs/base/common/worker/simpleWorker',
      'vs/base/common/worker/simpleWorker',
      'vs/editor/common/services/editorSimpleWorker',
    ],
    J = function (F) {
      for (var r = [], N = 0, e = F.length; N < e; N++) r[N] = X[F[N]]
      return r
    },
    Ae = this,
    Ee = typeof global == 'object' ? global : {},
    ie
  ;(function (F) {
    F.global = Ae
    var r = (function () {
      function N() {
        ;(this._detected = !1),
          (this._isWindows = !1),
          (this._isNode = !1),
          (this._isElectronRenderer = !1),
          (this._isWebWorker = !1),
          (this._isElectronNodeIntegrationWebWorker = !1)
      }
      return (
        Object.defineProperty(N.prototype, 'isWindows', {
          get: function () {
            return this._detect(), this._isWindows
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(N.prototype, 'isNode', {
          get: function () {
            return this._detect(), this._isNode
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(N.prototype, 'isElectronRenderer', {
          get: function () {
            return this._detect(), this._isElectronRenderer
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(N.prototype, 'isWebWorker', {
          get: function () {
            return this._detect(), this._isWebWorker
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(
          N.prototype,
          'isElectronNodeIntegrationWebWorker',
          {
            get: function () {
              return this._detect(), this._isElectronNodeIntegrationWebWorker
            },
            enumerable: !1,
            configurable: !0,
          }
        ),
        (N.prototype._detect = function () {
          this._detected ||
            ((this._detected = !0),
            (this._isWindows = N._isWindows()),
            (this._isNode = typeof module != 'undefined' && !!module.exports),
            (this._isElectronRenderer =
              typeof process != 'undefined' &&
              typeof process.versions != 'undefined' &&
              typeof process.versions.electron != 'undefined' &&
              process.type === 'renderer'),
            (this._isWebWorker = typeof F.global.importScripts == 'function'),
            (this._isElectronNodeIntegrationWebWorker =
              this._isWebWorker &&
              typeof process != 'undefined' &&
              typeof process.versions != 'undefined' &&
              typeof process.versions.electron != 'undefined' &&
              process.type === 'worker'))
        }),
        (N._isWindows = function () {
          return typeof navigator != 'undefined' &&
            navigator.userAgent &&
            navigator.userAgent.indexOf('Windows') >= 0
            ? !0
            : typeof process != 'undefined'
            ? process.platform === 'win32'
            : !1
        }),
        N
      )
    })()
    F.Environment = r
  })(ie || (ie = {}))
  var ie
  ;(function (F) {
    var r = (function () {
      function A(l, y, C) {
        ;(this.type = l), (this.detail = y), (this.timestamp = C)
      }
      return A
    })()
    F.LoaderEvent = r
    var N = (function () {
      function A(l) {
        this._events = [new r(1, '', l)]
      }
      return (
        (A.prototype.record = function (l, y) {
          this._events.push(
            new r(l, y, F.Utilities.getHighPerformanceTimestamp())
          )
        }),
        (A.prototype.getEvents = function () {
          return this._events
        }),
        A
      )
    })()
    F.LoaderEventRecorder = N
    var e = (function () {
      function A() {}
      return (
        (A.prototype.record = function (l, y) {}),
        (A.prototype.getEvents = function () {
          return []
        }),
        (A.INSTANCE = new A()),
        A
      )
    })()
    F.NullLoaderEventRecorder = e
  })(ie || (ie = {}))
  var ie
  ;(function (F) {
    var r = (function () {
      function N() {}
      return (
        (N.fileUriToFilePath = function (e, A) {
          if (((A = decodeURI(A).replace(/%23/g, '#')), e)) {
            if (/^file:\/\/\//.test(A)) return A.substr(8)
            if (/^file:\/\//.test(A)) return A.substr(5)
          } else if (/^file:\/\//.test(A)) return A.substr(7)
          return A
        }),
        (N.startsWith = function (e, A) {
          return e.length >= A.length && e.substr(0, A.length) === A
        }),
        (N.endsWith = function (e, A) {
          return e.length >= A.length && e.substr(e.length - A.length) === A
        }),
        (N.containsQueryString = function (e) {
          return /^[^\#]*\?/gi.test(e)
        }),
        (N.isAbsolutePath = function (e) {
          return /^((http:\/\/)|(https:\/\/)|(file:\/\/)|(\/))/.test(e)
        }),
        (N.forEachProperty = function (e, A) {
          if (e) {
            var l = void 0
            for (l in e) e.hasOwnProperty(l) && A(l, e[l])
          }
        }),
        (N.isEmpty = function (e) {
          var A = !0
          return (
            N.forEachProperty(e, function () {
              A = !1
            }),
            A
          )
        }),
        (N.recursiveClone = function (e) {
          if (
            !e ||
            typeof e != 'object' ||
            e instanceof RegExp ||
            (!Array.isArray(e) && Object.getPrototypeOf(e) !== Object.prototype)
          )
            return e
          var A = Array.isArray(e) ? [] : {}
          return (
            N.forEachProperty(e, function (l, y) {
              y && typeof y == 'object'
                ? (A[l] = N.recursiveClone(y))
                : (A[l] = y)
            }),
            A
          )
        }),
        (N.generateAnonymousModule = function () {
          return '===anonymous' + N.NEXT_ANONYMOUS_ID++ + '==='
        }),
        (N.isAnonymousModule = function (e) {
          return N.startsWith(e, '===anonymous')
        }),
        (N.getHighPerformanceTimestamp = function () {
          return (
            this.PERFORMANCE_NOW_PROBED ||
              ((this.PERFORMANCE_NOW_PROBED = !0),
              (this.HAS_PERFORMANCE_NOW =
                F.global.performance &&
                typeof F.global.performance.now == 'function')),
            this.HAS_PERFORMANCE_NOW ? F.global.performance.now() : Date.now()
          )
        }),
        (N.NEXT_ANONYMOUS_ID = 1),
        (N.PERFORMANCE_NOW_PROBED = !1),
        (N.HAS_PERFORMANCE_NOW = !1),
        N
      )
    })()
    F.Utilities = r
  })(ie || (ie = {}))
  var ie
  ;(function (F) {
    function r(A) {
      if (A instanceof Error) return A
      var l = new Error(A.message || String(A) || 'Unknown Error')
      return A.stack && (l.stack = A.stack), l
    }
    F.ensureError = r
    var N = (function () {
      function A() {}
      return (
        (A.validateConfigurationOptions = function (l) {
          function y(c) {
            if (c.phase === 'loading') {
              console.error('Loading "' + c.moduleId + '" failed'),
                console.error(c),
                console.error('Here are the modules that depend on it:'),
                console.error(c.neededBy)
              return
            }
            if (c.phase === 'factory') {
              console.error(
                'The factory function of "' +
                  c.moduleId +
                  '" has thrown an exception'
              ),
                console.error(c),
                console.error('Here are the modules that depend on it:'),
                console.error(c.neededBy)
              return
            }
          }
          if (
            ((l = l || {}),
            typeof l.baseUrl != 'string' && (l.baseUrl = ''),
            typeof l.isBuild != 'boolean' && (l.isBuild = !1),
            typeof l.buildForceInvokeFactory != 'object' &&
              (l.buildForceInvokeFactory = {}),
            typeof l.paths != 'object' && (l.paths = {}),
            typeof l.config != 'object' && (l.config = {}),
            typeof l.catchError == 'undefined' && (l.catchError = !1),
            typeof l.recordStats == 'undefined' && (l.recordStats = !1),
            typeof l.urlArgs != 'string' && (l.urlArgs = ''),
            typeof l.onError != 'function' && (l.onError = y),
            Array.isArray(l.ignoreDuplicateModules) ||
              (l.ignoreDuplicateModules = []),
            l.baseUrl.length > 0 &&
              (F.Utilities.endsWith(l.baseUrl, '/') || (l.baseUrl += '/')),
            typeof l.cspNonce != 'string' && (l.cspNonce = ''),
            typeof l.preferScriptTags == 'undefined' &&
              (l.preferScriptTags = !1),
            Array.isArray(l.nodeModules) || (l.nodeModules = []),
            l.nodeCachedData &&
              typeof l.nodeCachedData == 'object' &&
              (typeof l.nodeCachedData.seed != 'string' &&
                (l.nodeCachedData.seed = 'seed'),
              (typeof l.nodeCachedData.writeDelay != 'number' ||
                l.nodeCachedData.writeDelay < 0) &&
                (l.nodeCachedData.writeDelay = 1e3 * 7),
              !l.nodeCachedData.path ||
                typeof l.nodeCachedData.path != 'string'))
          ) {
            var C = r(
              new Error("INVALID cached data configuration, 'path' MUST be set")
            )
            ;(C.phase = 'configuration'),
              l.onError(C),
              (l.nodeCachedData = void 0)
          }
          return l
        }),
        (A.mergeConfigurationOptions = function (l, y) {
          l === void 0 && (l = null), y === void 0 && (y = null)
          var C = F.Utilities.recursiveClone(y || {})
          return (
            F.Utilities.forEachProperty(l, function (c, h) {
              c === 'ignoreDuplicateModules' &&
              typeof C.ignoreDuplicateModules != 'undefined'
                ? (C.ignoreDuplicateModules =
                    C.ignoreDuplicateModules.concat(h))
                : c === 'paths' && typeof C.paths != 'undefined'
                ? F.Utilities.forEachProperty(h, function (v, t) {
                    return (C.paths[v] = t)
                  })
                : c === 'config' && typeof C.config != 'undefined'
                ? F.Utilities.forEachProperty(h, function (v, t) {
                    return (C.config[v] = t)
                  })
                : (C[c] = F.Utilities.recursiveClone(h))
            }),
            A.validateConfigurationOptions(C)
          )
        }),
        A
      )
    })()
    F.ConfigurationOptionsUtil = N
    var e = (function () {
      function A(l, y) {
        if (
          ((this._env = l),
          (this.options = N.mergeConfigurationOptions(y)),
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
            var C = this.options.nodeRequire.main.filename,
              c = Math.max(C.lastIndexOf('/'), C.lastIndexOf('\\'))
            this.options.baseUrl = C.substring(0, c + 1)
          }
          if (this.options.nodeMain && this._env.isNode) {
            var C = this.options.nodeMain,
              c = Math.max(C.lastIndexOf('/'), C.lastIndexOf('\\'))
            this.options.baseUrl = C.substring(0, c + 1)
          }
        }
      }
      return (
        (A.prototype._createIgnoreDuplicateModulesMap = function () {
          this.ignoreDuplicateModulesMap = {}
          for (var l = 0; l < this.options.ignoreDuplicateModules.length; l++)
            this.ignoreDuplicateModulesMap[
              this.options.ignoreDuplicateModules[l]
            ] = !0
        }),
        (A.prototype._createNodeModulesMap = function () {
          this.nodeModulesMap = Object.create(null)
          for (var l = 0, y = this.options.nodeModules; l < y.length; l++) {
            var C = y[l]
            this.nodeModulesMap[C] = !0
          }
        }),
        (A.prototype._createSortedPathsRules = function () {
          var l = this
          ;(this.sortedPathsRules = []),
            F.Utilities.forEachProperty(this.options.paths, function (y, C) {
              Array.isArray(C)
                ? l.sortedPathsRules.push({ from: y, to: C })
                : l.sortedPathsRules.push({ from: y, to: [C] })
            }),
            this.sortedPathsRules.sort(function (y, C) {
              return C.from.length - y.from.length
            })
        }),
        (A.prototype.cloneAndMerge = function (l) {
          return new A(this._env, N.mergeConfigurationOptions(l, this.options))
        }),
        (A.prototype.getOptionsLiteral = function () {
          return this.options
        }),
        (A.prototype._applyPaths = function (l) {
          for (var y, C = 0, c = this.sortedPathsRules.length; C < c; C++)
            if (
              ((y = this.sortedPathsRules[C]),
              F.Utilities.startsWith(l, y.from))
            ) {
              for (var h = [], v = 0, t = y.to.length; v < t; v++)
                h.push(y.to[v] + l.substr(y.from.length))
              return h
            }
          return [l]
        }),
        (A.prototype._addUrlArgsToUrl = function (l) {
          return F.Utilities.containsQueryString(l)
            ? l + '&' + this.options.urlArgs
            : l + '?' + this.options.urlArgs
        }),
        (A.prototype._addUrlArgsIfNecessaryToUrl = function (l) {
          return this.options.urlArgs ? this._addUrlArgsToUrl(l) : l
        }),
        (A.prototype._addUrlArgsIfNecessaryToUrls = function (l) {
          if (this.options.urlArgs)
            for (var y = 0, C = l.length; y < C; y++)
              l[y] = this._addUrlArgsToUrl(l[y])
          return l
        }),
        (A.prototype.moduleIdToPaths = function (l) {
          if (this._env.isNode) {
            var y =
              this.nodeModulesMap[l] === !0 ||
              (this.options.amdModulesPattern instanceof RegExp &&
                !this.options.amdModulesPattern.test(l))
            if (y) return this.isBuild() ? ['empty:'] : ['node|' + l]
          }
          var C = l,
            c
          if (
            !F.Utilities.endsWith(C, '.js') &&
            !F.Utilities.isAbsolutePath(C)
          ) {
            c = this._applyPaths(C)
            for (var h = 0, v = c.length; h < v; h++)
              (this.isBuild() && c[h] === 'empty:') ||
                (F.Utilities.isAbsolutePath(c[h]) ||
                  (c[h] = this.options.baseUrl + c[h]),
                !F.Utilities.endsWith(c[h], '.js') &&
                  !F.Utilities.containsQueryString(c[h]) &&
                  (c[h] = c[h] + '.js'))
          } else
            !F.Utilities.endsWith(C, '.js') &&
              !F.Utilities.containsQueryString(C) &&
              (C = C + '.js'),
              (c = [C])
          return this._addUrlArgsIfNecessaryToUrls(c)
        }),
        (A.prototype.requireToUrl = function (l) {
          var y = l
          return (
            F.Utilities.isAbsolutePath(y) ||
              ((y = this._applyPaths(y)[0]),
              F.Utilities.isAbsolutePath(y) || (y = this.options.baseUrl + y)),
            this._addUrlArgsIfNecessaryToUrl(y)
          )
        }),
        (A.prototype.isBuild = function () {
          return this.options.isBuild
        }),
        (A.prototype.shouldInvokeFactory = function (l) {
          return this.options.isBuild
            ? this.options.buildForceInvokeFactory[l] ||
                F.Utilities.isAnonymousModule(l)
            : !0
        }),
        (A.prototype.isDuplicateMessageIgnoredFor = function (l) {
          return this.ignoreDuplicateModulesMap.hasOwnProperty(l)
        }),
        (A.prototype.getConfigForModule = function (l) {
          if (this.options.config) return this.options.config[l]
        }),
        (A.prototype.shouldCatchError = function () {
          return this.options.catchError
        }),
        (A.prototype.shouldRecordStats = function () {
          return this.options.recordStats
        }),
        (A.prototype.onError = function (l) {
          this.options.onError(l)
        }),
        A
      )
    })()
    F.Configuration = e
  })(ie || (ie = {}))
  var ie
  ;(function (F) {
    var r = (function () {
        function c(h) {
          ;(this._env = h),
            (this._scriptLoader = null),
            (this._callbackMap = {})
        }
        return (
          (c.prototype.load = function (h, v, t, g) {
            var m = this
            if (!this._scriptLoader)
              if (this._env.isWebWorker) this._scriptLoader = new A()
              else if (this._env.isElectronRenderer) {
                var p = h.getConfig().getOptionsLiteral().preferScriptTags
                p
                  ? (this._scriptLoader = new N())
                  : (this._scriptLoader = new l(this._env))
              } else
                this._env.isNode
                  ? (this._scriptLoader = new l(this._env))
                  : (this._scriptLoader = new N())
            var L = { callback: t, errorback: g }
            if (this._callbackMap.hasOwnProperty(v)) {
              this._callbackMap[v].push(L)
              return
            }
            ;(this._callbackMap[v] = [L]),
              this._scriptLoader.load(
                h,
                v,
                function () {
                  return m.triggerCallback(v)
                },
                function (w) {
                  return m.triggerErrorback(v, w)
                }
              )
          }),
          (c.prototype.triggerCallback = function (h) {
            var v = this._callbackMap[h]
            delete this._callbackMap[h]
            for (var t = 0; t < v.length; t++) v[t].callback()
          }),
          (c.prototype.triggerErrorback = function (h, v) {
            var t = this._callbackMap[h]
            delete this._callbackMap[h]
            for (var g = 0; g < t.length; g++) t[g].errorback(v)
          }),
          c
        )
      })(),
      N = (function () {
        function c() {}
        return (
          (c.prototype.attachListeners = function (h, v, t) {
            var g = function () {
                h.removeEventListener('load', m),
                  h.removeEventListener('error', p)
              },
              m = function (L) {
                g(), v()
              },
              p = function (L) {
                g(), t(L)
              }
            h.addEventListener('load', m), h.addEventListener('error', p)
          }),
          (c.prototype.load = function (h, v, t, g) {
            if (/^node\|/.test(v)) {
              var m = h.getConfig().getOptionsLiteral(),
                p = y(h.getRecorder(), m.nodeRequire || F.global.nodeRequire),
                L = v.split('|'),
                w = null
              try {
                w = p(L[1])
              } catch (a) {
                g(a)
                return
              }
              h.enqueueDefineAnonymousModule([], function () {
                return w
              }),
                t()
            } else {
              var S = document.createElement('script')
              S.setAttribute('async', 'async'),
                S.setAttribute('type', 'text/javascript'),
                this.attachListeners(S, t, g)
              var b = h.getConfig().getOptionsLiteral().trustedTypesPolicy
              b && (v = b.createScriptURL(v)), S.setAttribute('src', v)
              var s = h.getConfig().getOptionsLiteral().cspNonce
              s && S.setAttribute('nonce', s),
                document.getElementsByTagName('head')[0].appendChild(S)
            }
          }),
          c
        )
      })()
    function e(c) {
      var h = c.getConfig().getOptionsLiteral().trustedTypesPolicy
      try {
        var v = h ? self.eval(h.createScript('', 'true')) : new Function('true')
        return v.call(self), !0
      } catch {
        return !1
      }
    }
    var A = (function () {
        function c() {
          this._cachedCanUseEval = null
        }
        return (
          (c.prototype._canUseEval = function (h) {
            return (
              this._cachedCanUseEval === null &&
                (this._cachedCanUseEval = e(h)),
              this._cachedCanUseEval
            )
          }),
          (c.prototype.load = function (h, v, t, g) {
            if (/^node\|/.test(v)) {
              var m = h.getConfig().getOptionsLiteral(),
                p = y(h.getRecorder(), m.nodeRequire || F.global.nodeRequire),
                L = v.split('|'),
                w = null
              try {
                w = p(L[1])
              } catch (s) {
                g(s)
                return
              }
              h.enqueueDefineAnonymousModule([], function () {
                return w
              }),
                t()
            } else {
              var S = h.getConfig().getOptionsLiteral().trustedTypesPolicy,
                b =
                  /^((http:)|(https:)|(file:))/.test(v) &&
                  v.substring(0, self.origin.length) !== self.origin
              if (!b && this._canUseEval(h)) {
                fetch(v)
                  .then(function (s) {
                    if (s.status !== 200) throw new Error(s.statusText)
                    return s.text()
                  })
                  .then(function (s) {
                    s =
                      s +
                      `
//# sourceURL=` +
                      v
                    var a = S
                      ? self.eval(S.createScript('', s))
                      : new Function(s)
                    a.call(self), t()
                  })
                  .then(void 0, g)
                return
              }
              try {
                S && (v = S.createScriptURL(v)), importScripts(v), t()
              } catch (s) {
                g(s)
              }
            }
          }),
          c
        )
      })(),
      l = (function () {
        function c(h) {
          ;(this._env = h),
            (this._didInitialize = !1),
            (this._didPatchNodeRequire = !1)
        }
        return (
          (c.prototype._init = function (h) {
            this._didInitialize ||
              ((this._didInitialize = !0),
              (this._fs = h('fs')),
              (this._vm = h('vm')),
              (this._path = h('path')),
              (this._crypto = h('crypto')))
          }),
          (c.prototype._initNodeRequire = function (h, v) {
            var t = v.getConfig().getOptionsLiteral().nodeCachedData
            if (!t || this._didPatchNodeRequire) return
            this._didPatchNodeRequire = !0
            var g = this,
              m = h('module')
            function p(L) {
              var w = L.constructor,
                S = function (s) {
                  try {
                    return L.require(s)
                  } finally {
                  }
                }
              return (
                (S.resolve = function (s, a) {
                  return w._resolveFilename(s, L, !1, a)
                }),
                (S.resolve.paths = function (s) {
                  return w._resolveLookupPaths(s, L)
                }),
                (S.main = process.mainModule),
                (S.extensions = w._extensions),
                (S.cache = w._cache),
                S
              )
            }
            m.prototype._compile = function (L, w) {
              var S = m.wrap(L.replace(/^#!.*/, '')),
                b = v.getRecorder(),
                s = g._getCachedDataPath(t, w),
                a = { filename: w },
                f
              try {
                var d = g._fs.readFileSync(s)
                ;(f = d.slice(0, 16)),
                  (a.cachedData = d.slice(16)),
                  b.record(60, s)
              } catch {
                b.record(61, s)
              }
              var o = new g._vm.Script(S, a),
                i = o.runInThisContext(a),
                u = g._path.dirname(w),
                _ = p(this),
                E = [this.exports, _, this, w, u, process, Ee, Buffer],
                M = i.apply(this.exports, E)
              return (
                g._handleCachedData(o, S, s, !a.cachedData, v),
                g._verifyCachedData(o, S, s, f, v),
                M
              )
            }
          }),
          (c.prototype.load = function (h, v, t, g) {
            var m = this,
              p = h.getConfig().getOptionsLiteral(),
              L = y(h.getRecorder(), p.nodeRequire || F.global.nodeRequire),
              w =
                p.nodeInstrumenter ||
                function (i) {
                  return i
                }
            this._init(L), this._initNodeRequire(L, h)
            var S = h.getRecorder()
            if (/^node\|/.test(v)) {
              var b = v.split('|'),
                s = null
              try {
                s = L(b[1])
              } catch (i) {
                g(i)
                return
              }
              h.enqueueDefineAnonymousModule([], function () {
                return s
              }),
                t()
            } else {
              v = F.Utilities.fileUriToFilePath(this._env.isWindows, v)
              var a = this._path.normalize(v),
                f = this._getElectronRendererScriptPathOrUri(a),
                d = Boolean(p.nodeCachedData),
                o = d ? this._getCachedDataPath(p.nodeCachedData, v) : void 0
              this._readSourceAndCachedData(a, o, S, function (i, u, _, E) {
                if (i) {
                  g(i)
                  return
                }
                var M
                u.charCodeAt(0) === c._BOM
                  ? (M = c._PREFIX + u.substring(1) + c._SUFFIX)
                  : (M = c._PREFIX + u + c._SUFFIX),
                  (M = w(M, a))
                var D = { filename: f, cachedData: _ },
                  I = m._createAndEvalScript(h, M, D, t, g)
                m._handleCachedData(I, M, o, d && !_, h),
                  m._verifyCachedData(I, M, o, E, h)
              })
            }
          }),
          (c.prototype._createAndEvalScript = function (h, v, t, g, m) {
            var p = h.getRecorder()
            p.record(31, t.filename)
            var L = new this._vm.Script(v, t),
              w = L.runInThisContext(t),
              S = h.getGlobalAMDDefineFunc(),
              b = !1,
              s = function () {
                return (b = !0), S.apply(null, arguments)
              }
            return (
              (s.amd = S.amd),
              w.call(
                F.global,
                h.getGlobalAMDRequireFunc(),
                s,
                t.filename,
                this._path.dirname(t.filename)
              ),
              p.record(32, t.filename),
              b
                ? g()
                : m(
                    new Error(
                      "Didn't receive define call in " + t.filename + '!'
                    )
                  ),
              L
            )
          }),
          (c.prototype._getElectronRendererScriptPathOrUri = function (h) {
            if (!this._env.isElectronRenderer) return h
            var v = h.match(/^([a-z])\:(.*)/i)
            return v
              ? 'file:///' +
                  (v[1].toUpperCase() + ':' + v[2]).replace(/\\/g, '/')
              : 'file://' + h
          }),
          (c.prototype._getCachedDataPath = function (h, v) {
            var t = this._crypto
                .createHash('md5')
                .update(v, 'utf8')
                .update(h.seed, 'utf8')
                .update(process.arch, '')
                .digest('hex'),
              g = this._path.basename(v).replace(/\.js$/, '')
            return this._path.join(h.path, g + '-' + t + '.code')
          }),
          (c.prototype._handleCachedData = function (h, v, t, g, m) {
            var p = this
            h.cachedDataRejected
              ? this._fs.unlink(t, function (L) {
                  m.getRecorder().record(62, t),
                    p._createAndWriteCachedData(h, v, t, m),
                    L && m.getConfig().onError(L)
                })
              : g && this._createAndWriteCachedData(h, v, t, m)
          }),
          (c.prototype._createAndWriteCachedData = function (h, v, t, g) {
            var m = this,
              p = Math.ceil(
                g.getConfig().getOptionsLiteral().nodeCachedData.writeDelay *
                  (1 + Math.random())
              ),
              L = -1,
              w = 0,
              S = void 0,
              b = function () {
                setTimeout(function () {
                  S ||
                    (S = m._crypto.createHash('md5').update(v, 'utf8').digest())
                  var s = h.createCachedData()
                  if (!(s.length === 0 || s.length === L || w >= 5)) {
                    if (s.length < L) {
                      b()
                      return
                    }
                    ;(L = s.length),
                      m._fs.writeFile(t, Buffer.concat([S, s]), function (a) {
                        a && g.getConfig().onError(a),
                          g.getRecorder().record(63, t),
                          b()
                      })
                  }
                }, p * Math.pow(4, w++))
              }
            b()
          }),
          (c.prototype._readSourceAndCachedData = function (h, v, t, g) {
            if (!v) this._fs.readFile(h, { encoding: 'utf8' }, g)
            else {
              var m = void 0,
                p = void 0,
                L = void 0,
                w = 2,
                S = function (b) {
                  b ? g(b) : --w == 0 && g(void 0, m, p, L)
                }
              this._fs.readFile(h, { encoding: 'utf8' }, function (b, s) {
                ;(m = s), S(b)
              }),
                this._fs.readFile(v, function (b, s) {
                  !b && s && s.length > 0
                    ? ((L = s.slice(0, 16)), (p = s.slice(16)), t.record(60, v))
                    : t.record(61, v),
                    S()
                })
            }
          }),
          (c.prototype._verifyCachedData = function (h, v, t, g, m) {
            var p = this
            !g ||
              h.cachedDataRejected ||
              setTimeout(function () {
                var L = p._crypto.createHash('md5').update(v, 'utf8').digest()
                g.equals(L) ||
                  (m
                    .getConfig()
                    .onError(
                      new Error(
                        "FAILED TO VERIFY CACHED DATA, deleting stale '" +
                          t +
                          "' now, but a RESTART IS REQUIRED"
                      )
                    ),
                  p._fs.unlink(t, function (w) {
                    w && m.getConfig().onError(w)
                  }))
              }, Math.ceil(5e3 * (1 + Math.random())))
          }),
          (c._BOM = 65279),
          (c._PREFIX = '(function (require, define, __filename, __dirname) { '),
          (c._SUFFIX = `
});`),
          c
        )
      })()
    function y(c, h) {
      if (h.__$__isRecorded) return h
      var v = function (g) {
        c.record(33, g)
        try {
          return h(g)
        } finally {
          c.record(34, g)
        }
      }
      return (v.__$__isRecorded = !0), v
    }
    F.ensureRecordedNodeRequire = y
    function C(c) {
      return new r(c)
    }
    F.createScriptLoader = C
  })(ie || (ie = {}))
  var ie
  ;(function (F) {
    var r = (function () {
      function C(c) {
        var h = c.lastIndexOf('/')
        h !== -1
          ? (this.fromModulePath = c.substr(0, h + 1))
          : (this.fromModulePath = '')
      }
      return (
        (C._normalizeModuleId = function (c) {
          var h = c,
            v
          for (v = /\/\.\//; v.test(h); ) h = h.replace(v, '/')
          for (
            h = h.replace(/^\.\//g, ''),
              v =
                /\/(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//;
            v.test(h);

          )
            h = h.replace(v, '/')
          return (
            (h = h.replace(
              /^(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//,
              ''
            )),
            h
          )
        }),
        (C.prototype.resolveModule = function (c) {
          var h = c
          return (
            F.Utilities.isAbsolutePath(h) ||
              ((F.Utilities.startsWith(h, './') ||
                F.Utilities.startsWith(h, '../')) &&
                (h = C._normalizeModuleId(this.fromModulePath + h))),
            h
          )
        }),
        (C.ROOT = new C('')),
        C
      )
    })()
    F.ModuleIdResolver = r
    var N = (function () {
      function C(c, h, v, t, g, m) {
        ;(this.id = c),
          (this.strId = h),
          (this.dependencies = v),
          (this._callback = t),
          (this._errorback = g),
          (this.moduleIdResolver = m),
          (this.exports = {}),
          (this.error = null),
          (this.exportsPassedIn = !1),
          (this.unresolvedDependenciesCount = this.dependencies.length),
          (this._isComplete = !1)
      }
      return (
        (C._safeInvokeFunction = function (c, h) {
          try {
            return { returnedValue: c.apply(F.global, h), producedError: null }
          } catch (v) {
            return { returnedValue: null, producedError: v }
          }
        }),
        (C._invokeFactory = function (c, h, v, t) {
          return c.shouldInvokeFactory(h)
            ? c.shouldCatchError()
              ? this._safeInvokeFunction(v, t)
              : { returnedValue: v.apply(F.global, t), producedError: null }
            : { returnedValue: null, producedError: null }
        }),
        (C.prototype.complete = function (c, h, v, t) {
          this._isComplete = !0
          var g = null
          if (this._callback)
            if (typeof this._callback == 'function') {
              c.record(21, this.strId)
              var m = C._invokeFactory(h, this.strId, this._callback, v)
              ;(g = m.producedError),
                c.record(22, this.strId),
                !g &&
                  typeof m.returnedValue != 'undefined' &&
                  (!this.exportsPassedIn ||
                    F.Utilities.isEmpty(this.exports)) &&
                  (this.exports = m.returnedValue)
            } else this.exports = this._callback
          if (g) {
            var p = F.ensureError(g)
            ;(p.phase = 'factory'),
              (p.moduleId = this.strId),
              (p.neededBy = t(this.id)),
              (this.error = p),
              h.onError(p)
          }
          ;(this.dependencies = null),
            (this._callback = null),
            (this._errorback = null),
            (this.moduleIdResolver = null)
        }),
        (C.prototype.onDependencyError = function (c) {
          return (
            (this._isComplete = !0),
            (this.error = c),
            this._errorback ? (this._errorback(c), !0) : !1
          )
        }),
        (C.prototype.isComplete = function () {
          return this._isComplete
        }),
        C
      )
    })()
    F.Module = N
    var e = (function () {
        function C() {
          ;(this._nextId = 0),
            (this._strModuleIdToIntModuleId = new Map()),
            (this._intModuleIdToStrModuleId = []),
            this.getModuleId('exports'),
            this.getModuleId('module'),
            this.getModuleId('require')
        }
        return (
          (C.prototype.getMaxModuleId = function () {
            return this._nextId
          }),
          (C.prototype.getModuleId = function (c) {
            var h = this._strModuleIdToIntModuleId.get(c)
            return (
              typeof h == 'undefined' &&
                ((h = this._nextId++),
                this._strModuleIdToIntModuleId.set(c, h),
                (this._intModuleIdToStrModuleId[h] = c)),
              h
            )
          }),
          (C.prototype.getStrModuleId = function (c) {
            return this._intModuleIdToStrModuleId[c]
          }),
          C
        )
      })(),
      A = (function () {
        function C(c) {
          this.id = c
        }
        return (
          (C.EXPORTS = new C(0)),
          (C.MODULE = new C(1)),
          (C.REQUIRE = new C(2)),
          C
        )
      })()
    F.RegularDependency = A
    var l = (function () {
      function C(c, h, v) {
        ;(this.id = c), (this.pluginId = h), (this.pluginParam = v)
      }
      return C
    })()
    F.PluginDependency = l
    var y = (function () {
      function C(c, h, v, t, g) {
        g === void 0 && (g = 0),
          (this._env = c),
          (this._scriptLoader = h),
          (this._loaderAvailableTimestamp = g),
          (this._defineFunc = v),
          (this._requireFunc = t),
          (this._moduleIdProvider = new e()),
          (this._config = new F.Configuration(this._env)),
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
        (C.prototype.reset = function () {
          return new C(
            this._env,
            this._scriptLoader,
            this._defineFunc,
            this._requireFunc,
            this._loaderAvailableTimestamp
          )
        }),
        (C.prototype.getGlobalAMDDefineFunc = function () {
          return this._defineFunc
        }),
        (C.prototype.getGlobalAMDRequireFunc = function () {
          return this._requireFunc
        }),
        (C._findRelevantLocationInStack = function (c, h) {
          for (
            var v = function (a) {
                return a.replace(/\\/g, '/')
              },
              t = v(c),
              g = h.split(/\n/),
              m = 0;
            m < g.length;
            m++
          ) {
            var p = g[m].match(/(.*):(\d+):(\d+)\)?$/)
            if (p) {
              var L = p[1],
                w = p[2],
                S = p[3],
                b = Math.max(L.lastIndexOf(' ') + 1, L.lastIndexOf('(') + 1)
              if (((L = L.substr(b)), (L = v(L)), L === t)) {
                var s = { line: parseInt(w, 10), col: parseInt(S, 10) }
                return (
                  s.line === 1 &&
                    (s.col -=
                      '(function (require, define, __filename, __dirname) { '.length),
                  s
                )
              }
            }
          }
          throw new Error(
            'Could not correlate define call site for needle ' + c
          )
        }),
        (C.prototype.getBuildInfo = function () {
          if (!this._config.isBuild()) return null
          for (
            var c = [], h = 0, v = 0, t = this._modules2.length;
            v < t;
            v++
          ) {
            var g = this._modules2[v]
            if (!!g) {
              var m = this._buildInfoPath[g.id] || null,
                p = this._buildInfoDefineStack[g.id] || null,
                L = this._buildInfoDependencies[g.id]
              c[h++] = {
                id: g.strId,
                path: m,
                defineLocation:
                  m && p ? C._findRelevantLocationInStack(m, p) : null,
                dependencies: L,
                shim: null,
                exports: g.exports,
              }
            }
          }
          return c
        }),
        (C.prototype.getRecorder = function () {
          return (
            this._recorder ||
              (this._config.shouldRecordStats()
                ? (this._recorder = new F.LoaderEventRecorder(
                    this._loaderAvailableTimestamp
                  ))
                : (this._recorder = F.NullLoaderEventRecorder.INSTANCE)),
            this._recorder
          )
        }),
        (C.prototype.getLoaderEvents = function () {
          return this.getRecorder().getEvents()
        }),
        (C.prototype.enqueueDefineAnonymousModule = function (c, h) {
          if (this._currentAnonymousDefineCall !== null)
            throw new Error(
              'Can only have one anonymous define call per script file'
            )
          var v = null
          this._config.isBuild() &&
            (v = new Error('StackLocation').stack || null),
            (this._currentAnonymousDefineCall = {
              stack: v,
              dependencies: c,
              callback: h,
            })
        }),
        (C.prototype.defineModule = function (c, h, v, t, g, m) {
          var p = this
          m === void 0 && (m = new r(c))
          var L = this._moduleIdProvider.getModuleId(c)
          if (this._modules2[L]) {
            this._config.isDuplicateMessageIgnoredFor(c) ||
              console.warn("Duplicate definition of module '" + c + "'")
            return
          }
          var w = new N(L, c, this._normalizeDependencies(h, m), v, t, m)
          ;(this._modules2[L] = w),
            this._config.isBuild() &&
              ((this._buildInfoDefineStack[L] = g),
              (this._buildInfoDependencies[L] = (w.dependencies || []).map(
                function (S) {
                  return p._moduleIdProvider.getStrModuleId(S.id)
                }
              ))),
            this._resolve(w)
        }),
        (C.prototype._normalizeDependency = function (c, h) {
          if (c === 'exports') return A.EXPORTS
          if (c === 'module') return A.MODULE
          if (c === 'require') return A.REQUIRE
          var v = c.indexOf('!')
          if (v >= 0) {
            var t = h.resolveModule(c.substr(0, v)),
              g = h.resolveModule(c.substr(v + 1)),
              m = this._moduleIdProvider.getModuleId(t + '!' + g),
              p = this._moduleIdProvider.getModuleId(t)
            return new l(m, p, g)
          }
          return new A(this._moduleIdProvider.getModuleId(h.resolveModule(c)))
        }),
        (C.prototype._normalizeDependencies = function (c, h) {
          for (var v = [], t = 0, g = 0, m = c.length; g < m; g++)
            v[t++] = this._normalizeDependency(c[g], h)
          return v
        }),
        (C.prototype._relativeRequire = function (c, h, v, t) {
          if (typeof h == 'string') return this.synchronousRequire(h, c)
          this.defineModule(
            F.Utilities.generateAnonymousModule(),
            h,
            v,
            t,
            null,
            c
          )
        }),
        (C.prototype.synchronousRequire = function (c, h) {
          h === void 0 && (h = new r(c))
          var v = this._normalizeDependency(c, h),
            t = this._modules2[v.id]
          if (!t)
            throw new Error(
              "Check dependency list! Synchronous require cannot resolve module '" +
                c +
                "'. This is the first mention of this module!"
            )
          if (!t.isComplete())
            throw new Error(
              "Check dependency list! Synchronous require cannot resolve module '" +
                c +
                "'. This module has not been resolved completely yet."
            )
          if (t.error) throw t.error
          return t.exports
        }),
        (C.prototype.configure = function (c, h) {
          var v = this._config.shouldRecordStats()
          h
            ? (this._config = new F.Configuration(this._env, c))
            : (this._config = this._config.cloneAndMerge(c)),
            this._config.shouldRecordStats() && !v && (this._recorder = null)
        }),
        (C.prototype.getConfig = function () {
          return this._config
        }),
        (C.prototype._onLoad = function (c) {
          if (this._currentAnonymousDefineCall !== null) {
            var h = this._currentAnonymousDefineCall
            ;(this._currentAnonymousDefineCall = null),
              this.defineModule(
                this._moduleIdProvider.getStrModuleId(c),
                h.dependencies,
                h.callback,
                null,
                h.stack
              )
          }
        }),
        (C.prototype._createLoadError = function (c, h) {
          var v = this,
            t = this._moduleIdProvider.getStrModuleId(c),
            g = (this._inverseDependencies2[c] || []).map(function (p) {
              return v._moduleIdProvider.getStrModuleId(p)
            }),
            m = F.ensureError(h)
          return (m.phase = 'loading'), (m.moduleId = t), (m.neededBy = g), m
        }),
        (C.prototype._onLoadError = function (c, h) {
          var v = this._createLoadError(c, h)
          this._modules2[c] ||
            (this._modules2[c] = new N(
              c,
              this._moduleIdProvider.getStrModuleId(c),
              [],
              function () {},
              null,
              null
            ))
          for (
            var t = [], g = 0, m = this._moduleIdProvider.getMaxModuleId();
            g < m;
            g++
          )
            t[g] = !1
          var p = !1,
            L = []
          for (L.push(c), t[c] = !0; L.length > 0; ) {
            var w = L.shift(),
              S = this._modules2[w]
            S && (p = S.onDependencyError(v) || p)
            var b = this._inverseDependencies2[w]
            if (b)
              for (var g = 0, m = b.length; g < m; g++) {
                var s = b[g]
                t[s] || (L.push(s), (t[s] = !0))
              }
          }
          p || this._config.onError(v)
        }),
        (C.prototype._hasDependencyPath = function (c, h) {
          var v = this._modules2[c]
          if (!v) return !1
          for (
            var t = [], g = 0, m = this._moduleIdProvider.getMaxModuleId();
            g < m;
            g++
          )
            t[g] = !1
          var p = []
          for (p.push(v), t[c] = !0; p.length > 0; ) {
            var L = p.shift(),
              w = L.dependencies
            if (w)
              for (var g = 0, m = w.length; g < m; g++) {
                var S = w[g]
                if (S.id === h) return !0
                var b = this._modules2[S.id]
                b && !t[S.id] && ((t[S.id] = !0), p.push(b))
              }
          }
          return !1
        }),
        (C.prototype._findCyclePath = function (c, h, v) {
          if (c === h || v === 50) return [c]
          var t = this._modules2[c]
          if (!t) return null
          var g = t.dependencies
          if (g)
            for (var m = 0, p = g.length; m < p; m++) {
              var L = this._findCyclePath(g[m].id, h, v + 1)
              if (L !== null) return L.push(c), L
            }
          return null
        }),
        (C.prototype._createRequire = function (c) {
          var h = this,
            v = function (t, g, m) {
              return h._relativeRequire(c, t, g, m)
            }
          return (
            (v.toUrl = function (t) {
              return h._config.requireToUrl(c.resolveModule(t))
            }),
            (v.getStats = function () {
              return h.getLoaderEvents()
            }),
            (v.hasDependencyCycle = function () {
              return h._hasDependencyCycle
            }),
            (v.config = function (t, g) {
              g === void 0 && (g = !1), h.configure(t, g)
            }),
            (v.__$__nodeRequire = F.global.nodeRequire),
            v
          )
        }),
        (C.prototype._loadModule = function (c) {
          var h = this
          if (!(this._modules2[c] || this._knownModules2[c])) {
            this._knownModules2[c] = !0
            var v = this._moduleIdProvider.getStrModuleId(c),
              t = this._config.moduleIdToPaths(v),
              g = /^@[^\/]+\/[^\/]+$/
            this._env.isNode &&
              (v.indexOf('/') === -1 || g.test(v)) &&
              t.push('node|' + v)
            var m = -1,
              p = function (L) {
                if ((m++, m >= t.length)) h._onLoadError(c, L)
                else {
                  var w = t[m],
                    S = h.getRecorder()
                  if (h._config.isBuild() && w === 'empty:') {
                    ;(h._buildInfoPath[c] = w),
                      h.defineModule(
                        h._moduleIdProvider.getStrModuleId(c),
                        [],
                        null,
                        null,
                        null
                      ),
                      h._onLoad(c)
                    return
                  }
                  S.record(10, w),
                    h._scriptLoader.load(
                      h,
                      w,
                      function () {
                        h._config.isBuild() && (h._buildInfoPath[c] = w),
                          S.record(11, w),
                          h._onLoad(c)
                      },
                      function (b) {
                        S.record(12, w), p(b)
                      }
                    )
                }
              }
            p(null)
          }
        }),
        (C.prototype._loadPluginDependency = function (c, h) {
          var v = this
          if (!(this._modules2[h.id] || this._knownModules2[h.id])) {
            this._knownModules2[h.id] = !0
            var t = function (g) {
              v.defineModule(
                v._moduleIdProvider.getStrModuleId(h.id),
                [],
                g,
                null,
                null
              )
            }
            ;(t.error = function (g) {
              v._config.onError(v._createLoadError(h.id, g))
            }),
              c.load(
                h.pluginParam,
                this._createRequire(r.ROOT),
                t,
                this._config.getOptionsLiteral()
              )
          }
        }),
        (C.prototype._resolve = function (c) {
          var h = this,
            v = c.dependencies
          if (v)
            for (var t = 0, g = v.length; t < g; t++) {
              var m = v[t]
              if (m === A.EXPORTS) {
                ;(c.exportsPassedIn = !0), c.unresolvedDependenciesCount--
                continue
              }
              if (m === A.MODULE) {
                c.unresolvedDependenciesCount--
                continue
              }
              if (m === A.REQUIRE) {
                c.unresolvedDependenciesCount--
                continue
              }
              var p = this._modules2[m.id]
              if (p && p.isComplete()) {
                if (p.error) {
                  c.onDependencyError(p.error)
                  return
                }
                c.unresolvedDependenciesCount--
                continue
              }
              if (this._hasDependencyPath(m.id, c.id)) {
                ;(this._hasDependencyCycle = !0),
                  console.warn(
                    "There is a dependency cycle between '" +
                      this._moduleIdProvider.getStrModuleId(m.id) +
                      "' and '" +
                      this._moduleIdProvider.getStrModuleId(c.id) +
                      "'. The cyclic path follows:"
                  )
                var L = this._findCyclePath(m.id, c.id, 0) || []
                L.reverse(),
                  L.push(m.id),
                  console.warn(
                    L.map(function (b) {
                      return h._moduleIdProvider.getStrModuleId(b)
                    }).join(` => 
`)
                  ),
                  c.unresolvedDependenciesCount--
                continue
              }
              if (
                ((this._inverseDependencies2[m.id] =
                  this._inverseDependencies2[m.id] || []),
                this._inverseDependencies2[m.id].push(c.id),
                m instanceof l)
              ) {
                var w = this._modules2[m.pluginId]
                if (w && w.isComplete()) {
                  this._loadPluginDependency(w.exports, m)
                  continue
                }
                var S = this._inversePluginDependencies2.get(m.pluginId)
                S ||
                  ((S = []),
                  this._inversePluginDependencies2.set(m.pluginId, S)),
                  S.push(m),
                  this._loadModule(m.pluginId)
                continue
              }
              this._loadModule(m.id)
            }
          c.unresolvedDependenciesCount === 0 && this._onModuleComplete(c)
        }),
        (C.prototype._onModuleComplete = function (c) {
          var h = this,
            v = this.getRecorder()
          if (!c.isComplete()) {
            var t = c.dependencies,
              g = []
            if (t)
              for (var m = 0, p = t.length; m < p; m++) {
                var L = t[m]
                if (L === A.EXPORTS) {
                  g[m] = c.exports
                  continue
                }
                if (L === A.MODULE) {
                  g[m] = {
                    id: c.strId,
                    config: function () {
                      return h._config.getConfigForModule(c.strId)
                    },
                  }
                  continue
                }
                if (L === A.REQUIRE) {
                  g[m] = this._createRequire(c.moduleIdResolver)
                  continue
                }
                var w = this._modules2[L.id]
                if (w) {
                  g[m] = w.exports
                  continue
                }
                g[m] = null
              }
            var S = function (d) {
              return (h._inverseDependencies2[d] || []).map(function (o) {
                return h._moduleIdProvider.getStrModuleId(o)
              })
            }
            c.complete(v, this._config, g, S)
            var b = this._inverseDependencies2[c.id]
            if (((this._inverseDependencies2[c.id] = null), b))
              for (var m = 0, p = b.length; m < p; m++) {
                var s = b[m],
                  a = this._modules2[s]
                a.unresolvedDependenciesCount--,
                  a.unresolvedDependenciesCount === 0 &&
                    this._onModuleComplete(a)
              }
            var f = this._inversePluginDependencies2.get(c.id)
            if (f) {
              this._inversePluginDependencies2.delete(c.id)
              for (var m = 0, p = f.length; m < p; m++)
                this._loadPluginDependency(c.exports, f[m])
            }
          }
        }),
        C
      )
    })()
    F.ModuleManager = y
  })(ie || (ie = {}))
  var Y, ie
  ;(function (F) {
    var r = new F.Environment(),
      N = null,
      e = function (C, c, h) {
        typeof C != 'string' && ((h = c), (c = C), (C = null)),
          (typeof c != 'object' || !Array.isArray(c)) && ((h = c), (c = null)),
          c || (c = ['require', 'exports', 'module']),
          C
            ? N.defineModule(C, c, h, null, null)
            : N.enqueueDefineAnonymousModule(c, h)
      }
    e.amd = { jQuery: !0 }
    var A = function (C, c) {
        c === void 0 && (c = !1), N.configure(C, c)
      },
      l = function () {
        if (arguments.length === 1) {
          if (arguments[0] instanceof Object && !Array.isArray(arguments[0])) {
            A(arguments[0])
            return
          }
          if (typeof arguments[0] == 'string')
            return N.synchronousRequire(arguments[0])
        }
        if (
          (arguments.length === 2 || arguments.length === 3) &&
          Array.isArray(arguments[0])
        ) {
          N.defineModule(
            F.Utilities.generateAnonymousModule(),
            arguments[0],
            arguments[1],
            arguments[2],
            null
          )
          return
        }
        throw new Error('Unrecognized require call')
      }
    ;(l.config = A),
      (l.getConfig = function () {
        return N.getConfig().getOptionsLiteral()
      }),
      (l.reset = function () {
        N = N.reset()
      }),
      (l.getBuildInfo = function () {
        return N.getBuildInfo()
      }),
      (l.getStats = function () {
        return N.getLoaderEvents()
      }),
      (l.define = e)
    function y() {
      if (
        typeof F.global.require != 'undefined' ||
        typeof require != 'undefined'
      ) {
        var C = F.global.require || require
        if (typeof C == 'function' && typeof C.resolve == 'function') {
          var c = F.ensureRecordedNodeRequire(N.getRecorder(), C)
          ;(F.global.nodeRequire = c),
            (l.nodeRequire = c),
            (l.__$__nodeRequire = c)
        }
      }
      r.isNode && !r.isElectronRenderer && !r.isElectronNodeIntegrationWebWorker
        ? ((module.exports = l), (require = l))
        : (r.isElectronRenderer || (F.global.define = e),
          (F.global.require = l))
    }
    ;(F.init = y),
      (typeof F.global.define != 'function' || !F.global.define.amd) &&
        ((N = new F.ModuleManager(
          r,
          F.createScriptLoader(r),
          e,
          l,
          F.Utilities.getHighPerformanceTimestamp()
        )),
        typeof F.global.require != 'undefined' &&
          typeof F.global.require != 'function' &&
          l.config(F.global.require),
        (Y = function () {
          return e.apply(null, arguments)
        }),
        (Y.amd = e.amd),
        typeof doNotInitLoader == 'undefined' && y())
  })(ie || (ie = {}))
  var oe =
    (this && this.__awaiter) ||
    function (F, r, N, e) {
      function A(l) {
        return l instanceof N
          ? l
          : new N(function (y) {
              y(l)
            })
      }
      return new (N || (N = Promise))(function (l, y) {
        function C(v) {
          try {
            h(e.next(v))
          } catch (t) {
            y(t)
          }
        }
        function c(v) {
          try {
            h(e.throw(v))
          } catch (t) {
            y(t)
          }
        }
        function h(v) {
          v.done ? l(v.value) : A(v.value).then(C, c)
        }
        h((e = e.apply(F, r || [])).next())
      })
    }
  Y(X[18], J([0, 1]), function (F, r) {
    'use strict'
    Object.defineProperty(r, '__esModule', { value: !0 }),
      (r.load =
        r.create =
        r.setPseudoTranslation =
        r.getConfiguredDefaultLocale =
        r.localize =
          void 0)
    let N =
      typeof document != 'undefined' &&
      document.location &&
      document.location.hash.indexOf('pseudo=true') >= 0
    const e = 'i-default'
    function A(p, L) {
      let w
      return (
        L.length === 0
          ? (w = p)
          : (w = p.replace(/\{(\d+)\}/g, (S, b) => {
              const s = b[0],
                a = L[s]
              let f = S
              return (
                typeof a == 'string'
                  ? (f = a)
                  : (typeof a == 'number' ||
                      typeof a == 'boolean' ||
                      a === void 0 ||
                      a === null) &&
                    (f = String(a)),
                f
              )
            })),
        N && (w = '\uFF3B' + w.replace(/[aouei]/g, '$&$&') + '\uFF3D'),
        w
      )
    }
    function l(p, L) {
      let w = p[L]
      return w || ((w = p['*']), w) ? w : null
    }
    function y(p) {
      return p.charAt(p.length - 1) === '/' ? p : p + '/'
    }
    function C(p, L, w) {
      return oe(this, void 0, void 0, function* () {
        const S = y(p) + y(L) + 'vscode/' + y(w),
          b = yield fetch(S)
        if (b.ok) return yield b.json()
        throw new Error(`${b.status} - ${b.statusText}`)
      })
    }
    function c(p) {
      return function (L, w) {
        const S = Array.prototype.slice.call(arguments, 2)
        return A(p[L], S)
      }
    }
    function h(p, L, ...w) {
      return A(L, w)
    }
    r.localize = h
    function v(p) {}
    r.getConfiguredDefaultLocale = v
    function t(p) {
      N = p
    }
    r.setPseudoTranslation = t
    function g(p, L) {
      var w
      return {
        localize: c(L[p]),
        getConfiguredDefaultLocale:
          (w = L.getConfiguredDefaultLocale) !== null && w !== void 0
            ? w
            : (S) => {},
      }
    }
    r.create = g
    function m(p, L, w, S) {
      var b
      const s = (b = S['vs/nls']) !== null && b !== void 0 ? b : {}
      if (!p || p.length === 0)
        return w({
          localize: h,
          getConfiguredDefaultLocale: () => {
            var i
            return (i = s.availableLanguages) === null || i === void 0
              ? void 0
              : i['*']
          },
        })
      const a = s.availableLanguages ? l(s.availableLanguages, p) : null,
        f = a === null || a === e
      let d = '.nls'
      f || (d = d + '.' + a)
      const o = (i) => {
        Array.isArray(i) ? (i.localize = c(i)) : (i.localize = c(i[p])),
          (i.getConfiguredDefaultLocale = () => {
            var u
            return (u = s.availableLanguages) === null || u === void 0
              ? void 0
              : u['*']
          }),
          w(i)
      }
      typeof s.loadBundle == 'function'
        ? s.loadBundle(p, a, (i, u) => {
            i ? L([p + '.nls'], o) : o(u)
          })
        : s.translationServiceUrl && !f
        ? (() =>
            oe(this, void 0, void 0, function* () {
              var i
              try {
                const u = yield C(s.translationServiceUrl, a, p)
                return o(u)
              } catch (u) {
                if (!a.includes('-'))
                  return console.error(u), L([p + '.nls'], o)
                try {
                  const _ = a.split('-')[0],
                    E = yield C(s.translationServiceUrl, _, p)
                  return (
                    ((i = s.availableLanguages) !== null && i !== void 0) ||
                      (s.availableLanguages = {}),
                    (s.availableLanguages['*'] = _),
                    o(E)
                  )
                } catch (_) {
                  return console.error(_), L([p + '.nls'], o)
                }
              }
            }))()
        : L([p + d], o, (i) => {
            if (d === '.nls') {
              console.error('Failed trying to load default language strings', i)
              return
            }
            console.error(
              `Failed to load message bundle for language ${a}. Falling back to the default language:`,
              i
            ),
              L([p + '.nls'], o)
          })
    }
    r.load = m
  }),
    (function () {
      var F, r
      const N = self.MonacoEnvironment,
        e = N && N.baseUrl ? N.baseUrl : '../../../',
        A =
          typeof ((F = self.trustedTypes) === null || F === void 0
            ? void 0
            : F.createPolicy) == 'function'
            ? (r = self.trustedTypes) === null || r === void 0
              ? void 0
              : r.createPolicy('amdLoader', {
                  createScriptURL: (t) => t,
                  createScript: (t, ...g) => {
                    const m = g.slice(0, -1).join(','),
                      p = g.pop().toString()
                    return `(function anonymous(${m}) {
${p}
})`
                  },
                })
            : void 0
      function l() {
        try {
          return (
            (A
              ? self.eval(A.createScript('', 'true'))
              : new Function('true')
            ).call(self),
            !0
          )
        } catch {
          return !1
        }
      }
      function y() {
        return new Promise((t, g) => {
          if (typeof self.define == 'function' && self.define.amd) return t()
          const m = e + 'vs/loader.js'
          if (
            !(
              /^((http:)|(https:)|(file:))/.test(m) &&
              m.substring(0, self.origin.length) !== self.origin
            ) &&
            l()
          ) {
            fetch(m)
              .then((L) => {
                if (L.status !== 200) throw new Error(L.statusText)
                return L.text()
              })
              .then((L) => {
                ;(L = `${L}
//# sourceURL=${m}`),
                  (A ? self.eval(A.createScript('', L)) : new Function(L)).call(
                    self
                  ),
                  t()
              })
              .then(void 0, g)
            return
          }
          A ? importScripts(A.createScriptURL(m)) : importScripts(m), t()
        })
      }
      function C() {
        require.config({
          baseUrl: e,
          catchError: !0,
          trustedTypesPolicy: A,
          amdModulesPattern: /^vs\//,
        })
      }
      function c(t) {
        y().then(() => {
          C(),
            require([t], function (g) {
              setTimeout(function () {
                const m = g.create((p, L) => {
                  self.postMessage(p, L)
                }, null)
                for (
                  self.onmessage = (p) => m.onmessage(p.data, p.ports);
                  v.length > 0;

                )
                  self.onmessage(v.shift())
              }, 0)
            })
        })
      }
      typeof self.define == 'function' && self.define.amd && C()
      let h = !0
      const v = []
      self.onmessage = (t) => {
        if (!h) {
          v.push(t)
          return
        }
        ;(h = !1), c(t.data)
      }
    })(),
    Y(X[19], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.ArrayQueue =
          r.findMinBy =
          r.findLastMaxBy =
          r.findMaxBy =
          r.numberComparator =
          r.compareBy =
          r.CompareResult =
          r.splice =
          r.insertInto =
          r.asArray =
          r.pushMany =
          r.pushToEnd =
          r.pushToStart =
          r.arrayInsert =
          r.range =
          r.firstOrDefault =
          r.lastIndex =
          r.findLast =
          r.distinct =
          r.isNonEmptyArray =
          r.isFalsyOrEmpty =
          r.coalesce =
          r.groupBy =
          r.quickSelect =
          r.findFirstInSorted =
          r.binarySearch2 =
          r.binarySearch =
          r.removeFastWithoutKeepingOrder =
          r.equals =
          r.tail2 =
          r.tail =
            void 0)
      function N(P, U = 0) {
        return P[P.length - (1 + U)]
      }
      r.tail = N
      function e(P) {
        if (P.length === 0) throw new Error('Invalid tail call')
        return [P.slice(0, P.length - 1), P[P.length - 1]]
      }
      r.tail2 = e
      function A(P, U, T = (W, B) => W === B) {
        if (P === U) return !0
        if (!P || !U || P.length !== U.length) return !1
        for (let W = 0, B = P.length; W < B; W++) if (!T(P[W], U[W])) return !1
        return !0
      }
      r.equals = A
      function l(P, U) {
        const T = P.length - 1
        U < T && (P[U] = P[T]), P.pop()
      }
      r.removeFastWithoutKeepingOrder = l
      function y(P, U, T) {
        return C(P.length, (W) => T(P[W], U))
      }
      r.binarySearch = y
      function C(P, U) {
        let T = 0,
          W = P - 1
        for (; T <= W; ) {
          const B = ((T + W) / 2) | 0,
            te = U(B)
          if (te < 0) T = B + 1
          else if (te > 0) W = B - 1
          else return B
        }
        return -(T + 1)
      }
      r.binarySearch2 = C
      function c(P, U) {
        let T = 0,
          W = P.length
        if (W === 0) return 0
        for (; T < W; ) {
          const B = Math.floor((T + W) / 2)
          U(P[B]) ? (W = B) : (T = B + 1)
        }
        return T
      }
      r.findFirstInSorted = c
      function h(P, U, T) {
        if (((P = P | 0), P >= U.length)) throw new TypeError('invalid index')
        const W = U[Math.floor(U.length * Math.random())],
          B = [],
          te = [],
          n = []
        for (const de of U) {
          const be = T(de, W)
          be < 0 ? B.push(de) : be > 0 ? te.push(de) : n.push(de)
        }
        return P < B.length
          ? h(P, B, T)
          : P < B.length + n.length
          ? n[0]
          : h(P - (B.length + n.length), te, T)
      }
      r.quickSelect = h
      function v(P, U) {
        const T = []
        let W
        for (const B of P.slice(0).sort(U))
          !W || U(W[0], B) !== 0 ? ((W = [B]), T.push(W)) : W.push(B)
        return T
      }
      r.groupBy = v
      function t(P) {
        return P.filter((U) => !!U)
      }
      r.coalesce = t
      function g(P) {
        return !Array.isArray(P) || P.length === 0
      }
      r.isFalsyOrEmpty = g
      function m(P) {
        return Array.isArray(P) && P.length > 0
      }
      r.isNonEmptyArray = m
      function p(P, U = (T) => T) {
        const T = new Set()
        return P.filter((W) => {
          const B = U(W)
          return T.has(B) ? !1 : (T.add(B), !0)
        })
      }
      r.distinct = p
      function L(P, U) {
        const T = w(P, U)
        if (T !== -1) return P[T]
      }
      r.findLast = L
      function w(P, U) {
        for (let T = P.length - 1; T >= 0; T--) {
          const W = P[T]
          if (U(W)) return T
        }
        return -1
      }
      r.lastIndex = w
      function S(P, U) {
        return P.length > 0 ? P[0] : U
      }
      r.firstOrDefault = S
      function b(P, U) {
        let T = typeof U == 'number' ? P : 0
        typeof U == 'number' ? (T = P) : ((T = 0), (U = P))
        const W = []
        if (T <= U) for (let B = T; B < U; B++) W.push(B)
        else for (let B = T; B > U; B--) W.push(B)
        return W
      }
      r.range = b
      function s(P, U, T) {
        const W = P.slice(0, U),
          B = P.slice(U)
        return W.concat(T, B)
      }
      r.arrayInsert = s
      function a(P, U) {
        const T = P.indexOf(U)
        T > -1 && (P.splice(T, 1), P.unshift(U))
      }
      r.pushToStart = a
      function f(P, U) {
        const T = P.indexOf(U)
        T > -1 && (P.splice(T, 1), P.push(U))
      }
      r.pushToEnd = f
      function d(P, U) {
        for (const T of U) P.push(T)
      }
      r.pushMany = d
      function o(P) {
        return Array.isArray(P) ? P : [P]
      }
      r.asArray = o
      function i(P, U, T) {
        const W = _(P, U),
          B = P.length,
          te = T.length
        P.length = B + te
        for (let n = B - 1; n >= W; n--) P[n + te] = P[n]
        for (let n = 0; n < te; n++) P[n + W] = T[n]
      }
      r.insertInto = i
      function u(P, U, T, W) {
        const B = _(P, U),
          te = P.splice(B, T)
        return i(P, B, W), te
      }
      r.splice = u
      function _(P, U) {
        return U < 0 ? Math.max(U + P.length, 0) : Math.min(U, P.length)
      }
      var E
      ;(function (P) {
        function U(B) {
          return B < 0
        }
        P.isLessThan = U
        function T(B) {
          return B > 0
        }
        P.isGreaterThan = T
        function W(B) {
          return B === 0
        }
        ;(P.isNeitherLessOrGreaterThan = W),
          (P.greaterThan = 1),
          (P.lessThan = -1),
          (P.neitherLessOrGreaterThan = 0)
      })((E = r.CompareResult || (r.CompareResult = {})))
      function M(P, U) {
        return (T, W) => U(P(T), P(W))
      }
      r.compareBy = M
      const D = (P, U) => P - U
      r.numberComparator = D
      function I(P, U) {
        if (P.length === 0) return
        let T = P[0]
        for (let W = 1; W < P.length; W++) {
          const B = P[W]
          U(B, T) > 0 && (T = B)
        }
        return T
      }
      r.findMaxBy = I
      function O(P, U) {
        if (P.length === 0) return
        let T = P[0]
        for (let W = 1; W < P.length; W++) {
          const B = P[W]
          U(B, T) >= 0 && (T = B)
        }
        return T
      }
      r.findLastMaxBy = O
      function q(P, U) {
        return I(P, (T, W) => -U(T, W))
      }
      r.findMinBy = q
      class z {
        constructor(U) {
          ;(this.items = U),
            (this.firstIdx = 0),
            (this.lastIdx = this.items.length - 1)
        }
        get length() {
          return this.lastIdx - this.firstIdx + 1
        }
        takeWhile(U) {
          let T = this.firstIdx
          for (; T < this.items.length && U(this.items[T]); ) T++
          const W =
            T === this.firstIdx ? null : this.items.slice(this.firstIdx, T)
          return (this.firstIdx = T), W
        }
        takeFromEndWhile(U) {
          let T = this.lastIdx
          for (; T >= 0 && U(this.items[T]); ) T--
          const W =
            T === this.lastIdx
              ? null
              : this.items.slice(T + 1, this.lastIdx + 1)
          return (this.lastIdx = T), W
        }
        peek() {
          if (this.length !== 0) return this.items[this.firstIdx]
        }
        dequeue() {
          const U = this.items[this.firstIdx]
          return this.firstIdx++, U
        }
        takeCount(U) {
          const T = this.items.slice(this.firstIdx, this.firstIdx + U)
          return (this.firstIdx += U), T
        }
      }
      r.ArrayQueue = z
    }),
    Y(X[20], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.CachedFunction = r.LRUCachedFunction = void 0)
      class N {
        constructor(l) {
          ;(this.fn = l), (this.lastCache = void 0), (this.lastArgKey = void 0)
        }
        get(l) {
          const y = JSON.stringify(l)
          return (
            this.lastArgKey !== y &&
              ((this.lastArgKey = y), (this.lastCache = this.fn(l))),
            this.lastCache
          )
        }
      }
      r.LRUCachedFunction = N
      class e {
        constructor(l) {
          ;(this.fn = l), (this._map = new Map())
        }
        get cachedValues() {
          return this._map
        }
        get(l) {
          if (this._map.has(l)) return this._map.get(l)
          const y = this.fn(l)
          return this._map.set(l, y), y
        }
      }
      r.CachedFunction = e
    }),
    Y(X[21], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.CSSIcon = r.Codicon = r.getCodiconAriaLabel = void 0)
      function N(l) {
        return l ? l.replace(/\$\((.*?)\)/g, (y, C) => ` ${C} `).trim() : ''
      }
      r.getCodiconAriaLabel = N
      class e {
        constructor(y, C, c) {
          ;(this.id = y),
            (this.definition = C),
            (this.description = c),
            e._allCodicons.push(this)
        }
        get classNames() {
          return 'codicon codicon-' + this.id
        }
        get classNamesArray() {
          return ['codicon', 'codicon-' + this.id]
        }
        get cssSelector() {
          return '.codicon.codicon-' + this.id
        }
        static getAll() {
          return e._allCodicons
        }
      }
      ;(r.Codicon = e),
        (e._allCodicons = []),
        (e.add = new e('add', { fontCharacter: '\\ea60' })),
        (e.plus = new e('plus', e.add.definition)),
        (e.gistNew = new e('gist-new', e.add.definition)),
        (e.repoCreate = new e('repo-create', e.add.definition)),
        (e.lightbulb = new e('lightbulb', { fontCharacter: '\\ea61' })),
        (e.lightBulb = new e('light-bulb', { fontCharacter: '\\ea61' })),
        (e.repo = new e('repo', { fontCharacter: '\\ea62' })),
        (e.repoDelete = new e('repo-delete', { fontCharacter: '\\ea62' })),
        (e.gistFork = new e('gist-fork', { fontCharacter: '\\ea63' })),
        (e.repoForked = new e('repo-forked', { fontCharacter: '\\ea63' })),
        (e.gitPullRequest = new e('git-pull-request', {
          fontCharacter: '\\ea64',
        })),
        (e.gitPullRequestAbandoned = new e('git-pull-request-abandoned', {
          fontCharacter: '\\ea64',
        })),
        (e.recordKeys = new e('record-keys', { fontCharacter: '\\ea65' })),
        (e.keyboard = new e('keyboard', { fontCharacter: '\\ea65' })),
        (e.tag = new e('tag', { fontCharacter: '\\ea66' })),
        (e.tagAdd = new e('tag-add', { fontCharacter: '\\ea66' })),
        (e.tagRemove = new e('tag-remove', { fontCharacter: '\\ea66' })),
        (e.person = new e('person', { fontCharacter: '\\ea67' })),
        (e.personFollow = new e('person-follow', { fontCharacter: '\\ea67' })),
        (e.personOutline = new e('person-outline', {
          fontCharacter: '\\ea67',
        })),
        (e.personFilled = new e('person-filled', { fontCharacter: '\\ea67' })),
        (e.gitBranch = new e('git-branch', { fontCharacter: '\\ea68' })),
        (e.gitBranchCreate = new e('git-branch-create', {
          fontCharacter: '\\ea68',
        })),
        (e.gitBranchDelete = new e('git-branch-delete', {
          fontCharacter: '\\ea68',
        })),
        (e.sourceControl = new e('source-control', {
          fontCharacter: '\\ea68',
        })),
        (e.mirror = new e('mirror', { fontCharacter: '\\ea69' })),
        (e.mirrorPublic = new e('mirror-public', { fontCharacter: '\\ea69' })),
        (e.star = new e('star', { fontCharacter: '\\ea6a' })),
        (e.starAdd = new e('star-add', { fontCharacter: '\\ea6a' })),
        (e.starDelete = new e('star-delete', { fontCharacter: '\\ea6a' })),
        (e.starEmpty = new e('star-empty', { fontCharacter: '\\ea6a' })),
        (e.comment = new e('comment', { fontCharacter: '\\ea6b' })),
        (e.commentAdd = new e('comment-add', { fontCharacter: '\\ea6b' })),
        (e.alert = new e('alert', { fontCharacter: '\\ea6c' })),
        (e.warning = new e('warning', { fontCharacter: '\\ea6c' })),
        (e.search = new e('search', { fontCharacter: '\\ea6d' })),
        (e.searchSave = new e('search-save', { fontCharacter: '\\ea6d' })),
        (e.logOut = new e('log-out', { fontCharacter: '\\ea6e' })),
        (e.signOut = new e('sign-out', { fontCharacter: '\\ea6e' })),
        (e.logIn = new e('log-in', { fontCharacter: '\\ea6f' })),
        (e.signIn = new e('sign-in', { fontCharacter: '\\ea6f' })),
        (e.eye = new e('eye', { fontCharacter: '\\ea70' })),
        (e.eyeUnwatch = new e('eye-unwatch', { fontCharacter: '\\ea70' })),
        (e.eyeWatch = new e('eye-watch', { fontCharacter: '\\ea70' })),
        (e.circleFilled = new e('circle-filled', { fontCharacter: '\\ea71' })),
        (e.primitiveDot = new e('primitive-dot', { fontCharacter: '\\ea71' })),
        (e.closeDirty = new e('close-dirty', { fontCharacter: '\\ea71' })),
        (e.debugBreakpoint = new e('debug-breakpoint', {
          fontCharacter: '\\ea71',
        })),
        (e.debugBreakpointDisabled = new e('debug-breakpoint-disabled', {
          fontCharacter: '\\ea71',
        })),
        (e.debugHint = new e('debug-hint', { fontCharacter: '\\ea71' })),
        (e.primitiveSquare = new e('primitive-square', {
          fontCharacter: '\\ea72',
        })),
        (e.edit = new e('edit', { fontCharacter: '\\ea73' })),
        (e.pencil = new e('pencil', { fontCharacter: '\\ea73' })),
        (e.info = new e('info', { fontCharacter: '\\ea74' })),
        (e.issueOpened = new e('issue-opened', { fontCharacter: '\\ea74' })),
        (e.gistPrivate = new e('gist-private', { fontCharacter: '\\ea75' })),
        (e.gitForkPrivate = new e('git-fork-private', {
          fontCharacter: '\\ea75',
        })),
        (e.lock = new e('lock', { fontCharacter: '\\ea75' })),
        (e.mirrorPrivate = new e('mirror-private', {
          fontCharacter: '\\ea75',
        })),
        (e.close = new e('close', { fontCharacter: '\\ea76' })),
        (e.removeClose = new e('remove-close', { fontCharacter: '\\ea76' })),
        (e.x = new e('x', { fontCharacter: '\\ea76' })),
        (e.repoSync = new e('repo-sync', { fontCharacter: '\\ea77' })),
        (e.sync = new e('sync', { fontCharacter: '\\ea77' })),
        (e.clone = new e('clone', { fontCharacter: '\\ea78' })),
        (e.desktopDownload = new e('desktop-download', {
          fontCharacter: '\\ea78',
        })),
        (e.beaker = new e('beaker', { fontCharacter: '\\ea79' })),
        (e.microscope = new e('microscope', { fontCharacter: '\\ea79' })),
        (e.vm = new e('vm', { fontCharacter: '\\ea7a' })),
        (e.deviceDesktop = new e('device-desktop', {
          fontCharacter: '\\ea7a',
        })),
        (e.file = new e('file', { fontCharacter: '\\ea7b' })),
        (e.fileText = new e('file-text', { fontCharacter: '\\ea7b' })),
        (e.more = new e('more', { fontCharacter: '\\ea7c' })),
        (e.ellipsis = new e('ellipsis', { fontCharacter: '\\ea7c' })),
        (e.kebabHorizontal = new e('kebab-horizontal', {
          fontCharacter: '\\ea7c',
        })),
        (e.mailReply = new e('mail-reply', { fontCharacter: '\\ea7d' })),
        (e.reply = new e('reply', { fontCharacter: '\\ea7d' })),
        (e.organization = new e('organization', { fontCharacter: '\\ea7e' })),
        (e.organizationFilled = new e('organization-filled', {
          fontCharacter: '\\ea7e',
        })),
        (e.organizationOutline = new e('organization-outline', {
          fontCharacter: '\\ea7e',
        })),
        (e.newFile = new e('new-file', { fontCharacter: '\\ea7f' })),
        (e.fileAdd = new e('file-add', { fontCharacter: '\\ea7f' })),
        (e.newFolder = new e('new-folder', { fontCharacter: '\\ea80' })),
        (e.fileDirectoryCreate = new e('file-directory-create', {
          fontCharacter: '\\ea80',
        })),
        (e.trash = new e('trash', { fontCharacter: '\\ea81' })),
        (e.trashcan = new e('trashcan', { fontCharacter: '\\ea81' })),
        (e.history = new e('history', { fontCharacter: '\\ea82' })),
        (e.clock = new e('clock', { fontCharacter: '\\ea82' })),
        (e.folder = new e('folder', { fontCharacter: '\\ea83' })),
        (e.fileDirectory = new e('file-directory', {
          fontCharacter: '\\ea83',
        })),
        (e.symbolFolder = new e('symbol-folder', { fontCharacter: '\\ea83' })),
        (e.logoGithub = new e('logo-github', { fontCharacter: '\\ea84' })),
        (e.markGithub = new e('mark-github', { fontCharacter: '\\ea84' })),
        (e.github = new e('github', { fontCharacter: '\\ea84' })),
        (e.terminal = new e('terminal', { fontCharacter: '\\ea85' })),
        (e.console = new e('console', { fontCharacter: '\\ea85' })),
        (e.repl = new e('repl', { fontCharacter: '\\ea85' })),
        (e.zap = new e('zap', { fontCharacter: '\\ea86' })),
        (e.symbolEvent = new e('symbol-event', { fontCharacter: '\\ea86' })),
        (e.error = new e('error', { fontCharacter: '\\ea87' })),
        (e.stop = new e('stop', { fontCharacter: '\\ea87' })),
        (e.variable = new e('variable', { fontCharacter: '\\ea88' })),
        (e.symbolVariable = new e('symbol-variable', {
          fontCharacter: '\\ea88',
        })),
        (e.array = new e('array', { fontCharacter: '\\ea8a' })),
        (e.symbolArray = new e('symbol-array', { fontCharacter: '\\ea8a' })),
        (e.symbolModule = new e('symbol-module', { fontCharacter: '\\ea8b' })),
        (e.symbolPackage = new e('symbol-package', {
          fontCharacter: '\\ea8b',
        })),
        (e.symbolNamespace = new e('symbol-namespace', {
          fontCharacter: '\\ea8b',
        })),
        (e.symbolObject = new e('symbol-object', { fontCharacter: '\\ea8b' })),
        (e.symbolMethod = new e('symbol-method', { fontCharacter: '\\ea8c' })),
        (e.symbolFunction = new e('symbol-function', {
          fontCharacter: '\\ea8c',
        })),
        (e.symbolConstructor = new e('symbol-constructor', {
          fontCharacter: '\\ea8c',
        })),
        (e.symbolBoolean = new e('symbol-boolean', {
          fontCharacter: '\\ea8f',
        })),
        (e.symbolNull = new e('symbol-null', { fontCharacter: '\\ea8f' })),
        (e.symbolNumeric = new e('symbol-numeric', {
          fontCharacter: '\\ea90',
        })),
        (e.symbolNumber = new e('symbol-number', { fontCharacter: '\\ea90' })),
        (e.symbolStructure = new e('symbol-structure', {
          fontCharacter: '\\ea91',
        })),
        (e.symbolStruct = new e('symbol-struct', { fontCharacter: '\\ea91' })),
        (e.symbolParameter = new e('symbol-parameter', {
          fontCharacter: '\\ea92',
        })),
        (e.symbolTypeParameter = new e('symbol-type-parameter', {
          fontCharacter: '\\ea92',
        })),
        (e.symbolKey = new e('symbol-key', { fontCharacter: '\\ea93' })),
        (e.symbolText = new e('symbol-text', { fontCharacter: '\\ea93' })),
        (e.symbolReference = new e('symbol-reference', {
          fontCharacter: '\\ea94',
        })),
        (e.goToFile = new e('go-to-file', { fontCharacter: '\\ea94' })),
        (e.symbolEnum = new e('symbol-enum', { fontCharacter: '\\ea95' })),
        (e.symbolValue = new e('symbol-value', { fontCharacter: '\\ea95' })),
        (e.symbolRuler = new e('symbol-ruler', { fontCharacter: '\\ea96' })),
        (e.symbolUnit = new e('symbol-unit', { fontCharacter: '\\ea96' })),
        (e.activateBreakpoints = new e('activate-breakpoints', {
          fontCharacter: '\\ea97',
        })),
        (e.archive = new e('archive', { fontCharacter: '\\ea98' })),
        (e.arrowBoth = new e('arrow-both', { fontCharacter: '\\ea99' })),
        (e.arrowDown = new e('arrow-down', { fontCharacter: '\\ea9a' })),
        (e.arrowLeft = new e('arrow-left', { fontCharacter: '\\ea9b' })),
        (e.arrowRight = new e('arrow-right', { fontCharacter: '\\ea9c' })),
        (e.arrowSmallDown = new e('arrow-small-down', {
          fontCharacter: '\\ea9d',
        })),
        (e.arrowSmallLeft = new e('arrow-small-left', {
          fontCharacter: '\\ea9e',
        })),
        (e.arrowSmallRight = new e('arrow-small-right', {
          fontCharacter: '\\ea9f',
        })),
        (e.arrowSmallUp = new e('arrow-small-up', { fontCharacter: '\\eaa0' })),
        (e.arrowUp = new e('arrow-up', { fontCharacter: '\\eaa1' })),
        (e.bell = new e('bell', { fontCharacter: '\\eaa2' })),
        (e.bold = new e('bold', { fontCharacter: '\\eaa3' })),
        (e.book = new e('book', { fontCharacter: '\\eaa4' })),
        (e.bookmark = new e('bookmark', { fontCharacter: '\\eaa5' })),
        (e.debugBreakpointConditionalUnverified = new e(
          'debug-breakpoint-conditional-unverified',
          { fontCharacter: '\\eaa6' }
        )),
        (e.debugBreakpointConditional = new e('debug-breakpoint-conditional', {
          fontCharacter: '\\eaa7',
        })),
        (e.debugBreakpointConditionalDisabled = new e(
          'debug-breakpoint-conditional-disabled',
          { fontCharacter: '\\eaa7' }
        )),
        (e.debugBreakpointDataUnverified = new e(
          'debug-breakpoint-data-unverified',
          { fontCharacter: '\\eaa8' }
        )),
        (e.debugBreakpointData = new e('debug-breakpoint-data', {
          fontCharacter: '\\eaa9',
        })),
        (e.debugBreakpointDataDisabled = new e(
          'debug-breakpoint-data-disabled',
          { fontCharacter: '\\eaa9' }
        )),
        (e.debugBreakpointLogUnverified = new e(
          'debug-breakpoint-log-unverified',
          { fontCharacter: '\\eaaa' }
        )),
        (e.debugBreakpointLog = new e('debug-breakpoint-log', {
          fontCharacter: '\\eaab',
        })),
        (e.debugBreakpointLogDisabled = new e('debug-breakpoint-log-disabled', {
          fontCharacter: '\\eaab',
        })),
        (e.briefcase = new e('briefcase', { fontCharacter: '\\eaac' })),
        (e.broadcast = new e('broadcast', { fontCharacter: '\\eaad' })),
        (e.browser = new e('browser', { fontCharacter: '\\eaae' })),
        (e.bug = new e('bug', { fontCharacter: '\\eaaf' })),
        (e.calendar = new e('calendar', { fontCharacter: '\\eab0' })),
        (e.caseSensitive = new e('case-sensitive', {
          fontCharacter: '\\eab1',
        })),
        (e.check = new e('check', { fontCharacter: '\\eab2' })),
        (e.checklist = new e('checklist', { fontCharacter: '\\eab3' })),
        (e.chevronDown = new e('chevron-down', { fontCharacter: '\\eab4' })),
        (e.dropDownButton = new e(
          'drop-down-button',
          e.chevronDown.definition
        )),
        (e.chevronLeft = new e('chevron-left', { fontCharacter: '\\eab5' })),
        (e.chevronRight = new e('chevron-right', { fontCharacter: '\\eab6' })),
        (e.chevronUp = new e('chevron-up', { fontCharacter: '\\eab7' })),
        (e.chromeClose = new e('chrome-close', { fontCharacter: '\\eab8' })),
        (e.chromeMaximize = new e('chrome-maximize', {
          fontCharacter: '\\eab9',
        })),
        (e.chromeMinimize = new e('chrome-minimize', {
          fontCharacter: '\\eaba',
        })),
        (e.chromeRestore = new e('chrome-restore', {
          fontCharacter: '\\eabb',
        })),
        (e.circleOutline = new e('circle-outline', {
          fontCharacter: '\\eabc',
        })),
        (e.debugBreakpointUnverified = new e('debug-breakpoint-unverified', {
          fontCharacter: '\\eabc',
        })),
        (e.circleSlash = new e('circle-slash', { fontCharacter: '\\eabd' })),
        (e.circuitBoard = new e('circuit-board', { fontCharacter: '\\eabe' })),
        (e.clearAll = new e('clear-all', { fontCharacter: '\\eabf' })),
        (e.clippy = new e('clippy', { fontCharacter: '\\eac0' })),
        (e.closeAll = new e('close-all', { fontCharacter: '\\eac1' })),
        (e.cloudDownload = new e('cloud-download', {
          fontCharacter: '\\eac2',
        })),
        (e.cloudUpload = new e('cloud-upload', { fontCharacter: '\\eac3' })),
        (e.code = new e('code', { fontCharacter: '\\eac4' })),
        (e.collapseAll = new e('collapse-all', { fontCharacter: '\\eac5' })),
        (e.colorMode = new e('color-mode', { fontCharacter: '\\eac6' })),
        (e.commentDiscussion = new e('comment-discussion', {
          fontCharacter: '\\eac7',
        })),
        (e.compareChanges = new e('compare-changes', {
          fontCharacter: '\\eafd',
        })),
        (e.creditCard = new e('credit-card', { fontCharacter: '\\eac9' })),
        (e.dash = new e('dash', { fontCharacter: '\\eacc' })),
        (e.dashboard = new e('dashboard', { fontCharacter: '\\eacd' })),
        (e.database = new e('database', { fontCharacter: '\\eace' })),
        (e.debugContinue = new e('debug-continue', {
          fontCharacter: '\\eacf',
        })),
        (e.debugDisconnect = new e('debug-disconnect', {
          fontCharacter: '\\ead0',
        })),
        (e.debugPause = new e('debug-pause', { fontCharacter: '\\ead1' })),
        (e.debugRestart = new e('debug-restart', { fontCharacter: '\\ead2' })),
        (e.debugStart = new e('debug-start', { fontCharacter: '\\ead3' })),
        (e.debugStepInto = new e('debug-step-into', {
          fontCharacter: '\\ead4',
        })),
        (e.debugStepOut = new e('debug-step-out', { fontCharacter: '\\ead5' })),
        (e.debugStepOver = new e('debug-step-over', {
          fontCharacter: '\\ead6',
        })),
        (e.debugStop = new e('debug-stop', { fontCharacter: '\\ead7' })),
        (e.debug = new e('debug', { fontCharacter: '\\ead8' })),
        (e.deviceCameraVideo = new e('device-camera-video', {
          fontCharacter: '\\ead9',
        })),
        (e.deviceCamera = new e('device-camera', { fontCharacter: '\\eada' })),
        (e.deviceMobile = new e('device-mobile', { fontCharacter: '\\eadb' })),
        (e.diffAdded = new e('diff-added', { fontCharacter: '\\eadc' })),
        (e.diffIgnored = new e('diff-ignored', { fontCharacter: '\\eadd' })),
        (e.diffModified = new e('diff-modified', { fontCharacter: '\\eade' })),
        (e.diffRemoved = new e('diff-removed', { fontCharacter: '\\eadf' })),
        (e.diffRenamed = new e('diff-renamed', { fontCharacter: '\\eae0' })),
        (e.diff = new e('diff', { fontCharacter: '\\eae1' })),
        (e.discard = new e('discard', { fontCharacter: '\\eae2' })),
        (e.editorLayout = new e('editor-layout', { fontCharacter: '\\eae3' })),
        (e.emptyWindow = new e('empty-window', { fontCharacter: '\\eae4' })),
        (e.exclude = new e('exclude', { fontCharacter: '\\eae5' })),
        (e.extensions = new e('extensions', { fontCharacter: '\\eae6' })),
        (e.eyeClosed = new e('eye-closed', { fontCharacter: '\\eae7' })),
        (e.fileBinary = new e('file-binary', { fontCharacter: '\\eae8' })),
        (e.fileCode = new e('file-code', { fontCharacter: '\\eae9' })),
        (e.fileMedia = new e('file-media', { fontCharacter: '\\eaea' })),
        (e.filePdf = new e('file-pdf', { fontCharacter: '\\eaeb' })),
        (e.fileSubmodule = new e('file-submodule', {
          fontCharacter: '\\eaec',
        })),
        (e.fileSymlinkDirectory = new e('file-symlink-directory', {
          fontCharacter: '\\eaed',
        })),
        (e.fileSymlinkFile = new e('file-symlink-file', {
          fontCharacter: '\\eaee',
        })),
        (e.fileZip = new e('file-zip', { fontCharacter: '\\eaef' })),
        (e.files = new e('files', { fontCharacter: '\\eaf0' })),
        (e.filter = new e('filter', { fontCharacter: '\\eaf1' })),
        (e.flame = new e('flame', { fontCharacter: '\\eaf2' })),
        (e.foldDown = new e('fold-down', { fontCharacter: '\\eaf3' })),
        (e.foldUp = new e('fold-up', { fontCharacter: '\\eaf4' })),
        (e.fold = new e('fold', { fontCharacter: '\\eaf5' })),
        (e.folderActive = new e('folder-active', { fontCharacter: '\\eaf6' })),
        (e.folderOpened = new e('folder-opened', { fontCharacter: '\\eaf7' })),
        (e.gear = new e('gear', { fontCharacter: '\\eaf8' })),
        (e.gift = new e('gift', { fontCharacter: '\\eaf9' })),
        (e.gistSecret = new e('gist-secret', { fontCharacter: '\\eafa' })),
        (e.gist = new e('gist', { fontCharacter: '\\eafb' })),
        (e.gitCommit = new e('git-commit', { fontCharacter: '\\eafc' })),
        (e.gitCompare = new e('git-compare', { fontCharacter: '\\eafd' })),
        (e.gitMerge = new e('git-merge', { fontCharacter: '\\eafe' })),
        (e.githubAction = new e('github-action', { fontCharacter: '\\eaff' })),
        (e.githubAlt = new e('github-alt', { fontCharacter: '\\eb00' })),
        (e.globe = new e('globe', { fontCharacter: '\\eb01' })),
        (e.grabber = new e('grabber', { fontCharacter: '\\eb02' })),
        (e.graph = new e('graph', { fontCharacter: '\\eb03' })),
        (e.gripper = new e('gripper', { fontCharacter: '\\eb04' })),
        (e.heart = new e('heart', { fontCharacter: '\\eb05' })),
        (e.home = new e('home', { fontCharacter: '\\eb06' })),
        (e.horizontalRule = new e('horizontal-rule', {
          fontCharacter: '\\eb07',
        })),
        (e.hubot = new e('hubot', { fontCharacter: '\\eb08' })),
        (e.inbox = new e('inbox', { fontCharacter: '\\eb09' })),
        (e.issueClosed = new e('issue-closed', { fontCharacter: '\\eba4' })),
        (e.issueReopened = new e('issue-reopened', {
          fontCharacter: '\\eb0b',
        })),
        (e.issues = new e('issues', { fontCharacter: '\\eb0c' })),
        (e.italic = new e('italic', { fontCharacter: '\\eb0d' })),
        (e.jersey = new e('jersey', { fontCharacter: '\\eb0e' })),
        (e.json = new e('json', { fontCharacter: '\\eb0f' })),
        (e.kebabVertical = new e('kebab-vertical', {
          fontCharacter: '\\eb10',
        })),
        (e.key = new e('key', { fontCharacter: '\\eb11' })),
        (e.law = new e('law', { fontCharacter: '\\eb12' })),
        (e.lightbulbAutofix = new e('lightbulb-autofix', {
          fontCharacter: '\\eb13',
        })),
        (e.linkExternal = new e('link-external', { fontCharacter: '\\eb14' })),
        (e.link = new e('link', { fontCharacter: '\\eb15' })),
        (e.listOrdered = new e('list-ordered', { fontCharacter: '\\eb16' })),
        (e.listUnordered = new e('list-unordered', {
          fontCharacter: '\\eb17',
        })),
        (e.liveShare = new e('live-share', { fontCharacter: '\\eb18' })),
        (e.loading = new e('loading', { fontCharacter: '\\eb19' })),
        (e.location = new e('location', { fontCharacter: '\\eb1a' })),
        (e.mailRead = new e('mail-read', { fontCharacter: '\\eb1b' })),
        (e.mail = new e('mail', { fontCharacter: '\\eb1c' })),
        (e.markdown = new e('markdown', { fontCharacter: '\\eb1d' })),
        (e.megaphone = new e('megaphone', { fontCharacter: '\\eb1e' })),
        (e.mention = new e('mention', { fontCharacter: '\\eb1f' })),
        (e.milestone = new e('milestone', { fontCharacter: '\\eb20' })),
        (e.mortarBoard = new e('mortar-board', { fontCharacter: '\\eb21' })),
        (e.move = new e('move', { fontCharacter: '\\eb22' })),
        (e.multipleWindows = new e('multiple-windows', {
          fontCharacter: '\\eb23',
        })),
        (e.mute = new e('mute', { fontCharacter: '\\eb24' })),
        (e.noNewline = new e('no-newline', { fontCharacter: '\\eb25' })),
        (e.note = new e('note', { fontCharacter: '\\eb26' })),
        (e.octoface = new e('octoface', { fontCharacter: '\\eb27' })),
        (e.openPreview = new e('open-preview', { fontCharacter: '\\eb28' })),
        (e.package_ = new e('package', { fontCharacter: '\\eb29' })),
        (e.paintcan = new e('paintcan', { fontCharacter: '\\eb2a' })),
        (e.pin = new e('pin', { fontCharacter: '\\eb2b' })),
        (e.play = new e('play', { fontCharacter: '\\eb2c' })),
        (e.run = new e('run', { fontCharacter: '\\eb2c' })),
        (e.plug = new e('plug', { fontCharacter: '\\eb2d' })),
        (e.preserveCase = new e('preserve-case', { fontCharacter: '\\eb2e' })),
        (e.preview = new e('preview', { fontCharacter: '\\eb2f' })),
        (e.project = new e('project', { fontCharacter: '\\eb30' })),
        (e.pulse = new e('pulse', { fontCharacter: '\\eb31' })),
        (e.question = new e('question', { fontCharacter: '\\eb32' })),
        (e.quote = new e('quote', { fontCharacter: '\\eb33' })),
        (e.radioTower = new e('radio-tower', { fontCharacter: '\\eb34' })),
        (e.reactions = new e('reactions', { fontCharacter: '\\eb35' })),
        (e.references = new e('references', { fontCharacter: '\\eb36' })),
        (e.refresh = new e('refresh', { fontCharacter: '\\eb37' })),
        (e.regex = new e('regex', { fontCharacter: '\\eb38' })),
        (e.remoteExplorer = new e('remote-explorer', {
          fontCharacter: '\\eb39',
        })),
        (e.remote = new e('remote', { fontCharacter: '\\eb3a' })),
        (e.remove = new e('remove', { fontCharacter: '\\eb3b' })),
        (e.replaceAll = new e('replace-all', { fontCharacter: '\\eb3c' })),
        (e.replace = new e('replace', { fontCharacter: '\\eb3d' })),
        (e.repoClone = new e('repo-clone', { fontCharacter: '\\eb3e' })),
        (e.repoForcePush = new e('repo-force-push', {
          fontCharacter: '\\eb3f',
        })),
        (e.repoPull = new e('repo-pull', { fontCharacter: '\\eb40' })),
        (e.repoPush = new e('repo-push', { fontCharacter: '\\eb41' })),
        (e.report = new e('report', { fontCharacter: '\\eb42' })),
        (e.requestChanges = new e('request-changes', {
          fontCharacter: '\\eb43',
        })),
        (e.rocket = new e('rocket', { fontCharacter: '\\eb44' })),
        (e.rootFolderOpened = new e('root-folder-opened', {
          fontCharacter: '\\eb45',
        })),
        (e.rootFolder = new e('root-folder', { fontCharacter: '\\eb46' })),
        (e.rss = new e('rss', { fontCharacter: '\\eb47' })),
        (e.ruby = new e('ruby', { fontCharacter: '\\eb48' })),
        (e.saveAll = new e('save-all', { fontCharacter: '\\eb49' })),
        (e.saveAs = new e('save-as', { fontCharacter: '\\eb4a' })),
        (e.save = new e('save', { fontCharacter: '\\eb4b' })),
        (e.screenFull = new e('screen-full', { fontCharacter: '\\eb4c' })),
        (e.screenNormal = new e('screen-normal', { fontCharacter: '\\eb4d' })),
        (e.searchStop = new e('search-stop', { fontCharacter: '\\eb4e' })),
        (e.server = new e('server', { fontCharacter: '\\eb50' })),
        (e.settingsGear = new e('settings-gear', { fontCharacter: '\\eb51' })),
        (e.settings = new e('settings', { fontCharacter: '\\eb52' })),
        (e.shield = new e('shield', { fontCharacter: '\\eb53' })),
        (e.smiley = new e('smiley', { fontCharacter: '\\eb54' })),
        (e.sortPrecedence = new e('sort-precedence', {
          fontCharacter: '\\eb55',
        })),
        (e.splitHorizontal = new e('split-horizontal', {
          fontCharacter: '\\eb56',
        })),
        (e.splitVertical = new e('split-vertical', {
          fontCharacter: '\\eb57',
        })),
        (e.squirrel = new e('squirrel', { fontCharacter: '\\eb58' })),
        (e.starFull = new e('star-full', { fontCharacter: '\\eb59' })),
        (e.starHalf = new e('star-half', { fontCharacter: '\\eb5a' })),
        (e.symbolClass = new e('symbol-class', { fontCharacter: '\\eb5b' })),
        (e.symbolColor = new e('symbol-color', { fontCharacter: '\\eb5c' })),
        (e.symbolCustomColor = new e('symbol-customcolor', {
          fontCharacter: '\\eb5c',
        })),
        (e.symbolConstant = new e('symbol-constant', {
          fontCharacter: '\\eb5d',
        })),
        (e.symbolEnumMember = new e('symbol-enum-member', {
          fontCharacter: '\\eb5e',
        })),
        (e.symbolField = new e('symbol-field', { fontCharacter: '\\eb5f' })),
        (e.symbolFile = new e('symbol-file', { fontCharacter: '\\eb60' })),
        (e.symbolInterface = new e('symbol-interface', {
          fontCharacter: '\\eb61',
        })),
        (e.symbolKeyword = new e('symbol-keyword', {
          fontCharacter: '\\eb62',
        })),
        (e.symbolMisc = new e('symbol-misc', { fontCharacter: '\\eb63' })),
        (e.symbolOperator = new e('symbol-operator', {
          fontCharacter: '\\eb64',
        })),
        (e.symbolProperty = new e('symbol-property', {
          fontCharacter: '\\eb65',
        })),
        (e.wrench = new e('wrench', { fontCharacter: '\\eb65' })),
        (e.wrenchSubaction = new e('wrench-subaction', {
          fontCharacter: '\\eb65',
        })),
        (e.symbolSnippet = new e('symbol-snippet', {
          fontCharacter: '\\eb66',
        })),
        (e.tasklist = new e('tasklist', { fontCharacter: '\\eb67' })),
        (e.telescope = new e('telescope', { fontCharacter: '\\eb68' })),
        (e.textSize = new e('text-size', { fontCharacter: '\\eb69' })),
        (e.threeBars = new e('three-bars', { fontCharacter: '\\eb6a' })),
        (e.thumbsdown = new e('thumbsdown', { fontCharacter: '\\eb6b' })),
        (e.thumbsup = new e('thumbsup', { fontCharacter: '\\eb6c' })),
        (e.tools = new e('tools', { fontCharacter: '\\eb6d' })),
        (e.triangleDown = new e('triangle-down', { fontCharacter: '\\eb6e' })),
        (e.triangleLeft = new e('triangle-left', { fontCharacter: '\\eb6f' })),
        (e.triangleRight = new e('triangle-right', {
          fontCharacter: '\\eb70',
        })),
        (e.triangleUp = new e('triangle-up', { fontCharacter: '\\eb71' })),
        (e.twitter = new e('twitter', { fontCharacter: '\\eb72' })),
        (e.unfold = new e('unfold', { fontCharacter: '\\eb73' })),
        (e.unlock = new e('unlock', { fontCharacter: '\\eb74' })),
        (e.unmute = new e('unmute', { fontCharacter: '\\eb75' })),
        (e.unverified = new e('unverified', { fontCharacter: '\\eb76' })),
        (e.verified = new e('verified', { fontCharacter: '\\eb77' })),
        (e.versions = new e('versions', { fontCharacter: '\\eb78' })),
        (e.vmActive = new e('vm-active', { fontCharacter: '\\eb79' })),
        (e.vmOutline = new e('vm-outline', { fontCharacter: '\\eb7a' })),
        (e.vmRunning = new e('vm-running', { fontCharacter: '\\eb7b' })),
        (e.watch = new e('watch', { fontCharacter: '\\eb7c' })),
        (e.whitespace = new e('whitespace', { fontCharacter: '\\eb7d' })),
        (e.wholeWord = new e('whole-word', { fontCharacter: '\\eb7e' })),
        (e.window = new e('window', { fontCharacter: '\\eb7f' })),
        (e.wordWrap = new e('word-wrap', { fontCharacter: '\\eb80' })),
        (e.zoomIn = new e('zoom-in', { fontCharacter: '\\eb81' })),
        (e.zoomOut = new e('zoom-out', { fontCharacter: '\\eb82' })),
        (e.listFilter = new e('list-filter', { fontCharacter: '\\eb83' })),
        (e.listFlat = new e('list-flat', { fontCharacter: '\\eb84' })),
        (e.listSelection = new e('list-selection', {
          fontCharacter: '\\eb85',
        })),
        (e.selection = new e('selection', { fontCharacter: '\\eb85' })),
        (e.listTree = new e('list-tree', { fontCharacter: '\\eb86' })),
        (e.debugBreakpointFunctionUnverified = new e(
          'debug-breakpoint-function-unverified',
          { fontCharacter: '\\eb87' }
        )),
        (e.debugBreakpointFunction = new e('debug-breakpoint-function', {
          fontCharacter: '\\eb88',
        })),
        (e.debugBreakpointFunctionDisabled = new e(
          'debug-breakpoint-function-disabled',
          { fontCharacter: '\\eb88' }
        )),
        (e.debugStackframeActive = new e('debug-stackframe-active', {
          fontCharacter: '\\eb89',
        })),
        (e.circleSmallFilled = new e('circle-small-filled', {
          fontCharacter: '\\eb8a',
        })),
        (e.debugStackframeDot = new e(
          'debug-stackframe-dot',
          e.circleSmallFilled.definition
        )),
        (e.debugStackframe = new e('debug-stackframe', {
          fontCharacter: '\\eb8b',
        })),
        (e.debugStackframeFocused = new e('debug-stackframe-focused', {
          fontCharacter: '\\eb8b',
        })),
        (e.debugBreakpointUnsupported = new e('debug-breakpoint-unsupported', {
          fontCharacter: '\\eb8c',
        })),
        (e.symbolString = new e('symbol-string', { fontCharacter: '\\eb8d' })),
        (e.debugReverseContinue = new e('debug-reverse-continue', {
          fontCharacter: '\\eb8e',
        })),
        (e.debugStepBack = new e('debug-step-back', {
          fontCharacter: '\\eb8f',
        })),
        (e.debugRestartFrame = new e('debug-restart-frame', {
          fontCharacter: '\\eb90',
        })),
        (e.callIncoming = new e('call-incoming', { fontCharacter: '\\eb92' })),
        (e.callOutgoing = new e('call-outgoing', { fontCharacter: '\\eb93' })),
        (e.menu = new e('menu', { fontCharacter: '\\eb94' })),
        (e.expandAll = new e('expand-all', { fontCharacter: '\\eb95' })),
        (e.feedback = new e('feedback', { fontCharacter: '\\eb96' })),
        (e.groupByRefType = new e('group-by-ref-type', {
          fontCharacter: '\\eb97',
        })),
        (e.ungroupByRefType = new e('ungroup-by-ref-type', {
          fontCharacter: '\\eb98',
        })),
        (e.account = new e('account', { fontCharacter: '\\eb99' })),
        (e.bellDot = new e('bell-dot', { fontCharacter: '\\eb9a' })),
        (e.debugConsole = new e('debug-console', { fontCharacter: '\\eb9b' })),
        (e.library = new e('library', { fontCharacter: '\\eb9c' })),
        (e.output = new e('output', { fontCharacter: '\\eb9d' })),
        (e.runAll = new e('run-all', { fontCharacter: '\\eb9e' })),
        (e.syncIgnored = new e('sync-ignored', { fontCharacter: '\\eb9f' })),
        (e.pinned = new e('pinned', { fontCharacter: '\\eba0' })),
        (e.githubInverted = new e('github-inverted', {
          fontCharacter: '\\eba1',
        })),
        (e.debugAlt = new e('debug-alt', { fontCharacter: '\\eb91' })),
        (e.serverProcess = new e('server-process', {
          fontCharacter: '\\eba2',
        })),
        (e.serverEnvironment = new e('server-environment', {
          fontCharacter: '\\eba3',
        })),
        (e.pass = new e('pass', { fontCharacter: '\\eba4' })),
        (e.stopCircle = new e('stop-circle', { fontCharacter: '\\eba5' })),
        (e.playCircle = new e('play-circle', { fontCharacter: '\\eba6' })),
        (e.record = new e('record', { fontCharacter: '\\eba7' })),
        (e.debugAltSmall = new e('debug-alt-small', {
          fontCharacter: '\\eba8',
        })),
        (e.vmConnect = new e('vm-connect', { fontCharacter: '\\eba9' })),
        (e.cloud = new e('cloud', { fontCharacter: '\\ebaa' })),
        (e.merge = new e('merge', { fontCharacter: '\\ebab' })),
        (e.exportIcon = new e('export', { fontCharacter: '\\ebac' })),
        (e.graphLeft = new e('graph-left', { fontCharacter: '\\ebad' })),
        (e.magnet = new e('magnet', { fontCharacter: '\\ebae' })),
        (e.notebook = new e('notebook', { fontCharacter: '\\ebaf' })),
        (e.redo = new e('redo', { fontCharacter: '\\ebb0' })),
        (e.checkAll = new e('check-all', { fontCharacter: '\\ebb1' })),
        (e.pinnedDirty = new e('pinned-dirty', { fontCharacter: '\\ebb2' })),
        (e.passFilled = new e('pass-filled', { fontCharacter: '\\ebb3' })),
        (e.circleLargeFilled = new e('circle-large-filled', {
          fontCharacter: '\\ebb4',
        })),
        (e.circleLargeOutline = new e('circle-large-outline', {
          fontCharacter: '\\ebb5',
        })),
        (e.combine = new e('combine', { fontCharacter: '\\ebb6' })),
        (e.gather = new e('gather', { fontCharacter: '\\ebb6' })),
        (e.table = new e('table', { fontCharacter: '\\ebb7' })),
        (e.variableGroup = new e('variable-group', {
          fontCharacter: '\\ebb8',
        })),
        (e.typeHierarchy = new e('type-hierarchy', {
          fontCharacter: '\\ebb9',
        })),
        (e.typeHierarchySub = new e('type-hierarchy-sub', {
          fontCharacter: '\\ebba',
        })),
        (e.typeHierarchySuper = new e('type-hierarchy-super', {
          fontCharacter: '\\ebbb',
        })),
        (e.gitPullRequestCreate = new e('git-pull-request-create', {
          fontCharacter: '\\ebbc',
        })),
        (e.runAbove = new e('run-above', { fontCharacter: '\\ebbd' })),
        (e.runBelow = new e('run-below', { fontCharacter: '\\ebbe' })),
        (e.notebookTemplate = new e('notebook-template', {
          fontCharacter: '\\ebbf',
        })),
        (e.debugRerun = new e('debug-rerun', { fontCharacter: '\\ebc0' })),
        (e.workspaceTrusted = new e('workspace-trusted', {
          fontCharacter: '\\ebc1',
        })),
        (e.workspaceUntrusted = new e('workspace-untrusted', {
          fontCharacter: '\\ebc2',
        })),
        (e.workspaceUnspecified = new e('workspace-unspecified', {
          fontCharacter: '\\ebc3',
        })),
        (e.terminalCmd = new e('terminal-cmd', { fontCharacter: '\\ebc4' })),
        (e.terminalDebian = new e('terminal-debian', {
          fontCharacter: '\\ebc5',
        })),
        (e.terminalLinux = new e('terminal-linux', {
          fontCharacter: '\\ebc6',
        })),
        (e.terminalPowershell = new e('terminal-powershell', {
          fontCharacter: '\\ebc7',
        })),
        (e.terminalTmux = new e('terminal-tmux', { fontCharacter: '\\ebc8' })),
        (e.terminalUbuntu = new e('terminal-ubuntu', {
          fontCharacter: '\\ebc9',
        })),
        (e.terminalBash = new e('terminal-bash', { fontCharacter: '\\ebca' })),
        (e.arrowSwap = new e('arrow-swap', { fontCharacter: '\\ebcb' })),
        (e.copy = new e('copy', { fontCharacter: '\\ebcc' })),
        (e.personAdd = new e('person-add', { fontCharacter: '\\ebcd' })),
        (e.filterFilled = new e('filter-filled', { fontCharacter: '\\ebce' })),
        (e.wand = new e('wand', { fontCharacter: '\\ebcf' })),
        (e.debugLineByLine = new e('debug-line-by-line', {
          fontCharacter: '\\ebd0',
        })),
        (e.inspect = new e('inspect', { fontCharacter: '\\ebd1' })),
        (e.layers = new e('layers', { fontCharacter: '\\ebd2' })),
        (e.layersDot = new e('layers-dot', { fontCharacter: '\\ebd3' })),
        (e.layersActive = new e('layers-active', { fontCharacter: '\\ebd4' })),
        (e.compass = new e('compass', { fontCharacter: '\\ebd5' })),
        (e.compassDot = new e('compass-dot', { fontCharacter: '\\ebd6' })),
        (e.compassActive = new e('compass-active', {
          fontCharacter: '\\ebd7',
        })),
        (e.azure = new e('azure', { fontCharacter: '\\ebd8' })),
        (e.issueDraft = new e('issue-draft', { fontCharacter: '\\ebd9' })),
        (e.gitPullRequestClosed = new e('git-pull-request-closed', {
          fontCharacter: '\\ebda',
        })),
        (e.gitPullRequestDraft = new e('git-pull-request-draft', {
          fontCharacter: '\\ebdb',
        })),
        (e.debugAll = new e('debug-all', { fontCharacter: '\\ebdc' })),
        (e.debugCoverage = new e('debug-coverage', {
          fontCharacter: '\\ebdd',
        })),
        (e.runErrors = new e('run-errors', { fontCharacter: '\\ebde' })),
        (e.folderLibrary = new e('folder-library', {
          fontCharacter: '\\ebdf',
        })),
        (e.debugContinueSmall = new e('debug-continue-small', {
          fontCharacter: '\\ebe0',
        })),
        (e.beakerStop = new e('beaker-stop', { fontCharacter: '\\ebe1' })),
        (e.graphLine = new e('graph-line', { fontCharacter: '\\ebe2' })),
        (e.graphScatter = new e('graph-scatter', { fontCharacter: '\\ebe3' })),
        (e.pieChart = new e('pie-chart', { fontCharacter: '\\ebe4' })),
        (e.bracket = new e('bracket', e.json.definition)),
        (e.bracketDot = new e('bracket-dot', { fontCharacter: '\\ebe5' })),
        (e.bracketError = new e('bracket-error', { fontCharacter: '\\ebe6' })),
        (e.lockSmall = new e('lock-small', { fontCharacter: '\\ebe7' })),
        (e.azureDevops = new e('azure-devops', { fontCharacter: '\\ebe8' })),
        (e.verifiedFilled = new e('verified-filled', {
          fontCharacter: '\\ebe9',
        })),
        (e.newLine = new e('newline', { fontCharacter: '\\ebea' })),
        (e.layout = new e('layout', { fontCharacter: '\\ebeb' })),
        (e.layoutActivitybarLeft = new e('layout-activitybar-left', {
          fontCharacter: '\\ebec',
        })),
        (e.layoutActivitybarRight = new e('layout-activitybar-right', {
          fontCharacter: '\\ebed',
        })),
        (e.layoutPanelLeft = new e('layout-panel-left', {
          fontCharacter: '\\ebee',
        })),
        (e.layoutPanelCenter = new e('layout-panel-center', {
          fontCharacter: '\\ebef',
        })),
        (e.layoutPanelJustify = new e('layout-panel-justify', {
          fontCharacter: '\\ebf0',
        })),
        (e.layoutPanelRight = new e('layout-panel-right', {
          fontCharacter: '\\ebf1',
        })),
        (e.layoutPanel = new e('layout-panel', { fontCharacter: '\\ebf2' })),
        (e.layoutSidebarLeft = new e('layout-sidebar-left', {
          fontCharacter: '\\ebf3',
        })),
        (e.layoutSidebarRight = new e('layout-sidebar-right', {
          fontCharacter: '\\ebf4',
        })),
        (e.layoutStatusbar = new e('layout-statusbar', {
          fontCharacter: '\\ebf5',
        })),
        (e.layoutMenubar = new e('layout-menubar', {
          fontCharacter: '\\ebf6',
        })),
        (e.layoutCentered = new e('layout-centered', {
          fontCharacter: '\\ebf7',
        })),
        (e.layoutSidebarRightOff = new e('layout-sidebar-right-off', {
          fontCharacter: '\\ec00',
        })),
        (e.layoutPanelOff = new e('layout-panel-off', {
          fontCharacter: '\\ec01',
        })),
        (e.layoutSidebarLeftOff = new e('layout-sidebar-left-off', {
          fontCharacter: '\\ec02',
        })),
        (e.target = new e('target', { fontCharacter: '\\ebf8' })),
        (e.indent = new e('indent', { fontCharacter: '\\ebf9' })),
        (e.recordSmall = new e('record-small', { fontCharacter: '\\ebfa' })),
        (e.errorSmall = new e('error-small', { fontCharacter: '\\ebfb' })),
        (e.arrowCircleDown = new e('arrow-circle-down', {
          fontCharacter: '\\ebfc',
        })),
        (e.arrowCircleLeft = new e('arrow-circle-left', {
          fontCharacter: '\\ebfd',
        })),
        (e.arrowCircleRight = new e('arrow-circle-right', {
          fontCharacter: '\\ebfe',
        })),
        (e.arrowCircleUp = new e('arrow-circle-up', {
          fontCharacter: '\\ebff',
        })),
        (e.heartFilled = new e('heart-filled', { fontCharacter: '\\ec04' })),
        (e.map = new e('map', { fontCharacter: '\\ec05' })),
        (e.mapFilled = new e('map-filled', { fontCharacter: '\\ec06' })),
        (e.circleSmall = new e('circle-small', { fontCharacter: '\\ec07' })),
        (e.bellSlash = new e('bell-slash', { fontCharacter: '\\ec08' })),
        (e.bellSlashDot = new e('bell-slash-dot', { fontCharacter: '\\ec09' })),
        (e.commentUnresolved = new e('comment-unresolved', {
          fontCharacter: '\\ec0a',
        })),
        (e.gitPullRequestGoToChanges = new e('git-pull-request-go-to-changes', {
          fontCharacter: '\\ec0b',
        })),
        (e.gitPullRequestNewChanges = new e('git-pull-request-new-changes', {
          fontCharacter: '\\ec0c',
        })),
        (e.dialogError = new e('dialog-error', e.error.definition)),
        (e.dialogWarning = new e('dialog-warning', e.warning.definition)),
        (e.dialogInfo = new e('dialog-info', e.info.definition)),
        (e.dialogClose = new e('dialog-close', e.close.definition)),
        (e.treeItemExpanded = new e(
          'tree-item-expanded',
          e.chevronDown.definition
        )),
        (e.treeFilterOnTypeOn = new e(
          'tree-filter-on-type-on',
          e.listFilter.definition
        )),
        (e.treeFilterOnTypeOff = new e(
          'tree-filter-on-type-off',
          e.listSelection.definition
        )),
        (e.treeFilterClear = new e('tree-filter-clear', e.close.definition)),
        (e.treeItemLoading = new e('tree-item-loading', e.loading.definition)),
        (e.menuSelection = new e('menu-selection', e.check.definition)),
        (e.menuSubmenu = new e('menu-submenu', e.chevronRight.definition)),
        (e.menuBarMore = new e('menubar-more', e.more.definition)),
        (e.scrollbarButtonLeft = new e(
          'scrollbar-button-left',
          e.triangleLeft.definition
        )),
        (e.scrollbarButtonRight = new e(
          'scrollbar-button-right',
          e.triangleRight.definition
        )),
        (e.scrollbarButtonUp = new e(
          'scrollbar-button-up',
          e.triangleUp.definition
        )),
        (e.scrollbarButtonDown = new e(
          'scrollbar-button-down',
          e.triangleDown.definition
        )),
        (e.toolBarMore = new e('toolbar-more', e.more.definition)),
        (e.quickInputBack = new e('quick-input-back', e.arrowLeft.definition))
      var A
      ;(function (l) {
        ;(l.iconNameSegment = '[A-Za-z0-9]+'),
          (l.iconNameExpression = '[A-Za-z0-9-]+'),
          (l.iconModifierExpression = '~[A-Za-z]+'),
          (l.iconNameCharacter = '[A-Za-z0-9~-]')
        const y = new RegExp(
          `^(${l.iconNameExpression})(${l.iconModifierExpression})?$`
        )
        function C(v) {
          if (v instanceof e) return ['codicon', 'codicon-' + v.id]
          const t = y.exec(v.id)
          if (!t) return C(e.error)
          const [, g, m] = t,
            p = ['codicon', 'codicon-' + g]
          return m && p.push('codicon-modifier-' + m.substr(1)), p
        }
        l.asClassNameArray = C
        function c(v) {
          return C(v).join(' ')
        }
        l.asClassName = c
        function h(v) {
          return '.' + C(v).join('.')
        }
        l.asCSSSelector = h
      })((A = r.CSSIcon || (r.CSSIcon = {})))
    }),
    Y(X[22], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.DiffChange = void 0)
      class N {
        constructor(A, l, y, C) {
          ;(this.originalStart = A),
            (this.originalLength = l),
            (this.modifiedStart = y),
            (this.modifiedLength = C)
        }
        getOriginalEnd() {
          return this.originalStart + this.originalLength
        }
        getModifiedEnd() {
          return this.modifiedStart + this.modifiedLength
        }
      }
      r.DiffChange = N
    }),
    Y(X[10], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.BugIndicatingError =
          r.ErrorNoTelemetry =
          r.NotSupportedError =
          r.illegalState =
          r.illegalArgument =
          r.canceled =
          r.CancellationError =
          r.isCancellationError =
          r.transformErrorForSerialization =
          r.onUnexpectedExternalError =
          r.onUnexpectedError =
          r.errorHandler =
          r.ErrorHandler =
            void 0)
      class N {
        constructor() {
          ;(this.listeners = []),
            (this.unexpectedErrorHandler = function (w) {
              setTimeout(() => {
                throw w.stack
                  ? m.isErrorNoTelemetry(w)
                    ? new m(
                        w.message +
                          `

` +
                          w.stack
                      )
                    : new Error(
                        w.message +
                          `

` +
                          w.stack
                      )
                  : w
              }, 0)
            })
        }
        emit(w) {
          this.listeners.forEach((S) => {
            S(w)
          })
        }
        onUnexpectedError(w) {
          this.unexpectedErrorHandler(w), this.emit(w)
        }
        onUnexpectedExternalError(w) {
          this.unexpectedErrorHandler(w)
        }
      }
      ;(r.ErrorHandler = N), (r.errorHandler = new N())
      function e(L) {
        C(L) || r.errorHandler.onUnexpectedError(L)
      }
      r.onUnexpectedError = e
      function A(L) {
        C(L) || r.errorHandler.onUnexpectedExternalError(L)
      }
      r.onUnexpectedExternalError = A
      function l(L) {
        if (L instanceof Error) {
          const { name: w, message: S } = L,
            b = L.stacktrace || L.stack
          return {
            $isError: !0,
            name: w,
            message: S,
            stack: b,
            noTelemetry: m.isErrorNoTelemetry(L),
          }
        }
        return L
      }
      r.transformErrorForSerialization = l
      const y = 'Canceled'
      function C(L) {
        return L instanceof c
          ? !0
          : L instanceof Error && L.name === y && L.message === y
      }
      r.isCancellationError = C
      class c extends Error {
        constructor() {
          super(y)
          this.name = this.message
        }
      }
      r.CancellationError = c
      function h() {
        const L = new Error(y)
        return (L.name = L.message), L
      }
      r.canceled = h
      function v(L) {
        return L
          ? new Error(`Illegal argument: ${L}`)
          : new Error('Illegal argument')
      }
      r.illegalArgument = v
      function t(L) {
        return L ? new Error(`Illegal state: ${L}`) : new Error('Illegal state')
      }
      r.illegalState = t
      class g extends Error {
        constructor(w) {
          super('NotSupported')
          w && (this.message = w)
        }
      }
      r.NotSupportedError = g
      class m extends Error {
        constructor(w) {
          super(w)
          this.name = 'ErrorNoTelemetry'
        }
        static fromError(w) {
          if (w instanceof m) return w
          const S = new m()
          return (S.message = w.message), (S.stack = w.stack), S
        }
        static isErrorNoTelemetry(w) {
          return w.name === 'ErrorNoTelemetry'
        }
      }
      r.ErrorNoTelemetry = m
      class p extends Error {
        constructor(w) {
          super(w || 'An unexpected bug occurred.')
          Object.setPrototypeOf(this, p.prototype)
          debugger
        }
      }
      r.BugIndicatingError = p
    }),
    Y(X[23], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }), (r.once = void 0)
      function N(e) {
        const A = this
        let l = !1,
          y
        return function () {
          return l || ((l = !0), (y = e.apply(A, arguments))), y
        }
      }
      r.once = N
    }),
    Y(X[11], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.Iterable = void 0)
      var N
      ;(function (e) {
        function A(o) {
          return (
            o && typeof o == 'object' && typeof o[Symbol.iterator] == 'function'
          )
        }
        e.is = A
        const l = Object.freeze([])
        function y() {
          return l
        }
        e.empty = y
        function* C(o) {
          yield o
        }
        e.single = C
        function c(o) {
          return o || l
        }
        e.from = c
        function h(o) {
          return !o || o[Symbol.iterator]().next().done === !0
        }
        e.isEmpty = h
        function v(o) {
          return o[Symbol.iterator]().next().value
        }
        e.first = v
        function t(o, i) {
          for (const u of o) if (i(u)) return !0
          return !1
        }
        e.some = t
        function g(o, i) {
          for (const u of o) if (i(u)) return u
        }
        e.find = g
        function* m(o, i) {
          for (const u of o) i(u) && (yield u)
        }
        e.filter = m
        function* p(o, i) {
          let u = 0
          for (const _ of o) yield i(_, u++)
        }
        e.map = p
        function* L(...o) {
          for (const i of o) for (const u of i) yield u
        }
        e.concat = L
        function* w(o) {
          for (const i of o) for (const u of i) yield u
        }
        e.concatNested = w
        function S(o, i, u) {
          let _ = u
          for (const E of o) _ = i(_, E)
          return _
        }
        e.reduce = S
        function b(o, i) {
          let u = 0
          for (const _ of o) i(_, u++)
        }
        e.forEach = b
        function* s(o, i, u = o.length) {
          for (
            i < 0 && (i += o.length),
              u < 0 ? (u += o.length) : u > o.length && (u = o.length);
            i < u;
            i++
          )
            yield o[i]
        }
        e.slice = s
        function a(o, i = Number.POSITIVE_INFINITY) {
          const u = []
          if (i === 0) return [u, o]
          const _ = o[Symbol.iterator]()
          for (let E = 0; E < i; E++) {
            const M = _.next()
            if (M.done) return [u, e.empty()]
            u.push(M.value)
          }
          return [
            u,
            {
              [Symbol.iterator]() {
                return _
              },
            },
          ]
        }
        e.consume = a
        function f(o) {
          return a(o)[0]
        }
        e.collect = f
        function d(o, i, u = (_, E) => _ === E) {
          const _ = o[Symbol.iterator](),
            E = i[Symbol.iterator]()
          for (;;) {
            const M = _.next(),
              D = E.next()
            if (M.done !== D.done) return !1
            if (M.done) return !0
            if (!u(M.value, D.value)) return !1
          }
        }
        e.equals = d
      })((N = r.Iterable || (r.Iterable = {})))
    }),
    Y(X[24], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.KeyChord =
          r.KeyCodeUtils =
          r.IMMUTABLE_KEY_CODE_TO_CODE =
          r.IMMUTABLE_CODE_TO_KEY_CODE =
          r.NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE =
          r.EVENT_KEY_CODE_MAP =
            void 0)
      class N {
        constructor() {
          ;(this._keyCodeToStr = []), (this._strToKeyCode = Object.create(null))
        }
        define(g, m) {
          ;(this._keyCodeToStr[g] = m),
            (this._strToKeyCode[m.toLowerCase()] = g)
        }
        keyCodeToStr(g) {
          return this._keyCodeToStr[g]
        }
        strToKeyCode(g) {
          return this._strToKeyCode[g.toLowerCase()] || 0
        }
      }
      const e = new N(),
        A = new N(),
        l = new N()
      ;(r.EVENT_KEY_CODE_MAP = new Array(230)),
        (r.NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE = {})
      const y = [],
        C = Object.create(null),
        c = Object.create(null)
      ;(r.IMMUTABLE_CODE_TO_KEY_CODE = []), (r.IMMUTABLE_KEY_CODE_TO_CODE = [])
      for (let t = 0; t <= 193; t++) r.IMMUTABLE_CODE_TO_KEY_CODE[t] = -1
      for (let t = 0; t <= 127; t++) r.IMMUTABLE_KEY_CODE_TO_CODE[t] = -1
      ;(function () {
        const t = '',
          g = [
            [0, 1, 0, 'None', 0, 'unknown', 0, 'VK_UNKNOWN', t, t],
            [0, 1, 1, 'Hyper', 0, t, 0, t, t, t],
            [0, 1, 2, 'Super', 0, t, 0, t, t, t],
            [0, 1, 3, 'Fn', 0, t, 0, t, t, t],
            [0, 1, 4, 'FnLock', 0, t, 0, t, t, t],
            [0, 1, 5, 'Suspend', 0, t, 0, t, t, t],
            [0, 1, 6, 'Resume', 0, t, 0, t, t, t],
            [0, 1, 7, 'Turbo', 0, t, 0, t, t, t],
            [0, 1, 8, 'Sleep', 0, t, 0, 'VK_SLEEP', t, t],
            [0, 1, 9, 'WakeUp', 0, t, 0, t, t, t],
            [31, 0, 10, 'KeyA', 31, 'A', 65, 'VK_A', t, t],
            [32, 0, 11, 'KeyB', 32, 'B', 66, 'VK_B', t, t],
            [33, 0, 12, 'KeyC', 33, 'C', 67, 'VK_C', t, t],
            [34, 0, 13, 'KeyD', 34, 'D', 68, 'VK_D', t, t],
            [35, 0, 14, 'KeyE', 35, 'E', 69, 'VK_E', t, t],
            [36, 0, 15, 'KeyF', 36, 'F', 70, 'VK_F', t, t],
            [37, 0, 16, 'KeyG', 37, 'G', 71, 'VK_G', t, t],
            [38, 0, 17, 'KeyH', 38, 'H', 72, 'VK_H', t, t],
            [39, 0, 18, 'KeyI', 39, 'I', 73, 'VK_I', t, t],
            [40, 0, 19, 'KeyJ', 40, 'J', 74, 'VK_J', t, t],
            [41, 0, 20, 'KeyK', 41, 'K', 75, 'VK_K', t, t],
            [42, 0, 21, 'KeyL', 42, 'L', 76, 'VK_L', t, t],
            [43, 0, 22, 'KeyM', 43, 'M', 77, 'VK_M', t, t],
            [44, 0, 23, 'KeyN', 44, 'N', 78, 'VK_N', t, t],
            [45, 0, 24, 'KeyO', 45, 'O', 79, 'VK_O', t, t],
            [46, 0, 25, 'KeyP', 46, 'P', 80, 'VK_P', t, t],
            [47, 0, 26, 'KeyQ', 47, 'Q', 81, 'VK_Q', t, t],
            [48, 0, 27, 'KeyR', 48, 'R', 82, 'VK_R', t, t],
            [49, 0, 28, 'KeyS', 49, 'S', 83, 'VK_S', t, t],
            [50, 0, 29, 'KeyT', 50, 'T', 84, 'VK_T', t, t],
            [51, 0, 30, 'KeyU', 51, 'U', 85, 'VK_U', t, t],
            [52, 0, 31, 'KeyV', 52, 'V', 86, 'VK_V', t, t],
            [53, 0, 32, 'KeyW', 53, 'W', 87, 'VK_W', t, t],
            [54, 0, 33, 'KeyX', 54, 'X', 88, 'VK_X', t, t],
            [55, 0, 34, 'KeyY', 55, 'Y', 89, 'VK_Y', t, t],
            [56, 0, 35, 'KeyZ', 56, 'Z', 90, 'VK_Z', t, t],
            [22, 0, 36, 'Digit1', 22, '1', 49, 'VK_1', t, t],
            [23, 0, 37, 'Digit2', 23, '2', 50, 'VK_2', t, t],
            [24, 0, 38, 'Digit3', 24, '3', 51, 'VK_3', t, t],
            [25, 0, 39, 'Digit4', 25, '4', 52, 'VK_4', t, t],
            [26, 0, 40, 'Digit5', 26, '5', 53, 'VK_5', t, t],
            [27, 0, 41, 'Digit6', 27, '6', 54, 'VK_6', t, t],
            [28, 0, 42, 'Digit7', 28, '7', 55, 'VK_7', t, t],
            [29, 0, 43, 'Digit8', 29, '8', 56, 'VK_8', t, t],
            [30, 0, 44, 'Digit9', 30, '9', 57, 'VK_9', t, t],
            [21, 0, 45, 'Digit0', 21, '0', 48, 'VK_0', t, t],
            [3, 1, 46, 'Enter', 3, 'Enter', 13, 'VK_RETURN', t, t],
            [9, 1, 47, 'Escape', 9, 'Escape', 27, 'VK_ESCAPE', t, t],
            [1, 1, 48, 'Backspace', 1, 'Backspace', 8, 'VK_BACK', t, t],
            [2, 1, 49, 'Tab', 2, 'Tab', 9, 'VK_TAB', t, t],
            [10, 1, 50, 'Space', 10, 'Space', 32, 'VK_SPACE', t, t],
            [
              83,
              0,
              51,
              'Minus',
              83,
              '-',
              189,
              'VK_OEM_MINUS',
              '-',
              'OEM_MINUS',
            ],
            [81, 0, 52, 'Equal', 81, '=', 187, 'VK_OEM_PLUS', '=', 'OEM_PLUS'],
            [87, 0, 53, 'BracketLeft', 87, '[', 219, 'VK_OEM_4', '[', 'OEM_4'],
            [89, 0, 54, 'BracketRight', 89, ']', 221, 'VK_OEM_6', ']', 'OEM_6'],
            [88, 0, 55, 'Backslash', 88, '\\', 220, 'VK_OEM_5', '\\', 'OEM_5'],
            [0, 0, 56, 'IntlHash', 0, t, 0, t, t, t],
            [80, 0, 57, 'Semicolon', 80, ';', 186, 'VK_OEM_1', ';', 'OEM_1'],
            [90, 0, 58, 'Quote', 90, "'", 222, 'VK_OEM_7', "'", 'OEM_7'],
            [86, 0, 59, 'Backquote', 86, '`', 192, 'VK_OEM_3', '`', 'OEM_3'],
            [
              82,
              0,
              60,
              'Comma',
              82,
              ',',
              188,
              'VK_OEM_COMMA',
              ',',
              'OEM_COMMA',
            ],
            [
              84,
              0,
              61,
              'Period',
              84,
              '.',
              190,
              'VK_OEM_PERIOD',
              '.',
              'OEM_PERIOD',
            ],
            [85, 0, 62, 'Slash', 85, '/', 191, 'VK_OEM_2', '/', 'OEM_2'],
            [8, 1, 63, 'CapsLock', 8, 'CapsLock', 20, 'VK_CAPITAL', t, t],
            [59, 1, 64, 'F1', 59, 'F1', 112, 'VK_F1', t, t],
            [60, 1, 65, 'F2', 60, 'F2', 113, 'VK_F2', t, t],
            [61, 1, 66, 'F3', 61, 'F3', 114, 'VK_F3', t, t],
            [62, 1, 67, 'F4', 62, 'F4', 115, 'VK_F4', t, t],
            [63, 1, 68, 'F5', 63, 'F5', 116, 'VK_F5', t, t],
            [64, 1, 69, 'F6', 64, 'F6', 117, 'VK_F6', t, t],
            [65, 1, 70, 'F7', 65, 'F7', 118, 'VK_F7', t, t],
            [66, 1, 71, 'F8', 66, 'F8', 119, 'VK_F8', t, t],
            [67, 1, 72, 'F9', 67, 'F9', 120, 'VK_F9', t, t],
            [68, 1, 73, 'F10', 68, 'F10', 121, 'VK_F10', t, t],
            [69, 1, 74, 'F11', 69, 'F11', 122, 'VK_F11', t, t],
            [70, 1, 75, 'F12', 70, 'F12', 123, 'VK_F12', t, t],
            [0, 1, 76, 'PrintScreen', 0, t, 0, t, t, t],
            [79, 1, 77, 'ScrollLock', 79, 'ScrollLock', 145, 'VK_SCROLL', t, t],
            [7, 1, 78, 'Pause', 7, 'PauseBreak', 19, 'VK_PAUSE', t, t],
            [19, 1, 79, 'Insert', 19, 'Insert', 45, 'VK_INSERT', t, t],
            [14, 1, 80, 'Home', 14, 'Home', 36, 'VK_HOME', t, t],
            [11, 1, 81, 'PageUp', 11, 'PageUp', 33, 'VK_PRIOR', t, t],
            [20, 1, 82, 'Delete', 20, 'Delete', 46, 'VK_DELETE', t, t],
            [13, 1, 83, 'End', 13, 'End', 35, 'VK_END', t, t],
            [12, 1, 84, 'PageDown', 12, 'PageDown', 34, 'VK_NEXT', t, t],
            [
              17,
              1,
              85,
              'ArrowRight',
              17,
              'RightArrow',
              39,
              'VK_RIGHT',
              'Right',
              t,
            ],
            [15, 1, 86, 'ArrowLeft', 15, 'LeftArrow', 37, 'VK_LEFT', 'Left', t],
            [18, 1, 87, 'ArrowDown', 18, 'DownArrow', 40, 'VK_DOWN', 'Down', t],
            [16, 1, 88, 'ArrowUp', 16, 'UpArrow', 38, 'VK_UP', 'Up', t],
            [78, 1, 89, 'NumLock', 78, 'NumLock', 144, 'VK_NUMLOCK', t, t],
            [
              108,
              1,
              90,
              'NumpadDivide',
              108,
              'NumPad_Divide',
              111,
              'VK_DIVIDE',
              t,
              t,
            ],
            [
              103,
              1,
              91,
              'NumpadMultiply',
              103,
              'NumPad_Multiply',
              106,
              'VK_MULTIPLY',
              t,
              t,
            ],
            [
              106,
              1,
              92,
              'NumpadSubtract',
              106,
              'NumPad_Subtract',
              109,
              'VK_SUBTRACT',
              t,
              t,
            ],
            [104, 1, 93, 'NumpadAdd', 104, 'NumPad_Add', 107, 'VK_ADD', t, t],
            [3, 1, 94, 'NumpadEnter', 3, t, 0, t, t, t],
            [94, 1, 95, 'Numpad1', 94, 'NumPad1', 97, 'VK_NUMPAD1', t, t],
            [95, 1, 96, 'Numpad2', 95, 'NumPad2', 98, 'VK_NUMPAD2', t, t],
            [96, 1, 97, 'Numpad3', 96, 'NumPad3', 99, 'VK_NUMPAD3', t, t],
            [97, 1, 98, 'Numpad4', 97, 'NumPad4', 100, 'VK_NUMPAD4', t, t],
            [98, 1, 99, 'Numpad5', 98, 'NumPad5', 101, 'VK_NUMPAD5', t, t],
            [99, 1, 100, 'Numpad6', 99, 'NumPad6', 102, 'VK_NUMPAD6', t, t],
            [100, 1, 101, 'Numpad7', 100, 'NumPad7', 103, 'VK_NUMPAD7', t, t],
            [101, 1, 102, 'Numpad8', 101, 'NumPad8', 104, 'VK_NUMPAD8', t, t],
            [102, 1, 103, 'Numpad9', 102, 'NumPad9', 105, 'VK_NUMPAD9', t, t],
            [93, 1, 104, 'Numpad0', 93, 'NumPad0', 96, 'VK_NUMPAD0', t, t],
            [
              107,
              1,
              105,
              'NumpadDecimal',
              107,
              'NumPad_Decimal',
              110,
              'VK_DECIMAL',
              t,
              t,
            ],
            [
              92,
              0,
              106,
              'IntlBackslash',
              92,
              'OEM_102',
              226,
              'VK_OEM_102',
              t,
              t,
            ],
            [58, 1, 107, 'ContextMenu', 58, 'ContextMenu', 93, t, t, t],
            [0, 1, 108, 'Power', 0, t, 0, t, t, t],
            [0, 1, 109, 'NumpadEqual', 0, t, 0, t, t, t],
            [71, 1, 110, 'F13', 71, 'F13', 124, 'VK_F13', t, t],
            [72, 1, 111, 'F14', 72, 'F14', 125, 'VK_F14', t, t],
            [73, 1, 112, 'F15', 73, 'F15', 126, 'VK_F15', t, t],
            [74, 1, 113, 'F16', 74, 'F16', 127, 'VK_F16', t, t],
            [75, 1, 114, 'F17', 75, 'F17', 128, 'VK_F17', t, t],
            [76, 1, 115, 'F18', 76, 'F18', 129, 'VK_F18', t, t],
            [77, 1, 116, 'F19', 77, 'F19', 130, 'VK_F19', t, t],
            [0, 1, 117, 'F20', 0, t, 0, 'VK_F20', t, t],
            [0, 1, 118, 'F21', 0, t, 0, 'VK_F21', t, t],
            [0, 1, 119, 'F22', 0, t, 0, 'VK_F22', t, t],
            [0, 1, 120, 'F23', 0, t, 0, 'VK_F23', t, t],
            [0, 1, 121, 'F24', 0, t, 0, 'VK_F24', t, t],
            [0, 1, 122, 'Open', 0, t, 0, t, t, t],
            [0, 1, 123, 'Help', 0, t, 0, t, t, t],
            [0, 1, 124, 'Select', 0, t, 0, t, t, t],
            [0, 1, 125, 'Again', 0, t, 0, t, t, t],
            [0, 1, 126, 'Undo', 0, t, 0, t, t, t],
            [0, 1, 127, 'Cut', 0, t, 0, t, t, t],
            [0, 1, 128, 'Copy', 0, t, 0, t, t, t],
            [0, 1, 129, 'Paste', 0, t, 0, t, t, t],
            [0, 1, 130, 'Find', 0, t, 0, t, t, t],
            [
              0,
              1,
              131,
              'AudioVolumeMute',
              112,
              'AudioVolumeMute',
              173,
              'VK_VOLUME_MUTE',
              t,
              t,
            ],
            [
              0,
              1,
              132,
              'AudioVolumeUp',
              113,
              'AudioVolumeUp',
              175,
              'VK_VOLUME_UP',
              t,
              t,
            ],
            [
              0,
              1,
              133,
              'AudioVolumeDown',
              114,
              'AudioVolumeDown',
              174,
              'VK_VOLUME_DOWN',
              t,
              t,
            ],
            [
              105,
              1,
              134,
              'NumpadComma',
              105,
              'NumPad_Separator',
              108,
              'VK_SEPARATOR',
              t,
              t,
            ],
            [110, 0, 135, 'IntlRo', 110, 'ABNT_C1', 193, 'VK_ABNT_C1', t, t],
            [0, 1, 136, 'KanaMode', 0, t, 0, t, t, t],
            [0, 0, 137, 'IntlYen', 0, t, 0, t, t, t],
            [0, 1, 138, 'Convert', 0, t, 0, t, t, t],
            [0, 1, 139, 'NonConvert', 0, t, 0, t, t, t],
            [0, 1, 140, 'Lang1', 0, t, 0, t, t, t],
            [0, 1, 141, 'Lang2', 0, t, 0, t, t, t],
            [0, 1, 142, 'Lang3', 0, t, 0, t, t, t],
            [0, 1, 143, 'Lang4', 0, t, 0, t, t, t],
            [0, 1, 144, 'Lang5', 0, t, 0, t, t, t],
            [0, 1, 145, 'Abort', 0, t, 0, t, t, t],
            [0, 1, 146, 'Props', 0, t, 0, t, t, t],
            [0, 1, 147, 'NumpadParenLeft', 0, t, 0, t, t, t],
            [0, 1, 148, 'NumpadParenRight', 0, t, 0, t, t, t],
            [0, 1, 149, 'NumpadBackspace', 0, t, 0, t, t, t],
            [0, 1, 150, 'NumpadMemoryStore', 0, t, 0, t, t, t],
            [0, 1, 151, 'NumpadMemoryRecall', 0, t, 0, t, t, t],
            [0, 1, 152, 'NumpadMemoryClear', 0, t, 0, t, t, t],
            [0, 1, 153, 'NumpadMemoryAdd', 0, t, 0, t, t, t],
            [0, 1, 154, 'NumpadMemorySubtract', 0, t, 0, t, t, t],
            [0, 1, 155, 'NumpadClear', 126, 'Clear', 12, 'VK_CLEAR', t, t],
            [0, 1, 156, 'NumpadClearEntry', 0, t, 0, t, t, t],
            [5, 1, 0, t, 5, 'Ctrl', 17, 'VK_CONTROL', t, t],
            [4, 1, 0, t, 4, 'Shift', 16, 'VK_SHIFT', t, t],
            [6, 1, 0, t, 6, 'Alt', 18, 'VK_MENU', t, t],
            [57, 1, 0, t, 57, 'Meta', 0, 'VK_COMMAND', t, t],
            [5, 1, 157, 'ControlLeft', 5, t, 0, 'VK_LCONTROL', t, t],
            [4, 1, 158, 'ShiftLeft', 4, t, 0, 'VK_LSHIFT', t, t],
            [6, 1, 159, 'AltLeft', 6, t, 0, 'VK_LMENU', t, t],
            [57, 1, 160, 'MetaLeft', 57, t, 0, 'VK_LWIN', t, t],
            [5, 1, 161, 'ControlRight', 5, t, 0, 'VK_RCONTROL', t, t],
            [4, 1, 162, 'ShiftRight', 4, t, 0, 'VK_RSHIFT', t, t],
            [6, 1, 163, 'AltRight', 6, t, 0, 'VK_RMENU', t, t],
            [57, 1, 164, 'MetaRight', 57, t, 0, 'VK_RWIN', t, t],
            [0, 1, 165, 'BrightnessUp', 0, t, 0, t, t, t],
            [0, 1, 166, 'BrightnessDown', 0, t, 0, t, t, t],
            [0, 1, 167, 'MediaPlay', 0, t, 0, t, t, t],
            [0, 1, 168, 'MediaRecord', 0, t, 0, t, t, t],
            [0, 1, 169, 'MediaFastForward', 0, t, 0, t, t, t],
            [0, 1, 170, 'MediaRewind', 0, t, 0, t, t, t],
            [
              114,
              1,
              171,
              'MediaTrackNext',
              119,
              'MediaTrackNext',
              176,
              'VK_MEDIA_NEXT_TRACK',
              t,
              t,
            ],
            [
              115,
              1,
              172,
              'MediaTrackPrevious',
              120,
              'MediaTrackPrevious',
              177,
              'VK_MEDIA_PREV_TRACK',
              t,
              t,
            ],
            [
              116,
              1,
              173,
              'MediaStop',
              121,
              'MediaStop',
              178,
              'VK_MEDIA_STOP',
              t,
              t,
            ],
            [0, 1, 174, 'Eject', 0, t, 0, t, t, t],
            [
              117,
              1,
              175,
              'MediaPlayPause',
              122,
              'MediaPlayPause',
              179,
              'VK_MEDIA_PLAY_PAUSE',
              t,
              t,
            ],
            [
              0,
              1,
              176,
              'MediaSelect',
              123,
              'LaunchMediaPlayer',
              181,
              'VK_MEDIA_LAUNCH_MEDIA_SELECT',
              t,
              t,
            ],
            [
              0,
              1,
              177,
              'LaunchMail',
              124,
              'LaunchMail',
              180,
              'VK_MEDIA_LAUNCH_MAIL',
              t,
              t,
            ],
            [
              0,
              1,
              178,
              'LaunchApp2',
              125,
              'LaunchApp2',
              183,
              'VK_MEDIA_LAUNCH_APP2',
              t,
              t,
            ],
            [0, 1, 179, 'LaunchApp1', 0, t, 0, 'VK_MEDIA_LAUNCH_APP1', t, t],
            [0, 1, 180, 'SelectTask', 0, t, 0, t, t, t],
            [0, 1, 181, 'LaunchScreenSaver', 0, t, 0, t, t, t],
            [
              0,
              1,
              182,
              'BrowserSearch',
              115,
              'BrowserSearch',
              170,
              'VK_BROWSER_SEARCH',
              t,
              t,
            ],
            [
              0,
              1,
              183,
              'BrowserHome',
              116,
              'BrowserHome',
              172,
              'VK_BROWSER_HOME',
              t,
              t,
            ],
            [
              112,
              1,
              184,
              'BrowserBack',
              117,
              'BrowserBack',
              166,
              'VK_BROWSER_BACK',
              t,
              t,
            ],
            [
              113,
              1,
              185,
              'BrowserForward',
              118,
              'BrowserForward',
              167,
              'VK_BROWSER_FORWARD',
              t,
              t,
            ],
            [0, 1, 186, 'BrowserStop', 0, t, 0, 'VK_BROWSER_STOP', t, t],
            [0, 1, 187, 'BrowserRefresh', 0, t, 0, 'VK_BROWSER_REFRESH', t, t],
            [
              0,
              1,
              188,
              'BrowserFavorites',
              0,
              t,
              0,
              'VK_BROWSER_FAVORITES',
              t,
              t,
            ],
            [0, 1, 189, 'ZoomToggle', 0, t, 0, t, t, t],
            [0, 1, 190, 'MailReply', 0, t, 0, t, t, t],
            [0, 1, 191, 'MailForward', 0, t, 0, t, t, t],
            [0, 1, 192, 'MailSend', 0, t, 0, t, t, t],
            [109, 1, 0, t, 109, 'KeyInComposition', 229, t, t, t],
            [111, 1, 0, t, 111, 'ABNT_C2', 194, 'VK_ABNT_C2', t, t],
            [91, 1, 0, t, 91, 'OEM_8', 223, 'VK_OEM_8', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_KANA', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_HANGUL', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_JUNJA', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_FINAL', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_HANJA', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_KANJI', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_CONVERT', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_NONCONVERT', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_ACCEPT', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_MODECHANGE', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_SELECT', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_PRINT', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_EXECUTE', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_SNAPSHOT', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_HELP', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_APPS', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_PROCESSKEY', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_PACKET', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_DBE_SBCSCHAR', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_DBE_DBCSCHAR', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_ATTN', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_CRSEL', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_EXSEL', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_EREOF', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_PLAY', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_ZOOM', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_NONAME', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_PA1', t, t],
            [0, 1, 0, t, 0, t, 0, 'VK_OEM_CLEAR', t, t],
          ],
          m = [],
          p = []
        for (const L of g) {
          const [w, S, b, s, a, f, d, o, i, u] = L
          if (
            (p[b] ||
              ((p[b] = !0),
              (y[b] = s),
              (C[s] = b),
              (c[s.toLowerCase()] = b),
              S &&
                ((r.IMMUTABLE_CODE_TO_KEY_CODE[b] = a),
                a !== 0 &&
                  a !== 3 &&
                  a !== 5 &&
                  a !== 4 &&
                  a !== 6 &&
                  a !== 57 &&
                  (r.IMMUTABLE_KEY_CODE_TO_CODE[a] = b))),
            !m[a])
          ) {
            if (((m[a] = !0), !f))
              throw new Error(
                `String representation missing for key code ${a} around scan code ${s}`
              )
            e.define(a, f), A.define(a, i || f), l.define(a, u || i || f)
          }
          d && (r.EVENT_KEY_CODE_MAP[d] = a),
            o && (r.NATIVE_WINDOWS_KEY_CODE_TO_KEY_CODE[o] = a)
        }
        r.IMMUTABLE_KEY_CODE_TO_CODE[3] = 46
      })()
      var h
      ;(function (t) {
        function g(b) {
          return e.keyCodeToStr(b)
        }
        t.toString = g
        function m(b) {
          return e.strToKeyCode(b)
        }
        t.fromString = m
        function p(b) {
          return A.keyCodeToStr(b)
        }
        t.toUserSettingsUS = p
        function L(b) {
          return l.keyCodeToStr(b)
        }
        t.toUserSettingsGeneral = L
        function w(b) {
          return A.strToKeyCode(b) || l.strToKeyCode(b)
        }
        t.fromUserSettings = w
        function S(b) {
          if (b >= 93 && b <= 108) return null
          switch (b) {
            case 16:
              return 'Up'
            case 18:
              return 'Down'
            case 15:
              return 'Left'
            case 17:
              return 'Right'
          }
          return e.keyCodeToStr(b)
        }
        t.toElectronAccelerator = S
      })((h = r.KeyCodeUtils || (r.KeyCodeUtils = {})))
      function v(t, g) {
        const m = ((g & 65535) << 16) >>> 0
        return (t | m) >>> 0
      }
      r.KeyChord = v
    }),
    Y(X[25], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }), (r.Lazy = void 0)
      class N {
        constructor(A) {
          ;(this.executor = A), (this._didRun = !1)
        }
        hasValue() {
          return this._didRun
        }
        getValue() {
          if (!this._didRun)
            try {
              this._value = this.executor()
            } catch (A) {
              this._error = A
            } finally {
              this._didRun = !0
            }
          if (this._error) throw this._error
          return this._value
        }
        get rawValue() {
          return this._value
        }
      }
      r.Lazy = N
    }),
    Y(X[8], J([0, 1, 23, 11]), function (F, r, N, e) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.ImmortalReference =
          r.SafeDisposable =
          r.RefCountedDisposable =
          r.MutableDisposable =
          r.Disposable =
          r.DisposableStore =
          r.toDisposable =
          r.combinedDisposable =
          r.dispose =
          r.isDisposable =
          r.MultiDisposeError =
          r.markAsSingleton =
          r.setDisposableTracker =
            void 0)
      const A = !1
      let l = null
      function y(o) {
        l = o
      }
      if (((r.setDisposableTracker = y), A)) {
        const o = '__is_disposable_tracked__'
        y(
          new (class {
            trackDisposable(i) {
              const u = new Error('Potentially leaked disposable').stack
              setTimeout(() => {
                i[o] || console.log(u)
              }, 3e3)
            }
            setParent(i, u) {
              if (i && i !== b.None)
                try {
                  i[o] = !0
                } catch {}
            }
            markAsDisposed(i) {
              if (i && i !== b.None)
                try {
                  i[o] = !0
                } catch {}
            }
            markAsSingleton(i) {}
          })()
        )
      }
      function C(o) {
        return l == null || l.trackDisposable(o), o
      }
      function c(o) {
        l == null || l.markAsDisposed(o)
      }
      function h(o, i) {
        l == null || l.setParent(o, i)
      }
      function v(o, i) {
        if (!!l) for (const u of o) l.setParent(u, i)
      }
      function t(o) {
        return l == null || l.markAsSingleton(o), o
      }
      r.markAsSingleton = t
      class g extends Error {
        constructor(i) {
          super(
            `Encountered errors while disposing of store. Errors: [${i.join(
              ', '
            )}]`
          )
          this.errors = i
        }
      }
      r.MultiDisposeError = g
      function m(o) {
        return typeof o.dispose == 'function' && o.dispose.length === 0
      }
      r.isDisposable = m
      function p(o) {
        if (e.Iterable.is(o)) {
          const i = []
          for (const u of o)
            if (u)
              try {
                u.dispose()
              } catch (_) {
                i.push(_)
              }
          if (i.length === 1) throw i[0]
          if (i.length > 1) throw new g(i)
          return Array.isArray(o) ? [] : o
        } else if (o) return o.dispose(), o
      }
      r.dispose = p
      function L(...o) {
        const i = w(() => p(o))
        return v(o, i), i
      }
      r.combinedDisposable = L
      function w(o) {
        const i = C({
          dispose: (0, N.once)(() => {
            c(i), o()
          }),
        })
        return i
      }
      r.toDisposable = w
      class S {
        constructor() {
          ;(this._toDispose = new Set()), (this._isDisposed = !1), C(this)
        }
        dispose() {
          this._isDisposed || (c(this), (this._isDisposed = !0), this.clear())
        }
        get isDisposed() {
          return this._isDisposed
        }
        clear() {
          try {
            p(this._toDispose.values())
          } finally {
            this._toDispose.clear()
          }
        }
        add(i) {
          if (!i) return i
          if (i === this)
            throw new Error('Cannot register a disposable on itself!')
          return (
            h(i, this),
            this._isDisposed
              ? S.DISABLE_DISPOSED_WARNING ||
                console.warn(
                  new Error(
                    'Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!'
                  ).stack
                )
              : this._toDispose.add(i),
            i
          )
        }
      }
      ;(r.DisposableStore = S), (S.DISABLE_DISPOSED_WARNING = !1)
      class b {
        constructor() {
          ;(this._store = new S()), C(this), h(this._store, this)
        }
        dispose() {
          c(this), this._store.dispose()
        }
        _register(i) {
          if (i === this)
            throw new Error('Cannot register a disposable on itself!')
          return this._store.add(i)
        }
      }
      ;(r.Disposable = b), (b.None = Object.freeze({ dispose() {} }))
      class s {
        constructor() {
          ;(this._isDisposed = !1), C(this)
        }
        get value() {
          return this._isDisposed ? void 0 : this._value
        }
        set value(i) {
          var u
          this._isDisposed ||
            i === this._value ||
            ((u = this._value) === null || u === void 0 || u.dispose(),
            i && h(i, this),
            (this._value = i))
        }
        clear() {
          this.value = void 0
        }
        dispose() {
          var i
          ;(this._isDisposed = !0),
            c(this),
            (i = this._value) === null || i === void 0 || i.dispose(),
            (this._value = void 0)
        }
        clearAndLeak() {
          const i = this._value
          return (this._value = void 0), i && h(i, null), i
        }
      }
      r.MutableDisposable = s
      class a {
        constructor(i) {
          ;(this._disposable = i), (this._counter = 1)
        }
        acquire() {
          return this._counter++, this
        }
        release() {
          return --this._counter == 0 && this._disposable.dispose(), this
        }
      }
      r.RefCountedDisposable = a
      class f {
        constructor() {
          ;(this.dispose = () => {}),
            (this.unset = () => {}),
            (this.isset = () => !1),
            C(this)
        }
        set(i) {
          let u = i
          return (
            (this.unset = () => (u = void 0)),
            (this.isset = () => u !== void 0),
            (this.dispose = () => {
              u && (u(), (u = void 0), c(this))
            }),
            this
          )
        }
      }
      r.SafeDisposable = f
      class d {
        constructor(i) {
          this.object = i
        }
        dispose() {}
      }
      r.ImmortalReference = d
    }),
    Y(X[12], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.LinkedList = void 0)
      class N {
        constructor(l) {
          ;(this.element = l),
            (this.next = N.Undefined),
            (this.prev = N.Undefined)
        }
      }
      N.Undefined = new N(void 0)
      class e {
        constructor() {
          ;(this._first = N.Undefined),
            (this._last = N.Undefined),
            (this._size = 0)
        }
        get size() {
          return this._size
        }
        isEmpty() {
          return this._first === N.Undefined
        }
        clear() {
          let l = this._first
          for (; l !== N.Undefined; ) {
            const y = l.next
            ;(l.prev = N.Undefined), (l.next = N.Undefined), (l = y)
          }
          ;(this._first = N.Undefined),
            (this._last = N.Undefined),
            (this._size = 0)
        }
        unshift(l) {
          return this._insert(l, !1)
        }
        push(l) {
          return this._insert(l, !0)
        }
        _insert(l, y) {
          const C = new N(l)
          if (this._first === N.Undefined) (this._first = C), (this._last = C)
          else if (y) {
            const h = this._last
            ;(this._last = C), (C.prev = h), (h.next = C)
          } else {
            const h = this._first
            ;(this._first = C), (C.next = h), (h.prev = C)
          }
          this._size += 1
          let c = !1
          return () => {
            c || ((c = !0), this._remove(C))
          }
        }
        shift() {
          if (this._first !== N.Undefined) {
            const l = this._first.element
            return this._remove(this._first), l
          }
        }
        pop() {
          if (this._last !== N.Undefined) {
            const l = this._last.element
            return this._remove(this._last), l
          }
        }
        _remove(l) {
          if (l.prev !== N.Undefined && l.next !== N.Undefined) {
            const y = l.prev
            ;(y.next = l.next), (l.next.prev = y)
          } else l.prev === N.Undefined && l.next === N.Undefined ? ((this._first = N.Undefined), (this._last = N.Undefined)) : l.next === N.Undefined ? ((this._last = this._last.prev), (this._last.next = N.Undefined)) : l.prev === N.Undefined && ((this._first = this._first.next), (this._first.prev = N.Undefined))
          this._size -= 1
        }
        *[Symbol.iterator]() {
          let l = this._first
          for (; l !== N.Undefined; ) yield l.element, (l = l.next)
        }
      }
      r.LinkedList = e
    }),
    Y(X[2], J([0, 1, 20, 25]), function (F, r, N, e) {
      'use strict'
      var A
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.InvisibleCharacters =
          r.AmbiguousCharacters =
          r.noBreakWhitespace =
          r.getLeftDeleteOffset =
          r.singleLetterHash =
          r.containsUppercaseCharacter =
          r.startsWithUTF8BOM =
          r.UTF8_BOM_CHARACTER =
          r.isEmojiImprecise =
          r.isFullWidthCharacter =
          r.containsUnusualLineTerminators =
          r.UNUSUAL_LINE_TERMINATORS =
          r.isBasicASCII =
          r.containsRTL =
          r.getCharContainingOffset =
          r.prevCharLength =
          r.nextCharLength =
          r.GraphemeIterator =
          r.CodePointIterator =
          r.getNextCodePoint =
          r.computeCodePoint =
          r.isLowSurrogate =
          r.isHighSurrogate =
          r.commonSuffixLength =
          r.commonPrefixLength =
          r.startsWithIgnoreCase =
          r.equalsIgnoreCase =
          r.isUpperAsciiLetter =
          r.isLowerAsciiLetter =
          r.isAsciiDigit =
          r.compareSubstringIgnoreCase =
          r.compareIgnoreCase =
          r.compareSubstring =
          r.compare =
          r.lastNonWhitespaceIndex =
          r.getLeadingWhitespace =
          r.firstNonWhitespaceIndex =
          r.splitLines =
          r.regExpFlags =
          r.regExpLeadsToEndlessLoop =
          r.createRegExp =
          r.stripWildcards =
          r.convertSimple2RegExpPattern =
          r.rtrim =
          r.ltrim =
          r.trim =
          r.escapeRegExpCharacters =
          r.escape =
          r.format =
          r.isFalsyOrWhitespace =
            void 0)
      function l(R) {
        return !R || typeof R != 'string' ? !0 : R.trim().length === 0
      }
      r.isFalsyOrWhitespace = l
      const y = /{(\d+)}/g
      function C(R, ...k) {
        return k.length === 0
          ? R
          : R.replace(y, function (V, H) {
              const Q = parseInt(H, 10)
              return isNaN(Q) || Q < 0 || Q >= k.length ? V : k[Q]
            })
      }
      r.format = C
      function c(R) {
        return R.replace(/[<>&]/g, function (k) {
          switch (k) {
            case '<':
              return '&lt;'
            case '>':
              return '&gt;'
            case '&':
              return '&amp;'
            default:
              return k
          }
        })
      }
      r.escape = c
      function h(R) {
        return R.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, '\\$&')
      }
      r.escapeRegExpCharacters = h
      function v(R, k = ' ') {
        const V = t(R, k)
        return g(V, k)
      }
      r.trim = v
      function t(R, k) {
        if (!R || !k) return R
        const V = k.length
        if (V === 0 || R.length === 0) return R
        let H = 0
        for (; R.indexOf(k, H) === H; ) H = H + V
        return R.substring(H)
      }
      r.ltrim = t
      function g(R, k) {
        if (!R || !k) return R
        const V = k.length,
          H = R.length
        if (V === 0 || H === 0) return R
        let Q = H,
          ne = -1
        for (; (ne = R.lastIndexOf(k, Q - 1)), !(ne === -1 || ne + V !== Q); ) {
          if (ne === 0) return ''
          Q = ne
        }
        return R.substring(0, Q)
      }
      r.rtrim = g
      function m(R) {
        return R.replace(
          /[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g,
          '\\$&'
        ).replace(/[\*]/g, '.*')
      }
      r.convertSimple2RegExpPattern = m
      function p(R) {
        return R.replace(/\*/g, '')
      }
      r.stripWildcards = p
      function L(R, k, V = {}) {
        if (!R) throw new Error('Cannot create regex from empty string')
        k || (R = h(R)),
          V.wholeWord &&
            (/\B/.test(R.charAt(0)) || (R = '\\b' + R),
            /\B/.test(R.charAt(R.length - 1)) || (R = R + '\\b'))
        let H = ''
        return (
          V.global && (H += 'g'),
          V.matchCase || (H += 'i'),
          V.multiline && (H += 'm'),
          V.unicode && (H += 'u'),
          new RegExp(R, H)
        )
      }
      r.createRegExp = L
      function w(R) {
        return R.source === '^' ||
          R.source === '^$' ||
          R.source === '$' ||
          R.source === '^\\s*$'
          ? !1
          : !!(R.exec('') && R.lastIndex === 0)
      }
      r.regExpLeadsToEndlessLoop = w
      function S(R) {
        return (
          (R.global ? 'g' : '') +
          (R.ignoreCase ? 'i' : '') +
          (R.multiline ? 'm' : '') +
          (R.unicode ? 'u' : '')
        )
      }
      r.regExpFlags = S
      function b(R) {
        return R.split(/\r\n|\r|\n/)
      }
      r.splitLines = b
      function s(R) {
        for (let k = 0, V = R.length; k < V; k++) {
          const H = R.charCodeAt(k)
          if (H !== 32 && H !== 9) return k
        }
        return -1
      }
      r.firstNonWhitespaceIndex = s
      function a(R, k = 0, V = R.length) {
        for (let H = k; H < V; H++) {
          const Q = R.charCodeAt(H)
          if (Q !== 32 && Q !== 9) return R.substring(k, H)
        }
        return R.substring(k, V)
      }
      r.getLeadingWhitespace = a
      function f(R, k = R.length - 1) {
        for (let V = k; V >= 0; V--) {
          const H = R.charCodeAt(V)
          if (H !== 32 && H !== 9) return V
        }
        return -1
      }
      r.lastNonWhitespaceIndex = f
      function d(R, k) {
        return R < k ? -1 : R > k ? 1 : 0
      }
      r.compare = d
      function o(R, k, V = 0, H = R.length, Q = 0, ne = k.length) {
        for (; V < H && Q < ne; V++, Q++) {
          const fe = R.charCodeAt(V),
            re = k.charCodeAt(Q)
          if (fe < re) return -1
          if (fe > re) return 1
        }
        const ae = H - V,
          ge = ne - Q
        return ae < ge ? -1 : ae > ge ? 1 : 0
      }
      r.compareSubstring = o
      function i(R, k) {
        return u(R, k, 0, R.length, 0, k.length)
      }
      r.compareIgnoreCase = i
      function u(R, k, V = 0, H = R.length, Q = 0, ne = k.length) {
        for (; V < H && Q < ne; V++, Q++) {
          let fe = R.charCodeAt(V),
            re = k.charCodeAt(Q)
          if (fe === re) continue
          if (fe >= 128 || re >= 128)
            return o(R.toLowerCase(), k.toLowerCase(), V, H, Q, ne)
          E(fe) && (fe -= 32), E(re) && (re -= 32)
          const ue = fe - re
          if (ue !== 0) return ue
        }
        const ae = H - V,
          ge = ne - Q
        return ae < ge ? -1 : ae > ge ? 1 : 0
      }
      r.compareSubstringIgnoreCase = u
      function _(R) {
        return R >= 48 && R <= 57
      }
      r.isAsciiDigit = _
      function E(R) {
        return R >= 97 && R <= 122
      }
      r.isLowerAsciiLetter = E
      function M(R) {
        return R >= 65 && R <= 90
      }
      r.isUpperAsciiLetter = M
      function D(R, k) {
        return R.length === k.length && u(R, k) === 0
      }
      r.equalsIgnoreCase = D
      function I(R, k) {
        const V = k.length
        return k.length > R.length ? !1 : u(R, k, 0, V) === 0
      }
      r.startsWithIgnoreCase = I
      function O(R, k) {
        const V = Math.min(R.length, k.length)
        let H
        for (H = 0; H < V; H++)
          if (R.charCodeAt(H) !== k.charCodeAt(H)) return H
        return V
      }
      r.commonPrefixLength = O
      function q(R, k) {
        const V = Math.min(R.length, k.length)
        let H
        const Q = R.length - 1,
          ne = k.length - 1
        for (H = 0; H < V; H++)
          if (R.charCodeAt(Q - H) !== k.charCodeAt(ne - H)) return H
        return V
      }
      r.commonSuffixLength = q
      function z(R) {
        return 55296 <= R && R <= 56319
      }
      r.isHighSurrogate = z
      function P(R) {
        return 56320 <= R && R <= 57343
      }
      r.isLowSurrogate = P
      function U(R, k) {
        return ((R - 55296) << 10) + (k - 56320) + 65536
      }
      r.computeCodePoint = U
      function T(R, k, V) {
        const H = R.charCodeAt(V)
        if (z(H) && V + 1 < k) {
          const Q = R.charCodeAt(V + 1)
          if (P(Q)) return U(H, Q)
        }
        return H
      }
      r.getNextCodePoint = T
      function W(R, k) {
        const V = R.charCodeAt(k - 1)
        if (P(V) && k > 1) {
          const H = R.charCodeAt(k - 2)
          if (z(H)) return U(H, V)
        }
        return V
      }
      class B {
        constructor(k, V = 0) {
          ;(this._str = k), (this._len = k.length), (this._offset = V)
        }
        get offset() {
          return this._offset
        }
        setOffset(k) {
          this._offset = k
        }
        prevCodePoint() {
          const k = W(this._str, this._offset)
          return (this._offset -= k >= 65536 ? 2 : 1), k
        }
        nextCodePoint() {
          const k = T(this._str, this._len, this._offset)
          return (this._offset += k >= 65536 ? 2 : 1), k
        }
        eol() {
          return this._offset >= this._len
        }
      }
      r.CodePointIterator = B
      class te {
        constructor(k, V = 0) {
          this._iterator = new B(k, V)
        }
        get offset() {
          return this._iterator.offset
        }
        nextGraphemeLength() {
          const k = le.getInstance(),
            V = this._iterator,
            H = V.offset
          let Q = k.getGraphemeBreakType(V.nextCodePoint())
          for (; !V.eol(); ) {
            const ne = V.offset,
              ae = k.getGraphemeBreakType(V.nextCodePoint())
            if (me(Q, ae)) {
              V.setOffset(ne)
              break
            }
            Q = ae
          }
          return V.offset - H
        }
        prevGraphemeLength() {
          const k = le.getInstance(),
            V = this._iterator,
            H = V.offset
          let Q = k.getGraphemeBreakType(V.prevCodePoint())
          for (; V.offset > 0; ) {
            const ne = V.offset,
              ae = k.getGraphemeBreakType(V.prevCodePoint())
            if (me(ae, Q)) {
              V.setOffset(ne)
              break
            }
            Q = ae
          }
          return H - V.offset
        }
        eol() {
          return this._iterator.eol()
        }
      }
      r.GraphemeIterator = te
      function n(R, k) {
        return new te(R, k).nextGraphemeLength()
      }
      r.nextCharLength = n
      function de(R, k) {
        return new te(R, k).prevGraphemeLength()
      }
      r.prevCharLength = de
      function be(R, k) {
        k > 0 && P(R.charCodeAt(k)) && k--
        const V = k + n(R, k)
        return [V - de(R, V), V]
      }
      r.getCharContainingOffset = be
      const pe =
        /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u088E\u08A0-\u08C9\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDC7\uFDF0-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE35\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDD23\uDE80-\uDEA9\uDEAD-\uDF45\uDF51-\uDF81\uDF86-\uDFF6]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD4B-\uDFFF]|\uD83B[\uDC00-\uDEBB])/
      function ye(R) {
        return pe.test(R)
      }
      r.containsRTL = ye
      const Z = /^[\t\n\r\x20-\x7E]*$/
      function $(R) {
        return Z.test(R)
      }
      ;(r.isBasicASCII = $), (r.UNUSUAL_LINE_TERMINATORS = /[\u2028\u2029]/)
      function j(R) {
        return r.UNUSUAL_LINE_TERMINATORS.test(R)
      }
      r.containsUnusualLineTerminators = j
      function G(R) {
        return (
          (R >= 11904 && R <= 55215) ||
          (R >= 63744 && R <= 64255) ||
          (R >= 65281 && R <= 65374)
        )
      }
      r.isFullWidthCharacter = G
      function K(R) {
        return (
          (R >= 127462 && R <= 127487) ||
          R === 8986 ||
          R === 8987 ||
          R === 9200 ||
          R === 9203 ||
          (R >= 9728 && R <= 10175) ||
          R === 11088 ||
          R === 11093 ||
          (R >= 127744 && R <= 128591) ||
          (R >= 128640 && R <= 128764) ||
          (R >= 128992 && R <= 129008) ||
          (R >= 129280 && R <= 129535) ||
          (R >= 129648 && R <= 129782)
        )
      }
      ;(r.isEmojiImprecise = K),
        (r.UTF8_BOM_CHARACTER = String.fromCharCode(65279))
      function x(R) {
        return !!(R && R.length > 0 && R.charCodeAt(0) === 65279)
      }
      r.startsWithUTF8BOM = x
      function ee(R, k = !1) {
        return R
          ? (k && (R = R.replace(/\\./g, '')), R.toLowerCase() !== R)
          : !1
      }
      r.containsUppercaseCharacter = ee
      function se(R) {
        const k = 90 - 65 + 1
        return (
          (R = R % (2 * k)),
          R < k ? String.fromCharCode(97 + R) : String.fromCharCode(65 + R - k)
        )
      }
      r.singleLetterHash = se
      function me(R, k) {
        return R === 0
          ? k !== 5 && k !== 7
          : R === 2 && k === 3
          ? !1
          : R === 4 || R === 2 || R === 3 || k === 4 || k === 2 || k === 3
          ? !0
          : !(
              (R === 8 && (k === 8 || k === 9 || k === 11 || k === 12)) ||
              ((R === 11 || R === 9) && (k === 9 || k === 10)) ||
              ((R === 12 || R === 10) && k === 10) ||
              k === 5 ||
              k === 13 ||
              k === 7 ||
              R === 1 ||
              (R === 13 && k === 14) ||
              (R === 6 && k === 6)
            )
      }
      class le {
        constructor() {
          this._data = we()
        }
        static getInstance() {
          return le._INSTANCE || (le._INSTANCE = new le()), le._INSTANCE
        }
        getGraphemeBreakType(k) {
          if (k < 32) return k === 10 ? 3 : k === 13 ? 2 : 4
          if (k < 127) return 0
          const V = this._data,
            H = V.length / 3
          let Q = 1
          for (; Q <= H; )
            if (k < V[3 * Q]) Q = 2 * Q
            else if (k > V[3 * Q + 1]) Q = 2 * Q + 1
            else return V[3 * Q + 2]
          return 0
        }
      }
      le._INSTANCE = null
      function we() {
        return JSON.parse(
          '[0,0,0,51229,51255,12,44061,44087,12,127462,127487,6,7083,7085,5,47645,47671,12,54813,54839,12,128678,128678,14,3270,3270,5,9919,9923,14,45853,45879,12,49437,49463,12,53021,53047,12,71216,71218,7,128398,128399,14,129360,129374,14,2519,2519,5,4448,4519,9,9742,9742,14,12336,12336,14,44957,44983,12,46749,46775,12,48541,48567,12,50333,50359,12,52125,52151,12,53917,53943,12,69888,69890,5,73018,73018,5,127990,127990,14,128558,128559,14,128759,128760,14,129653,129655,14,2027,2035,5,2891,2892,7,3761,3761,5,6683,6683,5,8293,8293,4,9825,9826,14,9999,9999,14,43452,43453,5,44509,44535,12,45405,45431,12,46301,46327,12,47197,47223,12,48093,48119,12,48989,49015,12,49885,49911,12,50781,50807,12,51677,51703,12,52573,52599,12,53469,53495,12,54365,54391,12,65279,65279,4,70471,70472,7,72145,72147,7,119173,119179,5,127799,127818,14,128240,128244,14,128512,128512,14,128652,128652,14,128721,128722,14,129292,129292,14,129445,129450,14,129734,129743,14,1476,1477,5,2366,2368,7,2750,2752,7,3076,3076,5,3415,3415,5,4141,4144,5,6109,6109,5,6964,6964,5,7394,7400,5,9197,9198,14,9770,9770,14,9877,9877,14,9968,9969,14,10084,10084,14,43052,43052,5,43713,43713,5,44285,44311,12,44733,44759,12,45181,45207,12,45629,45655,12,46077,46103,12,46525,46551,12,46973,46999,12,47421,47447,12,47869,47895,12,48317,48343,12,48765,48791,12,49213,49239,12,49661,49687,12,50109,50135,12,50557,50583,12,51005,51031,12,51453,51479,12,51901,51927,12,52349,52375,12,52797,52823,12,53245,53271,12,53693,53719,12,54141,54167,12,54589,54615,12,55037,55063,12,69506,69509,5,70191,70193,5,70841,70841,7,71463,71467,5,72330,72342,5,94031,94031,5,123628,123631,5,127763,127765,14,127941,127941,14,128043,128062,14,128302,128317,14,128465,128467,14,128539,128539,14,128640,128640,14,128662,128662,14,128703,128703,14,128745,128745,14,129004,129007,14,129329,129330,14,129402,129402,14,129483,129483,14,129686,129704,14,130048,131069,14,173,173,4,1757,1757,1,2200,2207,5,2434,2435,7,2631,2632,5,2817,2817,5,3008,3008,5,3201,3201,5,3387,3388,5,3542,3542,5,3902,3903,7,4190,4192,5,6002,6003,5,6439,6440,5,6765,6770,7,7019,7027,5,7154,7155,7,8205,8205,13,8505,8505,14,9654,9654,14,9757,9757,14,9792,9792,14,9852,9853,14,9890,9894,14,9937,9937,14,9981,9981,14,10035,10036,14,11035,11036,14,42654,42655,5,43346,43347,7,43587,43587,5,44006,44007,7,44173,44199,12,44397,44423,12,44621,44647,12,44845,44871,12,45069,45095,12,45293,45319,12,45517,45543,12,45741,45767,12,45965,45991,12,46189,46215,12,46413,46439,12,46637,46663,12,46861,46887,12,47085,47111,12,47309,47335,12,47533,47559,12,47757,47783,12,47981,48007,12,48205,48231,12,48429,48455,12,48653,48679,12,48877,48903,12,49101,49127,12,49325,49351,12,49549,49575,12,49773,49799,12,49997,50023,12,50221,50247,12,50445,50471,12,50669,50695,12,50893,50919,12,51117,51143,12,51341,51367,12,51565,51591,12,51789,51815,12,52013,52039,12,52237,52263,12,52461,52487,12,52685,52711,12,52909,52935,12,53133,53159,12,53357,53383,12,53581,53607,12,53805,53831,12,54029,54055,12,54253,54279,12,54477,54503,12,54701,54727,12,54925,54951,12,55149,55175,12,68101,68102,5,69762,69762,7,70067,70069,7,70371,70378,5,70720,70721,7,71087,71087,5,71341,71341,5,71995,71996,5,72249,72249,7,72850,72871,5,73109,73109,5,118576,118598,5,121505,121519,5,127245,127247,14,127568,127569,14,127777,127777,14,127872,127891,14,127956,127967,14,128015,128016,14,128110,128172,14,128259,128259,14,128367,128368,14,128424,128424,14,128488,128488,14,128530,128532,14,128550,128551,14,128566,128566,14,128647,128647,14,128656,128656,14,128667,128673,14,128691,128693,14,128715,128715,14,128728,128732,14,128752,128752,14,128765,128767,14,129096,129103,14,129311,129311,14,129344,129349,14,129394,129394,14,129413,129425,14,129466,129471,14,129511,129535,14,129664,129666,14,129719,129722,14,129760,129767,14,917536,917631,5,13,13,2,1160,1161,5,1564,1564,4,1807,1807,1,2085,2087,5,2307,2307,7,2382,2383,7,2497,2500,5,2563,2563,7,2677,2677,5,2763,2764,7,2879,2879,5,2914,2915,5,3021,3021,5,3142,3144,5,3263,3263,5,3285,3286,5,3398,3400,7,3530,3530,5,3633,3633,5,3864,3865,5,3974,3975,5,4155,4156,7,4229,4230,5,5909,5909,7,6078,6085,7,6277,6278,5,6451,6456,7,6744,6750,5,6846,6846,5,6972,6972,5,7074,7077,5,7146,7148,7,7222,7223,5,7416,7417,5,8234,8238,4,8417,8417,5,9000,9000,14,9203,9203,14,9730,9731,14,9748,9749,14,9762,9763,14,9776,9783,14,9800,9811,14,9831,9831,14,9872,9873,14,9882,9882,14,9900,9903,14,9929,9933,14,9941,9960,14,9974,9974,14,9989,9989,14,10006,10006,14,10062,10062,14,10160,10160,14,11647,11647,5,12953,12953,14,43019,43019,5,43232,43249,5,43443,43443,5,43567,43568,7,43696,43696,5,43765,43765,7,44013,44013,5,44117,44143,12,44229,44255,12,44341,44367,12,44453,44479,12,44565,44591,12,44677,44703,12,44789,44815,12,44901,44927,12,45013,45039,12,45125,45151,12,45237,45263,12,45349,45375,12,45461,45487,12,45573,45599,12,45685,45711,12,45797,45823,12,45909,45935,12,46021,46047,12,46133,46159,12,46245,46271,12,46357,46383,12,46469,46495,12,46581,46607,12,46693,46719,12,46805,46831,12,46917,46943,12,47029,47055,12,47141,47167,12,47253,47279,12,47365,47391,12,47477,47503,12,47589,47615,12,47701,47727,12,47813,47839,12,47925,47951,12,48037,48063,12,48149,48175,12,48261,48287,12,48373,48399,12,48485,48511,12,48597,48623,12,48709,48735,12,48821,48847,12,48933,48959,12,49045,49071,12,49157,49183,12,49269,49295,12,49381,49407,12,49493,49519,12,49605,49631,12,49717,49743,12,49829,49855,12,49941,49967,12,50053,50079,12,50165,50191,12,50277,50303,12,50389,50415,12,50501,50527,12,50613,50639,12,50725,50751,12,50837,50863,12,50949,50975,12,51061,51087,12,51173,51199,12,51285,51311,12,51397,51423,12,51509,51535,12,51621,51647,12,51733,51759,12,51845,51871,12,51957,51983,12,52069,52095,12,52181,52207,12,52293,52319,12,52405,52431,12,52517,52543,12,52629,52655,12,52741,52767,12,52853,52879,12,52965,52991,12,53077,53103,12,53189,53215,12,53301,53327,12,53413,53439,12,53525,53551,12,53637,53663,12,53749,53775,12,53861,53887,12,53973,53999,12,54085,54111,12,54197,54223,12,54309,54335,12,54421,54447,12,54533,54559,12,54645,54671,12,54757,54783,12,54869,54895,12,54981,55007,12,55093,55119,12,55243,55291,10,66045,66045,5,68325,68326,5,69688,69702,5,69817,69818,5,69957,69958,7,70089,70092,5,70198,70199,5,70462,70462,5,70502,70508,5,70750,70750,5,70846,70846,7,71100,71101,5,71230,71230,7,71351,71351,5,71737,71738,5,72000,72000,7,72160,72160,5,72273,72278,5,72752,72758,5,72882,72883,5,73031,73031,5,73461,73462,7,94192,94193,7,119149,119149,7,121403,121452,5,122915,122916,5,126980,126980,14,127358,127359,14,127535,127535,14,127759,127759,14,127771,127771,14,127792,127793,14,127825,127867,14,127897,127899,14,127945,127945,14,127985,127986,14,128000,128007,14,128021,128021,14,128066,128100,14,128184,128235,14,128249,128252,14,128266,128276,14,128335,128335,14,128379,128390,14,128407,128419,14,128444,128444,14,128481,128481,14,128499,128499,14,128526,128526,14,128536,128536,14,128543,128543,14,128556,128556,14,128564,128564,14,128577,128580,14,128643,128645,14,128649,128649,14,128654,128654,14,128660,128660,14,128664,128664,14,128675,128675,14,128686,128689,14,128695,128696,14,128705,128709,14,128717,128719,14,128725,128725,14,128736,128741,14,128747,128748,14,128755,128755,14,128762,128762,14,128981,128991,14,129009,129023,14,129160,129167,14,129296,129304,14,129320,129327,14,129340,129342,14,129356,129356,14,129388,129392,14,129399,129400,14,129404,129407,14,129432,129442,14,129454,129455,14,129473,129474,14,129485,129487,14,129648,129651,14,129659,129660,14,129671,129679,14,129709,129711,14,129728,129730,14,129751,129753,14,129776,129782,14,917505,917505,4,917760,917999,5,10,10,3,127,159,4,768,879,5,1471,1471,5,1536,1541,1,1648,1648,5,1767,1768,5,1840,1866,5,2070,2073,5,2137,2139,5,2274,2274,1,2363,2363,7,2377,2380,7,2402,2403,5,2494,2494,5,2507,2508,7,2558,2558,5,2622,2624,7,2641,2641,5,2691,2691,7,2759,2760,5,2786,2787,5,2876,2876,5,2881,2884,5,2901,2902,5,3006,3006,5,3014,3016,7,3072,3072,5,3134,3136,5,3157,3158,5,3260,3260,5,3266,3266,5,3274,3275,7,3328,3329,5,3391,3392,7,3405,3405,5,3457,3457,5,3536,3537,7,3551,3551,5,3636,3642,5,3764,3772,5,3895,3895,5,3967,3967,7,3993,4028,5,4146,4151,5,4182,4183,7,4226,4226,5,4253,4253,5,4957,4959,5,5940,5940,7,6070,6070,7,6087,6088,7,6158,6158,4,6432,6434,5,6448,6449,7,6679,6680,5,6742,6742,5,6754,6754,5,6783,6783,5,6912,6915,5,6966,6970,5,6978,6978,5,7042,7042,7,7080,7081,5,7143,7143,7,7150,7150,7,7212,7219,5,7380,7392,5,7412,7412,5,8203,8203,4,8232,8232,4,8265,8265,14,8400,8412,5,8421,8432,5,8617,8618,14,9167,9167,14,9200,9200,14,9410,9410,14,9723,9726,14,9733,9733,14,9745,9745,14,9752,9752,14,9760,9760,14,9766,9766,14,9774,9774,14,9786,9786,14,9794,9794,14,9823,9823,14,9828,9828,14,9833,9850,14,9855,9855,14,9875,9875,14,9880,9880,14,9885,9887,14,9896,9897,14,9906,9916,14,9926,9927,14,9935,9935,14,9939,9939,14,9962,9962,14,9972,9972,14,9978,9978,14,9986,9986,14,9997,9997,14,10002,10002,14,10017,10017,14,10055,10055,14,10071,10071,14,10133,10135,14,10548,10549,14,11093,11093,14,12330,12333,5,12441,12442,5,42608,42610,5,43010,43010,5,43045,43046,5,43188,43203,7,43302,43309,5,43392,43394,5,43446,43449,5,43493,43493,5,43571,43572,7,43597,43597,7,43703,43704,5,43756,43757,5,44003,44004,7,44009,44010,7,44033,44059,12,44089,44115,12,44145,44171,12,44201,44227,12,44257,44283,12,44313,44339,12,44369,44395,12,44425,44451,12,44481,44507,12,44537,44563,12,44593,44619,12,44649,44675,12,44705,44731,12,44761,44787,12,44817,44843,12,44873,44899,12,44929,44955,12,44985,45011,12,45041,45067,12,45097,45123,12,45153,45179,12,45209,45235,12,45265,45291,12,45321,45347,12,45377,45403,12,45433,45459,12,45489,45515,12,45545,45571,12,45601,45627,12,45657,45683,12,45713,45739,12,45769,45795,12,45825,45851,12,45881,45907,12,45937,45963,12,45993,46019,12,46049,46075,12,46105,46131,12,46161,46187,12,46217,46243,12,46273,46299,12,46329,46355,12,46385,46411,12,46441,46467,12,46497,46523,12,46553,46579,12,46609,46635,12,46665,46691,12,46721,46747,12,46777,46803,12,46833,46859,12,46889,46915,12,46945,46971,12,47001,47027,12,47057,47083,12,47113,47139,12,47169,47195,12,47225,47251,12,47281,47307,12,47337,47363,12,47393,47419,12,47449,47475,12,47505,47531,12,47561,47587,12,47617,47643,12,47673,47699,12,47729,47755,12,47785,47811,12,47841,47867,12,47897,47923,12,47953,47979,12,48009,48035,12,48065,48091,12,48121,48147,12,48177,48203,12,48233,48259,12,48289,48315,12,48345,48371,12,48401,48427,12,48457,48483,12,48513,48539,12,48569,48595,12,48625,48651,12,48681,48707,12,48737,48763,12,48793,48819,12,48849,48875,12,48905,48931,12,48961,48987,12,49017,49043,12,49073,49099,12,49129,49155,12,49185,49211,12,49241,49267,12,49297,49323,12,49353,49379,12,49409,49435,12,49465,49491,12,49521,49547,12,49577,49603,12,49633,49659,12,49689,49715,12,49745,49771,12,49801,49827,12,49857,49883,12,49913,49939,12,49969,49995,12,50025,50051,12,50081,50107,12,50137,50163,12,50193,50219,12,50249,50275,12,50305,50331,12,50361,50387,12,50417,50443,12,50473,50499,12,50529,50555,12,50585,50611,12,50641,50667,12,50697,50723,12,50753,50779,12,50809,50835,12,50865,50891,12,50921,50947,12,50977,51003,12,51033,51059,12,51089,51115,12,51145,51171,12,51201,51227,12,51257,51283,12,51313,51339,12,51369,51395,12,51425,51451,12,51481,51507,12,51537,51563,12,51593,51619,12,51649,51675,12,51705,51731,12,51761,51787,12,51817,51843,12,51873,51899,12,51929,51955,12,51985,52011,12,52041,52067,12,52097,52123,12,52153,52179,12,52209,52235,12,52265,52291,12,52321,52347,12,52377,52403,12,52433,52459,12,52489,52515,12,52545,52571,12,52601,52627,12,52657,52683,12,52713,52739,12,52769,52795,12,52825,52851,12,52881,52907,12,52937,52963,12,52993,53019,12,53049,53075,12,53105,53131,12,53161,53187,12,53217,53243,12,53273,53299,12,53329,53355,12,53385,53411,12,53441,53467,12,53497,53523,12,53553,53579,12,53609,53635,12,53665,53691,12,53721,53747,12,53777,53803,12,53833,53859,12,53889,53915,12,53945,53971,12,54001,54027,12,54057,54083,12,54113,54139,12,54169,54195,12,54225,54251,12,54281,54307,12,54337,54363,12,54393,54419,12,54449,54475,12,54505,54531,12,54561,54587,12,54617,54643,12,54673,54699,12,54729,54755,12,54785,54811,12,54841,54867,12,54897,54923,12,54953,54979,12,55009,55035,12,55065,55091,12,55121,55147,12,55177,55203,12,65024,65039,5,65520,65528,4,66422,66426,5,68152,68154,5,69291,69292,5,69633,69633,5,69747,69748,5,69811,69814,5,69826,69826,5,69932,69932,7,70016,70017,5,70079,70080,7,70095,70095,5,70196,70196,5,70367,70367,5,70402,70403,7,70464,70464,5,70487,70487,5,70709,70711,7,70725,70725,7,70833,70834,7,70843,70844,7,70849,70849,7,71090,71093,5,71103,71104,5,71227,71228,7,71339,71339,5,71344,71349,5,71458,71461,5,71727,71735,5,71985,71989,7,71998,71998,5,72002,72002,7,72154,72155,5,72193,72202,5,72251,72254,5,72281,72283,5,72344,72345,5,72766,72766,7,72874,72880,5,72885,72886,5,73023,73029,5,73104,73105,5,73111,73111,5,92912,92916,5,94095,94098,5,113824,113827,4,119142,119142,7,119155,119162,4,119362,119364,5,121476,121476,5,122888,122904,5,123184,123190,5,125252,125258,5,127183,127183,14,127340,127343,14,127377,127386,14,127491,127503,14,127548,127551,14,127744,127756,14,127761,127761,14,127769,127769,14,127773,127774,14,127780,127788,14,127796,127797,14,127820,127823,14,127869,127869,14,127894,127895,14,127902,127903,14,127943,127943,14,127947,127950,14,127972,127972,14,127988,127988,14,127992,127994,14,128009,128011,14,128019,128019,14,128023,128041,14,128064,128064,14,128102,128107,14,128174,128181,14,128238,128238,14,128246,128247,14,128254,128254,14,128264,128264,14,128278,128299,14,128329,128330,14,128348,128359,14,128371,128377,14,128392,128393,14,128401,128404,14,128421,128421,14,128433,128434,14,128450,128452,14,128476,128478,14,128483,128483,14,128495,128495,14,128506,128506,14,128519,128520,14,128528,128528,14,128534,128534,14,128538,128538,14,128540,128542,14,128544,128549,14,128552,128555,14,128557,128557,14,128560,128563,14,128565,128565,14,128567,128576,14,128581,128591,14,128641,128642,14,128646,128646,14,128648,128648,14,128650,128651,14,128653,128653,14,128655,128655,14,128657,128659,14,128661,128661,14,128663,128663,14,128665,128666,14,128674,128674,14,128676,128677,14,128679,128685,14,128690,128690,14,128694,128694,14,128697,128702,14,128704,128704,14,128710,128714,14,128716,128716,14,128720,128720,14,128723,128724,14,128726,128727,14,128733,128735,14,128742,128744,14,128746,128746,14,128749,128751,14,128753,128754,14,128756,128758,14,128761,128761,14,128763,128764,14,128884,128895,14,128992,129003,14,129008,129008,14,129036,129039,14,129114,129119,14,129198,129279,14,129293,129295,14,129305,129310,14,129312,129319,14,129328,129328,14,129331,129338,14,129343,129343,14,129351,129355,14,129357,129359,14,129375,129387,14,129393,129393,14,129395,129398,14,129401,129401,14,129403,129403,14,129408,129412,14,129426,129431,14,129443,129444,14,129451,129453,14,129456,129465,14,129472,129472,14,129475,129482,14,129484,129484,14,129488,129510,14,129536,129647,14,129652,129652,14,129656,129658,14,129661,129663,14,129667,129670,14,129680,129685,14,129705,129708,14,129712,129718,14,129723,129727,14,129731,129733,14,129744,129750,14,129754,129759,14,129768,129775,14,129783,129791,14,917504,917504,4,917506,917535,4,917632,917759,4,918000,921599,4,0,9,4,11,12,4,14,31,4,169,169,14,174,174,14,1155,1159,5,1425,1469,5,1473,1474,5,1479,1479,5,1552,1562,5,1611,1631,5,1750,1756,5,1759,1764,5,1770,1773,5,1809,1809,5,1958,1968,5,2045,2045,5,2075,2083,5,2089,2093,5,2192,2193,1,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2433,2433,5,2492,2492,5,2495,2496,7,2503,2504,7,2509,2509,5,2530,2531,5,2561,2562,5,2620,2620,5,2625,2626,5,2635,2637,5,2672,2673,5,2689,2690,5,2748,2748,5,2753,2757,5,2761,2761,7,2765,2765,5,2810,2815,5,2818,2819,7,2878,2878,5,2880,2880,7,2887,2888,7,2893,2893,5,2903,2903,5,2946,2946,5,3007,3007,7,3009,3010,7,3018,3020,7,3031,3031,5,3073,3075,7,3132,3132,5,3137,3140,7,3146,3149,5,3170,3171,5,3202,3203,7,3262,3262,7,3264,3265,7,3267,3268,7,3271,3272,7,3276,3277,5,3298,3299,5,3330,3331,7,3390,3390,5,3393,3396,5,3402,3404,7,3406,3406,1,3426,3427,5,3458,3459,7,3535,3535,5,3538,3540,5,3544,3550,7,3570,3571,7,3635,3635,7,3655,3662,5,3763,3763,7,3784,3789,5,3893,3893,5,3897,3897,5,3953,3966,5,3968,3972,5,3981,3991,5,4038,4038,5,4145,4145,7,4153,4154,5,4157,4158,5,4184,4185,5,4209,4212,5,4228,4228,7,4237,4237,5,4352,4447,8,4520,4607,10,5906,5908,5,5938,5939,5,5970,5971,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6155,6157,5,6159,6159,5,6313,6313,5,6435,6438,7,6441,6443,7,6450,6450,5,6457,6459,5,6681,6682,7,6741,6741,7,6743,6743,7,6752,6752,5,6757,6764,5,6771,6780,5,6832,6845,5,6847,6862,5,6916,6916,7,6965,6965,5,6971,6971,7,6973,6977,7,6979,6980,7,7040,7041,5,7073,7073,7,7078,7079,7,7082,7082,7,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7204,7211,7,7220,7221,7,7376,7378,5,7393,7393,7,7405,7405,5,7415,7415,7,7616,7679,5,8204,8204,5,8206,8207,4,8233,8233,4,8252,8252,14,8288,8292,4,8294,8303,4,8413,8416,5,8418,8420,5,8482,8482,14,8596,8601,14,8986,8987,14,9096,9096,14,9193,9196,14,9199,9199,14,9201,9202,14,9208,9210,14,9642,9643,14,9664,9664,14,9728,9729,14,9732,9732,14,9735,9741,14,9743,9744,14,9746,9746,14,9750,9751,14,9753,9756,14,9758,9759,14,9761,9761,14,9764,9765,14,9767,9769,14,9771,9773,14,9775,9775,14,9784,9785,14,9787,9791,14,9793,9793,14,9795,9799,14,9812,9822,14,9824,9824,14,9827,9827,14,9829,9830,14,9832,9832,14,9851,9851,14,9854,9854,14,9856,9861,14,9874,9874,14,9876,9876,14,9878,9879,14,9881,9881,14,9883,9884,14,9888,9889,14,9895,9895,14,9898,9899,14,9904,9905,14,9917,9918,14,9924,9925,14,9928,9928,14,9934,9934,14,9936,9936,14,9938,9938,14,9940,9940,14,9961,9961,14,9963,9967,14,9970,9971,14,9973,9973,14,9975,9977,14,9979,9980,14,9982,9985,14,9987,9988,14,9992,9996,14,9998,9998,14,10000,10001,14,10004,10004,14,10013,10013,14,10024,10024,14,10052,10052,14,10060,10060,14,10067,10069,14,10083,10083,14,10085,10087,14,10145,10145,14,10175,10175,14,11013,11015,14,11088,11088,14,11503,11505,5,11744,11775,5,12334,12335,5,12349,12349,14,12951,12951,14,42607,42607,5,42612,42621,5,42736,42737,5,43014,43014,5,43043,43044,7,43047,43047,7,43136,43137,7,43204,43205,5,43263,43263,5,43335,43345,5,43360,43388,8,43395,43395,7,43444,43445,7,43450,43451,7,43454,43456,7,43561,43566,5,43569,43570,5,43573,43574,5,43596,43596,5,43644,43644,5,43698,43700,5,43710,43711,5,43755,43755,7,43758,43759,7,43766,43766,5,44005,44005,5,44008,44008,5,44012,44012,7,44032,44032,11,44060,44060,11,44088,44088,11,44116,44116,11,44144,44144,11,44172,44172,11,44200,44200,11,44228,44228,11,44256,44256,11,44284,44284,11,44312,44312,11,44340,44340,11,44368,44368,11,44396,44396,11,44424,44424,11,44452,44452,11,44480,44480,11,44508,44508,11,44536,44536,11,44564,44564,11,44592,44592,11,44620,44620,11,44648,44648,11,44676,44676,11,44704,44704,11,44732,44732,11,44760,44760,11,44788,44788,11,44816,44816,11,44844,44844,11,44872,44872,11,44900,44900,11,44928,44928,11,44956,44956,11,44984,44984,11,45012,45012,11,45040,45040,11,45068,45068,11,45096,45096,11,45124,45124,11,45152,45152,11,45180,45180,11,45208,45208,11,45236,45236,11,45264,45264,11,45292,45292,11,45320,45320,11,45348,45348,11,45376,45376,11,45404,45404,11,45432,45432,11,45460,45460,11,45488,45488,11,45516,45516,11,45544,45544,11,45572,45572,11,45600,45600,11,45628,45628,11,45656,45656,11,45684,45684,11,45712,45712,11,45740,45740,11,45768,45768,11,45796,45796,11,45824,45824,11,45852,45852,11,45880,45880,11,45908,45908,11,45936,45936,11,45964,45964,11,45992,45992,11,46020,46020,11,46048,46048,11,46076,46076,11,46104,46104,11,46132,46132,11,46160,46160,11,46188,46188,11,46216,46216,11,46244,46244,11,46272,46272,11,46300,46300,11,46328,46328,11,46356,46356,11,46384,46384,11,46412,46412,11,46440,46440,11,46468,46468,11,46496,46496,11,46524,46524,11,46552,46552,11,46580,46580,11,46608,46608,11,46636,46636,11,46664,46664,11,46692,46692,11,46720,46720,11,46748,46748,11,46776,46776,11,46804,46804,11,46832,46832,11,46860,46860,11,46888,46888,11,46916,46916,11,46944,46944,11,46972,46972,11,47000,47000,11,47028,47028,11,47056,47056,11,47084,47084,11,47112,47112,11,47140,47140,11,47168,47168,11,47196,47196,11,47224,47224,11,47252,47252,11,47280,47280,11,47308,47308,11,47336,47336,11,47364,47364,11,47392,47392,11,47420,47420,11,47448,47448,11,47476,47476,11,47504,47504,11,47532,47532,11,47560,47560,11,47588,47588,11,47616,47616,11,47644,47644,11,47672,47672,11,47700,47700,11,47728,47728,11,47756,47756,11,47784,47784,11,47812,47812,11,47840,47840,11,47868,47868,11,47896,47896,11,47924,47924,11,47952,47952,11,47980,47980,11,48008,48008,11,48036,48036,11,48064,48064,11,48092,48092,11,48120,48120,11,48148,48148,11,48176,48176,11,48204,48204,11,48232,48232,11,48260,48260,11,48288,48288,11,48316,48316,11,48344,48344,11,48372,48372,11,48400,48400,11,48428,48428,11,48456,48456,11,48484,48484,11,48512,48512,11,48540,48540,11,48568,48568,11,48596,48596,11,48624,48624,11,48652,48652,11,48680,48680,11,48708,48708,11,48736,48736,11,48764,48764,11,48792,48792,11,48820,48820,11,48848,48848,11,48876,48876,11,48904,48904,11,48932,48932,11,48960,48960,11,48988,48988,11,49016,49016,11,49044,49044,11,49072,49072,11,49100,49100,11,49128,49128,11,49156,49156,11,49184,49184,11,49212,49212,11,49240,49240,11,49268,49268,11,49296,49296,11,49324,49324,11,49352,49352,11,49380,49380,11,49408,49408,11,49436,49436,11,49464,49464,11,49492,49492,11,49520,49520,11,49548,49548,11,49576,49576,11,49604,49604,11,49632,49632,11,49660,49660,11,49688,49688,11,49716,49716,11,49744,49744,11,49772,49772,11,49800,49800,11,49828,49828,11,49856,49856,11,49884,49884,11,49912,49912,11,49940,49940,11,49968,49968,11,49996,49996,11,50024,50024,11,50052,50052,11,50080,50080,11,50108,50108,11,50136,50136,11,50164,50164,11,50192,50192,11,50220,50220,11,50248,50248,11,50276,50276,11,50304,50304,11,50332,50332,11,50360,50360,11,50388,50388,11,50416,50416,11,50444,50444,11,50472,50472,11,50500,50500,11,50528,50528,11,50556,50556,11,50584,50584,11,50612,50612,11,50640,50640,11,50668,50668,11,50696,50696,11,50724,50724,11,50752,50752,11,50780,50780,11,50808,50808,11,50836,50836,11,50864,50864,11,50892,50892,11,50920,50920,11,50948,50948,11,50976,50976,11,51004,51004,11,51032,51032,11,51060,51060,11,51088,51088,11,51116,51116,11,51144,51144,11,51172,51172,11,51200,51200,11,51228,51228,11,51256,51256,11,51284,51284,11,51312,51312,11,51340,51340,11,51368,51368,11,51396,51396,11,51424,51424,11,51452,51452,11,51480,51480,11,51508,51508,11,51536,51536,11,51564,51564,11,51592,51592,11,51620,51620,11,51648,51648,11,51676,51676,11,51704,51704,11,51732,51732,11,51760,51760,11,51788,51788,11,51816,51816,11,51844,51844,11,51872,51872,11,51900,51900,11,51928,51928,11,51956,51956,11,51984,51984,11,52012,52012,11,52040,52040,11,52068,52068,11,52096,52096,11,52124,52124,11,52152,52152,11,52180,52180,11,52208,52208,11,52236,52236,11,52264,52264,11,52292,52292,11,52320,52320,11,52348,52348,11,52376,52376,11,52404,52404,11,52432,52432,11,52460,52460,11,52488,52488,11,52516,52516,11,52544,52544,11,52572,52572,11,52600,52600,11,52628,52628,11,52656,52656,11,52684,52684,11,52712,52712,11,52740,52740,11,52768,52768,11,52796,52796,11,52824,52824,11,52852,52852,11,52880,52880,11,52908,52908,11,52936,52936,11,52964,52964,11,52992,52992,11,53020,53020,11,53048,53048,11,53076,53076,11,53104,53104,11,53132,53132,11,53160,53160,11,53188,53188,11,53216,53216,11,53244,53244,11,53272,53272,11,53300,53300,11,53328,53328,11,53356,53356,11,53384,53384,11,53412,53412,11,53440,53440,11,53468,53468,11,53496,53496,11,53524,53524,11,53552,53552,11,53580,53580,11,53608,53608,11,53636,53636,11,53664,53664,11,53692,53692,11,53720,53720,11,53748,53748,11,53776,53776,11,53804,53804,11,53832,53832,11,53860,53860,11,53888,53888,11,53916,53916,11,53944,53944,11,53972,53972,11,54000,54000,11,54028,54028,11,54056,54056,11,54084,54084,11,54112,54112,11,54140,54140,11,54168,54168,11,54196,54196,11,54224,54224,11,54252,54252,11,54280,54280,11,54308,54308,11,54336,54336,11,54364,54364,11,54392,54392,11,54420,54420,11,54448,54448,11,54476,54476,11,54504,54504,11,54532,54532,11,54560,54560,11,54588,54588,11,54616,54616,11,54644,54644,11,54672,54672,11,54700,54700,11,54728,54728,11,54756,54756,11,54784,54784,11,54812,54812,11,54840,54840,11,54868,54868,11,54896,54896,11,54924,54924,11,54952,54952,11,54980,54980,11,55008,55008,11,55036,55036,11,55064,55064,11,55092,55092,11,55120,55120,11,55148,55148,11,55176,55176,11,55216,55238,9,64286,64286,5,65056,65071,5,65438,65439,5,65529,65531,4,66272,66272,5,68097,68099,5,68108,68111,5,68159,68159,5,68900,68903,5,69446,69456,5,69632,69632,7,69634,69634,7,69744,69744,5,69759,69761,5,69808,69810,7,69815,69816,7,69821,69821,1,69837,69837,1,69927,69931,5,69933,69940,5,70003,70003,5,70018,70018,7,70070,70078,5,70082,70083,1,70094,70094,7,70188,70190,7,70194,70195,7,70197,70197,7,70206,70206,5,70368,70370,7,70400,70401,5,70459,70460,5,70463,70463,7,70465,70468,7,70475,70477,7,70498,70499,7,70512,70516,5,70712,70719,5,70722,70724,5,70726,70726,5,70832,70832,5,70835,70840,5,70842,70842,5,70845,70845,5,70847,70848,5,70850,70851,5,71088,71089,7,71096,71099,7,71102,71102,7,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71340,71340,7,71342,71343,7,71350,71350,7,71453,71455,5,71462,71462,7,71724,71726,7,71736,71736,7,71984,71984,5,71991,71992,7,71997,71997,7,71999,71999,1,72001,72001,1,72003,72003,5,72148,72151,5,72156,72159,7,72164,72164,7,72243,72248,5,72250,72250,1,72263,72263,5,72279,72280,7,72324,72329,1,72343,72343,7,72751,72751,7,72760,72765,5,72767,72767,5,72873,72873,7,72881,72881,7,72884,72884,7,73009,73014,5,73020,73021,5,73030,73030,1,73098,73102,7,73107,73108,7,73110,73110,7,73459,73460,5,78896,78904,4,92976,92982,5,94033,94087,7,94180,94180,5,113821,113822,5,118528,118573,5,119141,119141,5,119143,119145,5,119150,119154,5,119163,119170,5,119210,119213,5,121344,121398,5,121461,121461,5,121499,121503,5,122880,122886,5,122907,122913,5,122918,122922,5,123566,123566,5,125136,125142,5,126976,126979,14,126981,127182,14,127184,127231,14,127279,127279,14,127344,127345,14,127374,127374,14,127405,127461,14,127489,127490,14,127514,127514,14,127538,127546,14,127561,127567,14,127570,127743,14,127757,127758,14,127760,127760,14,127762,127762,14,127766,127768,14,127770,127770,14,127772,127772,14,127775,127776,14,127778,127779,14,127789,127791,14,127794,127795,14,127798,127798,14,127819,127819,14,127824,127824,14,127868,127868,14,127870,127871,14,127892,127893,14,127896,127896,14,127900,127901,14,127904,127940,14,127942,127942,14,127944,127944,14,127946,127946,14,127951,127955,14,127968,127971,14,127973,127984,14,127987,127987,14,127989,127989,14,127991,127991,14,127995,127999,5,128008,128008,14,128012,128014,14,128017,128018,14,128020,128020,14,128022,128022,14,128042,128042,14,128063,128063,14,128065,128065,14,128101,128101,14,128108,128109,14,128173,128173,14,128182,128183,14,128236,128237,14,128239,128239,14,128245,128245,14,128248,128248,14,128253,128253,14,128255,128258,14,128260,128263,14,128265,128265,14,128277,128277,14,128300,128301,14,128326,128328,14,128331,128334,14,128336,128347,14,128360,128366,14,128369,128370,14,128378,128378,14,128391,128391,14,128394,128397,14,128400,128400,14,128405,128406,14,128420,128420,14,128422,128423,14,128425,128432,14,128435,128443,14,128445,128449,14,128453,128464,14,128468,128475,14,128479,128480,14,128482,128482,14,128484,128487,14,128489,128494,14,128496,128498,14,128500,128505,14,128507,128511,14,128513,128518,14,128521,128525,14,128527,128527,14,128529,128529,14,128533,128533,14,128535,128535,14,128537,128537,14]'
        )
      }
      function _e(R, k) {
        if (R === 0) return 0
        const V = Le(R, k)
        if (V !== void 0) return V
        const H = new B(k, R)
        return H.prevCodePoint(), H.offset
      }
      r.getLeftDeleteOffset = _e
      function Le(R, k) {
        const V = new B(k, R)
        let H = V.prevCodePoint()
        for (; Se(H) || H === 65039 || H === 8419; ) {
          if (V.offset === 0) return
          H = V.prevCodePoint()
        }
        if (!K(H)) return
        let Q = V.offset
        return Q > 0 && V.prevCodePoint() === 8205 && (Q = V.offset), Q
      }
      function Se(R) {
        return 127995 <= R && R <= 127999
      }
      r.noBreakWhitespace = '\xA0'
      class ce {
        constructor(k) {
          this.confusableDictionary = k
        }
        static getInstance(k) {
          return ce.cache.get(Array.from(k))
        }
        static getLocales() {
          return ce._locales.getValue()
        }
        isAmbiguous(k) {
          return this.confusableDictionary.has(k)
        }
        getPrimaryConfusable(k) {
          return this.confusableDictionary.get(k)
        }
        getConfusableCodePoints() {
          return new Set(this.confusableDictionary.keys())
        }
      }
      ;(r.AmbiguousCharacters = ce),
        (A = ce),
        (ce.ambiguousCharacterData = new e.Lazy(() =>
          JSON.parse(
            '{"_common":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,8218,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,8242,96,1370,96,1523,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71922,67,71913,67,65315,67,8557,67,8450,67,8493,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71919,87,71910,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,66293,90,71909,90,65338,90,8484,90,8488,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65297,49,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125],"_default":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"cs":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"de":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"es":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"fr":[65374,126,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"it":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ja":[8211,45,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65292,44,65307,59],"ko":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pl":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pt-BR":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"qps-ploc":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ru":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"tr":[160,32,8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"zh-hans":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41],"zh-hant":[8211,45,65374,126,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65307,59]}'
          )
        )),
        (ce.cache = new N.LRUCachedFunction((R) => {
          function k(re) {
            const ue = new Map()
            for (let he = 0; he < re.length; he += 2) ue.set(re[he], re[he + 1])
            return ue
          }
          function V(re, ue) {
            const he = new Map(re)
            for (const [ve, Ne] of ue) he.set(ve, Ne)
            return he
          }
          function H(re, ue) {
            if (!re) return ue
            const he = new Map()
            for (const [ve, Ne] of re) ue.has(ve) && he.set(ve, Ne)
            return he
          }
          const Q = A.ambiguousCharacterData.getValue()
          let ne = R.filter((re) => !re.startsWith('_') && re in Q)
          ne.length === 0 && (ne = ['_default'])
          let ae
          for (const re of ne) {
            const ue = k(Q[re])
            ae = H(ae, ue)
          }
          const ge = k(Q._common),
            fe = V(ge, ae)
          return new ce(fe)
        })),
        (ce._locales = new e.Lazy(() =>
          Object.keys(ce.ambiguousCharacterData.getValue()).filter(
            (R) => !R.startsWith('_')
          )
        ))
      class Ce {
        static getRawData() {
          return JSON.parse(
            '[9,10,11,12,13,32,127,160,173,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8203,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12288,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999]'
          )
        }
        static getData() {
          return (
            this._data || (this._data = new Set(Ce.getRawData())), this._data
          )
        }
        static isInvisibleCharacter(k) {
          return Ce.getData().has(k)
        }
        static get codePoints() {
          return Ce.getData()
        }
      }
      ;(r.InvisibleCharacters = Ce), (Ce._data = void 0)
    }),
    Y(X[26], J([0, 1, 2]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.StringSHA1 =
          r.toHexString =
          r.stringHash =
          r.numberHash =
          r.doHash =
          r.hash =
            void 0)
      function e(L) {
        return A(L, 0)
      }
      r.hash = e
      function A(L, w) {
        switch (typeof L) {
          case 'object':
            return L === null ? l(349, w) : Array.isArray(L) ? c(L, w) : h(L, w)
          case 'string':
            return C(L, w)
          case 'boolean':
            return y(L, w)
          case 'number':
            return l(L, w)
          case 'undefined':
            return l(937, w)
          default:
            return l(617, w)
        }
      }
      r.doHash = A
      function l(L, w) {
        return ((w << 5) - w + L) | 0
      }
      r.numberHash = l
      function y(L, w) {
        return l(L ? 433 : 863, w)
      }
      function C(L, w) {
        w = l(149417, w)
        for (let S = 0, b = L.length; S < b; S++) w = l(L.charCodeAt(S), w)
        return w
      }
      r.stringHash = C
      function c(L, w) {
        return (w = l(104579, w)), L.reduce((S, b) => A(b, S), w)
      }
      function h(L, w) {
        return (
          (w = l(181387, w)),
          Object.keys(L)
            .sort()
            .reduce((S, b) => ((S = C(b, S)), A(L[b], S)), w)
        )
      }
      function v(L, w, S = 32) {
        const b = S - w,
          s = ~((1 << b) - 1)
        return ((L << w) | ((s & L) >>> b)) >>> 0
      }
      function t(L, w = 0, S = L.byteLength, b = 0) {
        for (let s = 0; s < S; s++) L[w + s] = b
      }
      function g(L, w, S = '0') {
        for (; L.length < w; ) L = S + L
        return L
      }
      function m(L, w = 32) {
        return L instanceof ArrayBuffer
          ? Array.from(new Uint8Array(L))
              .map((S) => S.toString(16).padStart(2, '0'))
              .join('')
          : g((L >>> 0).toString(16), w / 4)
      }
      r.toHexString = m
      class p {
        constructor() {
          ;(this._h0 = 1732584193),
            (this._h1 = 4023233417),
            (this._h2 = 2562383102),
            (this._h3 = 271733878),
            (this._h4 = 3285377520),
            (this._buff = new Uint8Array(64 + 3)),
            (this._buffDV = new DataView(this._buff.buffer)),
            (this._buffLen = 0),
            (this._totalLen = 0),
            (this._leftoverHighSurrogate = 0),
            (this._finished = !1)
        }
        update(w) {
          const S = w.length
          if (S === 0) return
          const b = this._buff
          let s = this._buffLen,
            a = this._leftoverHighSurrogate,
            f,
            d
          for (
            a !== 0
              ? ((f = a), (d = -1), (a = 0))
              : ((f = w.charCodeAt(0)), (d = 0));
            ;

          ) {
            let o = f
            if (N.isHighSurrogate(f))
              if (d + 1 < S) {
                const i = w.charCodeAt(d + 1)
                N.isLowSurrogate(i)
                  ? (d++, (o = N.computeCodePoint(f, i)))
                  : (o = 65533)
              } else {
                a = f
                break
              }
            else N.isLowSurrogate(f) && (o = 65533)
            if (((s = this._push(b, s, o)), d++, d < S)) f = w.charCodeAt(d)
            else break
          }
          ;(this._buffLen = s), (this._leftoverHighSurrogate = a)
        }
        _push(w, S, b) {
          return (
            b < 128
              ? (w[S++] = b)
              : b < 2048
              ? ((w[S++] = 192 | ((b & 1984) >>> 6)),
                (w[S++] = 128 | ((b & 63) >>> 0)))
              : b < 65536
              ? ((w[S++] = 224 | ((b & 61440) >>> 12)),
                (w[S++] = 128 | ((b & 4032) >>> 6)),
                (w[S++] = 128 | ((b & 63) >>> 0)))
              : ((w[S++] = 240 | ((b & 1835008) >>> 18)),
                (w[S++] = 128 | ((b & 258048) >>> 12)),
                (w[S++] = 128 | ((b & 4032) >>> 6)),
                (w[S++] = 128 | ((b & 63) >>> 0))),
            S >= 64 &&
              (this._step(),
              (S -= 64),
              (this._totalLen += 64),
              (w[0] = w[64 + 0]),
              (w[1] = w[64 + 1]),
              (w[2] = w[64 + 2])),
            S
          )
        }
        digest() {
          return (
            this._finished ||
              ((this._finished = !0),
              this._leftoverHighSurrogate &&
                ((this._leftoverHighSurrogate = 0),
                (this._buffLen = this._push(this._buff, this._buffLen, 65533))),
              (this._totalLen += this._buffLen),
              this._wrapUp()),
            m(this._h0) + m(this._h1) + m(this._h2) + m(this._h3) + m(this._h4)
          )
        }
        _wrapUp() {
          ;(this._buff[this._buffLen++] = 128),
            t(this._buff, this._buffLen),
            this._buffLen > 56 && (this._step(), t(this._buff))
          const w = 8 * this._totalLen
          this._buffDV.setUint32(56, Math.floor(w / 4294967296), !1),
            this._buffDV.setUint32(60, w % 4294967296, !1),
            this._step()
        }
        _step() {
          const w = p._bigBlock32,
            S = this._buffDV
          for (let _ = 0; _ < 64; _ += 4) w.setUint32(_, S.getUint32(_, !1), !1)
          for (let _ = 64; _ < 320; _ += 4)
            w.setUint32(
              _,
              v(
                w.getUint32(_ - 12, !1) ^
                  w.getUint32(_ - 32, !1) ^
                  w.getUint32(_ - 56, !1) ^
                  w.getUint32(_ - 64, !1),
                1
              ),
              !1
            )
          let b = this._h0,
            s = this._h1,
            a = this._h2,
            f = this._h3,
            d = this._h4,
            o,
            i,
            u
          for (let _ = 0; _ < 80; _++)
            _ < 20
              ? ((o = (s & a) | (~s & f)), (i = 1518500249))
              : _ < 40
              ? ((o = s ^ a ^ f), (i = 1859775393))
              : _ < 60
              ? ((o = (s & a) | (s & f) | (a & f)), (i = 2400959708))
              : ((o = s ^ a ^ f), (i = 3395469782)),
              (u = (v(b, 5) + o + d + i + w.getUint32(_ * 4, !1)) & 4294967295),
              (d = f),
              (f = a),
              (a = v(s, 30)),
              (s = b),
              (b = u)
          ;(this._h0 = (this._h0 + b) & 4294967295),
            (this._h1 = (this._h1 + s) & 4294967295),
            (this._h2 = (this._h2 + a) & 4294967295),
            (this._h3 = (this._h3 + f) & 4294967295),
            (this._h4 = (this._h4 + d) & 4294967295)
        }
      }
      ;(r.StringSHA1 = p), (p._bigBlock32 = new DataView(new ArrayBuffer(320)))
    }),
    Y(X[13], J([0, 1, 22, 26]), function (F, r, N, e) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.LcsDiff =
          r.MyArray =
          r.Debug =
          r.stringDiff =
          r.StringDiffSequence =
            void 0)
      class A {
        constructor(t) {
          this.source = t
        }
        getElements() {
          const t = this.source,
            g = new Int32Array(t.length)
          for (let m = 0, p = t.length; m < p; m++) g[m] = t.charCodeAt(m)
          return g
        }
      }
      r.StringDiffSequence = A
      function l(v, t, g) {
        return new h(new A(v), new A(t)).ComputeDiff(g).changes
      }
      r.stringDiff = l
      class y {
        static Assert(t, g) {
          if (!t) throw new Error(g)
        }
      }
      r.Debug = y
      class C {
        static Copy(t, g, m, p, L) {
          for (let w = 0; w < L; w++) m[p + w] = t[g + w]
        }
        static Copy2(t, g, m, p, L) {
          for (let w = 0; w < L; w++) m[p + w] = t[g + w]
        }
      }
      r.MyArray = C
      class c {
        constructor() {
          ;(this.m_changes = []),
            (this.m_originalStart = 1073741824),
            (this.m_modifiedStart = 1073741824),
            (this.m_originalCount = 0),
            (this.m_modifiedCount = 0)
        }
        MarkNextChange() {
          ;(this.m_originalCount > 0 || this.m_modifiedCount > 0) &&
            this.m_changes.push(
              new N.DiffChange(
                this.m_originalStart,
                this.m_originalCount,
                this.m_modifiedStart,
                this.m_modifiedCount
              )
            ),
            (this.m_originalCount = 0),
            (this.m_modifiedCount = 0),
            (this.m_originalStart = 1073741824),
            (this.m_modifiedStart = 1073741824)
        }
        AddOriginalElement(t, g) {
          ;(this.m_originalStart = Math.min(this.m_originalStart, t)),
            (this.m_modifiedStart = Math.min(this.m_modifiedStart, g)),
            this.m_originalCount++
        }
        AddModifiedElement(t, g) {
          ;(this.m_originalStart = Math.min(this.m_originalStart, t)),
            (this.m_modifiedStart = Math.min(this.m_modifiedStart, g)),
            this.m_modifiedCount++
        }
        getChanges() {
          return (
            (this.m_originalCount > 0 || this.m_modifiedCount > 0) &&
              this.MarkNextChange(),
            this.m_changes
          )
        }
        getReverseChanges() {
          return (
            (this.m_originalCount > 0 || this.m_modifiedCount > 0) &&
              this.MarkNextChange(),
            this.m_changes.reverse(),
            this.m_changes
          )
        }
      }
      class h {
        constructor(t, g, m = null) {
          ;(this.ContinueProcessingPredicate = m),
            (this._originalSequence = t),
            (this._modifiedSequence = g)
          const [p, L, w] = h._getElements(t),
            [S, b, s] = h._getElements(g)
          ;(this._hasStrings = w && s),
            (this._originalStringElements = p),
            (this._originalElementsOrHash = L),
            (this._modifiedStringElements = S),
            (this._modifiedElementsOrHash = b),
            (this.m_forwardHistory = []),
            (this.m_reverseHistory = [])
        }
        static _isStringArray(t) {
          return t.length > 0 && typeof t[0] == 'string'
        }
        static _getElements(t) {
          const g = t.getElements()
          if (h._isStringArray(g)) {
            const m = new Int32Array(g.length)
            for (let p = 0, L = g.length; p < L; p++)
              m[p] = (0, e.stringHash)(g[p], 0)
            return [g, m, !0]
          }
          return g instanceof Int32Array
            ? [[], g, !1]
            : [[], new Int32Array(g), !1]
        }
        ElementsAreEqual(t, g) {
          return this._originalElementsOrHash[t] !==
            this._modifiedElementsOrHash[g]
            ? !1
            : this._hasStrings
            ? this._originalStringElements[t] ===
              this._modifiedStringElements[g]
            : !0
        }
        ElementsAreStrictEqual(t, g) {
          if (!this.ElementsAreEqual(t, g)) return !1
          const m = h._getStrictElement(this._originalSequence, t),
            p = h._getStrictElement(this._modifiedSequence, g)
          return m === p
        }
        static _getStrictElement(t, g) {
          return typeof t.getStrictElement == 'function'
            ? t.getStrictElement(g)
            : null
        }
        OriginalElementsAreEqual(t, g) {
          return this._originalElementsOrHash[t] !==
            this._originalElementsOrHash[g]
            ? !1
            : this._hasStrings
            ? this._originalStringElements[t] ===
              this._originalStringElements[g]
            : !0
        }
        ModifiedElementsAreEqual(t, g) {
          return this._modifiedElementsOrHash[t] !==
            this._modifiedElementsOrHash[g]
            ? !1
            : this._hasStrings
            ? this._modifiedStringElements[t] ===
              this._modifiedStringElements[g]
            : !0
        }
        ComputeDiff(t) {
          return this._ComputeDiff(
            0,
            this._originalElementsOrHash.length - 1,
            0,
            this._modifiedElementsOrHash.length - 1,
            t
          )
        }
        _ComputeDiff(t, g, m, p, L) {
          const w = [!1]
          let S = this.ComputeDiffRecursive(t, g, m, p, w)
          return (
            L && (S = this.PrettifyChanges(S)), { quitEarly: w[0], changes: S }
          )
        }
        ComputeDiffRecursive(t, g, m, p, L) {
          for (L[0] = !1; t <= g && m <= p && this.ElementsAreEqual(t, m); )
            t++, m++
          for (; g >= t && p >= m && this.ElementsAreEqual(g, p); ) g--, p--
          if (t > g || m > p) {
            let f
            return (
              m <= p
                ? (y.Assert(
                    t === g + 1,
                    'originalStart should only be one more than originalEnd'
                  ),
                  (f = [new N.DiffChange(t, 0, m, p - m + 1)]))
                : t <= g
                ? (y.Assert(
                    m === p + 1,
                    'modifiedStart should only be one more than modifiedEnd'
                  ),
                  (f = [new N.DiffChange(t, g - t + 1, m, 0)]))
                : (y.Assert(
                    t === g + 1,
                    'originalStart should only be one more than originalEnd'
                  ),
                  y.Assert(
                    m === p + 1,
                    'modifiedStart should only be one more than modifiedEnd'
                  ),
                  (f = [])),
              f
            )
          }
          const w = [0],
            S = [0],
            b = this.ComputeRecursionPoint(t, g, m, p, w, S, L),
            s = w[0],
            a = S[0]
          if (b !== null) return b
          if (!L[0]) {
            const f = this.ComputeDiffRecursive(t, s, m, a, L)
            let d = []
            return (
              L[0]
                ? (d = [
                    new N.DiffChange(
                      s + 1,
                      g - (s + 1) + 1,
                      a + 1,
                      p - (a + 1) + 1
                    ),
                  ])
                : (d = this.ComputeDiffRecursive(s + 1, g, a + 1, p, L)),
              this.ConcatenateChanges(f, d)
            )
          }
          return [new N.DiffChange(t, g - t + 1, m, p - m + 1)]
        }
        WALKTRACE(t, g, m, p, L, w, S, b, s, a, f, d, o, i, u, _, E, M) {
          let D = null,
            I = null,
            O = new c(),
            q = g,
            z = m,
            P = o[0] - _[0] - p,
            U = -1073741824,
            T = this.m_forwardHistory.length - 1
          do {
            const W = P + t
            W === q || (W < z && s[W - 1] < s[W + 1])
              ? ((f = s[W + 1]),
                (i = f - P - p),
                f < U && O.MarkNextChange(),
                (U = f),
                O.AddModifiedElement(f + 1, i),
                (P = W + 1 - t))
              : ((f = s[W - 1] + 1),
                (i = f - P - p),
                f < U && O.MarkNextChange(),
                (U = f - 1),
                O.AddOriginalElement(f, i + 1),
                (P = W - 1 - t)),
              T >= 0 &&
                ((s = this.m_forwardHistory[T]),
                (t = s[0]),
                (q = 1),
                (z = s.length - 1))
          } while (--T >= -1)
          if (((D = O.getReverseChanges()), M[0])) {
            let W = o[0] + 1,
              B = _[0] + 1
            if (D !== null && D.length > 0) {
              const te = D[D.length - 1]
              ;(W = Math.max(W, te.getOriginalEnd())),
                (B = Math.max(B, te.getModifiedEnd()))
            }
            I = [new N.DiffChange(W, d - W + 1, B, u - B + 1)]
          } else {
            ;(O = new c()),
              (q = w),
              (z = S),
              (P = o[0] - _[0] - b),
              (U = 1073741824),
              (T = E
                ? this.m_reverseHistory.length - 1
                : this.m_reverseHistory.length - 2)
            do {
              const W = P + L
              W === q || (W < z && a[W - 1] >= a[W + 1])
                ? ((f = a[W + 1] - 1),
                  (i = f - P - b),
                  f > U && O.MarkNextChange(),
                  (U = f + 1),
                  O.AddOriginalElement(f + 1, i + 1),
                  (P = W + 1 - L))
                : ((f = a[W - 1]),
                  (i = f - P - b),
                  f > U && O.MarkNextChange(),
                  (U = f),
                  O.AddModifiedElement(f + 1, i + 1),
                  (P = W - 1 - L)),
                T >= 0 &&
                  ((a = this.m_reverseHistory[T]),
                  (L = a[0]),
                  (q = 1),
                  (z = a.length - 1))
            } while (--T >= -1)
            I = O.getChanges()
          }
          return this.ConcatenateChanges(D, I)
        }
        ComputeRecursionPoint(t, g, m, p, L, w, S) {
          let b = 0,
            s = 0,
            a = 0,
            f = 0,
            d = 0,
            o = 0
          t--,
            m--,
            (L[0] = 0),
            (w[0] = 0),
            (this.m_forwardHistory = []),
            (this.m_reverseHistory = [])
          const i = g - t + (p - m),
            u = i + 1,
            _ = new Int32Array(u),
            E = new Int32Array(u),
            M = p - m,
            D = g - t,
            I = t - m,
            O = g - p,
            z = (D - M) % 2 == 0
          ;(_[M] = t), (E[D] = g), (S[0] = !1)
          for (let P = 1; P <= i / 2 + 1; P++) {
            let U = 0,
              T = 0
            ;(a = this.ClipDiagonalBound(M - P, P, M, u)),
              (f = this.ClipDiagonalBound(M + P, P, M, u))
            for (let B = a; B <= f; B += 2) {
              B === a || (B < f && _[B - 1] < _[B + 1])
                ? (b = _[B + 1])
                : (b = _[B - 1] + 1),
                (s = b - (B - M) - I)
              const te = b
              for (; b < g && s < p && this.ElementsAreEqual(b + 1, s + 1); )
                b++, s++
              if (
                ((_[B] = b),
                b + s > U + T && ((U = b), (T = s)),
                !z && Math.abs(B - D) <= P - 1 && b >= E[B])
              )
                return (
                  (L[0] = b),
                  (w[0] = s),
                  te <= E[B] && 1447 > 0 && P <= 1447 + 1
                    ? this.WALKTRACE(
                        M,
                        a,
                        f,
                        I,
                        D,
                        d,
                        o,
                        O,
                        _,
                        E,
                        b,
                        g,
                        L,
                        s,
                        p,
                        w,
                        z,
                        S
                      )
                    : null
                )
            }
            const W = (U - t + (T - m) - P) / 2
            if (
              this.ContinueProcessingPredicate !== null &&
              !this.ContinueProcessingPredicate(U, W)
            )
              return (
                (S[0] = !0),
                (L[0] = U),
                (w[0] = T),
                W > 0 && 1447 > 0 && P <= 1447 + 1
                  ? this.WALKTRACE(
                      M,
                      a,
                      f,
                      I,
                      D,
                      d,
                      o,
                      O,
                      _,
                      E,
                      b,
                      g,
                      L,
                      s,
                      p,
                      w,
                      z,
                      S
                    )
                  : (t++, m++, [new N.DiffChange(t, g - t + 1, m, p - m + 1)])
              )
            ;(d = this.ClipDiagonalBound(D - P, P, D, u)),
              (o = this.ClipDiagonalBound(D + P, P, D, u))
            for (let B = d; B <= o; B += 2) {
              B === d || (B < o && E[B - 1] >= E[B + 1])
                ? (b = E[B + 1] - 1)
                : (b = E[B - 1]),
                (s = b - (B - D) - O)
              const te = b
              for (; b > t && s > m && this.ElementsAreEqual(b, s); ) b--, s--
              if (((E[B] = b), z && Math.abs(B - M) <= P && b <= _[B]))
                return (
                  (L[0] = b),
                  (w[0] = s),
                  te >= _[B] && 1447 > 0 && P <= 1447 + 1
                    ? this.WALKTRACE(
                        M,
                        a,
                        f,
                        I,
                        D,
                        d,
                        o,
                        O,
                        _,
                        E,
                        b,
                        g,
                        L,
                        s,
                        p,
                        w,
                        z,
                        S
                      )
                    : null
                )
            }
            if (P <= 1447) {
              let B = new Int32Array(f - a + 2)
              ;(B[0] = M - a + 1),
                C.Copy2(_, a, B, 1, f - a + 1),
                this.m_forwardHistory.push(B),
                (B = new Int32Array(o - d + 2)),
                (B[0] = D - d + 1),
                C.Copy2(E, d, B, 1, o - d + 1),
                this.m_reverseHistory.push(B)
            }
          }
          return this.WALKTRACE(
            M,
            a,
            f,
            I,
            D,
            d,
            o,
            O,
            _,
            E,
            b,
            g,
            L,
            s,
            p,
            w,
            z,
            S
          )
        }
        PrettifyChanges(t) {
          for (let g = 0; g < t.length; g++) {
            const m = t[g],
              p =
                g < t.length - 1
                  ? t[g + 1].originalStart
                  : this._originalElementsOrHash.length,
              L =
                g < t.length - 1
                  ? t[g + 1].modifiedStart
                  : this._modifiedElementsOrHash.length,
              w = m.originalLength > 0,
              S = m.modifiedLength > 0
            for (
              ;
              m.originalStart + m.originalLength < p &&
              m.modifiedStart + m.modifiedLength < L &&
              (!w ||
                this.OriginalElementsAreEqual(
                  m.originalStart,
                  m.originalStart + m.originalLength
                )) &&
              (!S ||
                this.ModifiedElementsAreEqual(
                  m.modifiedStart,
                  m.modifiedStart + m.modifiedLength
                ));

            ) {
              const s = this.ElementsAreStrictEqual(
                m.originalStart,
                m.modifiedStart
              )
              if (
                this.ElementsAreStrictEqual(
                  m.originalStart + m.originalLength,
                  m.modifiedStart + m.modifiedLength
                ) &&
                !s
              )
                break
              m.originalStart++, m.modifiedStart++
            }
            const b = [null]
            if (g < t.length - 1 && this.ChangesOverlap(t[g], t[g + 1], b)) {
              ;(t[g] = b[0]), t.splice(g + 1, 1), g--
              continue
            }
          }
          for (let g = t.length - 1; g >= 0; g--) {
            const m = t[g]
            let p = 0,
              L = 0
            if (g > 0) {
              const f = t[g - 1]
              ;(p = f.originalStart + f.originalLength),
                (L = f.modifiedStart + f.modifiedLength)
            }
            const w = m.originalLength > 0,
              S = m.modifiedLength > 0
            let b = 0,
              s = this._boundaryScore(
                m.originalStart,
                m.originalLength,
                m.modifiedStart,
                m.modifiedLength
              )
            for (let f = 1; ; f++) {
              const d = m.originalStart - f,
                o = m.modifiedStart - f
              if (
                d < p ||
                o < L ||
                (w &&
                  !this.OriginalElementsAreEqual(d, d + m.originalLength)) ||
                (S && !this.ModifiedElementsAreEqual(o, o + m.modifiedLength))
              )
                break
              const u =
                (d === p && o === L ? 5 : 0) +
                this._boundaryScore(d, m.originalLength, o, m.modifiedLength)
              u > s && ((s = u), (b = f))
            }
            ;(m.originalStart -= b), (m.modifiedStart -= b)
            const a = [null]
            if (g > 0 && this.ChangesOverlap(t[g - 1], t[g], a)) {
              ;(t[g - 1] = a[0]), t.splice(g, 1), g++
              continue
            }
          }
          if (this._hasStrings)
            for (let g = 1, m = t.length; g < m; g++) {
              const p = t[g - 1],
                L = t[g],
                w = L.originalStart - p.originalStart - p.originalLength,
                S = p.originalStart,
                b = L.originalStart + L.originalLength,
                s = b - S,
                a = p.modifiedStart,
                f = L.modifiedStart + L.modifiedLength,
                d = f - a
              if (w < 5 && s < 20 && d < 20) {
                const o = this._findBetterContiguousSequence(S, s, a, d, w)
                if (o) {
                  const [i, u] = o
                  ;(i !== p.originalStart + p.originalLength ||
                    u !== p.modifiedStart + p.modifiedLength) &&
                    ((p.originalLength = i - p.originalStart),
                    (p.modifiedLength = u - p.modifiedStart),
                    (L.originalStart = i + w),
                    (L.modifiedStart = u + w),
                    (L.originalLength = b - L.originalStart),
                    (L.modifiedLength = f - L.modifiedStart))
                }
              }
            }
          return t
        }
        _findBetterContiguousSequence(t, g, m, p, L) {
          if (g < L || p < L) return null
          const w = t + g - L + 1,
            S = m + p - L + 1
          let b = 0,
            s = 0,
            a = 0
          for (let f = t; f < w; f++)
            for (let d = m; d < S; d++) {
              const o = this._contiguousSequenceScore(f, d, L)
              o > 0 && o > b && ((b = o), (s = f), (a = d))
            }
          return b > 0 ? [s, a] : null
        }
        _contiguousSequenceScore(t, g, m) {
          let p = 0
          for (let L = 0; L < m; L++) {
            if (!this.ElementsAreEqual(t + L, g + L)) return 0
            p += this._originalStringElements[t + L].length
          }
          return p
        }
        _OriginalIsBoundary(t) {
          return t <= 0 || t >= this._originalElementsOrHash.length - 1
            ? !0
            : this._hasStrings && /^\s*$/.test(this._originalStringElements[t])
        }
        _OriginalRegionIsBoundary(t, g) {
          if (this._OriginalIsBoundary(t) || this._OriginalIsBoundary(t - 1))
            return !0
          if (g > 0) {
            const m = t + g
            if (this._OriginalIsBoundary(m - 1) || this._OriginalIsBoundary(m))
              return !0
          }
          return !1
        }
        _ModifiedIsBoundary(t) {
          return t <= 0 || t >= this._modifiedElementsOrHash.length - 1
            ? !0
            : this._hasStrings && /^\s*$/.test(this._modifiedStringElements[t])
        }
        _ModifiedRegionIsBoundary(t, g) {
          if (this._ModifiedIsBoundary(t) || this._ModifiedIsBoundary(t - 1))
            return !0
          if (g > 0) {
            const m = t + g
            if (this._ModifiedIsBoundary(m - 1) || this._ModifiedIsBoundary(m))
              return !0
          }
          return !1
        }
        _boundaryScore(t, g, m, p) {
          const L = this._OriginalRegionIsBoundary(t, g) ? 1 : 0,
            w = this._ModifiedRegionIsBoundary(m, p) ? 1 : 0
          return L + w
        }
        ConcatenateChanges(t, g) {
          const m = []
          if (t.length === 0 || g.length === 0) return g.length > 0 ? g : t
          if (this.ChangesOverlap(t[t.length - 1], g[0], m)) {
            const p = new Array(t.length + g.length - 1)
            return (
              C.Copy(t, 0, p, 0, t.length - 1),
              (p[t.length - 1] = m[0]),
              C.Copy(g, 1, p, t.length, g.length - 1),
              p
            )
          } else {
            const p = new Array(t.length + g.length)
            return (
              C.Copy(t, 0, p, 0, t.length),
              C.Copy(g, 0, p, t.length, g.length),
              p
            )
          }
        }
        ChangesOverlap(t, g, m) {
          if (
            (y.Assert(
              t.originalStart <= g.originalStart,
              'Left change is not less than or equal to right change'
            ),
            y.Assert(
              t.modifiedStart <= g.modifiedStart,
              'Left change is not less than or equal to right change'
            ),
            t.originalStart + t.originalLength >= g.originalStart ||
              t.modifiedStart + t.modifiedLength >= g.modifiedStart)
          ) {
            const p = t.originalStart
            let L = t.originalLength
            const w = t.modifiedStart
            let S = t.modifiedLength
            return (
              t.originalStart + t.originalLength >= g.originalStart &&
                (L = g.originalStart + g.originalLength - t.originalStart),
              t.modifiedStart + t.modifiedLength >= g.modifiedStart &&
                (S = g.modifiedStart + g.modifiedLength - t.modifiedStart),
              (m[0] = new N.DiffChange(p, L, w, S)),
              !0
            )
          } else return (m[0] = null), !1
        }
        ClipDiagonalBound(t, g, m, p) {
          if (t >= 0 && t < p) return t
          const L = m,
            w = p - m - 1,
            S = g % 2 == 0
          if (t < 0) {
            const b = L % 2 == 0
            return S === b ? 0 : 1
          } else {
            const b = w % 2 == 0
            return S === b ? p - 1 : p - 2
          }
        }
      }
      r.LcsDiff = h
    }),
    Y(X[6], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.assertNever =
          r.withNullAsUndefined =
          r.createProxyObject =
          r.getAllMethodNames =
          r.getAllPropertyNames =
          r.validateConstraint =
          r.validateConstraints =
          r.isFunction =
          r.assertIsDefined =
          r.assertType =
          r.isUndefinedOrNull =
          r.isDefined =
          r.isUndefined =
          r.isBoolean =
          r.isIterable =
          r.isNumber =
          r.isTypedArray =
          r.isObject =
          r.isString =
          r.isArray =
            void 0)
      function N(d) {
        return Array.isArray(d)
      }
      r.isArray = N
      function e(d) {
        return typeof d == 'string'
      }
      r.isString = e
      function A(d) {
        return (
          typeof d == 'object' &&
          d !== null &&
          !Array.isArray(d) &&
          !(d instanceof RegExp) &&
          !(d instanceof Date)
        )
      }
      r.isObject = A
      function l(d) {
        const o = Object.getPrototypeOf(Uint8Array)
        return typeof d == 'object' && d instanceof o
      }
      r.isTypedArray = l
      function y(d) {
        return typeof d == 'number' && !isNaN(d)
      }
      r.isNumber = y
      function C(d) {
        return !!d && typeof d[Symbol.iterator] == 'function'
      }
      r.isIterable = C
      function c(d) {
        return d === !0 || d === !1
      }
      r.isBoolean = c
      function h(d) {
        return typeof d == 'undefined'
      }
      r.isUndefined = h
      function v(d) {
        return !t(d)
      }
      r.isDefined = v
      function t(d) {
        return h(d) || d === null
      }
      r.isUndefinedOrNull = t
      function g(d, o) {
        if (!d)
          throw new Error(
            o ? `Unexpected type, expected '${o}'` : 'Unexpected type'
          )
      }
      r.assertType = g
      function m(d) {
        if (t(d))
          throw new Error('Assertion Failed: argument is undefined or null')
        return d
      }
      r.assertIsDefined = m
      function p(d) {
        return typeof d == 'function'
      }
      r.isFunction = p
      function L(d, o) {
        const i = Math.min(d.length, o.length)
        for (let u = 0; u < i; u++) w(d[u], o[u])
      }
      r.validateConstraints = L
      function w(d, o) {
        if (e(o)) {
          if (typeof d !== o)
            throw new Error(`argument does not match constraint: typeof ${o}`)
        } else if (p(o)) {
          try {
            if (d instanceof o) return
          } catch {}
          if (
            (!t(d) && d.constructor === o) ||
            (o.length === 1 && o.call(void 0, d) === !0)
          )
            return
          throw new Error(
            'argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true'
          )
        }
      }
      r.validateConstraint = w
      function S(d) {
        let o = [],
          i = Object.getPrototypeOf(d)
        for (; Object.prototype !== i; )
          (o = o.concat(Object.getOwnPropertyNames(i))),
            (i = Object.getPrototypeOf(i))
        return o
      }
      r.getAllPropertyNames = S
      function b(d) {
        const o = []
        for (const i of S(d)) typeof d[i] == 'function' && o.push(i)
        return o
      }
      r.getAllMethodNames = b
      function s(d, o) {
        const i = (_) =>
            function () {
              const E = Array.prototype.slice.call(arguments, 0)
              return o(_, E)
            },
          u = {}
        for (const _ of d) u[_] = i(_)
        return u
      }
      r.createProxyObject = s
      function a(d) {
        return d === null ? void 0 : d
      }
      r.withNullAsUndefined = a
      function f(d, o = 'Unreachable') {
        throw new Error(o)
      }
      r.assertNever = f
    }),
    Y(X[27], J([0, 1, 6]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.equals =
          r.mixin =
          r.cloneAndChange =
          r.deepFreeze =
          r.deepClone =
            void 0)
      function e(v) {
        if (!v || typeof v != 'object' || v instanceof RegExp) return v
        const t = Array.isArray(v) ? [] : {}
        return (
          Object.keys(v).forEach((g) => {
            v[g] && typeof v[g] == 'object' ? (t[g] = e(v[g])) : (t[g] = v[g])
          }),
          t
        )
      }
      r.deepClone = e
      function A(v) {
        if (!v || typeof v != 'object') return v
        const t = [v]
        for (; t.length > 0; ) {
          const g = t.shift()
          Object.freeze(g)
          for (const m in g)
            if (l.call(g, m)) {
              const p = g[m]
              typeof p == 'object' &&
                !Object.isFrozen(p) &&
                !(0, N.isTypedArray)(p) &&
                t.push(p)
            }
        }
        return v
      }
      r.deepFreeze = A
      const l = Object.prototype.hasOwnProperty
      function y(v, t) {
        return C(v, t, new Set())
      }
      r.cloneAndChange = y
      function C(v, t, g) {
        if ((0, N.isUndefinedOrNull)(v)) return v
        const m = t(v)
        if (typeof m != 'undefined') return m
        if ((0, N.isArray)(v)) {
          const p = []
          for (const L of v) p.push(C(L, t, g))
          return p
        }
        if ((0, N.isObject)(v)) {
          if (g.has(v)) throw new Error('Cannot clone recursive data-structure')
          g.add(v)
          const p = {}
          for (const L in v) l.call(v, L) && (p[L] = C(v[L], t, g))
          return g.delete(v), p
        }
        return v
      }
      function c(v, t, g = !0) {
        return (0, N.isObject)(v)
          ? ((0, N.isObject)(t) &&
              Object.keys(t).forEach((m) => {
                m in v
                  ? g &&
                    ((0, N.isObject)(v[m]) && (0, N.isObject)(t[m])
                      ? c(v[m], t[m], g)
                      : (v[m] = t[m]))
                  : (v[m] = t[m])
              }),
            v)
          : t
      }
      r.mixin = c
      function h(v, t) {
        if (v === t) return !0
        if (
          v == null ||
          t === null ||
          t === void 0 ||
          typeof v != typeof t ||
          typeof v != 'object' ||
          Array.isArray(v) !== Array.isArray(t)
        )
          return !1
        let g, m
        if (Array.isArray(v)) {
          if (v.length !== t.length) return !1
          for (g = 0; g < v.length; g++) if (!h(v[g], t[g])) return !1
        } else {
          const p = []
          for (m in v) p.push(m)
          p.sort()
          const L = []
          for (m in t) L.push(m)
          if ((L.sort(), !h(p, L))) return !1
          for (g = 0; g < p.length; g++) if (!h(v[p[g]], t[p[g]])) return !1
        }
        return !0
      }
      r.equals = h
    }),
    Y(X[14], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.toUint32 = r.toUint8 = void 0)
      function N(A) {
        return A < 0 ? 0 : A > 255 ? 255 : A | 0
      }
      r.toUint8 = N
      function e(A) {
        return A < 0 ? 0 : A > 4294967295 ? 4294967295 : A | 0
      }
      r.toUint32 = e
    }),
    Y(X[15], J([0, 1, 14]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.CharacterSet = r.CharacterClassifier = void 0)
      class e {
        constructor(y) {
          const C = (0, N.toUint8)(y)
          ;(this._defaultValue = C),
            (this._asciiMap = e._createAsciiMap(C)),
            (this._map = new Map())
        }
        static _createAsciiMap(y) {
          const C = new Uint8Array(256)
          for (let c = 0; c < 256; c++) C[c] = y
          return C
        }
        set(y, C) {
          const c = (0, N.toUint8)(C)
          y >= 0 && y < 256 ? (this._asciiMap[y] = c) : this._map.set(y, c)
        }
        get(y) {
          return y >= 0 && y < 256
            ? this._asciiMap[y]
            : this._map.get(y) || this._defaultValue
        }
      }
      r.CharacterClassifier = e
      class A {
        constructor() {
          this._actual = new e(0)
        }
        add(y) {
          this._actual.set(y, 1)
        }
        has(y) {
          return this._actual.get(y) === 1
        }
      }
      r.CharacterSet = A
    }),
    Y(X[3], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.Position = void 0)
      class N {
        constructor(A, l) {
          ;(this.lineNumber = A), (this.column = l)
        }
        with(A = this.lineNumber, l = this.column) {
          return A === this.lineNumber && l === this.column ? this : new N(A, l)
        }
        delta(A = 0, l = 0) {
          return this.with(this.lineNumber + A, this.column + l)
        }
        equals(A) {
          return N.equals(this, A)
        }
        static equals(A, l) {
          return !A && !l
            ? !0
            : !!A &&
                !!l &&
                A.lineNumber === l.lineNumber &&
                A.column === l.column
        }
        isBefore(A) {
          return N.isBefore(this, A)
        }
        static isBefore(A, l) {
          return A.lineNumber < l.lineNumber
            ? !0
            : l.lineNumber < A.lineNumber
            ? !1
            : A.column < l.column
        }
        isBeforeOrEqual(A) {
          return N.isBeforeOrEqual(this, A)
        }
        static isBeforeOrEqual(A, l) {
          return A.lineNumber < l.lineNumber
            ? !0
            : l.lineNumber < A.lineNumber
            ? !1
            : A.column <= l.column
        }
        static compare(A, l) {
          const y = A.lineNumber | 0,
            C = l.lineNumber | 0
          if (y === C) {
            const c = A.column | 0,
              h = l.column | 0
            return c - h
          }
          return y - C
        }
        clone() {
          return new N(this.lineNumber, this.column)
        }
        toString() {
          return '(' + this.lineNumber + ',' + this.column + ')'
        }
        static lift(A) {
          return new N(A.lineNumber, A.column)
        }
        static isIPosition(A) {
          return (
            A && typeof A.lineNumber == 'number' && typeof A.column == 'number'
          )
        }
      }
      r.Position = N
    }),
    Y(X[4], J([0, 1, 3]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }), (r.Range = void 0)
      class e {
        constructor(l, y, C, c) {
          l > C || (l === C && y > c)
            ? ((this.startLineNumber = C),
              (this.startColumn = c),
              (this.endLineNumber = l),
              (this.endColumn = y))
            : ((this.startLineNumber = l),
              (this.startColumn = y),
              (this.endLineNumber = C),
              (this.endColumn = c))
        }
        isEmpty() {
          return e.isEmpty(this)
        }
        static isEmpty(l) {
          return (
            l.startLineNumber === l.endLineNumber &&
            l.startColumn === l.endColumn
          )
        }
        containsPosition(l) {
          return e.containsPosition(this, l)
        }
        static containsPosition(l, y) {
          return !(
            y.lineNumber < l.startLineNumber ||
            y.lineNumber > l.endLineNumber ||
            (y.lineNumber === l.startLineNumber && y.column < l.startColumn) ||
            (y.lineNumber === l.endLineNumber && y.column > l.endColumn)
          )
        }
        static strictContainsPosition(l, y) {
          return !(
            y.lineNumber < l.startLineNumber ||
            y.lineNumber > l.endLineNumber ||
            (y.lineNumber === l.startLineNumber && y.column <= l.startColumn) ||
            (y.lineNumber === l.endLineNumber && y.column >= l.endColumn)
          )
        }
        containsRange(l) {
          return e.containsRange(this, l)
        }
        static containsRange(l, y) {
          return !(
            y.startLineNumber < l.startLineNumber ||
            y.endLineNumber < l.startLineNumber ||
            y.startLineNumber > l.endLineNumber ||
            y.endLineNumber > l.endLineNumber ||
            (y.startLineNumber === l.startLineNumber &&
              y.startColumn < l.startColumn) ||
            (y.endLineNumber === l.endLineNumber && y.endColumn > l.endColumn)
          )
        }
        strictContainsRange(l) {
          return e.strictContainsRange(this, l)
        }
        static strictContainsRange(l, y) {
          return !(
            y.startLineNumber < l.startLineNumber ||
            y.endLineNumber < l.startLineNumber ||
            y.startLineNumber > l.endLineNumber ||
            y.endLineNumber > l.endLineNumber ||
            (y.startLineNumber === l.startLineNumber &&
              y.startColumn <= l.startColumn) ||
            (y.endLineNumber === l.endLineNumber && y.endColumn >= l.endColumn)
          )
        }
        plusRange(l) {
          return e.plusRange(this, l)
        }
        static plusRange(l, y) {
          let C, c, h, v
          return (
            y.startLineNumber < l.startLineNumber
              ? ((C = y.startLineNumber), (c = y.startColumn))
              : y.startLineNumber === l.startLineNumber
              ? ((C = y.startLineNumber),
                (c = Math.min(y.startColumn, l.startColumn)))
              : ((C = l.startLineNumber), (c = l.startColumn)),
            y.endLineNumber > l.endLineNumber
              ? ((h = y.endLineNumber), (v = y.endColumn))
              : y.endLineNumber === l.endLineNumber
              ? ((h = y.endLineNumber),
                (v = Math.max(y.endColumn, l.endColumn)))
              : ((h = l.endLineNumber), (v = l.endColumn)),
            new e(C, c, h, v)
          )
        }
        intersectRanges(l) {
          return e.intersectRanges(this, l)
        }
        static intersectRanges(l, y) {
          let C = l.startLineNumber,
            c = l.startColumn,
            h = l.endLineNumber,
            v = l.endColumn
          const t = y.startLineNumber,
            g = y.startColumn,
            m = y.endLineNumber,
            p = y.endColumn
          return (
            C < t ? ((C = t), (c = g)) : C === t && (c = Math.max(c, g)),
            h > m ? ((h = m), (v = p)) : h === m && (v = Math.min(v, p)),
            C > h || (C === h && c > v) ? null : new e(C, c, h, v)
          )
        }
        equalsRange(l) {
          return e.equalsRange(this, l)
        }
        static equalsRange(l, y) {
          return (
            !!l &&
            !!y &&
            l.startLineNumber === y.startLineNumber &&
            l.startColumn === y.startColumn &&
            l.endLineNumber === y.endLineNumber &&
            l.endColumn === y.endColumn
          )
        }
        getEndPosition() {
          return e.getEndPosition(this)
        }
        static getEndPosition(l) {
          return new N.Position(l.endLineNumber, l.endColumn)
        }
        getStartPosition() {
          return e.getStartPosition(this)
        }
        static getStartPosition(l) {
          return new N.Position(l.startLineNumber, l.startColumn)
        }
        toString() {
          return (
            '[' +
            this.startLineNumber +
            ',' +
            this.startColumn +
            ' -> ' +
            this.endLineNumber +
            ',' +
            this.endColumn +
            ']'
          )
        }
        setEndPosition(l, y) {
          return new e(this.startLineNumber, this.startColumn, l, y)
        }
        setStartPosition(l, y) {
          return new e(l, y, this.endLineNumber, this.endColumn)
        }
        collapseToStart() {
          return e.collapseToStart(this)
        }
        static collapseToStart(l) {
          return new e(
            l.startLineNumber,
            l.startColumn,
            l.startLineNumber,
            l.startColumn
          )
        }
        static fromPositions(l, y = l) {
          return new e(l.lineNumber, l.column, y.lineNumber, y.column)
        }
        static lift(l) {
          return l
            ? new e(
                l.startLineNumber,
                l.startColumn,
                l.endLineNumber,
                l.endColumn
              )
            : null
        }
        static isIRange(l) {
          return (
            l &&
            typeof l.startLineNumber == 'number' &&
            typeof l.startColumn == 'number' &&
            typeof l.endLineNumber == 'number' &&
            typeof l.endColumn == 'number'
          )
        }
        static areIntersectingOrTouching(l, y) {
          return !(
            l.endLineNumber < y.startLineNumber ||
            (l.endLineNumber === y.startLineNumber &&
              l.endColumn < y.startColumn) ||
            y.endLineNumber < l.startLineNumber ||
            (y.endLineNumber === l.startLineNumber &&
              y.endColumn < l.startColumn)
          )
        }
        static areIntersecting(l, y) {
          return !(
            l.endLineNumber < y.startLineNumber ||
            (l.endLineNumber === y.startLineNumber &&
              l.endColumn <= y.startColumn) ||
            y.endLineNumber < l.startLineNumber ||
            (y.endLineNumber === l.startLineNumber &&
              y.endColumn <= l.startColumn)
          )
        }
        static compareRangesUsingStarts(l, y) {
          if (l && y) {
            const h = l.startLineNumber | 0,
              v = y.startLineNumber | 0
            if (h === v) {
              const t = l.startColumn | 0,
                g = y.startColumn | 0
              if (t === g) {
                const m = l.endLineNumber | 0,
                  p = y.endLineNumber | 0
                if (m === p) {
                  const L = l.endColumn | 0,
                    w = y.endColumn | 0
                  return L - w
                }
                return m - p
              }
              return t - g
            }
            return h - v
          }
          return (l ? 1 : 0) - (y ? 1 : 0)
        }
        static compareRangesUsingEnds(l, y) {
          return l.endLineNumber === y.endLineNumber
            ? l.endColumn === y.endColumn
              ? l.startLineNumber === y.startLineNumber
                ? l.startColumn - y.startColumn
                : l.startLineNumber - y.startLineNumber
              : l.endColumn - y.endColumn
            : l.endLineNumber - y.endLineNumber
        }
        static spansMultipleLines(l) {
          return l.endLineNumber > l.startLineNumber
        }
        toJSON() {
          return this
        }
      }
      r.Range = e
    }),
    Y(X[28], J([0, 1, 3, 4]), function (F, r, N, e) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.Selection = void 0)
      class A extends e.Range {
        constructor(y, C, c, h) {
          super(y, C, c, h)
          ;(this.selectionStartLineNumber = y),
            (this.selectionStartColumn = C),
            (this.positionLineNumber = c),
            (this.positionColumn = h)
        }
        toString() {
          return (
            '[' +
            this.selectionStartLineNumber +
            ',' +
            this.selectionStartColumn +
            ' -> ' +
            this.positionLineNumber +
            ',' +
            this.positionColumn +
            ']'
          )
        }
        equalsSelection(y) {
          return A.selectionsEqual(this, y)
        }
        static selectionsEqual(y, C) {
          return (
            y.selectionStartLineNumber === C.selectionStartLineNumber &&
            y.selectionStartColumn === C.selectionStartColumn &&
            y.positionLineNumber === C.positionLineNumber &&
            y.positionColumn === C.positionColumn
          )
        }
        getDirection() {
          return this.selectionStartLineNumber === this.startLineNumber &&
            this.selectionStartColumn === this.startColumn
            ? 0
            : 1
        }
        setEndPosition(y, C) {
          return this.getDirection() === 0
            ? new A(this.startLineNumber, this.startColumn, y, C)
            : new A(y, C, this.startLineNumber, this.startColumn)
        }
        getPosition() {
          return new N.Position(this.positionLineNumber, this.positionColumn)
        }
        getSelectionStart() {
          return new N.Position(
            this.selectionStartLineNumber,
            this.selectionStartColumn
          )
        }
        setStartPosition(y, C) {
          return this.getDirection() === 0
            ? new A(y, C, this.endLineNumber, this.endColumn)
            : new A(this.endLineNumber, this.endColumn, y, C)
        }
        static fromPositions(y, C = y) {
          return new A(y.lineNumber, y.column, C.lineNumber, C.column)
        }
        static fromRange(y, C) {
          return C === 0
            ? new A(
                y.startLineNumber,
                y.startColumn,
                y.endLineNumber,
                y.endColumn
              )
            : new A(
                y.endLineNumber,
                y.endColumn,
                y.startLineNumber,
                y.startColumn
              )
        }
        static liftSelection(y) {
          return new A(
            y.selectionStartLineNumber,
            y.selectionStartColumn,
            y.positionLineNumber,
            y.positionColumn
          )
        }
        static selectionsArrEqual(y, C) {
          if ((y && !C) || (!y && C)) return !1
          if (!y && !C) return !0
          if (y.length !== C.length) return !1
          for (let c = 0, h = y.length; c < h; c++)
            if (!this.selectionsEqual(y[c], C[c])) return !1
          return !0
        }
        static isISelection(y) {
          return (
            y &&
            typeof y.selectionStartLineNumber == 'number' &&
            typeof y.selectionStartColumn == 'number' &&
            typeof y.positionLineNumber == 'number' &&
            typeof y.positionColumn == 'number'
          )
        }
        static createWithDirection(y, C, c, h, v) {
          return v === 0 ? new A(y, C, c, h) : new A(c, h, y, C)
        }
      }
      r.Selection = A
    }),
    Y(X[29], J([0, 1, 15]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.getMapForWordSeparators = r.WordCharacterClassifier = void 0)
      class e extends N.CharacterClassifier {
        constructor(y) {
          super(0)
          for (let C = 0, c = y.length; C < c; C++) this.set(y.charCodeAt(C), 2)
          this.set(32, 1), this.set(9, 1)
        }
      }
      r.WordCharacterClassifier = e
      function A(l) {
        const y = {}
        return (C) => (y.hasOwnProperty(C) || (y[C] = l(C)), y[C])
      }
      r.getMapForWordSeparators = A((l) => new e(l))
    }),
    Y(X[16], J([0, 1, 11, 12]), function (F, r, N, e) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.getWordAtText =
          r.ensureValidWordDefinition =
          r.DEFAULT_WORD_REGEXP =
          r.USUAL_WORD_SEPARATORS =
            void 0),
        (r.USUAL_WORD_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?')
      function A(h = '') {
        let v = '(-?\\d*\\.\\d\\w*)|([^'
        for (const t of r.USUAL_WORD_SEPARATORS)
          h.indexOf(t) >= 0 || (v += '\\' + t)
        return (v += '\\s]+)'), new RegExp(v, 'g')
      }
      r.DEFAULT_WORD_REGEXP = A()
      function l(h) {
        let v = r.DEFAULT_WORD_REGEXP
        if (h && h instanceof RegExp)
          if (h.global) v = h
          else {
            let t = 'g'
            h.ignoreCase && (t += 'i'),
              h.multiline && (t += 'm'),
              h.unicode && (t += 'u'),
              (v = new RegExp(h.source, t))
          }
        return (v.lastIndex = 0), v
      }
      r.ensureValidWordDefinition = l
      const y = new e.LinkedList()
      y.unshift({ maxLen: 1e3, windowSize: 15, timeBudget: 150 })
      function C(h, v, t, g, m) {
        if ((m || (m = N.Iterable.first(y)), t.length > m.maxLen)) {
          let b = h - m.maxLen / 2
          return (
            b < 0 ? (b = 0) : (g += b),
            (t = t.substring(b, h + m.maxLen / 2)),
            C(h, v, t, g, m)
          )
        }
        const p = Date.now(),
          L = h - 1 - g
        let w = -1,
          S = null
        for (let b = 1; !(Date.now() - p >= m.timeBudget); b++) {
          const s = L - m.windowSize * b
          v.lastIndex = Math.max(0, s)
          const a = c(v, t, L, w)
          if ((!a && S) || ((S = a), s <= 0)) break
          w = s
        }
        if (S) {
          const b = {
            word: S[0],
            startColumn: g + 1 + S.index,
            endColumn: g + 1 + S.index + S[0].length,
          }
          return (v.lastIndex = 0), b
        }
        return null
      }
      r.getWordAtText = C
      function c(h, v, t, g) {
        let m
        for (; (m = h.exec(v)); ) {
          const p = m.index || 0
          if (p <= t && h.lastIndex >= t) return m
          if (g > 0 && p > g) return null
        }
        return null
      }
    }),
    Y(X[30], J([0, 1, 13, 2]), function (F, r, N, e) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.DiffComputer = void 0)
      const A = 3
      function l(L, w, S, b) {
        return new N.LcsDiff(L, w, S).ComputeDiff(b)
      }
      class y {
        constructor(w) {
          const S = [],
            b = []
          for (let s = 0, a = w.length; s < a; s++)
            (S[s] = g(w[s], 1)), (b[s] = m(w[s], 1))
          ;(this.lines = w), (this._startColumns = S), (this._endColumns = b)
        }
        getElements() {
          const w = []
          for (let S = 0, b = this.lines.length; S < b; S++)
            w[S] = this.lines[S].substring(
              this._startColumns[S] - 1,
              this._endColumns[S] - 1
            )
          return w
        }
        getStrictElement(w) {
          return this.lines[w]
        }
        getStartLineNumber(w) {
          return w + 1
        }
        getEndLineNumber(w) {
          return w + 1
        }
        createCharSequence(w, S, b) {
          const s = [],
            a = [],
            f = []
          let d = 0
          for (let o = S; o <= b; o++) {
            const i = this.lines[o],
              u = w ? this._startColumns[o] : 1,
              _ = w ? this._endColumns[o] : i.length + 1
            for (let E = u; E < _; E++)
              (s[d] = i.charCodeAt(E - 1)), (a[d] = o + 1), (f[d] = E), d++
            !w &&
              o < b &&
              ((s[d] = 10), (a[d] = o + 1), (f[d] = i.length + 1), d++)
          }
          return new C(s, a, f)
        }
      }
      class C {
        constructor(w, S, b) {
          ;(this._charCodes = w), (this._lineNumbers = S), (this._columns = b)
        }
        toString() {
          return (
            '[' +
            this._charCodes
              .map(
                (w, S) =>
                  (w === 10 ? '\\n' : String.fromCharCode(w)) +
                  `-(${this._lineNumbers[S]},${this._columns[S]})`
              )
              .join(', ') +
            ']'
          )
        }
        _assertIndex(w, S) {
          if (w < 0 || w >= S.length) throw new Error('Illegal index')
        }
        getElements() {
          return this._charCodes
        }
        getStartLineNumber(w) {
          return w > 0 && w === this._lineNumbers.length
            ? this.getEndLineNumber(w - 1)
            : (this._assertIndex(w, this._lineNumbers), this._lineNumbers[w])
        }
        getEndLineNumber(w) {
          return w === -1
            ? this.getStartLineNumber(w + 1)
            : (this._assertIndex(w, this._lineNumbers),
              this._charCodes[w] === 10
                ? this._lineNumbers[w] + 1
                : this._lineNumbers[w])
        }
        getStartColumn(w) {
          return w > 0 && w === this._columns.length
            ? this.getEndColumn(w - 1)
            : (this._assertIndex(w, this._columns), this._columns[w])
        }
        getEndColumn(w) {
          return w === -1
            ? this.getStartColumn(w + 1)
            : (this._assertIndex(w, this._columns),
              this._charCodes[w] === 10 ? 1 : this._columns[w] + 1)
        }
      }
      class c {
        constructor(w, S, b, s, a, f, d, o) {
          ;(this.originalStartLineNumber = w),
            (this.originalStartColumn = S),
            (this.originalEndLineNumber = b),
            (this.originalEndColumn = s),
            (this.modifiedStartLineNumber = a),
            (this.modifiedStartColumn = f),
            (this.modifiedEndLineNumber = d),
            (this.modifiedEndColumn = o)
        }
        static createFromDiffChange(w, S, b) {
          const s = S.getStartLineNumber(w.originalStart),
            a = S.getStartColumn(w.originalStart),
            f = S.getEndLineNumber(w.originalStart + w.originalLength - 1),
            d = S.getEndColumn(w.originalStart + w.originalLength - 1),
            o = b.getStartLineNumber(w.modifiedStart),
            i = b.getStartColumn(w.modifiedStart),
            u = b.getEndLineNumber(w.modifiedStart + w.modifiedLength - 1),
            _ = b.getEndColumn(w.modifiedStart + w.modifiedLength - 1)
          return new c(s, a, f, d, o, i, u, _)
        }
      }
      function h(L) {
        if (L.length <= 1) return L
        const w = [L[0]]
        let S = w[0]
        for (let b = 1, s = L.length; b < s; b++) {
          const a = L[b],
            f = a.originalStart - (S.originalStart + S.originalLength),
            d = a.modifiedStart - (S.modifiedStart + S.modifiedLength)
          Math.min(f, d) < A
            ? ((S.originalLength =
                a.originalStart + a.originalLength - S.originalStart),
              (S.modifiedLength =
                a.modifiedStart + a.modifiedLength - S.modifiedStart))
            : (w.push(a), (S = a))
        }
        return w
      }
      class v {
        constructor(w, S, b, s, a) {
          ;(this.originalStartLineNumber = w),
            (this.originalEndLineNumber = S),
            (this.modifiedStartLineNumber = b),
            (this.modifiedEndLineNumber = s),
            (this.charChanges = a)
        }
        static createFromDiffResult(w, S, b, s, a, f, d) {
          let o, i, u, _, E
          if (
            (S.originalLength === 0
              ? ((o = b.getStartLineNumber(S.originalStart) - 1), (i = 0))
              : ((o = b.getStartLineNumber(S.originalStart)),
                (i = b.getEndLineNumber(
                  S.originalStart + S.originalLength - 1
                ))),
            S.modifiedLength === 0
              ? ((u = s.getStartLineNumber(S.modifiedStart) - 1), (_ = 0))
              : ((u = s.getStartLineNumber(S.modifiedStart)),
                (_ = s.getEndLineNumber(
                  S.modifiedStart + S.modifiedLength - 1
                ))),
            f &&
              S.originalLength > 0 &&
              S.originalLength < 20 &&
              S.modifiedLength > 0 &&
              S.modifiedLength < 20 &&
              a())
          ) {
            const M = b.createCharSequence(
                w,
                S.originalStart,
                S.originalStart + S.originalLength - 1
              ),
              D = s.createCharSequence(
                w,
                S.modifiedStart,
                S.modifiedStart + S.modifiedLength - 1
              )
            if (M.getElements().length > 0 && D.getElements().length > 0) {
              let I = l(M, D, a, !0).changes
              d && (I = h(I)), (E = [])
              for (let O = 0, q = I.length; O < q; O++)
                E.push(c.createFromDiffChange(I[O], M, D))
            }
          }
          return new v(o, i, u, _, E)
        }
      }
      class t {
        constructor(w, S, b) {
          ;(this.shouldComputeCharChanges = b.shouldComputeCharChanges),
            (this.shouldPostProcessCharChanges =
              b.shouldPostProcessCharChanges),
            (this.shouldIgnoreTrimWhitespace = b.shouldIgnoreTrimWhitespace),
            (this.shouldMakePrettyDiff = b.shouldMakePrettyDiff),
            (this.originalLines = w),
            (this.modifiedLines = S),
            (this.original = new y(w)),
            (this.modified = new y(S)),
            (this.continueLineDiff = p(b.maxComputationTime)),
            (this.continueCharDiff = p(
              b.maxComputationTime === 0
                ? 0
                : Math.min(b.maxComputationTime, 5e3)
            ))
        }
        computeDiff() {
          if (
            this.original.lines.length === 1 &&
            this.original.lines[0].length === 0
          )
            return this.modified.lines.length === 1 &&
              this.modified.lines[0].length === 0
              ? { quitEarly: !1, changes: [] }
              : {
                  quitEarly: !1,
                  changes: [
                    {
                      originalStartLineNumber: 1,
                      originalEndLineNumber: 1,
                      modifiedStartLineNumber: 1,
                      modifiedEndLineNumber: this.modified.lines.length,
                      charChanges: [
                        {
                          modifiedEndColumn: 0,
                          modifiedEndLineNumber: 0,
                          modifiedStartColumn: 0,
                          modifiedStartLineNumber: 0,
                          originalEndColumn: 0,
                          originalEndLineNumber: 0,
                          originalStartColumn: 0,
                          originalStartLineNumber: 0,
                        },
                      ],
                    },
                  ],
                }
          if (
            this.modified.lines.length === 1 &&
            this.modified.lines[0].length === 0
          )
            return {
              quitEarly: !1,
              changes: [
                {
                  originalStartLineNumber: 1,
                  originalEndLineNumber: this.original.lines.length,
                  modifiedStartLineNumber: 1,
                  modifiedEndLineNumber: 1,
                  charChanges: [
                    {
                      modifiedEndColumn: 0,
                      modifiedEndLineNumber: 0,
                      modifiedStartColumn: 0,
                      modifiedStartLineNumber: 0,
                      originalEndColumn: 0,
                      originalEndLineNumber: 0,
                      originalStartColumn: 0,
                      originalStartLineNumber: 0,
                    },
                  ],
                },
              ],
            }
          const w = l(
              this.original,
              this.modified,
              this.continueLineDiff,
              this.shouldMakePrettyDiff
            ),
            S = w.changes,
            b = w.quitEarly
          if (this.shouldIgnoreTrimWhitespace) {
            const d = []
            for (let o = 0, i = S.length; o < i; o++)
              d.push(
                v.createFromDiffResult(
                  this.shouldIgnoreTrimWhitespace,
                  S[o],
                  this.original,
                  this.modified,
                  this.continueCharDiff,
                  this.shouldComputeCharChanges,
                  this.shouldPostProcessCharChanges
                )
              )
            return { quitEarly: b, changes: d }
          }
          const s = []
          let a = 0,
            f = 0
          for (let d = -1, o = S.length; d < o; d++) {
            const i = d + 1 < o ? S[d + 1] : null,
              u = i ? i.originalStart : this.originalLines.length,
              _ = i ? i.modifiedStart : this.modifiedLines.length
            for (; a < u && f < _; ) {
              const E = this.originalLines[a],
                M = this.modifiedLines[f]
              if (E !== M) {
                {
                  let D = g(E, 1),
                    I = g(M, 1)
                  for (; D > 1 && I > 1; ) {
                    const O = E.charCodeAt(D - 2),
                      q = M.charCodeAt(I - 2)
                    if (O !== q) break
                    D--, I--
                  }
                  ;(D > 1 || I > 1) &&
                    this._pushTrimWhitespaceCharChange(
                      s,
                      a + 1,
                      1,
                      D,
                      f + 1,
                      1,
                      I
                    )
                }
                {
                  let D = m(E, 1),
                    I = m(M, 1)
                  const O = E.length + 1,
                    q = M.length + 1
                  for (; D < O && I < q; ) {
                    const z = E.charCodeAt(D - 1),
                      P = E.charCodeAt(I - 1)
                    if (z !== P) break
                    D++, I++
                  }
                  ;(D < O || I < q) &&
                    this._pushTrimWhitespaceCharChange(
                      s,
                      a + 1,
                      D,
                      O,
                      f + 1,
                      I,
                      q
                    )
                }
              }
              a++, f++
            }
            i &&
              (s.push(
                v.createFromDiffResult(
                  this.shouldIgnoreTrimWhitespace,
                  i,
                  this.original,
                  this.modified,
                  this.continueCharDiff,
                  this.shouldComputeCharChanges,
                  this.shouldPostProcessCharChanges
                )
              ),
              (a += i.originalLength),
              (f += i.modifiedLength))
          }
          return { quitEarly: b, changes: s }
        }
        _pushTrimWhitespaceCharChange(w, S, b, s, a, f, d) {
          if (this._mergeTrimWhitespaceCharChange(w, S, b, s, a, f, d)) return
          let o
          this.shouldComputeCharChanges &&
            (o = [new c(S, b, S, s, a, f, a, d)]),
            w.push(new v(S, S, a, a, o))
        }
        _mergeTrimWhitespaceCharChange(w, S, b, s, a, f, d) {
          const o = w.length
          if (o === 0) return !1
          const i = w[o - 1]
          return i.originalEndLineNumber === 0 || i.modifiedEndLineNumber === 0
            ? !1
            : i.originalEndLineNumber + 1 === S &&
              i.modifiedEndLineNumber + 1 === a
            ? ((i.originalEndLineNumber = S),
              (i.modifiedEndLineNumber = a),
              this.shouldComputeCharChanges &&
                i.charChanges &&
                i.charChanges.push(new c(S, b, S, s, a, f, a, d)),
              !0)
            : !1
        }
      }
      r.DiffComputer = t
      function g(L, w) {
        const S = e.firstNonWhitespaceIndex(L)
        return S === -1 ? w : S + 1
      }
      function m(L, w) {
        const S = e.lastNonWhitespaceIndex(L)
        return S === -1 ? w : S + 2
      }
      function p(L) {
        if (L === 0) return () => !0
        const w = Date.now()
        return () => Date.now() - w < L
      }
    }),
    Y(X[31], J([0, 1, 15]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.computeLinks =
          r.LinkComputer =
          r.StateMachine =
          r.Uint8Matrix =
            void 0)
      class e {
        constructor(g, m, p) {
          const L = new Uint8Array(g * m)
          for (let w = 0, S = g * m; w < S; w++) L[w] = p
          ;(this._data = L), (this.rows = g), (this.cols = m)
        }
        get(g, m) {
          return this._data[g * this.cols + m]
        }
        set(g, m, p) {
          this._data[g * this.cols + m] = p
        }
      }
      r.Uint8Matrix = e
      class A {
        constructor(g) {
          let m = 0,
            p = 0
          for (let w = 0, S = g.length; w < S; w++) {
            const [b, s, a] = g[w]
            s > m && (m = s), b > p && (p = b), a > p && (p = a)
          }
          m++, p++
          const L = new e(p, m, 0)
          for (let w = 0, S = g.length; w < S; w++) {
            const [b, s, a] = g[w]
            L.set(b, s, a)
          }
          ;(this._states = L), (this._maxCharCode = m)
        }
        nextState(g, m) {
          return m < 0 || m >= this._maxCharCode ? 0 : this._states.get(g, m)
        }
      }
      r.StateMachine = A
      let l = null
      function y() {
        return (
          l === null &&
            (l = new A([
              [1, 104, 2],
              [1, 72, 2],
              [1, 102, 6],
              [1, 70, 6],
              [2, 116, 3],
              [2, 84, 3],
              [3, 116, 4],
              [3, 84, 4],
              [4, 112, 5],
              [4, 80, 5],
              [5, 115, 9],
              [5, 83, 9],
              [5, 58, 10],
              [6, 105, 7],
              [6, 73, 7],
              [7, 108, 8],
              [7, 76, 8],
              [8, 101, 9],
              [8, 69, 9],
              [9, 58, 10],
              [10, 47, 11],
              [11, 47, 12],
            ])),
          l
        )
      }
      let C = null
      function c() {
        if (C === null) {
          C = new N.CharacterClassifier(0)
          const t = ` 	<>'"\u3001\u3002\uFF61\uFF64\uFF0C\uFF0E\uFF1A\uFF1B\u2018\u3008\u300C\u300E\u3014\uFF08\uFF3B\uFF5B\uFF62\uFF63\uFF5D\uFF3D\uFF09\u3015\u300F\u300D\u3009\u2019\uFF40\uFF5E\u2026`
          for (let m = 0; m < t.length; m++) C.set(t.charCodeAt(m), 1)
          const g = '.,;:'
          for (let m = 0; m < g.length; m++) C.set(g.charCodeAt(m), 2)
        }
        return C
      }
      class h {
        static _createLink(g, m, p, L, w) {
          let S = w - 1
          do {
            const b = m.charCodeAt(S)
            if (g.get(b) !== 2) break
            S--
          } while (S > L)
          if (L > 0) {
            const b = m.charCodeAt(L - 1),
              s = m.charCodeAt(S)
            ;((b === 40 && s === 41) ||
              (b === 91 && s === 93) ||
              (b === 123 && s === 125)) &&
              S--
          }
          return {
            range: {
              startLineNumber: p,
              startColumn: L + 1,
              endLineNumber: p,
              endColumn: S + 2,
            },
            url: m.substring(L, S + 1),
          }
        }
        static computeLinks(g, m = y()) {
          const p = c(),
            L = []
          for (let w = 1, S = g.getLineCount(); w <= S; w++) {
            const b = g.getLineContent(w),
              s = b.length
            let a = 0,
              f = 0,
              d = 0,
              o = 1,
              i = !1,
              u = !1,
              _ = !1,
              E = !1
            for (; a < s; ) {
              let M = !1
              const D = b.charCodeAt(a)
              if (o === 13) {
                let I
                switch (D) {
                  case 40:
                    ;(i = !0), (I = 0)
                    break
                  case 41:
                    I = i ? 0 : 1
                    break
                  case 91:
                    ;(_ = !0), (u = !0), (I = 0)
                    break
                  case 93:
                    ;(_ = !1), (I = u ? 0 : 1)
                    break
                  case 123:
                    ;(E = !0), (I = 0)
                    break
                  case 125:
                    I = E ? 0 : 1
                    break
                  case 39:
                    I = d === 39 ? 1 : 0
                    break
                  case 34:
                    I = d === 34 ? 1 : 0
                    break
                  case 96:
                    I = d === 96 ? 1 : 0
                    break
                  case 42:
                    I = d === 42 ? 1 : 0
                    break
                  case 124:
                    I = d === 124 ? 1 : 0
                    break
                  case 32:
                    I = _ ? 0 : 1
                    break
                  default:
                    I = p.get(D)
                }
                I === 1 && (L.push(h._createLink(p, b, w, f, a)), (M = !0))
              } else if (o === 12) {
                let I
                D === 91 ? ((u = !0), (I = 0)) : (I = p.get(D)),
                  I === 1 ? (M = !0) : (o = 13)
              } else (o = m.nextState(o, D)), o === 0 && (M = !0)
              M &&
                ((o = 1), (i = !1), (u = !1), (E = !1), (f = a + 1), (d = D)),
                a++
            }
            o === 13 && L.push(h._createLink(p, b, w, f, s))
          }
          return L
        }
      }
      r.LinkComputer = h
      function v(t) {
        return !t ||
          typeof t.getLineCount != 'function' ||
          typeof t.getLineContent != 'function'
          ? []
          : h.computeLinks(t)
      }
      r.computeLinks = v
    }),
    Y(X[32], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.BasicInplaceReplace = void 0)
      class N {
        constructor() {
          this._defaultValueSet = [
            ['true', 'false'],
            ['True', 'False'],
            [
              'Private',
              'Public',
              'Friend',
              'ReadOnly',
              'Partial',
              'Protected',
              'WriteOnly',
            ],
            ['public', 'protected', 'private'],
          ]
        }
        navigateValueSet(A, l, y, C, c) {
          if (A && l) {
            const h = this.doNavigateValueSet(l, c)
            if (h) return { range: A, value: h }
          }
          if (y && C) {
            const h = this.doNavigateValueSet(C, c)
            if (h) return { range: y, value: h }
          }
          return null
        }
        doNavigateValueSet(A, l) {
          const y = this.numberReplace(A, l)
          return y !== null ? y : this.textReplace(A, l)
        }
        numberReplace(A, l) {
          const y = Math.pow(10, A.length - (A.lastIndexOf('.') + 1))
          let C = Number(A)
          const c = parseFloat(A)
          return !isNaN(C) && !isNaN(c) && C === c
            ? C === 0 && !l
              ? null
              : ((C = Math.floor(C * y)), (C += l ? y : -y), String(C / y))
            : null
        }
        textReplace(A, l) {
          return this.valueSetsReplace(this._defaultValueSet, A, l)
        }
        valueSetsReplace(A, l, y) {
          let C = null
          for (let c = 0, h = A.length; C === null && c < h; c++)
            C = this.valueSetReplace(A[c], l, y)
          return C
        }
        valueSetReplace(A, l, y) {
          let C = A.indexOf(l)
          return C >= 0
            ? ((C += y ? 1 : -1),
              C < 0 ? (C = A.length - 1) : (C %= A.length),
              A[C])
            : null
        }
      }
      ;(r.BasicInplaceReplace = N), (N.INSTANCE = new N())
    }),
    Y(X[33], J([0, 1, 27]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.shouldSynchronizeModel =
          r.ApplyEditsResult =
          r.SearchData =
          r.ValidAnnotatedEditOperation =
          r.isITextSnapshot =
          r.FindMatch =
          r.TextModelResolvedOptions =
          r.InjectedTextCursorStops =
          r.MinimapPosition =
          r.OverviewRulerLane =
            void 0)
      var e
      ;(function (m) {
        ;(m[(m.Left = 1)] = 'Left'),
          (m[(m.Center = 2)] = 'Center'),
          (m[(m.Right = 4)] = 'Right'),
          (m[(m.Full = 7)] = 'Full')
      })((e = r.OverviewRulerLane || (r.OverviewRulerLane = {})))
      var A
      ;(function (m) {
        ;(m[(m.Inline = 1)] = 'Inline'), (m[(m.Gutter = 2)] = 'Gutter')
      })((A = r.MinimapPosition || (r.MinimapPosition = {})))
      var l
      ;(function (m) {
        ;(m[(m.Both = 0)] = 'Both'),
          (m[(m.Right = 1)] = 'Right'),
          (m[(m.Left = 2)] = 'Left'),
          (m[(m.None = 3)] = 'None')
      })((l = r.InjectedTextCursorStops || (r.InjectedTextCursorStops = {})))
      class y {
        constructor(p) {
          ;(this._textModelResolvedOptionsBrand = void 0),
            (this.tabSize = Math.max(1, p.tabSize | 0)),
            (this.indentSize = p.tabSize | 0),
            (this.insertSpaces = Boolean(p.insertSpaces)),
            (this.defaultEOL = p.defaultEOL | 0),
            (this.trimAutoWhitespace = Boolean(p.trimAutoWhitespace)),
            (this.bracketPairColorizationOptions =
              p.bracketPairColorizationOptions)
        }
        equals(p) {
          return (
            this.tabSize === p.tabSize &&
            this.indentSize === p.indentSize &&
            this.insertSpaces === p.insertSpaces &&
            this.defaultEOL === p.defaultEOL &&
            this.trimAutoWhitespace === p.trimAutoWhitespace &&
            (0, N.equals)(
              this.bracketPairColorizationOptions,
              p.bracketPairColorizationOptions
            )
          )
        }
        createChangeEvent(p) {
          return {
            tabSize: this.tabSize !== p.tabSize,
            indentSize: this.indentSize !== p.indentSize,
            insertSpaces: this.insertSpaces !== p.insertSpaces,
            trimAutoWhitespace:
              this.trimAutoWhitespace !== p.trimAutoWhitespace,
          }
        }
      }
      r.TextModelResolvedOptions = y
      class C {
        constructor(p, L) {
          ;(this._findMatchBrand = void 0), (this.range = p), (this.matches = L)
        }
      }
      r.FindMatch = C
      function c(m) {
        return m && typeof m.read == 'function'
      }
      r.isITextSnapshot = c
      class h {
        constructor(p, L, w, S, b, s) {
          ;(this.identifier = p),
            (this.range = L),
            (this.text = w),
            (this.forceMoveMarkers = S),
            (this.isAutoWhitespaceEdit = b),
            (this._isTracked = s)
        }
      }
      r.ValidAnnotatedEditOperation = h
      class v {
        constructor(p, L, w) {
          ;(this.regex = p), (this.wordSeparators = L), (this.simpleSearch = w)
        }
      }
      r.SearchData = v
      class t {
        constructor(p, L, w) {
          ;(this.reverseEdits = p),
            (this.changes = L),
            (this.trimAutoWhitespaceLineNumbers = w)
        }
      }
      r.ApplyEditsResult = t
      function g(m) {
        return !m.isTooLargeForSyncing() && !m.isForSimpleWidget
      }
      r.shouldSynchronizeModel = g
    }),
    Y(X[34], J([0, 1, 19, 14]), function (F, r, N, e) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.PrefixSumIndexOfResult =
          r.ConstantTimePrefixSumComputer =
          r.PrefixSumComputer =
            void 0)
      class A {
        constructor(c) {
          ;(this.values = c),
            (this.prefixSum = new Uint32Array(c.length)),
            (this.prefixSumValidIndex = new Int32Array(1)),
            (this.prefixSumValidIndex[0] = -1)
        }
        insertValues(c, h) {
          c = (0, e.toUint32)(c)
          const v = this.values,
            t = this.prefixSum,
            g = h.length
          return g === 0
            ? !1
            : ((this.values = new Uint32Array(v.length + g)),
              this.values.set(v.subarray(0, c), 0),
              this.values.set(v.subarray(c), c + g),
              this.values.set(h, c),
              c - 1 < this.prefixSumValidIndex[0] &&
                (this.prefixSumValidIndex[0] = c - 1),
              (this.prefixSum = new Uint32Array(this.values.length)),
              this.prefixSumValidIndex[0] >= 0 &&
                this.prefixSum.set(
                  t.subarray(0, this.prefixSumValidIndex[0] + 1)
                ),
              !0)
        }
        setValue(c, h) {
          return (
            (c = (0, e.toUint32)(c)),
            (h = (0, e.toUint32)(h)),
            this.values[c] === h
              ? !1
              : ((this.values[c] = h),
                c - 1 < this.prefixSumValidIndex[0] &&
                  (this.prefixSumValidIndex[0] = c - 1),
                !0)
          )
        }
        removeValues(c, h) {
          ;(c = (0, e.toUint32)(c)), (h = (0, e.toUint32)(h))
          const v = this.values,
            t = this.prefixSum
          if (c >= v.length) return !1
          const g = v.length - c
          return (
            h >= g && (h = g),
            h === 0
              ? !1
              : ((this.values = new Uint32Array(v.length - h)),
                this.values.set(v.subarray(0, c), 0),
                this.values.set(v.subarray(c + h), c),
                (this.prefixSum = new Uint32Array(this.values.length)),
                c - 1 < this.prefixSumValidIndex[0] &&
                  (this.prefixSumValidIndex[0] = c - 1),
                this.prefixSumValidIndex[0] >= 0 &&
                  this.prefixSum.set(
                    t.subarray(0, this.prefixSumValidIndex[0] + 1)
                  ),
                !0)
          )
        }
        getTotalSum() {
          return this.values.length === 0
            ? 0
            : this._getPrefixSum(this.values.length - 1)
        }
        getPrefixSum(c) {
          return c < 0 ? 0 : ((c = (0, e.toUint32)(c)), this._getPrefixSum(c))
        }
        _getPrefixSum(c) {
          if (c <= this.prefixSumValidIndex[0]) return this.prefixSum[c]
          let h = this.prefixSumValidIndex[0] + 1
          h === 0 && ((this.prefixSum[0] = this.values[0]), h++),
            c >= this.values.length && (c = this.values.length - 1)
          for (let v = h; v <= c; v++)
            this.prefixSum[v] = this.prefixSum[v - 1] + this.values[v]
          return (
            (this.prefixSumValidIndex[0] = Math.max(
              this.prefixSumValidIndex[0],
              c
            )),
            this.prefixSum[c]
          )
        }
        getIndexOf(c) {
          ;(c = Math.floor(c)), this.getTotalSum()
          let h = 0,
            v = this.values.length - 1,
            t = 0,
            g = 0,
            m = 0
          for (; h <= v; )
            if (
              ((t = (h + (v - h) / 2) | 0),
              (g = this.prefixSum[t]),
              (m = g - this.values[t]),
              c < m)
            )
              v = t - 1
            else if (c >= g) h = t + 1
            else break
          return new y(t, c - m)
        }
      }
      r.PrefixSumComputer = A
      class l {
        constructor(c) {
          ;(this._values = c),
            (this._isValid = !1),
            (this._validEndIndex = -1),
            (this._prefixSum = []),
            (this._indexBySum = [])
        }
        getTotalSum() {
          return this._ensureValid(), this._indexBySum.length
        }
        getPrefixSum(c) {
          return this._ensureValid(), c === 0 ? 0 : this._prefixSum[c - 1]
        }
        getIndexOf(c) {
          this._ensureValid()
          const h = this._indexBySum[c],
            v = h > 0 ? this._prefixSum[h - 1] : 0
          return new y(h, c - v)
        }
        removeValues(c, h) {
          this._values.splice(c, h), this._invalidate(c)
        }
        insertValues(c, h) {
          ;(this._values = (0, N.arrayInsert)(this._values, c, h)),
            this._invalidate(c)
        }
        _invalidate(c) {
          ;(this._isValid = !1),
            (this._validEndIndex = Math.min(this._validEndIndex, c - 1))
        }
        _ensureValid() {
          if (!this._isValid) {
            for (
              let c = this._validEndIndex + 1, h = this._values.length;
              c < h;
              c++
            ) {
              const v = this._values[c],
                t = c > 0 ? this._prefixSum[c - 1] : 0
              this._prefixSum[c] = t + v
              for (let g = 0; g < v; g++) this._indexBySum[t + g] = c
            }
            ;(this._prefixSum.length = this._values.length),
              (this._indexBySum.length =
                this._prefixSum[this._prefixSum.length - 1]),
              (this._isValid = !0),
              (this._validEndIndex = this._values.length - 1)
          }
        }
        setValue(c, h) {
          this._values[c] !== h && ((this._values[c] = h), this._invalidate(c))
        }
      }
      r.ConstantTimePrefixSumComputer = l
      class y {
        constructor(c, h) {
          ;(this.index = c),
            (this.remainder = h),
            (this._prefixSumIndexOfResultBrand = void 0),
            (this.index = c),
            (this.remainder = h)
        }
      }
      r.PrefixSumIndexOfResult = y
    }),
    Y(X[35], J([0, 1, 2, 3, 34]), function (F, r, N, e, A) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.MirrorTextModel = void 0)
      class l {
        constructor(C, c, h, v) {
          ;(this._uri = C),
            (this._lines = c),
            (this._eol = h),
            (this._versionId = v),
            (this._lineStarts = null),
            (this._cachedTextValue = null)
        }
        dispose() {
          this._lines.length = 0
        }
        get version() {
          return this._versionId
        }
        getText() {
          return (
            this._cachedTextValue === null &&
              (this._cachedTextValue = this._lines.join(this._eol)),
            this._cachedTextValue
          )
        }
        onEvents(C) {
          C.eol &&
            C.eol !== this._eol &&
            ((this._eol = C.eol), (this._lineStarts = null))
          const c = C.changes
          for (const h of c)
            this._acceptDeleteRange(h.range),
              this._acceptInsertText(
                new e.Position(h.range.startLineNumber, h.range.startColumn),
                h.text
              )
          ;(this._versionId = C.versionId), (this._cachedTextValue = null)
        }
        _ensureLineStarts() {
          if (!this._lineStarts) {
            const C = this._eol.length,
              c = this._lines.length,
              h = new Uint32Array(c)
            for (let v = 0; v < c; v++) h[v] = this._lines[v].length + C
            this._lineStarts = new A.PrefixSumComputer(h)
          }
        }
        _setLineText(C, c) {
          ;(this._lines[C] = c),
            this._lineStarts &&
              this._lineStarts.setValue(
                C,
                this._lines[C].length + this._eol.length
              )
        }
        _acceptDeleteRange(C) {
          if (C.startLineNumber === C.endLineNumber) {
            if (C.startColumn === C.endColumn) return
            this._setLineText(
              C.startLineNumber - 1,
              this._lines[C.startLineNumber - 1].substring(
                0,
                C.startColumn - 1
              ) + this._lines[C.startLineNumber - 1].substring(C.endColumn - 1)
            )
            return
          }
          this._setLineText(
            C.startLineNumber - 1,
            this._lines[C.startLineNumber - 1].substring(0, C.startColumn - 1) +
              this._lines[C.endLineNumber - 1].substring(C.endColumn - 1)
          ),
            this._lines.splice(
              C.startLineNumber,
              C.endLineNumber - C.startLineNumber
            ),
            this._lineStarts &&
              this._lineStarts.removeValues(
                C.startLineNumber,
                C.endLineNumber - C.startLineNumber
              )
        }
        _acceptInsertText(C, c) {
          if (c.length === 0) return
          const h = (0, N.splitLines)(c)
          if (h.length === 1) {
            this._setLineText(
              C.lineNumber - 1,
              this._lines[C.lineNumber - 1].substring(0, C.column - 1) +
                h[0] +
                this._lines[C.lineNumber - 1].substring(C.column - 1)
            )
            return
          }
          ;(h[h.length - 1] += this._lines[C.lineNumber - 1].substring(
            C.column - 1
          )),
            this._setLineText(
              C.lineNumber - 1,
              this._lines[C.lineNumber - 1].substring(0, C.column - 1) + h[0]
            )
          const v = new Uint32Array(h.length - 1)
          for (let t = 1; t < h.length; t++)
            this._lines.splice(C.lineNumber + t - 1, 0, h[t]),
              (v[t - 1] = h[t].length + this._eol.length)
          this._lineStarts && this._lineStarts.insertValues(C.lineNumber, v)
        }
      }
      r.MirrorTextModel = l
    }),
    Y(X[36], J([0, 1, 2, 29, 3, 4, 33]), function (F, r, N, e, A, l, y) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.Searcher =
          r.isValidMatch =
          r.TextModelSearch =
          r.createFindMatch =
          r.isMultilineRegexSource =
          r.SearchParams =
            void 0)
      const C = 999
      class c {
        constructor(b, s, a, f) {
          ;(this.searchString = b),
            (this.isRegex = s),
            (this.matchCase = a),
            (this.wordSeparators = f)
        }
        parseSearchRequest() {
          if (this.searchString === '') return null
          let b
          this.isRegex
            ? (b = h(this.searchString))
            : (b =
                this.searchString.indexOf(`
`) >= 0)
          let s = null
          try {
            s = N.createRegExp(this.searchString, this.isRegex, {
              matchCase: this.matchCase,
              wholeWord: !1,
              multiline: b,
              global: !0,
              unicode: !0,
            })
          } catch {
            return null
          }
          if (!s) return null
          let a = !this.isRegex && !b
          return (
            a &&
              this.searchString.toLowerCase() !==
                this.searchString.toUpperCase() &&
              (a = this.matchCase),
            new y.SearchData(
              s,
              this.wordSeparators
                ? (0, e.getMapForWordSeparators)(this.wordSeparators)
                : null,
              a ? this.searchString : null
            )
          )
        }
      }
      r.SearchParams = c
      function h(S) {
        if (!S || S.length === 0) return !1
        for (let b = 0, s = S.length; b < s; b++) {
          const a = S.charCodeAt(b)
          if (a === 10) return !0
          if (a === 92) {
            if ((b++, b >= s)) break
            const f = S.charCodeAt(b)
            if (f === 110 || f === 114 || f === 87) return !0
          }
        }
        return !1
      }
      r.isMultilineRegexSource = h
      function v(S, b, s) {
        if (!s) return new y.FindMatch(S, null)
        const a = []
        for (let f = 0, d = b.length; f < d; f++) a[f] = b[f]
        return new y.FindMatch(S, a)
      }
      r.createFindMatch = v
      class t {
        constructor(b) {
          const s = []
          let a = 0
          for (let f = 0, d = b.length; f < d; f++)
            b.charCodeAt(f) === 10 && (s[a++] = f)
          this._lineFeedsOffsets = s
        }
        findLineFeedCountBeforeOffset(b) {
          const s = this._lineFeedsOffsets
          let a = 0,
            f = s.length - 1
          if (f === -1 || b <= s[0]) return 0
          for (; a < f; ) {
            const d = a + (((f - a) / 2) >> 0)
            s[d] >= b
              ? (f = d - 1)
              : s[d + 1] >= b
              ? ((a = d), (f = d))
              : (a = d + 1)
          }
          return a + 1
        }
      }
      class g {
        static findMatches(b, s, a, f, d) {
          const o = s.parseSearchRequest()
          return o
            ? o.regex.multiline
              ? this._doFindMatchesMultiline(
                  b,
                  a,
                  new w(o.wordSeparators, o.regex),
                  f,
                  d
                )
              : this._doFindMatchesLineByLine(b, a, o, f, d)
            : []
        }
        static _getMultilineMatchRange(b, s, a, f, d, o) {
          let i,
            u = 0
          f
            ? ((u = f.findLineFeedCountBeforeOffset(d)), (i = s + d + u))
            : (i = s + d)
          let _
          if (f) {
            const I = f.findLineFeedCountBeforeOffset(d + o.length) - u
            _ = i + o.length + I
          } else _ = i + o.length
          const E = b.getPositionAt(i),
            M = b.getPositionAt(_)
          return new l.Range(E.lineNumber, E.column, M.lineNumber, M.column)
        }
        static _doFindMatchesMultiline(b, s, a, f, d) {
          const o = b.getOffsetAt(s.getStartPosition()),
            i = b.getValueInRange(s, 1),
            u =
              b.getEOL() ===
              `\r
`
                ? new t(i)
                : null,
            _ = []
          let E = 0,
            M
          for (a.reset(0); (M = a.next(i)); )
            if (
              ((_[E++] = v(
                this._getMultilineMatchRange(b, o, i, u, M.index, M[0]),
                M,
                f
              )),
              E >= d)
            )
              return _
          return _
        }
        static _doFindMatchesLineByLine(b, s, a, f, d) {
          const o = []
          let i = 0
          if (s.startLineNumber === s.endLineNumber) {
            const _ = b
              .getLineContent(s.startLineNumber)
              .substring(s.startColumn - 1, s.endColumn - 1)
            return (
              (i = this._findMatchesInLine(
                a,
                _,
                s.startLineNumber,
                s.startColumn - 1,
                i,
                o,
                f,
                d
              )),
              o
            )
          }
          const u = b
            .getLineContent(s.startLineNumber)
            .substring(s.startColumn - 1)
          i = this._findMatchesInLine(
            a,
            u,
            s.startLineNumber,
            s.startColumn - 1,
            i,
            o,
            f,
            d
          )
          for (let _ = s.startLineNumber + 1; _ < s.endLineNumber && i < d; _++)
            i = this._findMatchesInLine(
              a,
              b.getLineContent(_),
              _,
              0,
              i,
              o,
              f,
              d
            )
          if (i < d) {
            const _ = b
              .getLineContent(s.endLineNumber)
              .substring(0, s.endColumn - 1)
            i = this._findMatchesInLine(a, _, s.endLineNumber, 0, i, o, f, d)
          }
          return o
        }
        static _findMatchesInLine(b, s, a, f, d, o, i, u) {
          const _ = b.wordSeparators
          if (!i && b.simpleSearch) {
            const D = b.simpleSearch,
              I = D.length,
              O = s.length
            let q = -I
            for (; (q = s.indexOf(D, q + I)) !== -1; )
              if (
                (!_ || L(_, s, O, q, I)) &&
                ((o[d++] = new y.FindMatch(
                  new l.Range(a, q + 1 + f, a, q + 1 + I + f),
                  null
                )),
                d >= u)
              )
                return d
            return d
          }
          const E = new w(b.wordSeparators, b.regex)
          let M
          E.reset(0)
          do
            if (
              ((M = E.next(s)),
              M &&
                ((o[d++] = v(
                  new l.Range(
                    a,
                    M.index + 1 + f,
                    a,
                    M.index + 1 + M[0].length + f
                  ),
                  M,
                  i
                )),
                d >= u))
            )
              return d
          while (M)
          return d
        }
        static findNextMatch(b, s, a, f) {
          const d = s.parseSearchRequest()
          if (!d) return null
          const o = new w(d.wordSeparators, d.regex)
          return d.regex.multiline
            ? this._doFindNextMatchMultiline(b, a, o, f)
            : this._doFindNextMatchLineByLine(b, a, o, f)
        }
        static _doFindNextMatchMultiline(b, s, a, f) {
          const d = new A.Position(s.lineNumber, 1),
            o = b.getOffsetAt(d),
            i = b.getLineCount(),
            u = b.getValueInRange(
              new l.Range(d.lineNumber, d.column, i, b.getLineMaxColumn(i)),
              1
            ),
            _ =
              b.getEOL() ===
              `\r
`
                ? new t(u)
                : null
          a.reset(s.column - 1)
          const E = a.next(u)
          return E
            ? v(this._getMultilineMatchRange(b, o, u, _, E.index, E[0]), E, f)
            : s.lineNumber !== 1 || s.column !== 1
            ? this._doFindNextMatchMultiline(b, new A.Position(1, 1), a, f)
            : null
        }
        static _doFindNextMatchLineByLine(b, s, a, f) {
          const d = b.getLineCount(),
            o = s.lineNumber,
            i = b.getLineContent(o),
            u = this._findFirstMatchInLine(a, i, o, s.column, f)
          if (u) return u
          for (let _ = 1; _ <= d; _++) {
            const E = (o + _ - 1) % d,
              M = b.getLineContent(E + 1),
              D = this._findFirstMatchInLine(a, M, E + 1, 1, f)
            if (D) return D
          }
          return null
        }
        static _findFirstMatchInLine(b, s, a, f, d) {
          b.reset(f - 1)
          const o = b.next(s)
          return o
            ? v(new l.Range(a, o.index + 1, a, o.index + 1 + o[0].length), o, d)
            : null
        }
        static findPreviousMatch(b, s, a, f) {
          const d = s.parseSearchRequest()
          if (!d) return null
          const o = new w(d.wordSeparators, d.regex)
          return d.regex.multiline
            ? this._doFindPreviousMatchMultiline(b, a, o, f)
            : this._doFindPreviousMatchLineByLine(b, a, o, f)
        }
        static _doFindPreviousMatchMultiline(b, s, a, f) {
          const d = this._doFindMatchesMultiline(
            b,
            new l.Range(1, 1, s.lineNumber, s.column),
            a,
            f,
            10 * C
          )
          if (d.length > 0) return d[d.length - 1]
          const o = b.getLineCount()
          return s.lineNumber !== o || s.column !== b.getLineMaxColumn(o)
            ? this._doFindPreviousMatchMultiline(
                b,
                new A.Position(o, b.getLineMaxColumn(o)),
                a,
                f
              )
            : null
        }
        static _doFindPreviousMatchLineByLine(b, s, a, f) {
          const d = b.getLineCount(),
            o = s.lineNumber,
            i = b.getLineContent(o).substring(0, s.column - 1),
            u = this._findLastMatchInLine(a, i, o, f)
          if (u) return u
          for (let _ = 1; _ <= d; _++) {
            const E = (d + o - _ - 1) % d,
              M = b.getLineContent(E + 1),
              D = this._findLastMatchInLine(a, M, E + 1, f)
            if (D) return D
          }
          return null
        }
        static _findLastMatchInLine(b, s, a, f) {
          let d = null,
            o
          for (b.reset(0); (o = b.next(s)); )
            d = v(
              new l.Range(a, o.index + 1, a, o.index + 1 + o[0].length),
              o,
              f
            )
          return d
        }
      }
      r.TextModelSearch = g
      function m(S, b, s, a, f) {
        if (a === 0) return !0
        const d = b.charCodeAt(a - 1)
        if (S.get(d) !== 0 || d === 13 || d === 10) return !0
        if (f > 0) {
          const o = b.charCodeAt(a)
          if (S.get(o) !== 0) return !0
        }
        return !1
      }
      function p(S, b, s, a, f) {
        if (a + f === s) return !0
        const d = b.charCodeAt(a + f)
        if (S.get(d) !== 0 || d === 13 || d === 10) return !0
        if (f > 0) {
          const o = b.charCodeAt(a + f - 1)
          if (S.get(o) !== 0) return !0
        }
        return !1
      }
      function L(S, b, s, a, f) {
        return m(S, b, s, a, f) && p(S, b, s, a, f)
      }
      r.isValidMatch = L
      class w {
        constructor(b, s) {
          ;(this._wordSeparators = b),
            (this._searchRegex = s),
            (this._prevMatchStartIndex = -1),
            (this._prevMatchLength = 0)
        }
        reset(b) {
          ;(this._searchRegex.lastIndex = b),
            (this._prevMatchStartIndex = -1),
            (this._prevMatchLength = 0)
        }
        next(b) {
          const s = b.length
          let a
          do {
            if (
              this._prevMatchStartIndex + this._prevMatchLength === s ||
              ((a = this._searchRegex.exec(b)), !a)
            )
              return null
            const f = a.index,
              d = a[0].length
            if (
              f === this._prevMatchStartIndex &&
              d === this._prevMatchLength
            ) {
              if (d === 0) {
                N.getNextCodePoint(b, s, this._searchRegex.lastIndex) > 65535
                  ? (this._searchRegex.lastIndex += 2)
                  : (this._searchRegex.lastIndex += 1)
                continue
              }
              return null
            }
            if (
              ((this._prevMatchStartIndex = f),
              (this._prevMatchLength = d),
              !this._wordSeparators || L(this._wordSeparators, b, s, f, d))
            )
              return a
          } while (a)
          return null
        }
      }
      r.Searcher = w
    }),
    Y(X[37], J([0, 1, 4, 36, 2, 6, 16]), function (F, r, N, e, A, l, y) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.UnicodeTextModelHighlighter = void 0)
      class C {
        static computeUnicodeHighlights(g, m, p) {
          const L = p ? p.startLineNumber : 1,
            w = p ? p.endLineNumber : g.getLineCount(),
            S = new h(m),
            b = S.getCandidateCodePoints()
          let s
          b === 'allNonBasicAscii'
            ? (s = new RegExp('[^\\t\\n\\r\\x20-\\x7E]', 'g'))
            : (s = new RegExp(`${c(Array.from(b))}`, 'g'))
          const a = new e.Searcher(null, s),
            f = []
          let d = !1,
            o,
            i = 0,
            u = 0,
            _ = 0
          e: for (let E = L, M = w; E <= M; E++) {
            const D = g.getLineContent(E),
              I = D.length
            a.reset(0)
            do
              if (((o = a.next(D)), o)) {
                let O = o.index,
                  q = o.index + o[0].length
                if (O > 0) {
                  const T = D.charCodeAt(O - 1)
                  A.isHighSurrogate(T) && O--
                }
                if (q + 1 < I) {
                  const T = D.charCodeAt(q - 1)
                  A.isHighSurrogate(T) && q++
                }
                const z = D.substring(O, q),
                  P = (0, y.getWordAtText)(O + 1, y.DEFAULT_WORD_REGEXP, D, 0),
                  U = S.shouldHighlightNonBasicASCII(z, P ? P.word : null)
                if (U !== 0) {
                  U === 3
                    ? i++
                    : U === 2
                    ? u++
                    : U === 1
                    ? _++
                    : (0, l.assertNever)(U)
                  const T = 1e3
                  if (f.length >= T) {
                    d = !0
                    break e
                  }
                  f.push(new N.Range(E, O + 1, E, q + 1))
                }
              }
            while (o)
          }
          return {
            ranges: f,
            hasMore: d,
            ambiguousCharacterCount: i,
            invisibleCharacterCount: u,
            nonBasicAsciiCharacterCount: _,
          }
        }
        static computeUnicodeHighlightReason(g, m) {
          const p = new h(m)
          switch (p.shouldHighlightNonBasicASCII(g, null)) {
            case 0:
              return null
            case 2:
              return { kind: 1 }
            case 3: {
              const w = g.codePointAt(0),
                S = p.ambiguousCharacters.getPrimaryConfusable(w),
                b = A.AmbiguousCharacters.getLocales().filter(
                  (s) =>
                    !A.AmbiguousCharacters.getInstance(
                      new Set([...m.allowedLocales, s])
                    ).isAmbiguous(w)
                )
              return {
                kind: 0,
                confusableWith: String.fromCodePoint(S),
                notAmbiguousInLocales: b,
              }
            }
            case 1:
              return { kind: 2 }
          }
        }
      }
      r.UnicodeTextModelHighlighter = C
      function c(t, g) {
        return `[${A.escapeRegExpCharacters(
          t.map((p) => String.fromCodePoint(p)).join('')
        )}]`
      }
      class h {
        constructor(g) {
          ;(this.options = g),
            (this.allowedCodePoints = new Set(g.allowedCodePoints)),
            (this.ambiguousCharacters = A.AmbiguousCharacters.getInstance(
              new Set(g.allowedLocales)
            ))
        }
        getCandidateCodePoints() {
          if (this.options.nonBasicASCII) return 'allNonBasicAscii'
          const g = new Set()
          if (this.options.invisibleCharacters)
            for (const m of A.InvisibleCharacters.codePoints)
              v(String.fromCodePoint(m)) || g.add(m)
          if (this.options.ambiguousCharacters)
            for (const m of this.ambiguousCharacters.getConfusableCodePoints())
              g.add(m)
          for (const m of this.allowedCodePoints) g.delete(m)
          return g
        }
        shouldHighlightNonBasicASCII(g, m) {
          const p = g.codePointAt(0)
          if (this.allowedCodePoints.has(p)) return 0
          if (this.options.nonBasicASCII) return 1
          let L = !1,
            w = !1
          if (m)
            for (const S of m) {
              const b = S.codePointAt(0),
                s = A.isBasicASCII(S)
              ;(L = L || s),
                !s &&
                  !this.ambiguousCharacters.isAmbiguous(b) &&
                  !A.InvisibleCharacters.isInvisibleCharacter(b) &&
                  (w = !0)
            }
          return !L && w
            ? 0
            : this.options.invisibleCharacters &&
              !v(g) &&
              A.InvisibleCharacters.isInvisibleCharacter(p)
            ? 2
            : this.options.ambiguousCharacters &&
              this.ambiguousCharacters.isAmbiguous(p)
            ? 3
            : 0
        }
      }
      function v(t) {
        return (
          t === ' ' ||
          t ===
            `
` ||
          t === '	'
        )
      }
    }),
    Y(X[38], J([0, 1]), function (F, r) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.WrappingIndent =
          r.TrackedRangeStickiness =
          r.TextEditorCursorStyle =
          r.TextEditorCursorBlinkingStyle =
          r.SymbolTag =
          r.SymbolKind =
          r.SignatureHelpTriggerKind =
          r.SelectionDirection =
          r.ScrollbarVisibility =
          r.ScrollType =
          r.RenderMinimap =
          r.RenderLineNumbersType =
          r.PositionAffinity =
          r.OverviewRulerLane =
          r.OverlayWidgetPositionPreference =
          r.MouseTargetType =
          r.MinimapPosition =
          r.MarkerTag =
          r.MarkerSeverity =
          r.KeyCode =
          r.InlineCompletionTriggerKind =
          r.InlayHintKind =
          r.InjectedTextCursorStops =
          r.IndentAction =
          r.EndOfLineSequence =
          r.EndOfLinePreference =
          r.EditorOption =
          r.EditorAutoIndentStrategy =
          r.DocumentHighlightKind =
          r.DefaultEndOfLine =
          r.CursorChangeReason =
          r.ContentWidgetPositionPreference =
          r.CompletionTriggerKind =
          r.CompletionItemTag =
          r.CompletionItemKind =
          r.CompletionItemInsertTextRule =
          r.CodeActionTriggerType =
          r.AccessibilitySupport =
            void 0)
      var N
      ;(function (n) {
        ;(n[(n.Unknown = 0)] = 'Unknown'),
          (n[(n.Disabled = 1)] = 'Disabled'),
          (n[(n.Enabled = 2)] = 'Enabled')
      })((N = r.AccessibilitySupport || (r.AccessibilitySupport = {})))
      var e
      ;(function (n) {
        ;(n[(n.Invoke = 1)] = 'Invoke'), (n[(n.Auto = 2)] = 'Auto')
      })((e = r.CodeActionTriggerType || (r.CodeActionTriggerType = {})))
      var A
      ;(function (n) {
        ;(n[(n.KeepWhitespace = 1)] = 'KeepWhitespace'),
          (n[(n.InsertAsSnippet = 4)] = 'InsertAsSnippet')
      })(
        (A =
          r.CompletionItemInsertTextRule ||
          (r.CompletionItemInsertTextRule = {}))
      )
      var l
      ;(function (n) {
        ;(n[(n.Method = 0)] = 'Method'),
          (n[(n.Function = 1)] = 'Function'),
          (n[(n.Constructor = 2)] = 'Constructor'),
          (n[(n.Field = 3)] = 'Field'),
          (n[(n.Variable = 4)] = 'Variable'),
          (n[(n.Class = 5)] = 'Class'),
          (n[(n.Struct = 6)] = 'Struct'),
          (n[(n.Interface = 7)] = 'Interface'),
          (n[(n.Module = 8)] = 'Module'),
          (n[(n.Property = 9)] = 'Property'),
          (n[(n.Event = 10)] = 'Event'),
          (n[(n.Operator = 11)] = 'Operator'),
          (n[(n.Unit = 12)] = 'Unit'),
          (n[(n.Value = 13)] = 'Value'),
          (n[(n.Constant = 14)] = 'Constant'),
          (n[(n.Enum = 15)] = 'Enum'),
          (n[(n.EnumMember = 16)] = 'EnumMember'),
          (n[(n.Keyword = 17)] = 'Keyword'),
          (n[(n.Text = 18)] = 'Text'),
          (n[(n.Color = 19)] = 'Color'),
          (n[(n.File = 20)] = 'File'),
          (n[(n.Reference = 21)] = 'Reference'),
          (n[(n.Customcolor = 22)] = 'Customcolor'),
          (n[(n.Folder = 23)] = 'Folder'),
          (n[(n.TypeParameter = 24)] = 'TypeParameter'),
          (n[(n.User = 25)] = 'User'),
          (n[(n.Issue = 26)] = 'Issue'),
          (n[(n.Snippet = 27)] = 'Snippet')
      })((l = r.CompletionItemKind || (r.CompletionItemKind = {})))
      var y
      ;(function (n) {
        n[(n.Deprecated = 1)] = 'Deprecated'
      })((y = r.CompletionItemTag || (r.CompletionItemTag = {})))
      var C
      ;(function (n) {
        ;(n[(n.Invoke = 0)] = 'Invoke'),
          (n[(n.TriggerCharacter = 1)] = 'TriggerCharacter'),
          (n[(n.TriggerForIncompleteCompletions = 2)] =
            'TriggerForIncompleteCompletions')
      })((C = r.CompletionTriggerKind || (r.CompletionTriggerKind = {})))
      var c
      ;(function (n) {
        ;(n[(n.EXACT = 0)] = 'EXACT'),
          (n[(n.ABOVE = 1)] = 'ABOVE'),
          (n[(n.BELOW = 2)] = 'BELOW')
      })(
        (c =
          r.ContentWidgetPositionPreference ||
          (r.ContentWidgetPositionPreference = {}))
      )
      var h
      ;(function (n) {
        ;(n[(n.NotSet = 0)] = 'NotSet'),
          (n[(n.ContentFlush = 1)] = 'ContentFlush'),
          (n[(n.RecoverFromMarkers = 2)] = 'RecoverFromMarkers'),
          (n[(n.Explicit = 3)] = 'Explicit'),
          (n[(n.Paste = 4)] = 'Paste'),
          (n[(n.Undo = 5)] = 'Undo'),
          (n[(n.Redo = 6)] = 'Redo')
      })((h = r.CursorChangeReason || (r.CursorChangeReason = {})))
      var v
      ;(function (n) {
        ;(n[(n.LF = 1)] = 'LF'), (n[(n.CRLF = 2)] = 'CRLF')
      })((v = r.DefaultEndOfLine || (r.DefaultEndOfLine = {})))
      var t
      ;(function (n) {
        ;(n[(n.Text = 0)] = 'Text'),
          (n[(n.Read = 1)] = 'Read'),
          (n[(n.Write = 2)] = 'Write')
      })((t = r.DocumentHighlightKind || (r.DocumentHighlightKind = {})))
      var g
      ;(function (n) {
        ;(n[(n.None = 0)] = 'None'),
          (n[(n.Keep = 1)] = 'Keep'),
          (n[(n.Brackets = 2)] = 'Brackets'),
          (n[(n.Advanced = 3)] = 'Advanced'),
          (n[(n.Full = 4)] = 'Full')
      })((g = r.EditorAutoIndentStrategy || (r.EditorAutoIndentStrategy = {})))
      var m
      ;(function (n) {
        ;(n[(n.acceptSuggestionOnCommitCharacter = 0)] =
          'acceptSuggestionOnCommitCharacter'),
          (n[(n.acceptSuggestionOnEnter = 1)] = 'acceptSuggestionOnEnter'),
          (n[(n.accessibilitySupport = 2)] = 'accessibilitySupport'),
          (n[(n.accessibilityPageSize = 3)] = 'accessibilityPageSize'),
          (n[(n.ariaLabel = 4)] = 'ariaLabel'),
          (n[(n.autoClosingBrackets = 5)] = 'autoClosingBrackets'),
          (n[(n.autoClosingDelete = 6)] = 'autoClosingDelete'),
          (n[(n.autoClosingOvertype = 7)] = 'autoClosingOvertype'),
          (n[(n.autoClosingQuotes = 8)] = 'autoClosingQuotes'),
          (n[(n.autoIndent = 9)] = 'autoIndent'),
          (n[(n.automaticLayout = 10)] = 'automaticLayout'),
          (n[(n.autoSurround = 11)] = 'autoSurround'),
          (n[(n.bracketPairColorization = 12)] = 'bracketPairColorization'),
          (n[(n.guides = 13)] = 'guides'),
          (n[(n.codeLens = 14)] = 'codeLens'),
          (n[(n.codeLensFontFamily = 15)] = 'codeLensFontFamily'),
          (n[(n.codeLensFontSize = 16)] = 'codeLensFontSize'),
          (n[(n.colorDecorators = 17)] = 'colorDecorators'),
          (n[(n.columnSelection = 18)] = 'columnSelection'),
          (n[(n.comments = 19)] = 'comments'),
          (n[(n.contextmenu = 20)] = 'contextmenu'),
          (n[(n.copyWithSyntaxHighlighting = 21)] =
            'copyWithSyntaxHighlighting'),
          (n[(n.cursorBlinking = 22)] = 'cursorBlinking'),
          (n[(n.cursorSmoothCaretAnimation = 23)] =
            'cursorSmoothCaretAnimation'),
          (n[(n.cursorStyle = 24)] = 'cursorStyle'),
          (n[(n.cursorSurroundingLines = 25)] = 'cursorSurroundingLines'),
          (n[(n.cursorSurroundingLinesStyle = 26)] =
            'cursorSurroundingLinesStyle'),
          (n[(n.cursorWidth = 27)] = 'cursorWidth'),
          (n[(n.disableLayerHinting = 28)] = 'disableLayerHinting'),
          (n[(n.disableMonospaceOptimizations = 29)] =
            'disableMonospaceOptimizations'),
          (n[(n.domReadOnly = 30)] = 'domReadOnly'),
          (n[(n.dragAndDrop = 31)] = 'dragAndDrop'),
          (n[(n.dropIntoEditor = 32)] = 'dropIntoEditor'),
          (n[(n.emptySelectionClipboard = 33)] = 'emptySelectionClipboard'),
          (n[(n.experimental = 34)] = 'experimental'),
          (n[(n.extraEditorClassName = 35)] = 'extraEditorClassName'),
          (n[(n.fastScrollSensitivity = 36)] = 'fastScrollSensitivity'),
          (n[(n.find = 37)] = 'find'),
          (n[(n.fixedOverflowWidgets = 38)] = 'fixedOverflowWidgets'),
          (n[(n.folding = 39)] = 'folding'),
          (n[(n.foldingStrategy = 40)] = 'foldingStrategy'),
          (n[(n.foldingHighlight = 41)] = 'foldingHighlight'),
          (n[(n.foldingImportsByDefault = 42)] = 'foldingImportsByDefault'),
          (n[(n.foldingMaximumRegions = 43)] = 'foldingMaximumRegions'),
          (n[(n.unfoldOnClickAfterEndOfLine = 44)] =
            'unfoldOnClickAfterEndOfLine'),
          (n[(n.fontFamily = 45)] = 'fontFamily'),
          (n[(n.fontInfo = 46)] = 'fontInfo'),
          (n[(n.fontLigatures = 47)] = 'fontLigatures'),
          (n[(n.fontSize = 48)] = 'fontSize'),
          (n[(n.fontWeight = 49)] = 'fontWeight'),
          (n[(n.formatOnPaste = 50)] = 'formatOnPaste'),
          (n[(n.formatOnType = 51)] = 'formatOnType'),
          (n[(n.glyphMargin = 52)] = 'glyphMargin'),
          (n[(n.gotoLocation = 53)] = 'gotoLocation'),
          (n[(n.hideCursorInOverviewRuler = 54)] = 'hideCursorInOverviewRuler'),
          (n[(n.hover = 55)] = 'hover'),
          (n[(n.inDiffEditor = 56)] = 'inDiffEditor'),
          (n[(n.inlineSuggest = 57)] = 'inlineSuggest'),
          (n[(n.letterSpacing = 58)] = 'letterSpacing'),
          (n[(n.lightbulb = 59)] = 'lightbulb'),
          (n[(n.lineDecorationsWidth = 60)] = 'lineDecorationsWidth'),
          (n[(n.lineHeight = 61)] = 'lineHeight'),
          (n[(n.lineNumbers = 62)] = 'lineNumbers'),
          (n[(n.lineNumbersMinChars = 63)] = 'lineNumbersMinChars'),
          (n[(n.linkedEditing = 64)] = 'linkedEditing'),
          (n[(n.links = 65)] = 'links'),
          (n[(n.matchBrackets = 66)] = 'matchBrackets'),
          (n[(n.minimap = 67)] = 'minimap'),
          (n[(n.mouseStyle = 68)] = 'mouseStyle'),
          (n[(n.mouseWheelScrollSensitivity = 69)] =
            'mouseWheelScrollSensitivity'),
          (n[(n.mouseWheelZoom = 70)] = 'mouseWheelZoom'),
          (n[(n.multiCursorMergeOverlapping = 71)] =
            'multiCursorMergeOverlapping'),
          (n[(n.multiCursorModifier = 72)] = 'multiCursorModifier'),
          (n[(n.multiCursorPaste = 73)] = 'multiCursorPaste'),
          (n[(n.occurrencesHighlight = 74)] = 'occurrencesHighlight'),
          (n[(n.overviewRulerBorder = 75)] = 'overviewRulerBorder'),
          (n[(n.overviewRulerLanes = 76)] = 'overviewRulerLanes'),
          (n[(n.padding = 77)] = 'padding'),
          (n[(n.parameterHints = 78)] = 'parameterHints'),
          (n[(n.peekWidgetDefaultFocus = 79)] = 'peekWidgetDefaultFocus'),
          (n[(n.definitionLinkOpensInPeek = 80)] = 'definitionLinkOpensInPeek'),
          (n[(n.quickSuggestions = 81)] = 'quickSuggestions'),
          (n[(n.quickSuggestionsDelay = 82)] = 'quickSuggestionsDelay'),
          (n[(n.readOnly = 83)] = 'readOnly'),
          (n[(n.renameOnType = 84)] = 'renameOnType'),
          (n[(n.renderControlCharacters = 85)] = 'renderControlCharacters'),
          (n[(n.renderFinalNewline = 86)] = 'renderFinalNewline'),
          (n[(n.renderLineHighlight = 87)] = 'renderLineHighlight'),
          (n[(n.renderLineHighlightOnlyWhenFocus = 88)] =
            'renderLineHighlightOnlyWhenFocus'),
          (n[(n.renderValidationDecorations = 89)] =
            'renderValidationDecorations'),
          (n[(n.renderWhitespace = 90)] = 'renderWhitespace'),
          (n[(n.revealHorizontalRightPadding = 91)] =
            'revealHorizontalRightPadding'),
          (n[(n.roundedSelection = 92)] = 'roundedSelection'),
          (n[(n.rulers = 93)] = 'rulers'),
          (n[(n.scrollbar = 94)] = 'scrollbar'),
          (n[(n.scrollBeyondLastColumn = 95)] = 'scrollBeyondLastColumn'),
          (n[(n.scrollBeyondLastLine = 96)] = 'scrollBeyondLastLine'),
          (n[(n.scrollPredominantAxis = 97)] = 'scrollPredominantAxis'),
          (n[(n.selectionClipboard = 98)] = 'selectionClipboard'),
          (n[(n.selectionHighlight = 99)] = 'selectionHighlight'),
          (n[(n.selectOnLineNumbers = 100)] = 'selectOnLineNumbers'),
          (n[(n.showFoldingControls = 101)] = 'showFoldingControls'),
          (n[(n.showUnused = 102)] = 'showUnused'),
          (n[(n.snippetSuggestions = 103)] = 'snippetSuggestions'),
          (n[(n.smartSelect = 104)] = 'smartSelect'),
          (n[(n.smoothScrolling = 105)] = 'smoothScrolling'),
          (n[(n.stickyTabStops = 106)] = 'stickyTabStops'),
          (n[(n.stopRenderingLineAfter = 107)] = 'stopRenderingLineAfter'),
          (n[(n.suggest = 108)] = 'suggest'),
          (n[(n.suggestFontSize = 109)] = 'suggestFontSize'),
          (n[(n.suggestLineHeight = 110)] = 'suggestLineHeight'),
          (n[(n.suggestOnTriggerCharacters = 111)] =
            'suggestOnTriggerCharacters'),
          (n[(n.suggestSelection = 112)] = 'suggestSelection'),
          (n[(n.tabCompletion = 113)] = 'tabCompletion'),
          (n[(n.tabIndex = 114)] = 'tabIndex'),
          (n[(n.unicodeHighlighting = 115)] = 'unicodeHighlighting'),
          (n[(n.unusualLineTerminators = 116)] = 'unusualLineTerminators'),
          (n[(n.useShadowDOM = 117)] = 'useShadowDOM'),
          (n[(n.useTabStops = 118)] = 'useTabStops'),
          (n[(n.wordSeparators = 119)] = 'wordSeparators'),
          (n[(n.wordWrap = 120)] = 'wordWrap'),
          (n[(n.wordWrapBreakAfterCharacters = 121)] =
            'wordWrapBreakAfterCharacters'),
          (n[(n.wordWrapBreakBeforeCharacters = 122)] =
            'wordWrapBreakBeforeCharacters'),
          (n[(n.wordWrapColumn = 123)] = 'wordWrapColumn'),
          (n[(n.wordWrapOverride1 = 124)] = 'wordWrapOverride1'),
          (n[(n.wordWrapOverride2 = 125)] = 'wordWrapOverride2'),
          (n[(n.wrappingIndent = 126)] = 'wrappingIndent'),
          (n[(n.wrappingStrategy = 127)] = 'wrappingStrategy'),
          (n[(n.showDeprecated = 128)] = 'showDeprecated'),
          (n[(n.inlayHints = 129)] = 'inlayHints'),
          (n[(n.editorClassName = 130)] = 'editorClassName'),
          (n[(n.pixelRatio = 131)] = 'pixelRatio'),
          (n[(n.tabFocusMode = 132)] = 'tabFocusMode'),
          (n[(n.layoutInfo = 133)] = 'layoutInfo'),
          (n[(n.wrappingInfo = 134)] = 'wrappingInfo')
      })((m = r.EditorOption || (r.EditorOption = {})))
      var p
      ;(function (n) {
        ;(n[(n.TextDefined = 0)] = 'TextDefined'),
          (n[(n.LF = 1)] = 'LF'),
          (n[(n.CRLF = 2)] = 'CRLF')
      })((p = r.EndOfLinePreference || (r.EndOfLinePreference = {})))
      var L
      ;(function (n) {
        ;(n[(n.LF = 0)] = 'LF'), (n[(n.CRLF = 1)] = 'CRLF')
      })((L = r.EndOfLineSequence || (r.EndOfLineSequence = {})))
      var w
      ;(function (n) {
        ;(n[(n.None = 0)] = 'None'),
          (n[(n.Indent = 1)] = 'Indent'),
          (n[(n.IndentOutdent = 2)] = 'IndentOutdent'),
          (n[(n.Outdent = 3)] = 'Outdent')
      })((w = r.IndentAction || (r.IndentAction = {})))
      var S
      ;(function (n) {
        ;(n[(n.Both = 0)] = 'Both'),
          (n[(n.Right = 1)] = 'Right'),
          (n[(n.Left = 2)] = 'Left'),
          (n[(n.None = 3)] = 'None')
      })((S = r.InjectedTextCursorStops || (r.InjectedTextCursorStops = {})))
      var b
      ;(function (n) {
        ;(n[(n.Type = 1)] = 'Type'), (n[(n.Parameter = 2)] = 'Parameter')
      })((b = r.InlayHintKind || (r.InlayHintKind = {})))
      var s
      ;(function (n) {
        ;(n[(n.Automatic = 0)] = 'Automatic'),
          (n[(n.Explicit = 1)] = 'Explicit')
      })(
        (s =
          r.InlineCompletionTriggerKind || (r.InlineCompletionTriggerKind = {}))
      )
      var a
      ;(function (n) {
        ;(n[(n.DependsOnKbLayout = -1)] = 'DependsOnKbLayout'),
          (n[(n.Unknown = 0)] = 'Unknown'),
          (n[(n.Backspace = 1)] = 'Backspace'),
          (n[(n.Tab = 2)] = 'Tab'),
          (n[(n.Enter = 3)] = 'Enter'),
          (n[(n.Shift = 4)] = 'Shift'),
          (n[(n.Ctrl = 5)] = 'Ctrl'),
          (n[(n.Alt = 6)] = 'Alt'),
          (n[(n.PauseBreak = 7)] = 'PauseBreak'),
          (n[(n.CapsLock = 8)] = 'CapsLock'),
          (n[(n.Escape = 9)] = 'Escape'),
          (n[(n.Space = 10)] = 'Space'),
          (n[(n.PageUp = 11)] = 'PageUp'),
          (n[(n.PageDown = 12)] = 'PageDown'),
          (n[(n.End = 13)] = 'End'),
          (n[(n.Home = 14)] = 'Home'),
          (n[(n.LeftArrow = 15)] = 'LeftArrow'),
          (n[(n.UpArrow = 16)] = 'UpArrow'),
          (n[(n.RightArrow = 17)] = 'RightArrow'),
          (n[(n.DownArrow = 18)] = 'DownArrow'),
          (n[(n.Insert = 19)] = 'Insert'),
          (n[(n.Delete = 20)] = 'Delete'),
          (n[(n.Digit0 = 21)] = 'Digit0'),
          (n[(n.Digit1 = 22)] = 'Digit1'),
          (n[(n.Digit2 = 23)] = 'Digit2'),
          (n[(n.Digit3 = 24)] = 'Digit3'),
          (n[(n.Digit4 = 25)] = 'Digit4'),
          (n[(n.Digit5 = 26)] = 'Digit5'),
          (n[(n.Digit6 = 27)] = 'Digit6'),
          (n[(n.Digit7 = 28)] = 'Digit7'),
          (n[(n.Digit8 = 29)] = 'Digit8'),
          (n[(n.Digit9 = 30)] = 'Digit9'),
          (n[(n.KeyA = 31)] = 'KeyA'),
          (n[(n.KeyB = 32)] = 'KeyB'),
          (n[(n.KeyC = 33)] = 'KeyC'),
          (n[(n.KeyD = 34)] = 'KeyD'),
          (n[(n.KeyE = 35)] = 'KeyE'),
          (n[(n.KeyF = 36)] = 'KeyF'),
          (n[(n.KeyG = 37)] = 'KeyG'),
          (n[(n.KeyH = 38)] = 'KeyH'),
          (n[(n.KeyI = 39)] = 'KeyI'),
          (n[(n.KeyJ = 40)] = 'KeyJ'),
          (n[(n.KeyK = 41)] = 'KeyK'),
          (n[(n.KeyL = 42)] = 'KeyL'),
          (n[(n.KeyM = 43)] = 'KeyM'),
          (n[(n.KeyN = 44)] = 'KeyN'),
          (n[(n.KeyO = 45)] = 'KeyO'),
          (n[(n.KeyP = 46)] = 'KeyP'),
          (n[(n.KeyQ = 47)] = 'KeyQ'),
          (n[(n.KeyR = 48)] = 'KeyR'),
          (n[(n.KeyS = 49)] = 'KeyS'),
          (n[(n.KeyT = 50)] = 'KeyT'),
          (n[(n.KeyU = 51)] = 'KeyU'),
          (n[(n.KeyV = 52)] = 'KeyV'),
          (n[(n.KeyW = 53)] = 'KeyW'),
          (n[(n.KeyX = 54)] = 'KeyX'),
          (n[(n.KeyY = 55)] = 'KeyY'),
          (n[(n.KeyZ = 56)] = 'KeyZ'),
          (n[(n.Meta = 57)] = 'Meta'),
          (n[(n.ContextMenu = 58)] = 'ContextMenu'),
          (n[(n.F1 = 59)] = 'F1'),
          (n[(n.F2 = 60)] = 'F2'),
          (n[(n.F3 = 61)] = 'F3'),
          (n[(n.F4 = 62)] = 'F4'),
          (n[(n.F5 = 63)] = 'F5'),
          (n[(n.F6 = 64)] = 'F6'),
          (n[(n.F7 = 65)] = 'F7'),
          (n[(n.F8 = 66)] = 'F8'),
          (n[(n.F9 = 67)] = 'F9'),
          (n[(n.F10 = 68)] = 'F10'),
          (n[(n.F11 = 69)] = 'F11'),
          (n[(n.F12 = 70)] = 'F12'),
          (n[(n.F13 = 71)] = 'F13'),
          (n[(n.F14 = 72)] = 'F14'),
          (n[(n.F15 = 73)] = 'F15'),
          (n[(n.F16 = 74)] = 'F16'),
          (n[(n.F17 = 75)] = 'F17'),
          (n[(n.F18 = 76)] = 'F18'),
          (n[(n.F19 = 77)] = 'F19'),
          (n[(n.NumLock = 78)] = 'NumLock'),
          (n[(n.ScrollLock = 79)] = 'ScrollLock'),
          (n[(n.Semicolon = 80)] = 'Semicolon'),
          (n[(n.Equal = 81)] = 'Equal'),
          (n[(n.Comma = 82)] = 'Comma'),
          (n[(n.Minus = 83)] = 'Minus'),
          (n[(n.Period = 84)] = 'Period'),
          (n[(n.Slash = 85)] = 'Slash'),
          (n[(n.Backquote = 86)] = 'Backquote'),
          (n[(n.BracketLeft = 87)] = 'BracketLeft'),
          (n[(n.Backslash = 88)] = 'Backslash'),
          (n[(n.BracketRight = 89)] = 'BracketRight'),
          (n[(n.Quote = 90)] = 'Quote'),
          (n[(n.OEM_8 = 91)] = 'OEM_8'),
          (n[(n.IntlBackslash = 92)] = 'IntlBackslash'),
          (n[(n.Numpad0 = 93)] = 'Numpad0'),
          (n[(n.Numpad1 = 94)] = 'Numpad1'),
          (n[(n.Numpad2 = 95)] = 'Numpad2'),
          (n[(n.Numpad3 = 96)] = 'Numpad3'),
          (n[(n.Numpad4 = 97)] = 'Numpad4'),
          (n[(n.Numpad5 = 98)] = 'Numpad5'),
          (n[(n.Numpad6 = 99)] = 'Numpad6'),
          (n[(n.Numpad7 = 100)] = 'Numpad7'),
          (n[(n.Numpad8 = 101)] = 'Numpad8'),
          (n[(n.Numpad9 = 102)] = 'Numpad9'),
          (n[(n.NumpadMultiply = 103)] = 'NumpadMultiply'),
          (n[(n.NumpadAdd = 104)] = 'NumpadAdd'),
          (n[(n.NUMPAD_SEPARATOR = 105)] = 'NUMPAD_SEPARATOR'),
          (n[(n.NumpadSubtract = 106)] = 'NumpadSubtract'),
          (n[(n.NumpadDecimal = 107)] = 'NumpadDecimal'),
          (n[(n.NumpadDivide = 108)] = 'NumpadDivide'),
          (n[(n.KEY_IN_COMPOSITION = 109)] = 'KEY_IN_COMPOSITION'),
          (n[(n.ABNT_C1 = 110)] = 'ABNT_C1'),
          (n[(n.ABNT_C2 = 111)] = 'ABNT_C2'),
          (n[(n.AudioVolumeMute = 112)] = 'AudioVolumeMute'),
          (n[(n.AudioVolumeUp = 113)] = 'AudioVolumeUp'),
          (n[(n.AudioVolumeDown = 114)] = 'AudioVolumeDown'),
          (n[(n.BrowserSearch = 115)] = 'BrowserSearch'),
          (n[(n.BrowserHome = 116)] = 'BrowserHome'),
          (n[(n.BrowserBack = 117)] = 'BrowserBack'),
          (n[(n.BrowserForward = 118)] = 'BrowserForward'),
          (n[(n.MediaTrackNext = 119)] = 'MediaTrackNext'),
          (n[(n.MediaTrackPrevious = 120)] = 'MediaTrackPrevious'),
          (n[(n.MediaStop = 121)] = 'MediaStop'),
          (n[(n.MediaPlayPause = 122)] = 'MediaPlayPause'),
          (n[(n.LaunchMediaPlayer = 123)] = 'LaunchMediaPlayer'),
          (n[(n.LaunchMail = 124)] = 'LaunchMail'),
          (n[(n.LaunchApp2 = 125)] = 'LaunchApp2'),
          (n[(n.Clear = 126)] = 'Clear'),
          (n[(n.MAX_VALUE = 127)] = 'MAX_VALUE')
      })((a = r.KeyCode || (r.KeyCode = {})))
      var f
      ;(function (n) {
        ;(n[(n.Hint = 1)] = 'Hint'),
          (n[(n.Info = 2)] = 'Info'),
          (n[(n.Warning = 4)] = 'Warning'),
          (n[(n.Error = 8)] = 'Error')
      })((f = r.MarkerSeverity || (r.MarkerSeverity = {})))
      var d
      ;(function (n) {
        ;(n[(n.Unnecessary = 1)] = 'Unnecessary'),
          (n[(n.Deprecated = 2)] = 'Deprecated')
      })((d = r.MarkerTag || (r.MarkerTag = {})))
      var o
      ;(function (n) {
        ;(n[(n.Inline = 1)] = 'Inline'), (n[(n.Gutter = 2)] = 'Gutter')
      })((o = r.MinimapPosition || (r.MinimapPosition = {})))
      var i
      ;(function (n) {
        ;(n[(n.UNKNOWN = 0)] = 'UNKNOWN'),
          (n[(n.TEXTAREA = 1)] = 'TEXTAREA'),
          (n[(n.GUTTER_GLYPH_MARGIN = 2)] = 'GUTTER_GLYPH_MARGIN'),
          (n[(n.GUTTER_LINE_NUMBERS = 3)] = 'GUTTER_LINE_NUMBERS'),
          (n[(n.GUTTER_LINE_DECORATIONS = 4)] = 'GUTTER_LINE_DECORATIONS'),
          (n[(n.GUTTER_VIEW_ZONE = 5)] = 'GUTTER_VIEW_ZONE'),
          (n[(n.CONTENT_TEXT = 6)] = 'CONTENT_TEXT'),
          (n[(n.CONTENT_EMPTY = 7)] = 'CONTENT_EMPTY'),
          (n[(n.CONTENT_VIEW_ZONE = 8)] = 'CONTENT_VIEW_ZONE'),
          (n[(n.CONTENT_WIDGET = 9)] = 'CONTENT_WIDGET'),
          (n[(n.OVERVIEW_RULER = 10)] = 'OVERVIEW_RULER'),
          (n[(n.SCROLLBAR = 11)] = 'SCROLLBAR'),
          (n[(n.OVERLAY_WIDGET = 12)] = 'OVERLAY_WIDGET'),
          (n[(n.OUTSIDE_EDITOR = 13)] = 'OUTSIDE_EDITOR')
      })((i = r.MouseTargetType || (r.MouseTargetType = {})))
      var u
      ;(function (n) {
        ;(n[(n.TOP_RIGHT_CORNER = 0)] = 'TOP_RIGHT_CORNER'),
          (n[(n.BOTTOM_RIGHT_CORNER = 1)] = 'BOTTOM_RIGHT_CORNER'),
          (n[(n.TOP_CENTER = 2)] = 'TOP_CENTER')
      })(
        (u =
          r.OverlayWidgetPositionPreference ||
          (r.OverlayWidgetPositionPreference = {}))
      )
      var _
      ;(function (n) {
        ;(n[(n.Left = 1)] = 'Left'),
          (n[(n.Center = 2)] = 'Center'),
          (n[(n.Right = 4)] = 'Right'),
          (n[(n.Full = 7)] = 'Full')
      })((_ = r.OverviewRulerLane || (r.OverviewRulerLane = {})))
      var E
      ;(function (n) {
        ;(n[(n.Left = 0)] = 'Left'),
          (n[(n.Right = 1)] = 'Right'),
          (n[(n.None = 2)] = 'None'),
          (n[(n.LeftOfInjectedText = 3)] = 'LeftOfInjectedText'),
          (n[(n.RightOfInjectedText = 4)] = 'RightOfInjectedText')
      })((E = r.PositionAffinity || (r.PositionAffinity = {})))
      var M
      ;(function (n) {
        ;(n[(n.Off = 0)] = 'Off'),
          (n[(n.On = 1)] = 'On'),
          (n[(n.Relative = 2)] = 'Relative'),
          (n[(n.Interval = 3)] = 'Interval'),
          (n[(n.Custom = 4)] = 'Custom')
      })((M = r.RenderLineNumbersType || (r.RenderLineNumbersType = {})))
      var D
      ;(function (n) {
        ;(n[(n.None = 0)] = 'None'),
          (n[(n.Text = 1)] = 'Text'),
          (n[(n.Blocks = 2)] = 'Blocks')
      })((D = r.RenderMinimap || (r.RenderMinimap = {})))
      var I
      ;(function (n) {
        ;(n[(n.Smooth = 0)] = 'Smooth'), (n[(n.Immediate = 1)] = 'Immediate')
      })((I = r.ScrollType || (r.ScrollType = {})))
      var O
      ;(function (n) {
        ;(n[(n.Auto = 1)] = 'Auto'),
          (n[(n.Hidden = 2)] = 'Hidden'),
          (n[(n.Visible = 3)] = 'Visible')
      })((O = r.ScrollbarVisibility || (r.ScrollbarVisibility = {})))
      var q
      ;(function (n) {
        ;(n[(n.LTR = 0)] = 'LTR'), (n[(n.RTL = 1)] = 'RTL')
      })((q = r.SelectionDirection || (r.SelectionDirection = {})))
      var z
      ;(function (n) {
        ;(n[(n.Invoke = 1)] = 'Invoke'),
          (n[(n.TriggerCharacter = 2)] = 'TriggerCharacter'),
          (n[(n.ContentChange = 3)] = 'ContentChange')
      })((z = r.SignatureHelpTriggerKind || (r.SignatureHelpTriggerKind = {})))
      var P
      ;(function (n) {
        ;(n[(n.File = 0)] = 'File'),
          (n[(n.Module = 1)] = 'Module'),
          (n[(n.Namespace = 2)] = 'Namespace'),
          (n[(n.Package = 3)] = 'Package'),
          (n[(n.Class = 4)] = 'Class'),
          (n[(n.Method = 5)] = 'Method'),
          (n[(n.Property = 6)] = 'Property'),
          (n[(n.Field = 7)] = 'Field'),
          (n[(n.Constructor = 8)] = 'Constructor'),
          (n[(n.Enum = 9)] = 'Enum'),
          (n[(n.Interface = 10)] = 'Interface'),
          (n[(n.Function = 11)] = 'Function'),
          (n[(n.Variable = 12)] = 'Variable'),
          (n[(n.Constant = 13)] = 'Constant'),
          (n[(n.String = 14)] = 'String'),
          (n[(n.Number = 15)] = 'Number'),
          (n[(n.Boolean = 16)] = 'Boolean'),
          (n[(n.Array = 17)] = 'Array'),
          (n[(n.Object = 18)] = 'Object'),
          (n[(n.Key = 19)] = 'Key'),
          (n[(n.Null = 20)] = 'Null'),
          (n[(n.EnumMember = 21)] = 'EnumMember'),
          (n[(n.Struct = 22)] = 'Struct'),
          (n[(n.Event = 23)] = 'Event'),
          (n[(n.Operator = 24)] = 'Operator'),
          (n[(n.TypeParameter = 25)] = 'TypeParameter')
      })((P = r.SymbolKind || (r.SymbolKind = {})))
      var U
      ;(function (n) {
        n[(n.Deprecated = 1)] = 'Deprecated'
      })((U = r.SymbolTag || (r.SymbolTag = {})))
      var T
      ;(function (n) {
        ;(n[(n.Hidden = 0)] = 'Hidden'),
          (n[(n.Blink = 1)] = 'Blink'),
          (n[(n.Smooth = 2)] = 'Smooth'),
          (n[(n.Phase = 3)] = 'Phase'),
          (n[(n.Expand = 4)] = 'Expand'),
          (n[(n.Solid = 5)] = 'Solid')
      })(
        (T =
          r.TextEditorCursorBlinkingStyle ||
          (r.TextEditorCursorBlinkingStyle = {}))
      )
      var W
      ;(function (n) {
        ;(n[(n.Line = 1)] = 'Line'),
          (n[(n.Block = 2)] = 'Block'),
          (n[(n.Underline = 3)] = 'Underline'),
          (n[(n.LineThin = 4)] = 'LineThin'),
          (n[(n.BlockOutline = 5)] = 'BlockOutline'),
          (n[(n.UnderlineThin = 6)] = 'UnderlineThin')
      })((W = r.TextEditorCursorStyle || (r.TextEditorCursorStyle = {})))
      var B
      ;(function (n) {
        ;(n[(n.AlwaysGrowsWhenTypingAtEdges = 0)] =
          'AlwaysGrowsWhenTypingAtEdges'),
          (n[(n.NeverGrowsWhenTypingAtEdges = 1)] =
            'NeverGrowsWhenTypingAtEdges'),
          (n[(n.GrowsOnlyWhenTypingBefore = 2)] = 'GrowsOnlyWhenTypingBefore'),
          (n[(n.GrowsOnlyWhenTypingAfter = 3)] = 'GrowsOnlyWhenTypingAfter')
      })((B = r.TrackedRangeStickiness || (r.TrackedRangeStickiness = {})))
      var te
      ;(function (n) {
        ;(n[(n.None = 0)] = 'None'),
          (n[(n.Same = 1)] = 'Same'),
          (n[(n.Indent = 2)] = 'Indent'),
          (n[(n.DeepIndent = 3)] = 'DeepIndent')
      })((te = r.WrappingIndent || (r.WrappingIndent = {})))
    }),
    Y(X[39], J([18, 46]), function (F, r) {
      return F.create('vs/base/common/platform', r)
    }),
    Y(X[5], J([0, 1, 39]), function (F, r, N) {
      'use strict'
      var e
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.isAndroid =
          r.isEdge =
          r.isSafari =
          r.isFirefox =
          r.isChrome =
          r.isLittleEndian =
          r.OS =
          r.setTimeout0 =
          r.setTimeout0IsFaster =
          r.language =
          r.userAgent =
          r.isIOS =
          r.isWebWorker =
          r.isWeb =
          r.isNative =
          r.isLinux =
          r.isMacintosh =
          r.isWindows =
          r.globals =
            void 0)
      const A = 'en'
      let l = !1,
        y = !1,
        C = !1,
        c = !1,
        h = !1,
        v = !1,
        t = !1,
        g = !1,
        m = !1,
        p,
        L = A,
        w,
        S
      r.globals =
        typeof self == 'object' ? self : typeof global == 'object' ? global : {}
      let b
      typeof r.globals.vscode != 'undefined' &&
      typeof r.globals.vscode.process != 'undefined'
        ? (b = r.globals.vscode.process)
        : typeof process != 'undefined' && (b = process)
      const s =
          typeof ((e = b == null ? void 0 : b.versions) === null || e === void 0
            ? void 0
            : e.electron) == 'string',
        a = s && (b == null ? void 0 : b.type) === 'renderer'
      if (typeof navigator == 'object' && !a)
        (S = navigator.userAgent),
          (l = S.indexOf('Windows') >= 0),
          (y = S.indexOf('Macintosh') >= 0),
          (g =
            (S.indexOf('Macintosh') >= 0 ||
              S.indexOf('iPad') >= 0 ||
              S.indexOf('iPhone') >= 0) &&
            !!navigator.maxTouchPoints &&
            navigator.maxTouchPoints > 0),
          (C = S.indexOf('Linux') >= 0),
          (v = !0),
          (p = N.getConfiguredDefaultLocale(N.localize(0, null)) || A),
          (L = p)
      else if (typeof b == 'object') {
        ;(l = b.platform === 'win32'),
          (y = b.platform === 'darwin'),
          (C = b.platform === 'linux'),
          (c = C && !!b.env.SNAP && !!b.env.SNAP_REVISION),
          (t = s),
          (m = !!b.env.CI || !!b.env.BUILD_ARTIFACTSTAGINGDIRECTORY),
          (p = A),
          (L = A)
        const u = b.env.VSCODE_NLS_CONFIG
        if (u)
          try {
            const _ = JSON.parse(u),
              E = _.availableLanguages['*']
            ;(p = _.locale), (L = E || A), (w = _._translationsConfigFile)
          } catch {}
        h = !0
      } else console.error('Unable to resolve platform.')
      let f = 0
      y ? (f = 1) : l ? (f = 3) : C && (f = 2),
        (r.isWindows = l),
        (r.isMacintosh = y),
        (r.isLinux = C),
        (r.isNative = h),
        (r.isWeb = v),
        (r.isWebWorker = v && typeof r.globals.importScripts == 'function'),
        (r.isIOS = g),
        (r.userAgent = S),
        (r.language = L),
        (r.setTimeout0IsFaster =
          typeof r.globals.postMessage == 'function' &&
          !r.globals.importScripts),
        (r.setTimeout0 = (() => {
          if (r.setTimeout0IsFaster) {
            const u = []
            r.globals.addEventListener('message', (E) => {
              if (E.data && E.data.vscodeScheduleAsyncWork)
                for (let M = 0, D = u.length; M < D; M++) {
                  const I = u[M]
                  if (I.id === E.data.vscodeScheduleAsyncWork) {
                    u.splice(M, 1), I.callback()
                    return
                  }
                }
            })
            let _ = 0
            return (E) => {
              const M = ++_
              u.push({ id: M, callback: E }),
                r.globals.postMessage({ vscodeScheduleAsyncWork: M }, '*')
            }
          }
          return (u) => setTimeout(u)
        })()),
        (r.OS = y || g ? 2 : l ? 1 : 3)
      let d = !0,
        o = !1
      function i() {
        if (!o) {
          o = !0
          const u = new Uint8Array(2)
          ;(u[0] = 1),
            (u[1] = 2),
            (d = new Uint16Array(u.buffer)[0] === (2 << 8) + 1)
        }
        return d
      }
      ;(r.isLittleEndian = i),
        (r.isChrome = !!(r.userAgent && r.userAgent.indexOf('Chrome') >= 0)),
        (r.isFirefox = !!(r.userAgent && r.userAgent.indexOf('Firefox') >= 0)),
        (r.isSafari = !!(
          !r.isChrome &&
          r.userAgent &&
          r.userAgent.indexOf('Safari') >= 0
        )),
        (r.isEdge = !!(r.userAgent && r.userAgent.indexOf('Edg/') >= 0)),
        (r.isAndroid = !!(r.userAgent && r.userAgent.indexOf('Android') >= 0))
    }),
    Y(X[40], J([0, 1, 5]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.platform = r.env = r.cwd = void 0)
      let e
      if (
        typeof N.globals.vscode != 'undefined' &&
        typeof N.globals.vscode.process != 'undefined'
      ) {
        const A = N.globals.vscode.process
        e = {
          get platform() {
            return A.platform
          },
          get arch() {
            return A.arch
          },
          get env() {
            return A.env
          },
          cwd() {
            return A.cwd()
          },
        }
      } else
        typeof process != 'undefined'
          ? (e = {
              get platform() {
                return process.platform
              },
              get arch() {
                return process.arch
              },
              get env() {
                return process.env
              },
              cwd() {
                return process.env.VSCODE_CWD || process.cwd()
              },
            })
          : (e = {
              get platform() {
                return N.isWindows
                  ? 'win32'
                  : N.isMacintosh
                  ? 'darwin'
                  : 'linux'
              },
              get arch() {},
              get env() {
                return {}
              },
              cwd() {
                return '/'
              },
            })
      ;(r.cwd = e.cwd), (r.env = e.env), (r.platform = e.platform)
    }),
    Y(X[41], J([0, 1, 40]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.sep =
          r.extname =
          r.basename =
          r.dirname =
          r.relative =
          r.resolve =
          r.normalize =
          r.posix =
          r.win32 =
            void 0)
      const e = 65,
        A = 97,
        l = 90,
        y = 122,
        C = 46,
        c = 47,
        h = 92,
        v = 58,
        t = 63
      class g extends Error {
        constructor(a, f, d) {
          let o
          typeof f == 'string' && f.indexOf('not ') === 0
            ? ((o = 'must not be'), (f = f.replace(/^not /, '')))
            : (o = 'must be')
          const i = a.indexOf('.') !== -1 ? 'property' : 'argument'
          let u = `The "${a}" ${i} ${o} of type ${f}`
          u += `. Received type ${typeof d}`
          super(u)
          this.code = 'ERR_INVALID_ARG_TYPE'
        }
      }
      function m(s, a) {
        if (typeof s != 'string') throw new g(a, 'string', s)
      }
      function p(s) {
        return s === c || s === h
      }
      function L(s) {
        return s === c
      }
      function w(s) {
        return (s >= e && s <= l) || (s >= A && s <= y)
      }
      function S(s, a, f, d) {
        let o = '',
          i = 0,
          u = -1,
          _ = 0,
          E = 0
        for (let M = 0; M <= s.length; ++M) {
          if (M < s.length) E = s.charCodeAt(M)
          else {
            if (d(E)) break
            E = c
          }
          if (d(E)) {
            if (!(u === M - 1 || _ === 1))
              if (_ === 2) {
                if (
                  o.length < 2 ||
                  i !== 2 ||
                  o.charCodeAt(o.length - 1) !== C ||
                  o.charCodeAt(o.length - 2) !== C
                ) {
                  if (o.length > 2) {
                    const D = o.lastIndexOf(f)
                    D === -1
                      ? ((o = ''), (i = 0))
                      : ((o = o.slice(0, D)),
                        (i = o.length - 1 - o.lastIndexOf(f))),
                      (u = M),
                      (_ = 0)
                    continue
                  } else if (o.length !== 0) {
                    ;(o = ''), (i = 0), (u = M), (_ = 0)
                    continue
                  }
                }
                a && ((o += o.length > 0 ? `${f}..` : '..'), (i = 2))
              } else
                o.length > 0
                  ? (o += `${f}${s.slice(u + 1, M)}`)
                  : (o = s.slice(u + 1, M)),
                  (i = M - u - 1)
            ;(u = M), (_ = 0)
          } else E === C && _ !== -1 ? ++_ : (_ = -1)
        }
        return o
      }
      function b(s, a) {
        if (a === null || typeof a != 'object')
          throw new g('pathObject', 'Object', a)
        const f = a.dir || a.root,
          d = a.base || `${a.name || ''}${a.ext || ''}`
        return f ? (f === a.root ? `${f}${d}` : `${f}${s}${d}`) : d
      }
      ;(r.win32 = {
        resolve(...s) {
          let a = '',
            f = '',
            d = !1
          for (let o = s.length - 1; o >= -1; o--) {
            let i
            if (o >= 0) {
              if (((i = s[o]), m(i, 'path'), i.length === 0)) continue
            } else
              a.length === 0
                ? (i = N.cwd())
                : ((i = N.env[`=${a}`] || N.cwd()),
                  (i === void 0 ||
                    (i.slice(0, 2).toLowerCase() !== a.toLowerCase() &&
                      i.charCodeAt(2) === h)) &&
                    (i = `${a}\\`))
            const u = i.length
            let _ = 0,
              E = '',
              M = !1
            const D = i.charCodeAt(0)
            if (u === 1) p(D) && ((_ = 1), (M = !0))
            else if (p(D))
              if (((M = !0), p(i.charCodeAt(1)))) {
                let I = 2,
                  O = I
                for (; I < u && !p(i.charCodeAt(I)); ) I++
                if (I < u && I !== O) {
                  const q = i.slice(O, I)
                  for (O = I; I < u && p(i.charCodeAt(I)); ) I++
                  if (I < u && I !== O) {
                    for (O = I; I < u && !p(i.charCodeAt(I)); ) I++
                    ;(I === u || I !== O) &&
                      ((E = `\\\\${q}\\${i.slice(O, I)}`), (_ = I))
                  }
                }
              } else _ = 1
            else
              w(D) &&
                i.charCodeAt(1) === v &&
                ((E = i.slice(0, 2)),
                (_ = 2),
                u > 2 && p(i.charCodeAt(2)) && ((M = !0), (_ = 3)))
            if (E.length > 0)
              if (a.length > 0) {
                if (E.toLowerCase() !== a.toLowerCase()) continue
              } else a = E
            if (d) {
              if (a.length > 0) break
            } else if (
              ((f = `${i.slice(_)}\\${f}`), (d = M), M && a.length > 0)
            )
              break
          }
          return (f = S(f, !d, '\\', p)), d ? `${a}\\${f}` : `${a}${f}` || '.'
        },
        normalize(s) {
          m(s, 'path')
          const a = s.length
          if (a === 0) return '.'
          let f = 0,
            d,
            o = !1
          const i = s.charCodeAt(0)
          if (a === 1) return L(i) ? '\\' : s
          if (p(i))
            if (((o = !0), p(s.charCodeAt(1)))) {
              let _ = 2,
                E = _
              for (; _ < a && !p(s.charCodeAt(_)); ) _++
              if (_ < a && _ !== E) {
                const M = s.slice(E, _)
                for (E = _; _ < a && p(s.charCodeAt(_)); ) _++
                if (_ < a && _ !== E) {
                  for (E = _; _ < a && !p(s.charCodeAt(_)); ) _++
                  if (_ === a) return `\\\\${M}\\${s.slice(E)}\\`
                  _ !== E && ((d = `\\\\${M}\\${s.slice(E, _)}`), (f = _))
                }
              }
            } else f = 1
          else
            w(i) &&
              s.charCodeAt(1) === v &&
              ((d = s.slice(0, 2)),
              (f = 2),
              a > 2 && p(s.charCodeAt(2)) && ((o = !0), (f = 3)))
          let u = f < a ? S(s.slice(f), !o, '\\', p) : ''
          return (
            u.length === 0 && !o && (u = '.'),
            u.length > 0 && p(s.charCodeAt(a - 1)) && (u += '\\'),
            d === void 0 ? (o ? `\\${u}` : u) : o ? `${d}\\${u}` : `${d}${u}`
          )
        },
        isAbsolute(s) {
          m(s, 'path')
          const a = s.length
          if (a === 0) return !1
          const f = s.charCodeAt(0)
          return (
            p(f) ||
            (a > 2 && w(f) && s.charCodeAt(1) === v && p(s.charCodeAt(2)))
          )
        },
        join(...s) {
          if (s.length === 0) return '.'
          let a, f
          for (let i = 0; i < s.length; ++i) {
            const u = s[i]
            m(u, 'path'),
              u.length > 0 && (a === void 0 ? (a = f = u) : (a += `\\${u}`))
          }
          if (a === void 0) return '.'
          let d = !0,
            o = 0
          if (typeof f == 'string' && p(f.charCodeAt(0))) {
            ++o
            const i = f.length
            i > 1 &&
              p(f.charCodeAt(1)) &&
              (++o, i > 2 && (p(f.charCodeAt(2)) ? ++o : (d = !1)))
          }
          if (d) {
            for (; o < a.length && p(a.charCodeAt(o)); ) o++
            o >= 2 && (a = `\\${a.slice(o)}`)
          }
          return r.win32.normalize(a)
        },
        relative(s, a) {
          if ((m(s, 'from'), m(a, 'to'), s === a)) return ''
          const f = r.win32.resolve(s),
            d = r.win32.resolve(a)
          if (
            f === d ||
            ((s = f.toLowerCase()), (a = d.toLowerCase()), s === a)
          )
            return ''
          let o = 0
          for (; o < s.length && s.charCodeAt(o) === h; ) o++
          let i = s.length
          for (; i - 1 > o && s.charCodeAt(i - 1) === h; ) i--
          const u = i - o
          let _ = 0
          for (; _ < a.length && a.charCodeAt(_) === h; ) _++
          let E = a.length
          for (; E - 1 > _ && a.charCodeAt(E - 1) === h; ) E--
          const M = E - _,
            D = u < M ? u : M
          let I = -1,
            O = 0
          for (; O < D; O++) {
            const z = s.charCodeAt(o + O)
            if (z !== a.charCodeAt(_ + O)) break
            z === h && (I = O)
          }
          if (O !== D) {
            if (I === -1) return d
          } else {
            if (M > D) {
              if (a.charCodeAt(_ + O) === h) return d.slice(_ + O + 1)
              if (O === 2) return d.slice(_ + O)
            }
            u > D && (s.charCodeAt(o + O) === h ? (I = O) : O === 2 && (I = 3)),
              I === -1 && (I = 0)
          }
          let q = ''
          for (O = o + I + 1; O <= i; ++O)
            (O === i || s.charCodeAt(O) === h) &&
              (q += q.length === 0 ? '..' : '\\..')
          return (
            (_ += I),
            q.length > 0
              ? `${q}${d.slice(_, E)}`
              : (d.charCodeAt(_) === h && ++_, d.slice(_, E))
          )
        },
        toNamespacedPath(s) {
          if (typeof s != 'string') return s
          if (s.length === 0) return ''
          const a = r.win32.resolve(s)
          if (a.length <= 2) return s
          if (a.charCodeAt(0) === h) {
            if (a.charCodeAt(1) === h) {
              const f = a.charCodeAt(2)
              if (f !== t && f !== C) return `\\\\?\\UNC\\${a.slice(2)}`
            }
          } else if (
            w(a.charCodeAt(0)) &&
            a.charCodeAt(1) === v &&
            a.charCodeAt(2) === h
          )
            return `\\\\?\\${a}`
          return s
        },
        dirname(s) {
          m(s, 'path')
          const a = s.length
          if (a === 0) return '.'
          let f = -1,
            d = 0
          const o = s.charCodeAt(0)
          if (a === 1) return p(o) ? s : '.'
          if (p(o)) {
            if (((f = d = 1), p(s.charCodeAt(1)))) {
              let _ = 2,
                E = _
              for (; _ < a && !p(s.charCodeAt(_)); ) _++
              if (_ < a && _ !== E) {
                for (E = _; _ < a && p(s.charCodeAt(_)); ) _++
                if (_ < a && _ !== E) {
                  for (E = _; _ < a && !p(s.charCodeAt(_)); ) _++
                  if (_ === a) return s
                  _ !== E && (f = d = _ + 1)
                }
              }
            }
          } else
            w(o) &&
              s.charCodeAt(1) === v &&
              ((f = a > 2 && p(s.charCodeAt(2)) ? 3 : 2), (d = f))
          let i = -1,
            u = !0
          for (let _ = a - 1; _ >= d; --_)
            if (p(s.charCodeAt(_))) {
              if (!u) {
                i = _
                break
              }
            } else u = !1
          if (i === -1) {
            if (f === -1) return '.'
            i = f
          }
          return s.slice(0, i)
        },
        basename(s, a) {
          a !== void 0 && m(a, 'ext'), m(s, 'path')
          let f = 0,
            d = -1,
            o = !0,
            i
          if (
            (s.length >= 2 &&
              w(s.charCodeAt(0)) &&
              s.charCodeAt(1) === v &&
              (f = 2),
            a !== void 0 && a.length > 0 && a.length <= s.length)
          ) {
            if (a === s) return ''
            let u = a.length - 1,
              _ = -1
            for (i = s.length - 1; i >= f; --i) {
              const E = s.charCodeAt(i)
              if (p(E)) {
                if (!o) {
                  f = i + 1
                  break
                }
              } else
                _ === -1 && ((o = !1), (_ = i + 1)),
                  u >= 0 &&
                    (E === a.charCodeAt(u)
                      ? --u == -1 && (d = i)
                      : ((u = -1), (d = _)))
            }
            return f === d ? (d = _) : d === -1 && (d = s.length), s.slice(f, d)
          }
          for (i = s.length - 1; i >= f; --i)
            if (p(s.charCodeAt(i))) {
              if (!o) {
                f = i + 1
                break
              }
            } else d === -1 && ((o = !1), (d = i + 1))
          return d === -1 ? '' : s.slice(f, d)
        },
        extname(s) {
          m(s, 'path')
          let a = 0,
            f = -1,
            d = 0,
            o = -1,
            i = !0,
            u = 0
          s.length >= 2 &&
            s.charCodeAt(1) === v &&
            w(s.charCodeAt(0)) &&
            (a = d = 2)
          for (let _ = s.length - 1; _ >= a; --_) {
            const E = s.charCodeAt(_)
            if (p(E)) {
              if (!i) {
                d = _ + 1
                break
              }
              continue
            }
            o === -1 && ((i = !1), (o = _ + 1)),
              E === C
                ? f === -1
                  ? (f = _)
                  : u !== 1 && (u = 1)
                : f !== -1 && (u = -1)
          }
          return f === -1 ||
            o === -1 ||
            u === 0 ||
            (u === 1 && f === o - 1 && f === d + 1)
            ? ''
            : s.slice(f, o)
        },
        format: b.bind(null, '\\'),
        parse(s) {
          m(s, 'path')
          const a = { root: '', dir: '', base: '', ext: '', name: '' }
          if (s.length === 0) return a
          const f = s.length
          let d = 0,
            o = s.charCodeAt(0)
          if (f === 1)
            return p(o) ? ((a.root = a.dir = s), a) : ((a.base = a.name = s), a)
          if (p(o)) {
            if (((d = 1), p(s.charCodeAt(1)))) {
              let I = 2,
                O = I
              for (; I < f && !p(s.charCodeAt(I)); ) I++
              if (I < f && I !== O) {
                for (O = I; I < f && p(s.charCodeAt(I)); ) I++
                if (I < f && I !== O) {
                  for (O = I; I < f && !p(s.charCodeAt(I)); ) I++
                  I === f ? (d = I) : I !== O && (d = I + 1)
                }
              }
            }
          } else if (w(o) && s.charCodeAt(1) === v) {
            if (f <= 2) return (a.root = a.dir = s), a
            if (((d = 2), p(s.charCodeAt(2)))) {
              if (f === 3) return (a.root = a.dir = s), a
              d = 3
            }
          }
          d > 0 && (a.root = s.slice(0, d))
          let i = -1,
            u = d,
            _ = -1,
            E = !0,
            M = s.length - 1,
            D = 0
          for (; M >= d; --M) {
            if (((o = s.charCodeAt(M)), p(o))) {
              if (!E) {
                u = M + 1
                break
              }
              continue
            }
            _ === -1 && ((E = !1), (_ = M + 1)),
              o === C
                ? i === -1
                  ? (i = M)
                  : D !== 1 && (D = 1)
                : i !== -1 && (D = -1)
          }
          return (
            _ !== -1 &&
              (i === -1 || D === 0 || (D === 1 && i === _ - 1 && i === u + 1)
                ? (a.base = a.name = s.slice(u, _))
                : ((a.name = s.slice(u, i)),
                  (a.base = s.slice(u, _)),
                  (a.ext = s.slice(i, _)))),
            u > 0 && u !== d ? (a.dir = s.slice(0, u - 1)) : (a.dir = a.root),
            a
          )
        },
        sep: '\\',
        delimiter: ';',
        win32: null,
        posix: null,
      }),
        (r.posix = {
          resolve(...s) {
            let a = '',
              f = !1
            for (let d = s.length - 1; d >= -1 && !f; d--) {
              const o = d >= 0 ? s[d] : N.cwd()
              m(o, 'path'),
                o.length !== 0 &&
                  ((a = `${o}/${a}`), (f = o.charCodeAt(0) === c))
            }
            return (a = S(a, !f, '/', L)), f ? `/${a}` : a.length > 0 ? a : '.'
          },
          normalize(s) {
            if ((m(s, 'path'), s.length === 0)) return '.'
            const a = s.charCodeAt(0) === c,
              f = s.charCodeAt(s.length - 1) === c
            return (
              (s = S(s, !a, '/', L)),
              s.length === 0
                ? a
                  ? '/'
                  : f
                  ? './'
                  : '.'
                : (f && (s += '/'), a ? `/${s}` : s)
            )
          },
          isAbsolute(s) {
            return m(s, 'path'), s.length > 0 && s.charCodeAt(0) === c
          },
          join(...s) {
            if (s.length === 0) return '.'
            let a
            for (let f = 0; f < s.length; ++f) {
              const d = s[f]
              m(d, 'path'),
                d.length > 0 && (a === void 0 ? (a = d) : (a += `/${d}`))
            }
            return a === void 0 ? '.' : r.posix.normalize(a)
          },
          relative(s, a) {
            if (
              (m(s, 'from'),
              m(a, 'to'),
              s === a ||
                ((s = r.posix.resolve(s)), (a = r.posix.resolve(a)), s === a))
            )
              return ''
            const f = 1,
              d = s.length,
              o = d - f,
              i = 1,
              u = a.length - i,
              _ = o < u ? o : u
            let E = -1,
              M = 0
            for (; M < _; M++) {
              const I = s.charCodeAt(f + M)
              if (I !== a.charCodeAt(i + M)) break
              I === c && (E = M)
            }
            if (M === _)
              if (u > _) {
                if (a.charCodeAt(i + M) === c) return a.slice(i + M + 1)
                if (M === 0) return a.slice(i + M)
              } else
                o > _ &&
                  (s.charCodeAt(f + M) === c ? (E = M) : M === 0 && (E = 0))
            let D = ''
            for (M = f + E + 1; M <= d; ++M)
              (M === d || s.charCodeAt(M) === c) &&
                (D += D.length === 0 ? '..' : '/..')
            return `${D}${a.slice(i + E)}`
          },
          toNamespacedPath(s) {
            return s
          },
          dirname(s) {
            if ((m(s, 'path'), s.length === 0)) return '.'
            const a = s.charCodeAt(0) === c
            let f = -1,
              d = !0
            for (let o = s.length - 1; o >= 1; --o)
              if (s.charCodeAt(o) === c) {
                if (!d) {
                  f = o
                  break
                }
              } else d = !1
            return f === -1
              ? a
                ? '/'
                : '.'
              : a && f === 1
              ? '//'
              : s.slice(0, f)
          },
          basename(s, a) {
            a !== void 0 && m(a, 'ext'), m(s, 'path')
            let f = 0,
              d = -1,
              o = !0,
              i
            if (a !== void 0 && a.length > 0 && a.length <= s.length) {
              if (a === s) return ''
              let u = a.length - 1,
                _ = -1
              for (i = s.length - 1; i >= 0; --i) {
                const E = s.charCodeAt(i)
                if (E === c) {
                  if (!o) {
                    f = i + 1
                    break
                  }
                } else
                  _ === -1 && ((o = !1), (_ = i + 1)),
                    u >= 0 &&
                      (E === a.charCodeAt(u)
                        ? --u == -1 && (d = i)
                        : ((u = -1), (d = _)))
              }
              return (
                f === d ? (d = _) : d === -1 && (d = s.length), s.slice(f, d)
              )
            }
            for (i = s.length - 1; i >= 0; --i)
              if (s.charCodeAt(i) === c) {
                if (!o) {
                  f = i + 1
                  break
                }
              } else d === -1 && ((o = !1), (d = i + 1))
            return d === -1 ? '' : s.slice(f, d)
          },
          extname(s) {
            m(s, 'path')
            let a = -1,
              f = 0,
              d = -1,
              o = !0,
              i = 0
            for (let u = s.length - 1; u >= 0; --u) {
              const _ = s.charCodeAt(u)
              if (_ === c) {
                if (!o) {
                  f = u + 1
                  break
                }
                continue
              }
              d === -1 && ((o = !1), (d = u + 1)),
                _ === C
                  ? a === -1
                    ? (a = u)
                    : i !== 1 && (i = 1)
                  : a !== -1 && (i = -1)
            }
            return a === -1 ||
              d === -1 ||
              i === 0 ||
              (i === 1 && a === d - 1 && a === f + 1)
              ? ''
              : s.slice(a, d)
          },
          format: b.bind(null, '/'),
          parse(s) {
            m(s, 'path')
            const a = { root: '', dir: '', base: '', ext: '', name: '' }
            if (s.length === 0) return a
            const f = s.charCodeAt(0) === c
            let d
            f ? ((a.root = '/'), (d = 1)) : (d = 0)
            let o = -1,
              i = 0,
              u = -1,
              _ = !0,
              E = s.length - 1,
              M = 0
            for (; E >= d; --E) {
              const D = s.charCodeAt(E)
              if (D === c) {
                if (!_) {
                  i = E + 1
                  break
                }
                continue
              }
              u === -1 && ((_ = !1), (u = E + 1)),
                D === C
                  ? o === -1
                    ? (o = E)
                    : M !== 1 && (M = 1)
                  : o !== -1 && (M = -1)
            }
            if (u !== -1) {
              const D = i === 0 && f ? 1 : i
              o === -1 || M === 0 || (M === 1 && o === u - 1 && o === i + 1)
                ? (a.base = a.name = s.slice(D, u))
                : ((a.name = s.slice(D, o)),
                  (a.base = s.slice(D, u)),
                  (a.ext = s.slice(o, u)))
            }
            return i > 0 ? (a.dir = s.slice(0, i - 1)) : f && (a.dir = '/'), a
          },
          sep: '/',
          delimiter: ':',
          win32: null,
          posix: null,
        }),
        (r.posix.win32 = r.win32.win32 = r.win32),
        (r.posix.posix = r.win32.posix = r.posix),
        (r.normalize =
          N.platform === 'win32' ? r.win32.normalize : r.posix.normalize),
        (r.resolve =
          N.platform === 'win32' ? r.win32.resolve : r.posix.resolve),
        (r.relative =
          N.platform === 'win32' ? r.win32.relative : r.posix.relative),
        (r.dirname =
          N.platform === 'win32' ? r.win32.dirname : r.posix.dirname),
        (r.basename =
          N.platform === 'win32' ? r.win32.basename : r.posix.basename),
        (r.extname =
          N.platform === 'win32' ? r.win32.extname : r.posix.extname),
        (r.sep = N.platform === 'win32' ? r.win32.sep : r.posix.sep)
    }),
    Y(X[17], J([0, 1, 5]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.StopWatch = void 0)
      const e =
        N.globals.performance && typeof N.globals.performance.now == 'function'
      class A {
        constructor(y) {
          ;(this._highResolution = e && y),
            (this._startTime = this._now()),
            (this._stopTime = -1)
        }
        static create(y = !0) {
          return new A(y)
        }
        stop() {
          this._stopTime = this._now()
        }
        elapsed() {
          return this._stopTime !== -1
            ? this._stopTime - this._startTime
            : this._now() - this._startTime
        }
        _now() {
          return this._highResolution ? N.globals.performance.now() : Date.now()
        }
      }
      r.StopWatch = A
    }),
    Y(X[7], J([0, 1, 10, 8, 12, 17]), function (F, r, N, e, A, l) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.Relay =
          r.EventBufferer =
          r.DebounceEmitter =
          r.PauseableEmitter =
          r.EventDeliveryQueue =
          r.Emitter =
          r.Event =
            void 0)
      const y = !1,
        C = !1
      var c
      ;(function (d) {
        d.None = () => e.Disposable.None
        function o(Z) {
          if (C) {
            const { onListenerDidAdd: $ } = Z,
              j = g.create()
            let G = 0
            Z.onListenerDidAdd = () => {
              ++G == 2 &&
                (console.warn(
                  'snapshotted emitter LIKELY used public and SHOULD HAVE BEEN created with DisposableStore. snapshotted here'
                ),
                j.print()),
                $ == null || $()
            }
          }
        }
        function i(Z) {
          return ($, j = null, G) => {
            let K = !1,
              x
            return (
              (x = Z(
                (ee) => {
                  if (!K) return x ? x.dispose() : (K = !0), $.call(j, ee)
                },
                null,
                G
              )),
              K && x.dispose(),
              x
            )
          }
        }
        d.once = i
        function u(Z, $, j) {
          return O((G, K = null, x) => Z((ee) => G.call(K, $(ee)), null, x), j)
        }
        d.map = u
        function _(Z, $, j) {
          return O(
            (G, K = null, x) =>
              Z(
                (ee) => {
                  $(ee), G.call(K, ee)
                },
                null,
                x
              ),
            j
          )
        }
        d.forEach = _
        function E(Z, $, j) {
          return O(
            (G, K = null, x) => Z((ee) => $(ee) && G.call(K, ee), null, x),
            j
          )
        }
        d.filter = E
        function M(Z) {
          return Z
        }
        d.signal = M
        function D(...Z) {
          return ($, j = null, G) =>
            (0, e.combinedDisposable)(
              ...Z.map((K) => K((x) => $.call(j, x), null, G))
            )
        }
        d.any = D
        function I(Z, $, j, G) {
          let K = j
          return u(Z, (x) => ((K = $(K, x)), K), G)
        }
        d.reduce = I
        function O(Z, $) {
          let j
          const G = {
            onFirstListenerAdd() {
              j = Z(K.fire, K)
            },
            onLastListenerRemove() {
              j == null || j.dispose()
            },
          }
          $ || o(G)
          const K = new p(G)
          return $ == null || $.add(K), K.event
        }
        function q(Z, $, j = 100, G = !1, K, x) {
          let ee,
            se,
            me,
            le = 0
          const we = {
            leakWarningThreshold: K,
            onFirstListenerAdd() {
              ee = Z((Le) => {
                le++,
                  (se = $(se, Le)),
                  G && !me && (_e.fire(se), (se = void 0)),
                  clearTimeout(me),
                  (me = setTimeout(() => {
                    const Se = se
                    ;(se = void 0),
                      (me = void 0),
                      (!G || le > 1) && _e.fire(Se),
                      (le = 0)
                  }, j))
              })
            },
            onLastListenerRemove() {
              ee.dispose()
            },
          }
          x || o(we)
          const _e = new p(we)
          return x == null || x.add(_e), _e.event
        }
        d.debounce = q
        function z(Z, $ = (G, K) => G === K, j) {
          let G = !0,
            K
          return E(
            Z,
            (x) => {
              const ee = G || !$(x, K)
              return (G = !1), (K = x), ee
            },
            j
          )
        }
        d.latch = z
        function P(Z, $, j) {
          return [d.filter(Z, $, j), d.filter(Z, (G) => !$(G), j)]
        }
        d.split = P
        function U(Z, $ = !1, j = []) {
          let G = j.slice(),
            K = Z((se) => {
              G ? G.push(se) : ee.fire(se)
            })
          const x = () => {
              G == null || G.forEach((se) => ee.fire(se)), (G = null)
            },
            ee = new p({
              onFirstListenerAdd() {
                K || (K = Z((se) => ee.fire(se)))
              },
              onFirstListenerDidAdd() {
                G && ($ ? setTimeout(x) : x())
              },
              onLastListenerRemove() {
                K && K.dispose(), (K = null)
              },
            })
          return ee.event
        }
        d.buffer = U
        class T {
          constructor($) {
            ;(this.event = $), (this.disposables = new e.DisposableStore())
          }
          map($) {
            return new T(u(this.event, $, this.disposables))
          }
          forEach($) {
            return new T(_(this.event, $, this.disposables))
          }
          filter($) {
            return new T(E(this.event, $, this.disposables))
          }
          reduce($, j) {
            return new T(I(this.event, $, j, this.disposables))
          }
          latch() {
            return new T(z(this.event, void 0, this.disposables))
          }
          debounce($, j = 100, G = !1, K) {
            return new T(q(this.event, $, j, G, K, this.disposables))
          }
          on($, j, G) {
            return this.event($, j, G)
          }
          once($, j, G) {
            return i(this.event)($, j, G)
          }
          dispose() {
            this.disposables.dispose()
          }
        }
        function W(Z) {
          return new T(Z)
        }
        d.chain = W
        function B(Z, $, j = (G) => G) {
          const G = (...se) => ee.fire(j(...se)),
            K = () => Z.on($, G),
            x = () => Z.removeListener($, G),
            ee = new p({ onFirstListenerAdd: K, onLastListenerRemove: x })
          return ee.event
        }
        d.fromNodeEventEmitter = B
        function te(Z, $, j = (G) => G) {
          const G = (...se) => ee.fire(j(...se)),
            K = () => Z.addEventListener($, G),
            x = () => Z.removeEventListener($, G),
            ee = new p({ onFirstListenerAdd: K, onLastListenerRemove: x })
          return ee.event
        }
        d.fromDOMEventEmitter = te
        function n(Z) {
          return new Promise(($) => i(Z)($))
        }
        d.toPromise = n
        function de(Z, $) {
          return $(void 0), Z((j) => $(j))
        }
        d.runAndSubscribe = de
        function be(Z, $) {
          let j = null
          function G(x) {
            j == null || j.dispose(), (j = new e.DisposableStore()), $(x, j)
          }
          G(void 0)
          const K = Z((x) => G(x))
          return (0, e.toDisposable)(() => {
            K.dispose(), j == null || j.dispose()
          })
        }
        d.runAndSubscribeWithStore = be
        class pe {
          constructor($, j) {
            ;(this.obs = $), (this._counter = 0), (this._hasChanged = !1)
            const G = {
              onFirstListenerAdd: () => {
                $.addObserver(this)
              },
              onLastListenerRemove: () => {
                $.removeObserver(this)
              },
            }
            j || o(G), (this.emitter = new p(G)), j && j.add(this.emitter)
          }
          beginUpdate($) {
            this._counter++
          }
          handleChange($, j) {
            this._hasChanged = !0
          }
          endUpdate($) {
            --this._counter == 0 &&
              this._hasChanged &&
              ((this._hasChanged = !1), this.emitter.fire(this.obs.get()))
          }
        }
        function ye(Z, $) {
          return new pe(Z, $).emitter.event
        }
        d.fromObservable = ye
      })((c = r.Event || (r.Event = {})))
      class h {
        constructor(o) {
          ;(this._listenerCount = 0),
            (this._invocationCount = 0),
            (this._elapsedOverall = 0),
            (this._name = `${o}_${h._idPool++}`)
        }
        start(o) {
          ;(this._stopWatch = new l.StopWatch(!0)), (this._listenerCount = o)
        }
        stop() {
          if (this._stopWatch) {
            const o = this._stopWatch.elapsed()
            ;(this._elapsedOverall += o),
              (this._invocationCount += 1),
              console.info(
                `did FIRE ${this._name}: elapsed_ms: ${o.toFixed(
                  5
                )}, listener: ${
                  this._listenerCount
                } (elapsed_overall: ${this._elapsedOverall.toFixed(
                  2
                )}, invocations: ${this._invocationCount})`
              ),
              (this._stopWatch = void 0)
          }
        }
      }
      h._idPool = 0
      let v = -1
      class t {
        constructor(o, i = Math.random().toString(18).slice(2, 5)) {
          ;(this.customThreshold = o),
            (this.name = i),
            (this._warnCountdown = 0)
        }
        dispose() {
          this._stacks && this._stacks.clear()
        }
        check(o, i) {
          let u = v
          if (
            (typeof this.customThreshold == 'number' &&
              (u = this.customThreshold),
            u <= 0 || i < u)
          )
            return
          this._stacks || (this._stacks = new Map())
          const _ = this._stacks.get(o.value) || 0
          if (
            (this._stacks.set(o.value, _ + 1),
            (this._warnCountdown -= 1),
            this._warnCountdown <= 0)
          ) {
            this._warnCountdown = u * 0.5
            let E,
              M = 0
            for (const [D, I] of this._stacks)
              (!E || M < I) && ((E = D), (M = I))
            console.warn(
              `[${this.name}] potential listener LEAK detected, having ${i} listeners already. MOST frequent listener (${M}):`
            ),
              console.warn(E)
          }
          return () => {
            const E = this._stacks.get(o.value) || 0
            this._stacks.set(o.value, E - 1)
          }
        }
      }
      class g {
        constructor(o) {
          this.value = o
        }
        static create() {
          var o
          return new g(
            (o = new Error().stack) !== null && o !== void 0 ? o : ''
          )
        }
        print() {
          console.warn(
            this.value
              .split(
                `
`
              )
              .slice(2).join(`
`)
          )
        }
      }
      class m {
        constructor(o, i, u) {
          ;(this.callback = o),
            (this.callbackThis = i),
            (this.stack = u),
            (this.subscription = new e.SafeDisposable())
        }
        invoke(o) {
          this.callback.call(this.callbackThis, o)
        }
      }
      class p {
        constructor(o) {
          var i, u
          ;(this._disposed = !1),
            (this._options = o),
            (this._leakageMon =
              v > 0
                ? new t(this._options && this._options.leakWarningThreshold)
                : void 0),
            (this._perfMon = (
              (i = this._options) === null || i === void 0
                ? void 0
                : i._profName
            )
              ? new h(this._options._profName)
              : void 0),
            (this._deliveryQueue =
              (u = this._options) === null || u === void 0
                ? void 0
                : u.deliveryQueue)
        }
        dispose() {
          var o, i, u, _
          if (!this._disposed) {
            if (((this._disposed = !0), this._listeners)) {
              if (y) {
                const E = Array.from(this._listeners)
                queueMicrotask(() => {
                  var M
                  for (const D of E)
                    D.subscription.isset() &&
                      (D.subscription.unset(),
                      (M = D.stack) === null || M === void 0 || M.print())
                })
              }
              this._listeners.clear()
            }
            ;(o = this._deliveryQueue) === null ||
              o === void 0 ||
              o.clear(this),
              (u =
                (i = this._options) === null || i === void 0
                  ? void 0
                  : i.onLastListenerRemove) === null ||
                u === void 0 ||
                u.call(i),
              (_ = this._leakageMon) === null || _ === void 0 || _.dispose()
          }
        }
        get event() {
          return (
            this._event ||
              (this._event = (o, i, u) => {
                var _, E, M
                this._listeners || (this._listeners = new A.LinkedList())
                const D = this._listeners.isEmpty()
                D &&
                  ((_ = this._options) === null || _ === void 0
                    ? void 0
                    : _.onFirstListenerAdd) &&
                  this._options.onFirstListenerAdd(this)
                let I, O
                this._leakageMon &&
                  this._listeners.size >= 30 &&
                  ((O = g.create()),
                  (I = this._leakageMon.check(O, this._listeners.size + 1))),
                  y && (O = O ?? g.create())
                const q = new m(o, i, O),
                  z = this._listeners.push(q)
                D &&
                  ((E = this._options) === null || E === void 0
                    ? void 0
                    : E.onFirstListenerDidAdd) &&
                  this._options.onFirstListenerDidAdd(this),
                  ((M = this._options) === null || M === void 0
                    ? void 0
                    : M.onListenerDidAdd) &&
                    this._options.onListenerDidAdd(this, o, i)
                const P = q.subscription.set(() => {
                  I == null || I(),
                    this._disposed ||
                      (z(),
                      this._options &&
                        this._options.onLastListenerRemove &&
                        ((this._listeners && !this._listeners.isEmpty()) ||
                          this._options.onLastListenerRemove(this)))
                })
                return (
                  u instanceof e.DisposableStore
                    ? u.add(P)
                    : Array.isArray(u) && u.push(P),
                  P
                )
              }),
            this._event
          )
        }
        fire(o) {
          var i, u
          if (this._listeners) {
            this._deliveryQueue || (this._deliveryQueue = new w())
            for (const _ of this._listeners)
              this._deliveryQueue.push(this, _, o)
            ;(i = this._perfMon) === null ||
              i === void 0 ||
              i.start(this._deliveryQueue.size),
              this._deliveryQueue.deliver(),
              (u = this._perfMon) === null || u === void 0 || u.stop()
          }
        }
      }
      r.Emitter = p
      class L {
        constructor() {
          this._queue = new A.LinkedList()
        }
        get size() {
          return this._queue.size
        }
        push(o, i, u) {
          this._queue.push(new S(o, i, u))
        }
        clear(o) {
          const i = new A.LinkedList()
          for (const u of this._queue) u.emitter !== o && i.push(u)
          this._queue = i
        }
        deliver() {
          for (; this._queue.size > 0; ) {
            const o = this._queue.shift()
            try {
              o.listener.invoke(o.event)
            } catch (i) {
              ;(0, N.onUnexpectedError)(i)
            }
          }
        }
      }
      r.EventDeliveryQueue = L
      class w extends L {
        clear(o) {
          this._queue.clear()
        }
      }
      class S {
        constructor(o, i, u) {
          ;(this.emitter = o), (this.listener = i), (this.event = u)
        }
      }
      class b extends p {
        constructor(o) {
          super(o)
          ;(this._isPaused = 0),
            (this._eventQueue = new A.LinkedList()),
            (this._mergeFn = o == null ? void 0 : o.merge)
        }
        pause() {
          this._isPaused++
        }
        resume() {
          if (this._isPaused !== 0 && --this._isPaused == 0)
            if (this._mergeFn) {
              const o = Array.from(this._eventQueue)
              this._eventQueue.clear(), super.fire(this._mergeFn(o))
            } else
              for (; !this._isPaused && this._eventQueue.size !== 0; )
                super.fire(this._eventQueue.shift())
        }
        fire(o) {
          this._listeners &&
            (this._isPaused !== 0 ? this._eventQueue.push(o) : super.fire(o))
        }
      }
      r.PauseableEmitter = b
      class s extends b {
        constructor(o) {
          var i
          super(o)
          this._delay = (i = o.delay) !== null && i !== void 0 ? i : 100
        }
        fire(o) {
          this._handle ||
            (this.pause(),
            (this._handle = setTimeout(() => {
              ;(this._handle = void 0), this.resume()
            }, this._delay))),
            super.fire(o)
        }
      }
      r.DebounceEmitter = s
      class a {
        constructor() {
          this.buffers = []
        }
        wrapEvent(o) {
          return (i, u, _) =>
            o(
              (E) => {
                const M = this.buffers[this.buffers.length - 1]
                M ? M.push(() => i.call(u, E)) : i.call(u, E)
              },
              void 0,
              _
            )
        }
        bufferEvents(o) {
          const i = []
          this.buffers.push(i)
          const u = o()
          return this.buffers.pop(), i.forEach((_) => _()), u
        }
      }
      r.EventBufferer = a
      class f {
        constructor() {
          ;(this.listening = !1),
            (this.inputEvent = c.None),
            (this.inputEventListener = e.Disposable.None),
            (this.emitter = new p({
              onFirstListenerDidAdd: () => {
                ;(this.listening = !0),
                  (this.inputEventListener = this.inputEvent(
                    this.emitter.fire,
                    this.emitter
                  ))
              },
              onLastListenerRemove: () => {
                ;(this.listening = !1), this.inputEventListener.dispose()
              },
            })),
            (this.event = this.emitter.event)
        }
        set input(o) {
          ;(this.inputEvent = o),
            this.listening &&
              (this.inputEventListener.dispose(),
              (this.inputEventListener = o(this.emitter.fire, this.emitter)))
        }
        dispose() {
          this.inputEventListener.dispose(), this.emitter.dispose()
        }
      }
      r.Relay = f
    }),
    Y(X[42], J([0, 1, 7]), function (F, r, N) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.CancellationTokenSource = r.CancellationToken = void 0)
      const e = Object.freeze(function (C, c) {
        const h = setTimeout(C.bind(c), 0)
        return {
          dispose() {
            clearTimeout(h)
          },
        }
      })
      var A
      ;(function (C) {
        function c(h) {
          return h === C.None || h === C.Cancelled || h instanceof l
            ? !0
            : !h || typeof h != 'object'
            ? !1
            : typeof h.isCancellationRequested == 'boolean' &&
              typeof h.onCancellationRequested == 'function'
        }
        ;(C.isCancellationToken = c),
          (C.None = Object.freeze({
            isCancellationRequested: !1,
            onCancellationRequested: N.Event.None,
          })),
          (C.Cancelled = Object.freeze({
            isCancellationRequested: !0,
            onCancellationRequested: e,
          }))
      })((A = r.CancellationToken || (r.CancellationToken = {})))
      class l {
        constructor() {
          ;(this._isCancelled = !1), (this._emitter = null)
        }
        cancel() {
          this._isCancelled ||
            ((this._isCancelled = !0),
            this._emitter && (this._emitter.fire(void 0), this.dispose()))
        }
        get isCancellationRequested() {
          return this._isCancelled
        }
        get onCancellationRequested() {
          return this._isCancelled
            ? e
            : (this._emitter || (this._emitter = new N.Emitter()),
              this._emitter.event)
        }
        dispose() {
          this._emitter && (this._emitter.dispose(), (this._emitter = null))
        }
      }
      class y {
        constructor(c) {
          ;(this._token = void 0),
            (this._parentListener = void 0),
            (this._parentListener =
              c && c.onCancellationRequested(this.cancel, this))
        }
        get token() {
          return this._token || (this._token = new l()), this._token
        }
        cancel() {
          this._token
            ? this._token instanceof l && this._token.cancel()
            : (this._token = A.Cancelled)
        }
        dispose(c = !1) {
          c && this.cancel(),
            this._parentListener && this._parentListener.dispose(),
            this._token
              ? this._token instanceof l && this._token.dispose()
              : (this._token = A.None)
        }
      }
      r.CancellationTokenSource = y
    }),
    Y(X[9], J([0, 1, 41, 5]), function (F, r, N, e) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.uriToFsPath = r.URI = void 0)
      const A = /^\w[\w\d+.-]*$/,
        l = /^\//,
        y = /^\/\//
      function C(i, u) {
        if (!i.scheme && u)
          throw new Error(
            `[UriError]: Scheme is missing: {scheme: "", authority: "${i.authority}", path: "${i.path}", query: "${i.query}", fragment: "${i.fragment}"}`
          )
        if (i.scheme && !A.test(i.scheme))
          throw new Error('[UriError]: Scheme contains illegal characters.')
        if (i.path) {
          if (i.authority) {
            if (!l.test(i.path))
              throw new Error(
                '[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character'
              )
          } else if (y.test(i.path))
            throw new Error(
              '[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")'
            )
        }
      }
      function c(i, u) {
        return !i && !u ? 'file' : i
      }
      function h(i, u) {
        switch (i) {
          case 'https':
          case 'http':
          case 'file':
            u ? u[0] !== t && (u = t + u) : (u = t)
            break
        }
        return u
      }
      const v = '',
        t = '/',
        g = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/
      class m {
        constructor(u, _, E, M, D, I = !1) {
          typeof u == 'object'
            ? ((this.scheme = u.scheme || v),
              (this.authority = u.authority || v),
              (this.path = u.path || v),
              (this.query = u.query || v),
              (this.fragment = u.fragment || v))
            : ((this.scheme = c(u, I)),
              (this.authority = _ || v),
              (this.path = h(this.scheme, E || v)),
              (this.query = M || v),
              (this.fragment = D || v),
              C(this, I))
        }
        static isUri(u) {
          return u instanceof m
            ? !0
            : u
            ? typeof u.authority == 'string' &&
              typeof u.fragment == 'string' &&
              typeof u.path == 'string' &&
              typeof u.query == 'string' &&
              typeof u.scheme == 'string' &&
              typeof u.fsPath == 'string' &&
              typeof u.with == 'function' &&
              typeof u.toString == 'function'
            : !1
        }
        get fsPath() {
          return s(this, !1)
        }
        with(u) {
          if (!u) return this
          let { scheme: _, authority: E, path: M, query: D, fragment: I } = u
          return (
            _ === void 0 ? (_ = this.scheme) : _ === null && (_ = v),
            E === void 0 ? (E = this.authority) : E === null && (E = v),
            M === void 0 ? (M = this.path) : M === null && (M = v),
            D === void 0 ? (D = this.query) : D === null && (D = v),
            I === void 0 ? (I = this.fragment) : I === null && (I = v),
            _ === this.scheme &&
            E === this.authority &&
            M === this.path &&
            D === this.query &&
            I === this.fragment
              ? this
              : new L(_, E, M, D, I)
          )
        }
        static parse(u, _ = !1) {
          const E = g.exec(u)
          return E
            ? new L(
                E[2] || v,
                o(E[4] || v),
                o(E[5] || v),
                o(E[7] || v),
                o(E[9] || v),
                _
              )
            : new L(v, v, v, v, v)
        }
        static file(u) {
          let _ = v
          if (
            (e.isWindows && (u = u.replace(/\\/g, t)), u[0] === t && u[1] === t)
          ) {
            const E = u.indexOf(t, 2)
            E === -1
              ? ((_ = u.substring(2)), (u = t))
              : ((_ = u.substring(2, E)), (u = u.substring(E) || t))
          }
          return new L('file', _, u, v, v)
        }
        static from(u) {
          const _ = new L(u.scheme, u.authority, u.path, u.query, u.fragment)
          return C(_, !0), _
        }
        static joinPath(u, ..._) {
          if (!u.path)
            throw new Error(
              '[UriError]: cannot call joinPath on URI without path'
            )
          let E
          return (
            e.isWindows && u.scheme === 'file'
              ? (E = m.file(N.win32.join(s(u, !0), ..._)).path)
              : (E = N.posix.join(u.path, ..._)),
            u.with({ path: E })
          )
        }
        toString(u = !1) {
          return a(this, u)
        }
        toJSON() {
          return this
        }
        static revive(u) {
          if (u) {
            if (u instanceof m) return u
            {
              const _ = new L(u)
              return (
                (_._formatted = u.external),
                (_._fsPath = u._sep === p ? u.fsPath : null),
                _
              )
            }
          } else return u
        }
      }
      r.URI = m
      const p = e.isWindows ? 1 : void 0
      class L extends m {
        constructor() {
          super(...arguments)
          ;(this._formatted = null), (this._fsPath = null)
        }
        get fsPath() {
          return this._fsPath || (this._fsPath = s(this, !1)), this._fsPath
        }
        toString(u = !1) {
          return u
            ? a(this, !0)
            : (this._formatted || (this._formatted = a(this, !1)),
              this._formatted)
        }
        toJSON() {
          const u = { $mid: 1 }
          return (
            this._fsPath && ((u.fsPath = this._fsPath), (u._sep = p)),
            this._formatted && (u.external = this._formatted),
            this.path && (u.path = this.path),
            this.scheme && (u.scheme = this.scheme),
            this.authority && (u.authority = this.authority),
            this.query && (u.query = this.query),
            this.fragment && (u.fragment = this.fragment),
            u
          )
        }
      }
      const w = {
        [58]: '%3A',
        [47]: '%2F',
        [63]: '%3F',
        [35]: '%23',
        [91]: '%5B',
        [93]: '%5D',
        [64]: '%40',
        [33]: '%21',
        [36]: '%24',
        [38]: '%26',
        [39]: '%27',
        [40]: '%28',
        [41]: '%29',
        [42]: '%2A',
        [43]: '%2B',
        [44]: '%2C',
        [59]: '%3B',
        [61]: '%3D',
        [32]: '%20',
      }
      function S(i, u) {
        let _,
          E = -1
        for (let M = 0; M < i.length; M++) {
          const D = i.charCodeAt(M)
          if (
            (D >= 97 && D <= 122) ||
            (D >= 65 && D <= 90) ||
            (D >= 48 && D <= 57) ||
            D === 45 ||
            D === 46 ||
            D === 95 ||
            D === 126 ||
            (u && D === 47)
          )
            E !== -1 &&
              ((_ += encodeURIComponent(i.substring(E, M))), (E = -1)),
              _ !== void 0 && (_ += i.charAt(M))
          else {
            _ === void 0 && (_ = i.substr(0, M))
            const I = w[D]
            I !== void 0
              ? (E !== -1 &&
                  ((_ += encodeURIComponent(i.substring(E, M))), (E = -1)),
                (_ += I))
              : E === -1 && (E = M)
          }
        }
        return (
          E !== -1 && (_ += encodeURIComponent(i.substring(E))),
          _ !== void 0 ? _ : i
        )
      }
      function b(i) {
        let u
        for (let _ = 0; _ < i.length; _++) {
          const E = i.charCodeAt(_)
          E === 35 || E === 63
            ? (u === void 0 && (u = i.substr(0, _)), (u += w[E]))
            : u !== void 0 && (u += i[_])
        }
        return u !== void 0 ? u : i
      }
      function s(i, u) {
        let _
        return (
          i.authority && i.path.length > 1 && i.scheme === 'file'
            ? (_ = `//${i.authority}${i.path}`)
            : i.path.charCodeAt(0) === 47 &&
              ((i.path.charCodeAt(1) >= 65 && i.path.charCodeAt(1) <= 90) ||
                (i.path.charCodeAt(1) >= 97 && i.path.charCodeAt(1) <= 122)) &&
              i.path.charCodeAt(2) === 58
            ? u
              ? (_ = i.path.substr(1))
              : (_ = i.path[1].toLowerCase() + i.path.substr(2))
            : (_ = i.path),
          e.isWindows && (_ = _.replace(/\//g, '\\')),
          _
        )
      }
      r.uriToFsPath = s
      function a(i, u) {
        const _ = u ? b : S
        let E = '',
          { scheme: M, authority: D, path: I, query: O, fragment: q } = i
        if (
          (M && ((E += M), (E += ':')),
          (D || M === 'file') && ((E += t), (E += t)),
          D)
        ) {
          let z = D.indexOf('@')
          if (z !== -1) {
            const P = D.substr(0, z)
            ;(D = D.substr(z + 1)),
              (z = P.indexOf(':')),
              z === -1
                ? (E += _(P, !1))
                : ((E += _(P.substr(0, z), !1)),
                  (E += ':'),
                  (E += _(P.substr(z + 1), !1))),
              (E += '@')
          }
          ;(D = D.toLowerCase()),
            (z = D.indexOf(':')),
            z === -1
              ? (E += _(D, !1))
              : ((E += _(D.substr(0, z), !1)), (E += D.substr(z)))
        }
        if (I) {
          if (
            I.length >= 3 &&
            I.charCodeAt(0) === 47 &&
            I.charCodeAt(2) === 58
          ) {
            const z = I.charCodeAt(1)
            z >= 65 &&
              z <= 90 &&
              (I = `/${String.fromCharCode(z + 32)}:${I.substr(3)}`)
          } else if (I.length >= 2 && I.charCodeAt(1) === 58) {
            const z = I.charCodeAt(0)
            z >= 65 &&
              z <= 90 &&
              (I = `${String.fromCharCode(z + 32)}:${I.substr(2)}`)
          }
          E += _(I, !0)
        }
        return (
          O && ((E += '?'), (E += _(O, !1))),
          q && ((E += '#'), (E += u ? q : S(q, !1))),
          E
        )
      }
      function f(i) {
        try {
          return decodeURIComponent(i)
        } catch {
          return i.length > 3 ? i.substr(0, 3) + f(i.substr(3)) : i
        }
      }
      const d = /(%[0-9A-Za-z][0-9A-Za-z])+/g
      function o(i) {
        return i.match(d) ? i.replace(d, (u) => f(u)) : i
      }
    }),
    Y(X[47], J([0, 1, 10, 7, 8, 5, 6, 2]), function (F, r, N, e, A, l, y, C) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.create =
          r.SimpleWorkerServer =
          r.SimpleWorkerClient =
          r.logOnceWebWorkerWarning =
            void 0)
      const c = '$initialize'
      let h = !1
      function v(o) {
        !l.isWeb ||
          (h ||
            ((h = !0),
            console.warn(
              'Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/microsoft/monaco-editor#faq'
            )),
          console.warn(o.message))
      }
      r.logOnceWebWorkerWarning = v
      class t {
        constructor(i, u, _, E) {
          ;(this.vsWorker = i),
            (this.req = u),
            (this.method = _),
            (this.args = E),
            (this.type = 0)
        }
      }
      class g {
        constructor(i, u, _, E) {
          ;(this.vsWorker = i),
            (this.seq = u),
            (this.res = _),
            (this.err = E),
            (this.type = 1)
        }
      }
      class m {
        constructor(i, u, _, E) {
          ;(this.vsWorker = i),
            (this.req = u),
            (this.eventName = _),
            (this.arg = E),
            (this.type = 2)
        }
      }
      class p {
        constructor(i, u, _) {
          ;(this.vsWorker = i),
            (this.req = u),
            (this.event = _),
            (this.type = 3)
        }
      }
      class L {
        constructor(i, u) {
          ;(this.vsWorker = i), (this.req = u), (this.type = 4)
        }
      }
      class w {
        constructor(i) {
          ;(this._workerId = -1),
            (this._handler = i),
            (this._lastSentReq = 0),
            (this._pendingReplies = Object.create(null)),
            (this._pendingEmitters = new Map()),
            (this._pendingEvents = new Map())
        }
        setWorkerId(i) {
          this._workerId = i
        }
        sendMessage(i, u) {
          const _ = String(++this._lastSentReq)
          return new Promise((E, M) => {
            ;(this._pendingReplies[_] = { resolve: E, reject: M }),
              this._send(new t(this._workerId, _, i, u))
          })
        }
        listen(i, u) {
          let _ = null
          const E = new e.Emitter({
            onFirstListenerAdd: () => {
              ;(_ = String(++this._lastSentReq)),
                this._pendingEmitters.set(_, E),
                this._send(new m(this._workerId, _, i, u))
            },
            onLastListenerRemove: () => {
              this._pendingEmitters.delete(_),
                this._send(new L(this._workerId, _)),
                (_ = null)
            },
          })
          return E.event
        }
        handleMessage(i) {
          !i ||
            !i.vsWorker ||
            (this._workerId !== -1 && i.vsWorker !== this._workerId) ||
            this._handleMessage(i)
        }
        _handleMessage(i) {
          switch (i.type) {
            case 1:
              return this._handleReplyMessage(i)
            case 0:
              return this._handleRequestMessage(i)
            case 2:
              return this._handleSubscribeEventMessage(i)
            case 3:
              return this._handleEventMessage(i)
            case 4:
              return this._handleUnsubscribeEventMessage(i)
          }
        }
        _handleReplyMessage(i) {
          if (!this._pendingReplies[i.seq]) {
            console.warn('Got reply to unknown seq')
            return
          }
          const u = this._pendingReplies[i.seq]
          if ((delete this._pendingReplies[i.seq], i.err)) {
            let _ = i.err
            i.err.$isError &&
              ((_ = new Error()),
              (_.name = i.err.name),
              (_.message = i.err.message),
              (_.stack = i.err.stack)),
              u.reject(_)
            return
          }
          u.resolve(i.res)
        }
        _handleRequestMessage(i) {
          const u = i.req
          this._handler.handleMessage(i.method, i.args).then(
            (E) => {
              this._send(new g(this._workerId, u, E, void 0))
            },
            (E) => {
              E.detail instanceof Error &&
                (E.detail = (0, N.transformErrorForSerialization)(E.detail)),
                this._send(
                  new g(
                    this._workerId,
                    u,
                    void 0,
                    (0, N.transformErrorForSerialization)(E)
                  )
                )
            }
          )
        }
        _handleSubscribeEventMessage(i) {
          const u = i.req,
            _ = this._handler.handleEvent(
              i.eventName,
              i.arg
            )((E) => {
              this._send(new p(this._workerId, u, E))
            })
          this._pendingEvents.set(u, _)
        }
        _handleEventMessage(i) {
          if (!this._pendingEmitters.has(i.req)) {
            console.warn('Got event for unknown req')
            return
          }
          this._pendingEmitters.get(i.req).fire(i.event)
        }
        _handleUnsubscribeEventMessage(i) {
          if (!this._pendingEvents.has(i.req)) {
            console.warn('Got unsubscribe for unknown req')
            return
          }
          this._pendingEvents.get(i.req).dispose(),
            this._pendingEvents.delete(i.req)
        }
        _send(i) {
          const u = []
          if (i.type === 0)
            for (let _ = 0; _ < i.args.length; _++)
              i.args[_] instanceof ArrayBuffer && u.push(i.args[_])
          else i.type === 1 && i.res instanceof ArrayBuffer && u.push(i.res)
          this._handler.sendMessage(i, u)
        }
      }
      class S extends A.Disposable {
        constructor(i, u, _) {
          super()
          let E = null
          ;(this._worker = this._register(
            i.create(
              'vs/base/common/worker/simpleWorker',
              (q) => {
                this._protocol.handleMessage(q)
              },
              (q) => {
                E == null || E(q)
              }
            )
          )),
            (this._protocol = new w({
              sendMessage: (q, z) => {
                this._worker.postMessage(q, z)
              },
              handleMessage: (q, z) => {
                if (typeof _[q] != 'function')
                  return Promise.reject(
                    new Error('Missing method ' + q + ' on main thread host.')
                  )
                try {
                  return Promise.resolve(_[q].apply(_, z))
                } catch (P) {
                  return Promise.reject(P)
                }
              },
              handleEvent: (q, z) => {
                if (s(q)) {
                  const P = _[q].call(_, z)
                  if (typeof P != 'function')
                    throw new Error(
                      `Missing dynamic event ${q} on main thread host.`
                    )
                  return P
                }
                if (b(q)) {
                  const P = _[q]
                  if (typeof P != 'function')
                    throw new Error(`Missing event ${q} on main thread host.`)
                  return P
                }
                throw new Error(`Malformed event name ${q}`)
              },
            })),
            this._protocol.setWorkerId(this._worker.getId())
          let M = null
          typeof l.globals.require != 'undefined' &&
          typeof l.globals.require.getConfig == 'function'
            ? (M = l.globals.require.getConfig())
            : typeof l.globals.requirejs != 'undefined' &&
              (M = l.globals.requirejs.s.contexts._.config)
          const D = y.getAllMethodNames(_)
          this._onModuleLoaded = this._protocol.sendMessage(c, [
            this._worker.getId(),
            JSON.parse(JSON.stringify(M)),
            u,
            D,
          ])
          const I = (q, z) => this._request(q, z),
            O = (q, z) => this._protocol.listen(q, z)
          this._lazyProxy = new Promise((q, z) => {
            ;(E = z),
              this._onModuleLoaded.then(
                (P) => {
                  q(a(P, I, O))
                },
                (P) => {
                  z(P), this._onError('Worker failed to load ' + u, P)
                }
              )
          })
        }
        getProxyObject() {
          return this._lazyProxy
        }
        _request(i, u) {
          return new Promise((_, E) => {
            this._onModuleLoaded.then(() => {
              this._protocol.sendMessage(i, u).then(_, E)
            }, E)
          })
        }
        _onError(i, u) {
          console.error(i), console.info(u)
        }
      }
      r.SimpleWorkerClient = S
      function b(o) {
        return (
          o[0] === 'o' && o[1] === 'n' && C.isUpperAsciiLetter(o.charCodeAt(2))
        )
      }
      function s(o) {
        return /^onDynamic/.test(o) && C.isUpperAsciiLetter(o.charCodeAt(9))
      }
      function a(o, i, u) {
        const _ = (D) =>
            function () {
              const I = Array.prototype.slice.call(arguments, 0)
              return i(D, I)
            },
          E = (D) =>
            function (I) {
              return u(D, I)
            },
          M = {}
        for (const D of o) {
          if (s(D)) {
            M[D] = E(D)
            continue
          }
          if (b(D)) {
            M[D] = u(D, void 0)
            continue
          }
          M[D] = _(D)
        }
        return M
      }
      class f {
        constructor(i, u) {
          ;(this._requestHandlerFactory = u),
            (this._requestHandler = null),
            (this._protocol = new w({
              sendMessage: (_, E) => {
                i(_, E)
              },
              handleMessage: (_, E) => this._handleMessage(_, E),
              handleEvent: (_, E) => this._handleEvent(_, E),
            }))
        }
        onmessage(i) {
          this._protocol.handleMessage(i)
        }
        _handleMessage(i, u) {
          if (i === c) return this.initialize(u[0], u[1], u[2], u[3])
          if (
            !this._requestHandler ||
            typeof this._requestHandler[i] != 'function'
          )
            return Promise.reject(
              new Error('Missing requestHandler or method: ' + i)
            )
          try {
            return Promise.resolve(
              this._requestHandler[i].apply(this._requestHandler, u)
            )
          } catch (_) {
            return Promise.reject(_)
          }
        }
        _handleEvent(i, u) {
          if (!this._requestHandler) throw new Error('Missing requestHandler')
          if (s(i)) {
            const _ = this._requestHandler[i].call(this._requestHandler, u)
            if (typeof _ != 'function')
              throw new Error(`Missing dynamic event ${i} on request handler.`)
            return _
          }
          if (b(i)) {
            const _ = this._requestHandler[i]
            if (typeof _ != 'function')
              throw new Error(`Missing event ${i} on request handler.`)
            return _
          }
          throw new Error(`Malformed event name ${i}`)
        }
        initialize(i, u, _, E) {
          this._protocol.setWorkerId(i)
          const I = a(
            E,
            (O, q) => this._protocol.sendMessage(O, q),
            (O, q) => this._protocol.listen(O, q)
          )
          return this._requestHandlerFactory
            ? ((this._requestHandler = this._requestHandlerFactory(I)),
              Promise.resolve(y.getAllMethodNames(this._requestHandler)))
            : (u &&
                (typeof u.baseUrl != 'undefined' && delete u.baseUrl,
                typeof u.paths != 'undefined' &&
                  typeof u.paths.vs != 'undefined' &&
                  delete u.paths.vs,
                typeof u.trustedTypesPolicy !== void 0 &&
                  delete u.trustedTypesPolicy,
                (u.catchError = !0),
                l.globals.require.config(u)),
              new Promise((O, q) => {
                ;(l.globals.require || F)(
                  [_],
                  (P) => {
                    if (
                      ((this._requestHandler = P.create(I)),
                      !this._requestHandler)
                    ) {
                      q(new Error('No RequestHandler!'))
                      return
                    }
                    O(y.getAllMethodNames(this._requestHandler))
                  },
                  q
                )
              }))
        }
      }
      r.SimpleWorkerServer = f
      function d(o) {
        return new f(o, null)
      }
      r.create = d
    }),
    Y(X[43], J([0, 1, 7, 8]), function (F, r, N, e) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.TokenizationRegistry = void 0)
      class A {
        constructor() {
          ;(this._map = new Map()),
            (this._factories = new Map()),
            (this._onDidChange = new N.Emitter()),
            (this.onDidChange = this._onDidChange.event),
            (this._colorMap = null)
        }
        fire(C) {
          this._onDidChange.fire({ changedLanguages: C, changedColorMap: !1 })
        }
        register(C, c) {
          return (
            this._map.set(C, c),
            this.fire([C]),
            (0, e.toDisposable)(() => {
              this._map.get(C) === c && (this._map.delete(C), this.fire([C]))
            })
          )
        }
        registerFactory(C, c) {
          var h
          ;(h = this._factories.get(C)) === null || h === void 0 || h.dispose()
          const v = new l(this, C, c)
          return (
            this._factories.set(C, v),
            (0, e.toDisposable)(() => {
              const t = this._factories.get(C)
              !t || t !== v || (this._factories.delete(C), t.dispose())
            })
          )
        }
        getOrCreate(C) {
          return oe(this, void 0, void 0, function* () {
            const c = this.get(C)
            if (c) return c
            const h = this._factories.get(C)
            return !h || h.isResolved ? null : (yield h.resolve(), this.get(C))
          })
        }
        get(C) {
          return this._map.get(C) || null
        }
        isResolved(C) {
          if (this.get(C)) return !0
          const h = this._factories.get(C)
          return !!(!h || h.isResolved)
        }
        setColorMap(C) {
          ;(this._colorMap = C),
            this._onDidChange.fire({
              changedLanguages: Array.from(this._map.keys()),
              changedColorMap: !0,
            })
        }
        getColorMap() {
          return this._colorMap
        }
        getDefaultBackground() {
          return this._colorMap && this._colorMap.length > 2
            ? this._colorMap[2]
            : null
        }
      }
      r.TokenizationRegistry = A
      class l extends e.Disposable {
        constructor(C, c, h) {
          super()
          ;(this._registry = C),
            (this._languageId = c),
            (this._factory = h),
            (this._isDisposed = !1),
            (this._resolvePromise = null),
            (this._isResolved = !1)
        }
        get isResolved() {
          return this._isResolved
        }
        dispose() {
          ;(this._isDisposed = !0), super.dispose()
        }
        resolve() {
          return oe(this, void 0, void 0, function* () {
            return (
              this._resolvePromise || (this._resolvePromise = this._create()),
              this._resolvePromise
            )
          })
        }
        _create() {
          return oe(this, void 0, void 0, function* () {
            const C = yield Promise.resolve(
              this._factory.createTokenizationSupport()
            )
            ;(this._isResolved = !0),
              C &&
                !this._isDisposed &&
                this._register(this._registry.register(this._languageId, C))
          })
        }
      }
    }),
    Y(X[44], J([0, 1, 21, 9, 4, 43]), function (F, r, N, e, A, l) {
      'use strict'
      Object.defineProperty(r, '__esModule', { value: !0 }),
        (r.TokenizationRegistry =
          r.InlayHintKind =
          r.Command =
          r.FoldingRangeKind =
          r.SymbolKinds =
          r.isLocationLink =
          r.DocumentHighlightKind =
          r.SignatureHelpTriggerKind =
          r.InlineCompletionTriggerKind =
          r.CompletionItemKinds =
          r.EncodedTokenizationResult =
          r.TokenizationResult =
          r.Token =
            void 0)
      class y {
        constructor(s, a, f) {
          ;(this._tokenBrand = void 0),
            (this.offset = s),
            (this.type = a),
            (this.language = f)
        }
        toString() {
          return '(' + this.offset + ', ' + this.type + ')'
        }
      }
      r.Token = y
      class C {
        constructor(s, a) {
          ;(this._tokenizationResultBrand = void 0),
            (this.tokens = s),
            (this.endState = a)
        }
      }
      r.TokenizationResult = C
      class c {
        constructor(s, a) {
          ;(this._encodedTokenizationResultBrand = void 0),
            (this.tokens = s),
            (this.endState = a)
        }
      }
      r.EncodedTokenizationResult = c
      var h
      ;(function (b) {
        const s = new Map()
        s.set(0, N.Codicon.symbolMethod),
          s.set(1, N.Codicon.symbolFunction),
          s.set(2, N.Codicon.symbolConstructor),
          s.set(3, N.Codicon.symbolField),
          s.set(4, N.Codicon.symbolVariable),
          s.set(5, N.Codicon.symbolClass),
          s.set(6, N.Codicon.symbolStruct),
          s.set(7, N.Codicon.symbolInterface),
          s.set(8, N.Codicon.symbolModule),
          s.set(9, N.Codicon.symbolProperty),
          s.set(10, N.Codicon.symbolEvent),
          s.set(11, N.Codicon.symbolOperator),
          s.set(12, N.Codicon.symbolUnit),
          s.set(13, N.Codicon.symbolValue),
          s.set(15, N.Codicon.symbolEnum),
          s.set(14, N.Codicon.symbolConstant),
          s.set(15, N.Codicon.symbolEnum),
          s.set(16, N.Codicon.symbolEnumMember),
          s.set(17, N.Codicon.symbolKeyword),
          s.set(27, N.Codicon.symbolSnippet),
          s.set(18, N.Codicon.symbolText),
          s.set(19, N.Codicon.symbolColor),
          s.set(20, N.Codicon.symbolFile),
          s.set(21, N.Codicon.symbolReference),
          s.set(22, N.Codicon.symbolCustomColor),
          s.set(23, N.Codicon.symbolFolder),
          s.set(24, N.Codicon.symbolTypeParameter),
          s.set(25, N.Codicon.account),
          s.set(26, N.Codicon.issues)
        function a(o) {
          let i = s.get(o)
          return (
            i ||
              (console.info('No codicon found for CompletionItemKind ' + o),
              (i = N.Codicon.symbolProperty)),
            i
          )
        }
        b.toIcon = a
        const f = new Map()
        f.set('method', 0),
          f.set('function', 1),
          f.set('constructor', 2),
          f.set('field', 3),
          f.set('variable', 4),
          f.set('class', 5),
          f.set('struct', 6),
          f.set('interface', 7),
          f.set('module', 8),
          f.set('property', 9),
          f.set('event', 10),
          f.set('operator', 11),
          f.set('unit', 12),
          f.set('value', 13),
          f.set('constant', 14),
          f.set('enum', 15),
          f.set('enum-member', 16),
          f.set('enumMember', 16),
          f.set('keyword', 17),
          f.set('snippet', 27),
          f.set('text', 18),
          f.set('color', 19),
          f.set('file', 20),
          f.set('reference', 21),
          f.set('customcolor', 22),
          f.set('folder', 23),
          f.set('type-parameter', 24),
          f.set('typeParameter', 24),
          f.set('account', 25),
          f.set('issue', 26)
        function d(o, i) {
          let u = f.get(o)
          return typeof u == 'undefined' && !i && (u = 9), u
        }
        b.fromString = d
      })((h = r.CompletionItemKinds || (r.CompletionItemKinds = {})))
      var v
      ;(function (b) {
        ;(b[(b.Automatic = 0)] = 'Automatic'),
          (b[(b.Explicit = 1)] = 'Explicit')
      })(
        (v =
          r.InlineCompletionTriggerKind || (r.InlineCompletionTriggerKind = {}))
      )
      var t
      ;(function (b) {
        ;(b[(b.Invoke = 1)] = 'Invoke'),
          (b[(b.TriggerCharacter = 2)] = 'TriggerCharacter'),
          (b[(b.ContentChange = 3)] = 'ContentChange')
      })((t = r.SignatureHelpTriggerKind || (r.SignatureHelpTriggerKind = {})))
      var g
      ;(function (b) {
        ;(b[(b.Text = 0)] = 'Text'),
          (b[(b.Read = 1)] = 'Read'),
          (b[(b.Write = 2)] = 'Write')
      })((g = r.DocumentHighlightKind || (r.DocumentHighlightKind = {})))
      function m(b) {
        return (
          b &&
          e.URI.isUri(b.uri) &&
          A.Range.isIRange(b.range) &&
          (A.Range.isIRange(b.originSelectionRange) ||
            A.Range.isIRange(b.targetSelectionRange))
        )
      }
      r.isLocationLink = m
      var p
      ;(function (b) {
        const s = new Map()
        s.set(0, N.Codicon.symbolFile),
          s.set(1, N.Codicon.symbolModule),
          s.set(2, N.Codicon.symbolNamespace),
          s.set(3, N.Codicon.symbolPackage),
          s.set(4, N.Codicon.symbolClass),
          s.set(5, N.Codicon.symbolMethod),
          s.set(6, N.Codicon.symbolProperty),
          s.set(7, N.Codicon.symbolField),
          s.set(8, N.Codicon.symbolConstructor),
          s.set(9, N.Codicon.symbolEnum),
          s.set(10, N.Codicon.symbolInterface),
          s.set(11, N.Codicon.symbolFunction),
          s.set(12, N.Codicon.symbolVariable),
          s.set(13, N.Codicon.symbolConstant),
          s.set(14, N.Codicon.symbolString),
          s.set(15, N.Codicon.symbolNumber),
          s.set(16, N.Codicon.symbolBoolean),
          s.set(17, N.Codicon.symbolArray),
          s.set(18, N.Codicon.symbolObject),
          s.set(19, N.Codicon.symbolKey),
          s.set(20, N.Codicon.symbolNull),
          s.set(21, N.Codicon.symbolEnumMember),
          s.set(22, N.Codicon.symbolStruct),
          s.set(23, N.Codicon.symbolEvent),
          s.set(24, N.Codicon.symbolOperator),
          s.set(25, N.Codicon.symbolTypeParameter)
        function a(f) {
          let d = s.get(f)
          return (
            d ||
              (console.info('No codicon found for SymbolKind ' + f),
              (d = N.Codicon.symbolProperty)),
            d
          )
        }
        b.toIcon = a
      })((p = r.SymbolKinds || (r.SymbolKinds = {})))
      class L {
        constructor(s) {
          this.value = s
        }
      }
      ;(r.FoldingRangeKind = L),
        (L.Comment = new L('comment')),
        (L.Imports = new L('imports')),
        (L.Region = new L('region'))
      var w
      ;(function (b) {
        function s(a) {
          return !a || typeof a != 'object'
            ? !1
            : typeof a.id == 'string' && typeof a.title == 'string'
        }
        b.is = s
      })((w = r.Command || (r.Command = {})))
      var S
      ;(function (b) {
        ;(b[(b.Type = 1)] = 'Type'), (b[(b.Parameter = 2)] = 'Parameter')
      })((S = r.InlayHintKind || (r.InlayHintKind = {}))),
        (r.TokenizationRegistry = new l.TokenizationRegistry())
    }),
    Y(
      X[45],
      J([0, 1, 42, 7, 24, 9, 3, 4, 28, 44, 38]),
      function (F, r, N, e, A, l, y, C, c, h, v) {
        'use strict'
        Object.defineProperty(r, '__esModule', { value: !0 }),
          (r.createMonacoBaseAPI = r.KeyMod = void 0)
        class t {
          static chord(p, L) {
            return (0, A.KeyChord)(p, L)
          }
        }
        ;(r.KeyMod = t),
          (t.CtrlCmd = 2048),
          (t.Shift = 1024),
          (t.Alt = 512),
          (t.WinCtrl = 256)
        function g() {
          return {
            editor: void 0,
            languages: void 0,
            CancellationTokenSource: N.CancellationTokenSource,
            Emitter: e.Emitter,
            KeyCode: v.KeyCode,
            KeyMod: t,
            Position: y.Position,
            Range: C.Range,
            Selection: c.Selection,
            SelectionDirection: v.SelectionDirection,
            MarkerSeverity: v.MarkerSeverity,
            MarkerTag: v.MarkerTag,
            Uri: l.URI,
            Token: h.Token,
          }
        }
        r.createMonacoBaseAPI = g
      }
    ),
    Y(
      X[48],
      J([0, 1, 13, 5, 9, 3, 4, 30, 35, 16, 31, 32, 45, 6, 17, 37]),
      function (F, r, N, e, A, l, y, C, c, h, v, t, g, m, p, L) {
        'use strict'
        Object.defineProperty(r, '__esModule', { value: !0 }),
          (r.create = r.EditorSimpleWorker = r.MirrorModel = void 0)
        class w extends c.MirrorTextModel {
          get uri() {
            return this._uri
          }
          get eol() {
            return this._eol
          }
          getValue() {
            return this.getText()
          }
          getLinesContent() {
            return this._lines.slice(0)
          }
          getLineCount() {
            return this._lines.length
          }
          getLineContent(a) {
            return this._lines[a - 1]
          }
          getWordAtPosition(a, f) {
            const d = (0, h.getWordAtText)(
              a.column,
              (0, h.ensureValidWordDefinition)(f),
              this._lines[a.lineNumber - 1],
              0
            )
            return d
              ? new y.Range(
                  a.lineNumber,
                  d.startColumn,
                  a.lineNumber,
                  d.endColumn
                )
              : null
          }
          words(a) {
            const f = this._lines,
              d = this._wordenize.bind(this)
            let o = 0,
              i = '',
              u = 0,
              _ = []
            return {
              *[Symbol.iterator]() {
                for (;;)
                  if (u < _.length) {
                    const E = i.substring(_[u].start, _[u].end)
                    ;(u += 1), yield E
                  } else if (o < f.length)
                    (i = f[o]), (_ = d(i, a)), (u = 0), (o += 1)
                  else break
              },
            }
          }
          getLineWords(a, f) {
            const d = this._lines[a - 1],
              o = this._wordenize(d, f),
              i = []
            for (const u of o)
              i.push({
                word: d.substring(u.start, u.end),
                startColumn: u.start + 1,
                endColumn: u.end + 1,
              })
            return i
          }
          _wordenize(a, f) {
            const d = []
            let o
            for (f.lastIndex = 0; (o = f.exec(a)) && o[0].length !== 0; )
              d.push({ start: o.index, end: o.index + o[0].length })
            return d
          }
          getValueInRange(a) {
            if (
              ((a = this._validateRange(a)),
              a.startLineNumber === a.endLineNumber)
            )
              return this._lines[a.startLineNumber - 1].substring(
                a.startColumn - 1,
                a.endColumn - 1
              )
            const f = this._eol,
              d = a.startLineNumber - 1,
              o = a.endLineNumber - 1,
              i = []
            i.push(this._lines[d].substring(a.startColumn - 1))
            for (let u = d + 1; u < o; u++) i.push(this._lines[u])
            return (
              i.push(this._lines[o].substring(0, a.endColumn - 1)), i.join(f)
            )
          }
          offsetAt(a) {
            return (
              (a = this._validatePosition(a)),
              this._ensureLineStarts(),
              this._lineStarts.getPrefixSum(a.lineNumber - 2) + (a.column - 1)
            )
          }
          positionAt(a) {
            ;(a = Math.floor(a)), (a = Math.max(0, a)), this._ensureLineStarts()
            const f = this._lineStarts.getIndexOf(a),
              d = this._lines[f.index].length
            return {
              lineNumber: 1 + f.index,
              column: 1 + Math.min(f.remainder, d),
            }
          }
          _validateRange(a) {
            const f = this._validatePosition({
                lineNumber: a.startLineNumber,
                column: a.startColumn,
              }),
              d = this._validatePosition({
                lineNumber: a.endLineNumber,
                column: a.endColumn,
              })
            return f.lineNumber !== a.startLineNumber ||
              f.column !== a.startColumn ||
              d.lineNumber !== a.endLineNumber ||
              d.column !== a.endColumn
              ? {
                  startLineNumber: f.lineNumber,
                  startColumn: f.column,
                  endLineNumber: d.lineNumber,
                  endColumn: d.column,
                }
              : a
          }
          _validatePosition(a) {
            if (!l.Position.isIPosition(a)) throw new Error('bad position')
            let { lineNumber: f, column: d } = a,
              o = !1
            if (f < 1) (f = 1), (d = 1), (o = !0)
            else if (f > this._lines.length)
              (f = this._lines.length),
                (d = this._lines[f - 1].length + 1),
                (o = !0)
            else {
              const i = this._lines[f - 1].length + 1
              d < 1 ? ((d = 1), (o = !0)) : d > i && ((d = i), (o = !0))
            }
            return o ? { lineNumber: f, column: d } : a
          }
        }
        r.MirrorModel = w
        class S {
          constructor(a, f) {
            ;(this._host = a),
              (this._models = Object.create(null)),
              (this._foreignModuleFactory = f),
              (this._foreignModule = null)
          }
          dispose() {
            this._models = Object.create(null)
          }
          _getModel(a) {
            return this._models[a]
          }
          _getModels() {
            const a = []
            return (
              Object.keys(this._models).forEach((f) => a.push(this._models[f])),
              a
            )
          }
          acceptNewModel(a) {
            this._models[a.url] = new w(
              A.URI.parse(a.url),
              a.lines,
              a.EOL,
              a.versionId
            )
          }
          acceptModelChanged(a, f) {
            if (!this._models[a]) return
            this._models[a].onEvents(f)
          }
          acceptRemovedModel(a) {
            !this._models[a] || delete this._models[a]
          }
          computeUnicodeHighlights(a, f, d) {
            return oe(this, void 0, void 0, function* () {
              const o = this._getModel(a)
              return o
                ? L.UnicodeTextModelHighlighter.computeUnicodeHighlights(
                    o,
                    f,
                    d
                  )
                : {
                    ranges: [],
                    hasMore: !1,
                    ambiguousCharacterCount: 0,
                    invisibleCharacterCount: 0,
                    nonBasicAsciiCharacterCount: 0,
                  }
            })
          }
          computeDiff(a, f, d, o) {
            return oe(this, void 0, void 0, function* () {
              const i = this._getModel(a),
                u = this._getModel(f)
              return !i || !u ? null : S.computeDiff(i, u, d, o)
            })
          }
          static computeDiff(a, f, d, o) {
            const i = a.getLinesContent(),
              u = f.getLinesContent(),
              E = new C.DiffComputer(i, u, {
                shouldComputeCharChanges: !0,
                shouldPostProcessCharChanges: !0,
                shouldIgnoreTrimWhitespace: d,
                shouldMakePrettyDiff: !0,
                maxComputationTime: o,
              }).computeDiff(),
              M = E.changes.length > 0 ? !1 : this._modelsAreIdentical(a, f)
            return { quitEarly: E.quitEarly, identical: M, changes: E.changes }
          }
          static _modelsAreIdentical(a, f) {
            const d = a.getLineCount(),
              o = f.getLineCount()
            if (d !== o) return !1
            for (let i = 1; i <= d; i++) {
              const u = a.getLineContent(i),
                _ = f.getLineContent(i)
              if (u !== _) return !1
            }
            return !0
          }
          computeMoreMinimalEdits(a, f) {
            return oe(this, void 0, void 0, function* () {
              const d = this._getModel(a)
              if (!d) return f
              const o = []
              let i
              f = f.slice(0).sort((u, _) => {
                if (u.range && _.range)
                  return y.Range.compareRangesUsingStarts(u.range, _.range)
                const E = u.range ? 0 : 1,
                  M = _.range ? 0 : 1
                return E - M
              })
              for (let { range: u, text: _, eol: E } of f) {
                if ((typeof E == 'number' && (i = E), y.Range.isEmpty(u) && !_))
                  continue
                const M = d.getValueInRange(u)
                if (((_ = _.replace(/\r\n|\n|\r/g, d.eol)), M === _)) continue
                if (Math.max(_.length, M.length) > S._diffLimit) {
                  o.push({ range: u, text: _ })
                  continue
                }
                const D = (0, N.stringDiff)(M, _, !1),
                  I = d.offsetAt(y.Range.lift(u).getStartPosition())
                for (const O of D) {
                  const q = d.positionAt(I + O.originalStart),
                    z = d.positionAt(I + O.originalStart + O.originalLength),
                    P = {
                      text: _.substr(O.modifiedStart, O.modifiedLength),
                      range: {
                        startLineNumber: q.lineNumber,
                        startColumn: q.column,
                        endLineNumber: z.lineNumber,
                        endColumn: z.column,
                      },
                    }
                  d.getValueInRange(P.range) !== P.text && o.push(P)
                }
              }
              return (
                typeof i == 'number' &&
                  o.push({
                    eol: i,
                    text: '',
                    range: {
                      startLineNumber: 0,
                      startColumn: 0,
                      endLineNumber: 0,
                      endColumn: 0,
                    },
                  }),
                o
              )
            })
          }
          computeLinks(a) {
            return oe(this, void 0, void 0, function* () {
              const f = this._getModel(a)
              return f ? (0, v.computeLinks)(f) : null
            })
          }
          textualSuggest(a, f, d, o) {
            return oe(this, void 0, void 0, function* () {
              const i = new p.StopWatch(!0),
                u = new RegExp(d, o),
                _ = new Set()
              e: for (const E of a) {
                const M = this._getModel(E)
                if (!!M) {
                  for (const D of M.words(u))
                    if (
                      !(D === f || !isNaN(Number(D))) &&
                      (_.add(D), _.size > S._suggestionsLimit)
                    )
                      break e
                }
              }
              return { words: Array.from(_), duration: i.elapsed() }
            })
          }
          computeWordRanges(a, f, d, o) {
            return oe(this, void 0, void 0, function* () {
              const i = this._getModel(a)
              if (!i) return Object.create(null)
              const u = new RegExp(d, o),
                _ = Object.create(null)
              for (let E = f.startLineNumber; E < f.endLineNumber; E++) {
                const M = i.getLineWords(E, u)
                for (const D of M) {
                  if (!isNaN(Number(D.word))) continue
                  let I = _[D.word]
                  I || ((I = []), (_[D.word] = I)),
                    I.push({
                      startLineNumber: E,
                      startColumn: D.startColumn,
                      endLineNumber: E,
                      endColumn: D.endColumn,
                    })
                }
              }
              return _
            })
          }
          navigateValueSet(a, f, d, o, i) {
            return oe(this, void 0, void 0, function* () {
              const u = this._getModel(a)
              if (!u) return null
              const _ = new RegExp(o, i)
              f.startColumn === f.endColumn &&
                (f = {
                  startLineNumber: f.startLineNumber,
                  startColumn: f.startColumn,
                  endLineNumber: f.endLineNumber,
                  endColumn: f.endColumn + 1,
                })
              const E = u.getValueInRange(f),
                M = u.getWordAtPosition(
                  { lineNumber: f.startLineNumber, column: f.startColumn },
                  _
                )
              if (!M) return null
              const D = u.getValueInRange(M)
              return t.BasicInplaceReplace.INSTANCE.navigateValueSet(
                f,
                E,
                M,
                D,
                d
              )
            })
          }
          loadForeignModule(a, f, d) {
            const o = (_, E) => this._host.fhr(_, E),
              u = {
                host: m.createProxyObject(d, o),
                getMirrorModels: () => this._getModels(),
              }
            return this._foreignModuleFactory
              ? ((this._foreignModule = this._foreignModuleFactory(u, f)),
                Promise.resolve(m.getAllMethodNames(this._foreignModule)))
              : new Promise((_, E) => {
                  F(
                    [a],
                    (M) => {
                      ;(this._foreignModule = M.create(u, f)),
                        _(m.getAllMethodNames(this._foreignModule))
                    },
                    E
                  )
                })
          }
          fmr(a, f) {
            if (
              !this._foreignModule ||
              typeof this._foreignModule[a] != 'function'
            )
              return Promise.reject(
                new Error('Missing requestHandler or method: ' + a)
              )
            try {
              return Promise.resolve(
                this._foreignModule[a].apply(this._foreignModule, f)
              )
            } catch (d) {
              return Promise.reject(d)
            }
          }
        }
        ;(r.EditorSimpleWorker = S),
          (S._diffLimit = 1e5),
          (S._suggestionsLimit = 1e4)
        function b(s) {
          return new S(s, null)
        }
        ;(r.create = b),
          typeof importScripts == 'function' &&
            (e.globals.monaco = (0, g.createMonacoBaseAPI)())
      }
    )
}.call(this))

//# sourceMappingURL=../../../../min-maps/vs/base/worker/workerMain.js.map
