'use strict'
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define('vs/language/html/htmlMode', ['require', 'require'], (require) => {
  var moduleExports = (() => {
    var nn = Object.create
    var Q = Object.defineProperty
    var tn = Object.getOwnPropertyDescriptor
    var rn = Object.getOwnPropertyNames
    var on = Object.getPrototypeOf,
      sn = Object.prototype.hasOwnProperty
    var an = ((n) =>
      typeof require != 'undefined'
        ? require
        : typeof Proxy != 'undefined'
        ? new Proxy(n, {
            get: (t, i) => (typeof require != 'undefined' ? require : t)[i],
          })
        : n)(function (n) {
      if (typeof require != 'undefined') return require.apply(this, arguments)
      throw new Error('Dynamic require of "' + n + '" is not supported')
    })
    var un = (n, t) => () => (
        t || n((t = { exports: {} }).exports, t), t.exports
      ),
      dn = (n, t) => {
        for (var i in t) Q(n, i, { get: t[i], enumerable: !0 })
      },
      q = (n, t, i, r) => {
        if ((t && typeof t == 'object') || typeof t == 'function')
          for (let e of rn(t))
            !sn.call(n, e) &&
              e !== i &&
              Q(n, e, {
                get: () => t[e],
                enumerable: !(r = tn(t, e)) || r.enumerable,
              })
        return n
      },
      he = (n, t, i) => (q(n, t, 'default'), i && q(i, t, 'default')),
      me = (n, t, i) => (
        (i = n != null ? nn(on(n)) : {}),
        q(
          t || !n || !n.__esModule
            ? Q(i, 'default', { value: n, enumerable: !0 })
            : i,
          n
        )
      ),
      cn = (n) => q(Q({}, '__esModule', { value: !0 }), n)
    var Te = un((Ln, ve) => {
      var ln = me(an('vs/editor/editor.api'))
      ve.exports = ln
    })
    var Rn = {}
    dn(Rn, {
      CompletionAdapter: () => B,
      DefinitionAdapter: () => ce,
      DiagnosticsAdapter: () => de,
      DocumentColorAdapter: () => ge,
      DocumentFormattingEditProvider: () => H,
      DocumentHighlightAdapter: () => S,
      DocumentLinkAdapter: () => A,
      DocumentRangeFormattingEditProvider: () => K,
      DocumentSymbolAdapter: () => M,
      FoldingRangeAdapter: () => U,
      HoverAdapter: () => D,
      ReferenceAdapter: () => le,
      RenameAdapter: () => F,
      SelectionRangeAdapter: () => j,
      WorkerManager: () => b,
      fromPosition: () => C,
      fromRange: () => fe,
      setupMode: () => Pn,
      setupMode1: () => En,
      toRange: () => y,
      toTextEdit: () => L,
    })
    var d = {}
    he(d, me(Te()))
    var gn = 2 * 60 * 1e3,
      b = class {
        _defaults
        _idleCheckInterval
        _lastUsedTime
        _configChangeListener
        _worker
        _client
        constructor(t) {
          ;(this._defaults = t),
            (this._worker = null),
            (this._client = null),
            (this._idleCheckInterval = window.setInterval(
              () => this._checkIfIdle(),
              30 * 1e3
            )),
            (this._lastUsedTime = 0),
            (this._configChangeListener = this._defaults.onDidChange(() =>
              this._stopWorker()
            ))
        }
        _stopWorker() {
          this._worker && (this._worker.dispose(), (this._worker = null)),
            (this._client = null)
        }
        dispose() {
          clearInterval(this._idleCheckInterval),
            this._configChangeListener.dispose(),
            this._stopWorker()
        }
        _checkIfIdle() {
          if (!this._worker) return
          Date.now() - this._lastUsedTime > gn && this._stopWorker()
        }
        _getClient() {
          return (
            (this._lastUsedTime = Date.now()),
            this._client ||
              ((this._worker = d.editor.createWebWorker({
                moduleId: 'vs/language/html/htmlWorker',
                createData: {
                  languageSettings: this._defaults.options,
                  languageId: this._defaults.languageId,
                },
                label: this._defaults.languageId,
              })),
              (this._client = this._worker.getProxy())),
            this._client
          )
        }
        getLanguageServiceWorker(...t) {
          let i
          return this._getClient()
            .then((r) => {
              i = r
            })
            .then((r) => {
              if (this._worker) return this._worker.withSyncedResources(t)
            })
            .then((r) => i)
        }
      }
    var ye
    ;(function (n) {
      ;(n.MIN_VALUE = -2147483648), (n.MAX_VALUE = 2147483647)
    })(ye || (ye = {}))
    var J
    ;(function (n) {
      ;(n.MIN_VALUE = 0), (n.MAX_VALUE = 2147483647)
    })(J || (J = {}))
    var x
    ;(function (n) {
      function t(r, e) {
        return (
          r === Number.MAX_VALUE && (r = J.MAX_VALUE),
          e === Number.MAX_VALUE && (e = J.MAX_VALUE),
          { line: r, character: e }
        )
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.objectLiteral(e) && a.uinteger(e.line) && a.uinteger(e.character)
        )
      }
      n.is = i
    })(x || (x = {}))
    var v
    ;(function (n) {
      function t(r, e, o, s) {
        if (a.uinteger(r) && a.uinteger(e) && a.uinteger(o) && a.uinteger(s))
          return { start: x.create(r, e), end: x.create(o, s) }
        if (x.is(r) && x.is(e)) return { start: r, end: e }
        throw new Error(
          'Range#create called with invalid arguments[' +
            r +
            ', ' +
            e +
            ', ' +
            o +
            ', ' +
            s +
            ']'
        )
      }
      n.create = t
      function i(r) {
        var e = r
        return a.objectLiteral(e) && x.is(e.start) && x.is(e.end)
      }
      n.is = i
    })(v || (v = {}))
    var ie
    ;(function (n) {
      function t(r, e) {
        return { uri: r, range: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.defined(e) &&
          v.is(e.range) &&
          (a.string(e.uri) || a.undefined(e.uri))
        )
      }
      n.is = i
    })(ie || (ie = {}))
    var xe
    ;(function (n) {
      function t(r, e, o, s) {
        return {
          targetUri: r,
          targetRange: e,
          targetSelectionRange: o,
          originSelectionRange: s,
        }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.defined(e) &&
          v.is(e.targetRange) &&
          a.string(e.targetUri) &&
          (v.is(e.targetSelectionRange) ||
            a.undefined(e.targetSelectionRange)) &&
          (v.is(e.originSelectionRange) || a.undefined(e.originSelectionRange))
        )
      }
      n.is = i
    })(xe || (xe = {}))
    var oe
    ;(function (n) {
      function t(r, e, o, s) {
        return { red: r, green: e, blue: o, alpha: s }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.numberRange(e.red, 0, 1) &&
          a.numberRange(e.green, 0, 1) &&
          a.numberRange(e.blue, 0, 1) &&
          a.numberRange(e.alpha, 0, 1)
        )
      }
      n.is = i
    })(oe || (oe = {}))
    var ke
    ;(function (n) {
      function t(r, e) {
        return { range: r, color: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return v.is(e.range) && oe.is(e.color)
      }
      n.is = i
    })(ke || (ke = {}))
    var Ie
    ;(function (n) {
      function t(r, e, o) {
        return { label: r, textEdit: e, additionalTextEdits: o }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.string(e.label) &&
          (a.undefined(e.textEdit) || _.is(e)) &&
          (a.undefined(e.additionalTextEdits) ||
            a.typedArray(e.additionalTextEdits, _.is))
        )
      }
      n.is = i
    })(Ie || (Ie = {}))
    var R
    ;(function (n) {
      ;(n.Comment = 'comment'), (n.Imports = 'imports'), (n.Region = 'region')
    })(R || (R = {}))
    var _e
    ;(function (n) {
      function t(r, e, o, s, u) {
        var l = { startLine: r, endLine: e }
        return (
          a.defined(o) && (l.startCharacter = o),
          a.defined(s) && (l.endCharacter = s),
          a.defined(u) && (l.kind = u),
          l
        )
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.uinteger(e.startLine) &&
          a.uinteger(e.startLine) &&
          (a.undefined(e.startCharacter) || a.uinteger(e.startCharacter)) &&
          (a.undefined(e.endCharacter) || a.uinteger(e.endCharacter)) &&
          (a.undefined(e.kind) || a.string(e.kind))
        )
      }
      n.is = i
    })(_e || (_e = {}))
    var se
    ;(function (n) {
      function t(r, e) {
        return { location: r, message: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return a.defined(e) && ie.is(e.location) && a.string(e.message)
      }
      n.is = i
    })(se || (se = {}))
    var w
    ;(function (n) {
      ;(n.Error = 1), (n.Warning = 2), (n.Information = 3), (n.Hint = 4)
    })(w || (w = {}))
    var Ce
    ;(function (n) {
      ;(n.Unnecessary = 1), (n.Deprecated = 2)
    })(Ce || (Ce = {}))
    var be
    ;(function (n) {
      function t(i) {
        var r = i
        return r != null && a.string(r.href)
      }
      n.is = t
    })(be || (be = {}))
    var Y
    ;(function (n) {
      function t(r, e, o, s, u, l) {
        var f = { range: r, message: e }
        return (
          a.defined(o) && (f.severity = o),
          a.defined(s) && (f.code = s),
          a.defined(u) && (f.source = u),
          a.defined(l) && (f.relatedInformation = l),
          f
        )
      }
      n.create = t
      function i(r) {
        var e,
          o = r
        return (
          a.defined(o) &&
          v.is(o.range) &&
          a.string(o.message) &&
          (a.number(o.severity) || a.undefined(o.severity)) &&
          (a.integer(o.code) || a.string(o.code) || a.undefined(o.code)) &&
          (a.undefined(o.codeDescription) ||
            a.string(
              (e = o.codeDescription) === null || e === void 0 ? void 0 : e.href
            )) &&
          (a.string(o.source) || a.undefined(o.source)) &&
          (a.undefined(o.relatedInformation) ||
            a.typedArray(o.relatedInformation, se.is))
        )
      }
      n.is = i
    })(Y || (Y = {}))
    var O
    ;(function (n) {
      function t(r, e) {
        for (var o = [], s = 2; s < arguments.length; s++)
          o[s - 2] = arguments[s]
        var u = { title: r, command: e }
        return a.defined(o) && o.length > 0 && (u.arguments = o), u
      }
      n.create = t
      function i(r) {
        var e = r
        return a.defined(e) && a.string(e.title) && a.string(e.command)
      }
      n.is = i
    })(O || (O = {}))
    var _
    ;(function (n) {
      function t(o, s) {
        return { range: o, newText: s }
      }
      n.replace = t
      function i(o, s) {
        return { range: { start: o, end: o }, newText: s }
      }
      n.insert = i
      function r(o) {
        return { range: o, newText: '' }
      }
      n.del = r
      function e(o) {
        var s = o
        return a.objectLiteral(s) && a.string(s.newText) && v.is(s.range)
      }
      n.is = e
    })(_ || (_ = {}))
    var P
    ;(function (n) {
      function t(r, e, o) {
        var s = { label: r }
        return (
          e !== void 0 && (s.needsConfirmation = e),
          o !== void 0 && (s.description = o),
          s
        )
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          e !== void 0 &&
          a.objectLiteral(e) &&
          a.string(e.label) &&
          (a.boolean(e.needsConfirmation) || e.needsConfirmation === void 0) &&
          (a.string(e.description) || e.description === void 0)
        )
      }
      n.is = i
    })(P || (P = {}))
    var T
    ;(function (n) {
      function t(i) {
        var r = i
        return typeof r == 'string'
      }
      n.is = t
    })(T || (T = {}))
    var I
    ;(function (n) {
      function t(o, s, u) {
        return { range: o, newText: s, annotationId: u }
      }
      n.replace = t
      function i(o, s, u) {
        return { range: { start: o, end: o }, newText: s, annotationId: u }
      }
      n.insert = i
      function r(o, s) {
        return { range: o, newText: '', annotationId: s }
      }
      n.del = r
      function e(o) {
        var s = o
        return _.is(s) && (P.is(s.annotationId) || T.is(s.annotationId))
      }
      n.is = e
    })(I || (I = {}))
    var Z
    ;(function (n) {
      function t(r, e) {
        return { textDocument: r, edits: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return a.defined(e) && ee.is(e.textDocument) && Array.isArray(e.edits)
      }
      n.is = i
    })(Z || (Z = {}))
    var N
    ;(function (n) {
      function t(r, e, o) {
        var s = { kind: 'create', uri: r }
        return (
          e !== void 0 &&
            (e.overwrite !== void 0 || e.ignoreIfExists !== void 0) &&
            (s.options = e),
          o !== void 0 && (s.annotationId = o),
          s
        )
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          e &&
          e.kind === 'create' &&
          a.string(e.uri) &&
          (e.options === void 0 ||
            ((e.options.overwrite === void 0 ||
              a.boolean(e.options.overwrite)) &&
              (e.options.ignoreIfExists === void 0 ||
                a.boolean(e.options.ignoreIfExists)))) &&
          (e.annotationId === void 0 || T.is(e.annotationId))
        )
      }
      n.is = i
    })(N || (N = {}))
    var V
    ;(function (n) {
      function t(r, e, o, s) {
        var u = { kind: 'rename', oldUri: r, newUri: e }
        return (
          o !== void 0 &&
            (o.overwrite !== void 0 || o.ignoreIfExists !== void 0) &&
            (u.options = o),
          s !== void 0 && (u.annotationId = s),
          u
        )
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          e &&
          e.kind === 'rename' &&
          a.string(e.oldUri) &&
          a.string(e.newUri) &&
          (e.options === void 0 ||
            ((e.options.overwrite === void 0 ||
              a.boolean(e.options.overwrite)) &&
              (e.options.ignoreIfExists === void 0 ||
                a.boolean(e.options.ignoreIfExists)))) &&
          (e.annotationId === void 0 || T.is(e.annotationId))
        )
      }
      n.is = i
    })(V || (V = {}))
    var z
    ;(function (n) {
      function t(r, e, o) {
        var s = { kind: 'delete', uri: r }
        return (
          e !== void 0 &&
            (e.recursive !== void 0 || e.ignoreIfNotExists !== void 0) &&
            (s.options = e),
          o !== void 0 && (s.annotationId = o),
          s
        )
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          e &&
          e.kind === 'delete' &&
          a.string(e.uri) &&
          (e.options === void 0 ||
            ((e.options.recursive === void 0 ||
              a.boolean(e.options.recursive)) &&
              (e.options.ignoreIfNotExists === void 0 ||
                a.boolean(e.options.ignoreIfNotExists)))) &&
          (e.annotationId === void 0 || T.is(e.annotationId))
        )
      }
      n.is = i
    })(z || (z = {}))
    var ae
    ;(function (n) {
      function t(i) {
        var r = i
        return (
          r &&
          (r.changes !== void 0 || r.documentChanges !== void 0) &&
          (r.documentChanges === void 0 ||
            r.documentChanges.every(function (e) {
              return a.string(e.kind) ? N.is(e) || V.is(e) || z.is(e) : Z.is(e)
            }))
        )
      }
      n.is = t
    })(ae || (ae = {}))
    var G = (function () {
        function n(t, i) {
          ;(this.edits = t), (this.changeAnnotations = i)
        }
        return (
          (n.prototype.insert = function (t, i, r) {
            var e, o
            if (
              (r === void 0
                ? (e = _.insert(t, i))
                : T.is(r)
                ? ((o = r), (e = I.insert(t, i, r)))
                : (this.assertChangeAnnotations(this.changeAnnotations),
                  (o = this.changeAnnotations.manage(r)),
                  (e = I.insert(t, i, o))),
              this.edits.push(e),
              o !== void 0)
            )
              return o
          }),
          (n.prototype.replace = function (t, i, r) {
            var e, o
            if (
              (r === void 0
                ? (e = _.replace(t, i))
                : T.is(r)
                ? ((o = r), (e = I.replace(t, i, r)))
                : (this.assertChangeAnnotations(this.changeAnnotations),
                  (o = this.changeAnnotations.manage(r)),
                  (e = I.replace(t, i, o))),
              this.edits.push(e),
              o !== void 0)
            )
              return o
          }),
          (n.prototype.delete = function (t, i) {
            var r, e
            if (
              (i === void 0
                ? (r = _.del(t))
                : T.is(i)
                ? ((e = i), (r = I.del(t, i)))
                : (this.assertChangeAnnotations(this.changeAnnotations),
                  (e = this.changeAnnotations.manage(i)),
                  (r = I.del(t, e))),
              this.edits.push(r),
              e !== void 0)
            )
              return e
          }),
          (n.prototype.add = function (t) {
            this.edits.push(t)
          }),
          (n.prototype.all = function () {
            return this.edits
          }),
          (n.prototype.clear = function () {
            this.edits.splice(0, this.edits.length)
          }),
          (n.prototype.assertChangeAnnotations = function (t) {
            if (t === void 0)
              throw new Error(
                'Text edit change is not configured to manage change annotations.'
              )
          }),
          n
        )
      })(),
      we = (function () {
        function n(t) {
          ;(this._annotations = t === void 0 ? Object.create(null) : t),
            (this._counter = 0),
            (this._size = 0)
        }
        return (
          (n.prototype.all = function () {
            return this._annotations
          }),
          Object.defineProperty(n.prototype, 'size', {
            get: function () {
              return this._size
            },
            enumerable: !1,
            configurable: !0,
          }),
          (n.prototype.manage = function (t, i) {
            var r
            if (
              (T.is(t) ? (r = t) : ((r = this.nextId()), (i = t)),
              this._annotations[r] !== void 0)
            )
              throw new Error('Id ' + r + ' is already in use.')
            if (i === void 0)
              throw new Error('No annotation provided for id ' + r)
            return (this._annotations[r] = i), this._size++, r
          }),
          (n.prototype.nextId = function () {
            return this._counter++, this._counter.toString()
          }),
          n
        )
      })(),
      Hn = (function () {
        function n(t) {
          var i = this
          ;(this._textEditChanges = Object.create(null)),
            t !== void 0
              ? ((this._workspaceEdit = t),
                t.documentChanges
                  ? ((this._changeAnnotations = new we(t.changeAnnotations)),
                    (t.changeAnnotations = this._changeAnnotations.all()),
                    t.documentChanges.forEach(function (r) {
                      if (Z.is(r)) {
                        var e = new G(r.edits, i._changeAnnotations)
                        i._textEditChanges[r.textDocument.uri] = e
                      }
                    }))
                  : t.changes &&
                    Object.keys(t.changes).forEach(function (r) {
                      var e = new G(t.changes[r])
                      i._textEditChanges[r] = e
                    }))
              : (this._workspaceEdit = {})
        }
        return (
          Object.defineProperty(n.prototype, 'edit', {
            get: function () {
              return (
                this.initDocumentChanges(),
                this._changeAnnotations !== void 0 &&
                  (this._changeAnnotations.size === 0
                    ? (this._workspaceEdit.changeAnnotations = void 0)
                    : (this._workspaceEdit.changeAnnotations =
                        this._changeAnnotations.all())),
                this._workspaceEdit
              )
            },
            enumerable: !1,
            configurable: !0,
          }),
          (n.prototype.getTextEditChange = function (t) {
            if (ee.is(t)) {
              if (
                (this.initDocumentChanges(),
                this._workspaceEdit.documentChanges === void 0)
              )
                throw new Error(
                  'Workspace edit is not configured for document changes.'
                )
              var i = { uri: t.uri, version: t.version },
                r = this._textEditChanges[i.uri]
              if (!r) {
                var e = [],
                  o = { textDocument: i, edits: e }
                this._workspaceEdit.documentChanges.push(o),
                  (r = new G(e, this._changeAnnotations)),
                  (this._textEditChanges[i.uri] = r)
              }
              return r
            } else {
              if ((this.initChanges(), this._workspaceEdit.changes === void 0))
                throw new Error(
                  'Workspace edit is not configured for normal text edit changes.'
                )
              var r = this._textEditChanges[t]
              if (!r) {
                var e = []
                ;(this._workspaceEdit.changes[t] = e),
                  (r = new G(e)),
                  (this._textEditChanges[t] = r)
              }
              return r
            }
          }),
          (n.prototype.initDocumentChanges = function () {
            this._workspaceEdit.documentChanges === void 0 &&
              this._workspaceEdit.changes === void 0 &&
              ((this._changeAnnotations = new we()),
              (this._workspaceEdit.documentChanges = []),
              (this._workspaceEdit.changeAnnotations =
                this._changeAnnotations.all()))
          }),
          (n.prototype.initChanges = function () {
            this._workspaceEdit.documentChanges === void 0 &&
              this._workspaceEdit.changes === void 0 &&
              (this._workspaceEdit.changes = Object.create(null))
          }),
          (n.prototype.createFile = function (t, i, r) {
            if (
              (this.initDocumentChanges(),
              this._workspaceEdit.documentChanges === void 0)
            )
              throw new Error(
                'Workspace edit is not configured for document changes.'
              )
            var e
            P.is(i) || T.is(i) ? (e = i) : (r = i)
            var o, s
            if (
              (e === void 0
                ? (o = N.create(t, r))
                : ((s = T.is(e) ? e : this._changeAnnotations.manage(e)),
                  (o = N.create(t, r, s))),
              this._workspaceEdit.documentChanges.push(o),
              s !== void 0)
            )
              return s
          }),
          (n.prototype.renameFile = function (t, i, r, e) {
            if (
              (this.initDocumentChanges(),
              this._workspaceEdit.documentChanges === void 0)
            )
              throw new Error(
                'Workspace edit is not configured for document changes.'
              )
            var o
            P.is(r) || T.is(r) ? (o = r) : (e = r)
            var s, u
            if (
              (o === void 0
                ? (s = V.create(t, i, e))
                : ((u = T.is(o) ? o : this._changeAnnotations.manage(o)),
                  (s = V.create(t, i, e, u))),
              this._workspaceEdit.documentChanges.push(s),
              u !== void 0)
            )
              return u
          }),
          (n.prototype.deleteFile = function (t, i, r) {
            if (
              (this.initDocumentChanges(),
              this._workspaceEdit.documentChanges === void 0)
            )
              throw new Error(
                'Workspace edit is not configured for document changes.'
              )
            var e
            P.is(i) || T.is(i) ? (e = i) : (r = i)
            var o, s
            if (
              (e === void 0
                ? (o = z.create(t, r))
                : ((s = T.is(e) ? e : this._changeAnnotations.manage(e)),
                  (o = z.create(t, r, s))),
              this._workspaceEdit.documentChanges.push(o),
              s !== void 0)
            )
              return s
          }),
          n
        )
      })()
    var Ee
    ;(function (n) {
      function t(r) {
        return { uri: r }
      }
      n.create = t
      function i(r) {
        var e = r
        return a.defined(e) && a.string(e.uri)
      }
      n.is = i
    })(Ee || (Ee = {}))
    var Pe
    ;(function (n) {
      function t(r, e) {
        return { uri: r, version: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return a.defined(e) && a.string(e.uri) && a.integer(e.version)
      }
      n.is = i
    })(Pe || (Pe = {}))
    var ee
    ;(function (n) {
      function t(r, e) {
        return { uri: r, version: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.defined(e) &&
          a.string(e.uri) &&
          (e.version === null || a.integer(e.version))
        )
      }
      n.is = i
    })(ee || (ee = {}))
    var Re
    ;(function (n) {
      function t(r, e, o, s) {
        return { uri: r, languageId: e, version: o, text: s }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.defined(e) &&
          a.string(e.uri) &&
          a.string(e.languageId) &&
          a.integer(e.version) &&
          a.string(e.text)
        )
      }
      n.is = i
    })(Re || (Re = {}))
    var X
    ;(function (n) {
      ;(n.PlainText = 'plaintext'), (n.Markdown = 'markdown')
    })(X || (X = {}))
    ;(function (n) {
      function t(i) {
        var r = i
        return r === n.PlainText || r === n.Markdown
      }
      n.is = t
    })(X || (X = {}))
    var ue
    ;(function (n) {
      function t(i) {
        var r = i
        return a.objectLiteral(i) && X.is(r.kind) && a.string(r.value)
      }
      n.is = t
    })(ue || (ue = {}))
    var p
    ;(function (n) {
      ;(n.Text = 1),
        (n.Method = 2),
        (n.Function = 3),
        (n.Constructor = 4),
        (n.Field = 5),
        (n.Variable = 6),
        (n.Class = 7),
        (n.Interface = 8),
        (n.Module = 9),
        (n.Property = 10),
        (n.Unit = 11),
        (n.Value = 12),
        (n.Enum = 13),
        (n.Keyword = 14),
        (n.Snippet = 15),
        (n.Color = 16),
        (n.File = 17),
        (n.Reference = 18),
        (n.Folder = 19),
        (n.EnumMember = 20),
        (n.Constant = 21),
        (n.Struct = 22),
        (n.Event = 23),
        (n.Operator = 24),
        (n.TypeParameter = 25)
    })(p || (p = {}))
    var ne
    ;(function (n) {
      ;(n.PlainText = 1), (n.Snippet = 2)
    })(ne || (ne = {}))
    var We
    ;(function (n) {
      n.Deprecated = 1
    })(We || (We = {}))
    var Le
    ;(function (n) {
      function t(r, e, o) {
        return { newText: r, insert: e, replace: o }
      }
      n.create = t
      function i(r) {
        var e = r
        return e && a.string(e.newText) && v.is(e.insert) && v.is(e.replace)
      }
      n.is = i
    })(Le || (Le = {}))
    var De
    ;(function (n) {
      ;(n.asIs = 1), (n.adjustIndentation = 2)
    })(De || (De = {}))
    var Se
    ;(function (n) {
      function t(i) {
        return { label: i }
      }
      n.create = t
    })(Se || (Se = {}))
    var Fe
    ;(function (n) {
      function t(i, r) {
        return { items: i || [], isIncomplete: !!r }
      }
      n.create = t
    })(Fe || (Fe = {}))
    var te
    ;(function (n) {
      function t(r) {
        return r.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&')
      }
      n.fromPlainText = t
      function i(r) {
        var e = r
        return (
          a.string(e) ||
          (a.objectLiteral(e) && a.string(e.language) && a.string(e.value))
        )
      }
      n.is = i
    })(te || (te = {}))
    var Me
    ;(function (n) {
      function t(i) {
        var r = i
        return (
          !!r &&
          a.objectLiteral(r) &&
          (ue.is(r.contents) ||
            te.is(r.contents) ||
            a.typedArray(r.contents, te.is)) &&
          (i.range === void 0 || v.is(i.range))
        )
      }
      n.is = t
    })(Me || (Me = {}))
    var Ae
    ;(function (n) {
      function t(i, r) {
        return r ? { label: i, documentation: r } : { label: i }
      }
      n.create = t
    })(Ae || (Ae = {}))
    var He
    ;(function (n) {
      function t(i, r) {
        for (var e = [], o = 2; o < arguments.length; o++)
          e[o - 2] = arguments[o]
        var s = { label: i }
        return (
          a.defined(r) && (s.documentation = r),
          a.defined(e) ? (s.parameters = e) : (s.parameters = []),
          s
        )
      }
      n.create = t
    })(He || (He = {}))
    var W
    ;(function (n) {
      ;(n.Text = 1), (n.Read = 2), (n.Write = 3)
    })(W || (W = {}))
    var Ke
    ;(function (n) {
      function t(i, r) {
        var e = { range: i }
        return a.number(r) && (e.kind = r), e
      }
      n.create = t
    })(Ke || (Ke = {}))
    var h
    ;(function (n) {
      ;(n.File = 1),
        (n.Module = 2),
        (n.Namespace = 3),
        (n.Package = 4),
        (n.Class = 5),
        (n.Method = 6),
        (n.Property = 7),
        (n.Field = 8),
        (n.Constructor = 9),
        (n.Enum = 10),
        (n.Interface = 11),
        (n.Function = 12),
        (n.Variable = 13),
        (n.Constant = 14),
        (n.String = 15),
        (n.Number = 16),
        (n.Boolean = 17),
        (n.Array = 18),
        (n.Object = 19),
        (n.Key = 20),
        (n.Null = 21),
        (n.EnumMember = 22),
        (n.Struct = 23),
        (n.Event = 24),
        (n.Operator = 25),
        (n.TypeParameter = 26)
    })(h || (h = {}))
    var Ue
    ;(function (n) {
      n.Deprecated = 1
    })(Ue || (Ue = {}))
    var je
    ;(function (n) {
      function t(i, r, e, o, s) {
        var u = { name: i, kind: r, location: { uri: o, range: e } }
        return s && (u.containerName = s), u
      }
      n.create = t
    })(je || (je = {}))
    var Oe
    ;(function (n) {
      function t(r, e, o, s, u, l) {
        var f = { name: r, detail: e, kind: o, range: s, selectionRange: u }
        return l !== void 0 && (f.children = l), f
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          e &&
          a.string(e.name) &&
          a.number(e.kind) &&
          v.is(e.range) &&
          v.is(e.selectionRange) &&
          (e.detail === void 0 || a.string(e.detail)) &&
          (e.deprecated === void 0 || a.boolean(e.deprecated)) &&
          (e.children === void 0 || Array.isArray(e.children)) &&
          (e.tags === void 0 || Array.isArray(e.tags))
        )
      }
      n.is = i
    })(Oe || (Oe = {}))
    var Ne
    ;(function (n) {
      ;(n.Empty = ''),
        (n.QuickFix = 'quickfix'),
        (n.Refactor = 'refactor'),
        (n.RefactorExtract = 'refactor.extract'),
        (n.RefactorInline = 'refactor.inline'),
        (n.RefactorRewrite = 'refactor.rewrite'),
        (n.Source = 'source'),
        (n.SourceOrganizeImports = 'source.organizeImports'),
        (n.SourceFixAll = 'source.fixAll')
    })(Ne || (Ne = {}))
    var Ve
    ;(function (n) {
      function t(r, e) {
        var o = { diagnostics: r }
        return e != null && (o.only = e), o
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.defined(e) &&
          a.typedArray(e.diagnostics, Y.is) &&
          (e.only === void 0 || a.typedArray(e.only, a.string))
        )
      }
      n.is = i
    })(Ve || (Ve = {}))
    var ze
    ;(function (n) {
      function t(r, e, o) {
        var s = { title: r },
          u = !0
        return (
          typeof e == 'string'
            ? ((u = !1), (s.kind = e))
            : O.is(e)
            ? (s.command = e)
            : (s.edit = e),
          u && o !== void 0 && (s.kind = o),
          s
        )
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          e &&
          a.string(e.title) &&
          (e.diagnostics === void 0 || a.typedArray(e.diagnostics, Y.is)) &&
          (e.kind === void 0 || a.string(e.kind)) &&
          (e.edit !== void 0 || e.command !== void 0) &&
          (e.command === void 0 || O.is(e.command)) &&
          (e.isPreferred === void 0 || a.boolean(e.isPreferred)) &&
          (e.edit === void 0 || ae.is(e.edit))
        )
      }
      n.is = i
    })(ze || (ze = {}))
    var Xe
    ;(function (n) {
      function t(r, e) {
        var o = { range: r }
        return a.defined(e) && (o.data = e), o
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.defined(e) &&
          v.is(e.range) &&
          (a.undefined(e.command) || O.is(e.command))
        )
      }
      n.is = i
    })(Xe || (Xe = {}))
    var Be
    ;(function (n) {
      function t(r, e) {
        return { tabSize: r, insertSpaces: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.defined(e) && a.uinteger(e.tabSize) && a.boolean(e.insertSpaces)
        )
      }
      n.is = i
    })(Be || (Be = {}))
    var $e
    ;(function (n) {
      function t(r, e, o) {
        return { range: r, target: e, data: o }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.defined(e) &&
          v.is(e.range) &&
          (a.undefined(e.target) || a.string(e.target))
        )
      }
      n.is = i
    })($e || ($e = {}))
    var qe
    ;(function (n) {
      function t(r, e) {
        return { range: r, parent: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          e !== void 0 &&
          v.is(e.range) &&
          (e.parent === void 0 || n.is(e.parent))
        )
      }
      n.is = i
    })(qe || (qe = {}))
    var Qe
    ;(function (n) {
      function t(o, s, u, l) {
        return new fn(o, s, u, l)
      }
      n.create = t
      function i(o) {
        var s = o
        return !!(
          a.defined(s) &&
          a.string(s.uri) &&
          (a.undefined(s.languageId) || a.string(s.languageId)) &&
          a.uinteger(s.lineCount) &&
          a.func(s.getText) &&
          a.func(s.positionAt) &&
          a.func(s.offsetAt)
        )
      }
      n.is = i
      function r(o, s) {
        for (
          var u = o.getText(),
            l = e(s, function (E, $) {
              var pe = E.range.start.line - $.range.start.line
              return pe === 0
                ? E.range.start.character - $.range.start.character
                : pe
            }),
            f = u.length,
            g = l.length - 1;
          g >= 0;
          g--
        ) {
          var m = l[g],
            k = o.offsetAt(m.range.start),
            c = o.offsetAt(m.range.end)
          if (c <= f)
            u = u.substring(0, k) + m.newText + u.substring(c, u.length)
          else throw new Error('Overlapping edit')
          f = k
        }
        return u
      }
      n.applyEdits = r
      function e(o, s) {
        if (o.length <= 1) return o
        var u = (o.length / 2) | 0,
          l = o.slice(0, u),
          f = o.slice(u)
        e(l, s), e(f, s)
        for (var g = 0, m = 0, k = 0; g < l.length && m < f.length; ) {
          var c = s(l[g], f[m])
          c <= 0 ? (o[k++] = l[g++]) : (o[k++] = f[m++])
        }
        for (; g < l.length; ) o[k++] = l[g++]
        for (; m < f.length; ) o[k++] = f[m++]
        return o
      }
    })(Qe || (Qe = {}))
    var fn = (function () {
        function n(t, i, r, e) {
          ;(this._uri = t),
            (this._languageId = i),
            (this._version = r),
            (this._content = e),
            (this._lineOffsets = void 0)
        }
        return (
          Object.defineProperty(n.prototype, 'uri', {
            get: function () {
              return this._uri
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(n.prototype, 'languageId', {
            get: function () {
              return this._languageId
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(n.prototype, 'version', {
            get: function () {
              return this._version
            },
            enumerable: !1,
            configurable: !0,
          }),
          (n.prototype.getText = function (t) {
            if (t) {
              var i = this.offsetAt(t.start),
                r = this.offsetAt(t.end)
              return this._content.substring(i, r)
            }
            return this._content
          }),
          (n.prototype.update = function (t, i) {
            ;(this._content = t.text),
              (this._version = i),
              (this._lineOffsets = void 0)
          }),
          (n.prototype.getLineOffsets = function () {
            if (this._lineOffsets === void 0) {
              for (
                var t = [], i = this._content, r = !0, e = 0;
                e < i.length;
                e++
              ) {
                r && (t.push(e), (r = !1))
                var o = i.charAt(e)
                ;(r =
                  o === '\r' ||
                  o ===
                    `
`),
                  o === '\r' &&
                    e + 1 < i.length &&
                    i.charAt(e + 1) ===
                      `
` &&
                    e++
              }
              r && i.length > 0 && t.push(i.length), (this._lineOffsets = t)
            }
            return this._lineOffsets
          }),
          (n.prototype.positionAt = function (t) {
            t = Math.max(Math.min(t, this._content.length), 0)
            var i = this.getLineOffsets(),
              r = 0,
              e = i.length
            if (e === 0) return x.create(0, t)
            for (; r < e; ) {
              var o = Math.floor((r + e) / 2)
              i[o] > t ? (e = o) : (r = o + 1)
            }
            var s = r - 1
            return x.create(s, t - i[s])
          }),
          (n.prototype.offsetAt = function (t) {
            var i = this.getLineOffsets()
            if (t.line >= i.length) return this._content.length
            if (t.line < 0) return 0
            var r = i[t.line],
              e = t.line + 1 < i.length ? i[t.line + 1] : this._content.length
            return Math.max(Math.min(r + t.character, e), r)
          }),
          Object.defineProperty(n.prototype, 'lineCount', {
            get: function () {
              return this.getLineOffsets().length
            },
            enumerable: !1,
            configurable: !0,
          }),
          n
        )
      })(),
      a
    ;(function (n) {
      var t = Object.prototype.toString
      function i(c) {
        return typeof c < 'u'
      }
      n.defined = i
      function r(c) {
        return typeof c > 'u'
      }
      n.undefined = r
      function e(c) {
        return c === !0 || c === !1
      }
      n.boolean = e
      function o(c) {
        return t.call(c) === '[object String]'
      }
      n.string = o
      function s(c) {
        return t.call(c) === '[object Number]'
      }
      n.number = s
      function u(c, E, $) {
        return t.call(c) === '[object Number]' && E <= c && c <= $
      }
      n.numberRange = u
      function l(c) {
        return (
          t.call(c) === '[object Number]' && -2147483648 <= c && c <= 2147483647
        )
      }
      n.integer = l
      function f(c) {
        return t.call(c) === '[object Number]' && 0 <= c && c <= 2147483647
      }
      n.uinteger = f
      function g(c) {
        return t.call(c) === '[object Function]'
      }
      n.func = g
      function m(c) {
        return c !== null && typeof c == 'object'
      }
      n.objectLiteral = m
      function k(c, E) {
        return Array.isArray(c) && c.every(E)
      }
      n.typedArray = k
    })(a || (a = {}))
    var de = class {
      constructor(t, i, r) {
        this._languageId = t
        this._worker = i
        let e = (s) => {
            let u = s.getLanguageId()
            if (u !== this._languageId) return
            let l
            ;(this._listener[s.uri.toString()] = s.onDidChangeContent(() => {
              window.clearTimeout(l),
                (l = window.setTimeout(() => this._doValidate(s.uri, u), 500))
            })),
              this._doValidate(s.uri, u)
          },
          o = (s) => {
            d.editor.setModelMarkers(s, this._languageId, [])
            let u = s.uri.toString(),
              l = this._listener[u]
            l && (l.dispose(), delete this._listener[u])
          }
        this._disposables.push(d.editor.onDidCreateModel(e)),
          this._disposables.push(d.editor.onWillDisposeModel(o)),
          this._disposables.push(
            d.editor.onDidChangeModelLanguage((s) => {
              o(s.model), e(s.model)
            })
          ),
          this._disposables.push(
            r((s) => {
              d.editor.getModels().forEach((u) => {
                u.getLanguageId() === this._languageId && (o(u), e(u))
              })
            })
          ),
          this._disposables.push({
            dispose: () => {
              d.editor.getModels().forEach(o)
              for (let s in this._listener) this._listener[s].dispose()
            },
          }),
          d.editor.getModels().forEach(e)
      }
      _disposables = []
      _listener = Object.create(null)
      dispose() {
        this._disposables.forEach((t) => t && t.dispose()),
          (this._disposables.length = 0)
      }
      _doValidate(t, i) {
        this._worker(t)
          .then((r) => r.doValidation(t.toString()))
          .then((r) => {
            let e = r.map((s) => mn(t, s)),
              o = d.editor.getModel(t)
            o && o.getLanguageId() === i && d.editor.setModelMarkers(o, i, e)
          })
          .then(void 0, (r) => {
            console.error(r)
          })
      }
    }
    function hn(n) {
      switch (n) {
        case w.Error:
          return d.MarkerSeverity.Error
        case w.Warning:
          return d.MarkerSeverity.Warning
        case w.Information:
          return d.MarkerSeverity.Info
        case w.Hint:
          return d.MarkerSeverity.Hint
        default:
          return d.MarkerSeverity.Info
      }
    }
    function mn(n, t) {
      let i = typeof t.code == 'number' ? String(t.code) : t.code
      return {
        severity: hn(t.severity),
        startLineNumber: t.range.start.line + 1,
        startColumn: t.range.start.character + 1,
        endLineNumber: t.range.end.line + 1,
        endColumn: t.range.end.character + 1,
        message: t.message,
        code: i,
        source: t.source,
      }
    }
    var B = class {
      constructor(t, i) {
        this._worker = t
        this._triggerCharacters = i
      }
      get triggerCharacters() {
        return this._triggerCharacters
      }
      provideCompletionItems(t, i, r, e) {
        let o = t.uri
        return this._worker(o)
          .then((s) => s.doComplete(o.toString(), C(i)))
          .then((s) => {
            if (!s) return
            let u = t.getWordUntilPosition(i),
              l = new d.Range(
                i.lineNumber,
                u.startColumn,
                i.lineNumber,
                u.endColumn
              ),
              f = s.items.map((g) => {
                let m = {
                  label: g.label,
                  insertText: g.insertText || g.label,
                  sortText: g.sortText,
                  filterText: g.filterText,
                  documentation: g.documentation,
                  detail: g.detail,
                  command: yn(g.command),
                  range: l,
                  kind: Tn(g.kind),
                }
                return (
                  g.textEdit &&
                    (vn(g.textEdit)
                      ? (m.range = {
                          insert: y(g.textEdit.insert),
                          replace: y(g.textEdit.replace),
                        })
                      : (m.range = y(g.textEdit.range)),
                    (m.insertText = g.textEdit.newText)),
                  g.additionalTextEdits &&
                    (m.additionalTextEdits = g.additionalTextEdits.map(L)),
                  g.insertTextFormat === ne.Snippet &&
                    (m.insertTextRules =
                      d.languages.CompletionItemInsertTextRule.InsertAsSnippet),
                  m
                )
              })
            return { isIncomplete: s.isIncomplete, suggestions: f }
          })
      }
    }
    function C(n) {
      if (!!n) return { character: n.column - 1, line: n.lineNumber - 1 }
    }
    function fe(n) {
      if (!!n)
        return {
          start: { line: n.startLineNumber - 1, character: n.startColumn - 1 },
          end: { line: n.endLineNumber - 1, character: n.endColumn - 1 },
        }
    }
    function y(n) {
      if (!!n)
        return new d.Range(
          n.start.line + 1,
          n.start.character + 1,
          n.end.line + 1,
          n.end.character + 1
        )
    }
    function vn(n) {
      return typeof n.insert < 'u' && typeof n.replace < 'u'
    }
    function Tn(n) {
      let t = d.languages.CompletionItemKind
      switch (n) {
        case p.Text:
          return t.Text
        case p.Method:
          return t.Method
        case p.Function:
          return t.Function
        case p.Constructor:
          return t.Constructor
        case p.Field:
          return t.Field
        case p.Variable:
          return t.Variable
        case p.Class:
          return t.Class
        case p.Interface:
          return t.Interface
        case p.Module:
          return t.Module
        case p.Property:
          return t.Property
        case p.Unit:
          return t.Unit
        case p.Value:
          return t.Value
        case p.Enum:
          return t.Enum
        case p.Keyword:
          return t.Keyword
        case p.Snippet:
          return t.Snippet
        case p.Color:
          return t.Color
        case p.File:
          return t.File
        case p.Reference:
          return t.Reference
      }
      return t.Property
    }
    function L(n) {
      if (!!n) return { range: y(n.range), text: n.newText }
    }
    function yn(n) {
      return n && n.command === 'editor.action.triggerSuggest'
        ? { id: n.command, title: n.title, arguments: n.arguments }
        : void 0
    }
    var D = class {
      constructor(t) {
        this._worker = t
      }
      provideHover(t, i, r) {
        let e = t.uri
        return this._worker(e)
          .then((o) => o.doHover(e.toString(), C(i)))
          .then((o) => {
            if (!!o) return { range: y(o.range), contents: kn(o.contents) }
          })
      }
    }
    function xn(n) {
      return n && typeof n == 'object' && typeof n.kind == 'string'
    }
    function Ge(n) {
      return typeof n == 'string'
        ? { value: n }
        : xn(n)
        ? n.kind === 'plaintext'
          ? { value: n.value.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&') }
          : { value: n.value }
        : {
            value:
              '```' +
              n.language +
              `
` +
              n.value +
              '\n```\n',
          }
    }
    function kn(n) {
      if (!!n) return Array.isArray(n) ? n.map(Ge) : [Ge(n)]
    }
    var S = class {
      constructor(t) {
        this._worker = t
      }
      provideDocumentHighlights(t, i, r) {
        let e = t.uri
        return this._worker(e)
          .then((o) => o.findDocumentHighlights(e.toString(), C(i)))
          .then((o) => {
            if (!!o)
              return o.map((s) => ({ range: y(s.range), kind: In(s.kind) }))
          })
      }
    }
    function In(n) {
      switch (n) {
        case W.Read:
          return d.languages.DocumentHighlightKind.Read
        case W.Write:
          return d.languages.DocumentHighlightKind.Write
        case W.Text:
          return d.languages.DocumentHighlightKind.Text
      }
      return d.languages.DocumentHighlightKind.Text
    }
    var ce = class {
      constructor(t) {
        this._worker = t
      }
      provideDefinition(t, i, r) {
        let e = t.uri
        return this._worker(e)
          .then((o) => o.findDefinition(e.toString(), C(i)))
          .then((o) => {
            if (!!o) return [Je(o)]
          })
      }
    }
    function Je(n) {
      return { uri: d.Uri.parse(n.uri), range: y(n.range) }
    }
    var le = class {
        constructor(t) {
          this._worker = t
        }
        provideReferences(t, i, r, e) {
          let o = t.uri
          return this._worker(o)
            .then((s) => s.findReferences(o.toString(), C(i)))
            .then((s) => {
              if (!!s) return s.map(Je)
            })
        }
      },
      F = class {
        constructor(t) {
          this._worker = t
        }
        provideRenameEdits(t, i, r, e) {
          let o = t.uri
          return this._worker(o)
            .then((s) => s.doRename(o.toString(), C(i), r))
            .then((s) => _n(s))
        }
      }
    function _n(n) {
      if (!n || !n.changes) return
      let t = []
      for (let i in n.changes) {
        let r = d.Uri.parse(i)
        for (let e of n.changes[i])
          t.push({
            resource: r,
            versionId: void 0,
            textEdit: { range: y(e.range), text: e.newText },
          })
      }
      return { edits: t }
    }
    var M = class {
      constructor(t) {
        this._worker = t
      }
      provideDocumentSymbols(t, i) {
        let r = t.uri
        return this._worker(r)
          .then((e) => e.findDocumentSymbols(r.toString()))
          .then((e) => {
            if (!!e)
              return e.map((o) => ({
                name: o.name,
                detail: '',
                containerName: o.containerName,
                kind: Cn(o.kind),
                range: y(o.location.range),
                selectionRange: y(o.location.range),
                tags: [],
              }))
          })
      }
    }
    function Cn(n) {
      let t = d.languages.SymbolKind
      switch (n) {
        case h.File:
          return t.Array
        case h.Module:
          return t.Module
        case h.Namespace:
          return t.Namespace
        case h.Package:
          return t.Package
        case h.Class:
          return t.Class
        case h.Method:
          return t.Method
        case h.Property:
          return t.Property
        case h.Field:
          return t.Field
        case h.Constructor:
          return t.Constructor
        case h.Enum:
          return t.Enum
        case h.Interface:
          return t.Interface
        case h.Function:
          return t.Function
        case h.Variable:
          return t.Variable
        case h.Constant:
          return t.Constant
        case h.String:
          return t.String
        case h.Number:
          return t.Number
        case h.Boolean:
          return t.Boolean
        case h.Array:
          return t.Array
      }
      return t.Function
    }
    var A = class {
        constructor(t) {
          this._worker = t
        }
        provideLinks(t, i) {
          let r = t.uri
          return this._worker(r)
            .then((e) => e.findDocumentLinks(r.toString()))
            .then((e) => {
              if (!!e)
                return {
                  links: e.map((o) => ({ range: y(o.range), url: o.target })),
                }
            })
        }
      },
      H = class {
        constructor(t) {
          this._worker = t
        }
        provideDocumentFormattingEdits(t, i, r) {
          let e = t.uri
          return this._worker(e).then((o) =>
            o.format(e.toString(), null, Ye(i)).then((s) => {
              if (!(!s || s.length === 0)) return s.map(L)
            })
          )
        }
      },
      K = class {
        constructor(t) {
          this._worker = t
        }
        provideDocumentRangeFormattingEdits(t, i, r, e) {
          let o = t.uri
          return this._worker(o).then((s) =>
            s.format(o.toString(), fe(i), Ye(r)).then((u) => {
              if (!(!u || u.length === 0)) return u.map(L)
            })
          )
        }
      }
    function Ye(n) {
      return { tabSize: n.tabSize, insertSpaces: n.insertSpaces }
    }
    var ge = class {
        constructor(t) {
          this._worker = t
        }
        provideDocumentColors(t, i) {
          let r = t.uri
          return this._worker(r)
            .then((e) => e.findDocumentColors(r.toString()))
            .then((e) => {
              if (!!e)
                return e.map((o) => ({ color: o.color, range: y(o.range) }))
            })
        }
        provideColorPresentations(t, i, r) {
          let e = t.uri
          return this._worker(e)
            .then((o) =>
              o.getColorPresentations(e.toString(), i.color, fe(i.range))
            )
            .then((o) => {
              if (!!o)
                return o.map((s) => {
                  let u = { label: s.label }
                  return (
                    s.textEdit && (u.textEdit = L(s.textEdit)),
                    s.additionalTextEdits &&
                      (u.additionalTextEdits = s.additionalTextEdits.map(L)),
                    u
                  )
                })
            })
        }
      },
      U = class {
        constructor(t) {
          this._worker = t
        }
        provideFoldingRanges(t, i, r) {
          let e = t.uri
          return this._worker(e)
            .then((o) => o.getFoldingRanges(e.toString(), i))
            .then((o) => {
              if (!!o)
                return o.map((s) => {
                  let u = { start: s.startLine + 1, end: s.endLine + 1 }
                  return typeof s.kind < 'u' && (u.kind = bn(s.kind)), u
                })
            })
        }
      }
    function bn(n) {
      switch (n) {
        case R.Comment:
          return d.languages.FoldingRangeKind.Comment
        case R.Imports:
          return d.languages.FoldingRangeKind.Imports
        case R.Region:
          return d.languages.FoldingRangeKind.Region
      }
    }
    var j = class {
      constructor(t) {
        this._worker = t
      }
      provideSelectionRanges(t, i, r) {
        let e = t.uri
        return this._worker(e)
          .then((o) => o.getSelectionRanges(e.toString(), i.map(C)))
          .then((o) => {
            if (!!o)
              return o.map((s) => {
                let u = []
                for (; s; ) u.push({ range: y(s.range) }), (s = s.parent)
                return u
              })
          })
      }
    }
    var re = class extends B {
      constructor(t) {
        super(t, ['.', ':', '<', '"', '=', '/'])
      }
    }
    function En(n) {
      let t = new b(n),
        i = (...e) => t.getLanguageServiceWorker(...e),
        r = n.languageId
      d.languages.registerCompletionItemProvider(r, new re(i)),
        d.languages.registerHoverProvider(r, new D(i)),
        d.languages.registerDocumentHighlightProvider(r, new S(i)),
        d.languages.registerLinkProvider(r, new A(i)),
        d.languages.registerFoldingRangeProvider(r, new U(i)),
        d.languages.registerDocumentSymbolProvider(r, new M(i)),
        d.languages.registerSelectionRangeProvider(r, new j(i)),
        d.languages.registerRenameProvider(r, new F(i)),
        r === 'html' &&
          (d.languages.registerDocumentFormattingEditProvider(r, new H(i)),
          d.languages.registerDocumentRangeFormattingEditProvider(r, new K(i)))
    }
    function Pn(n) {
      let t = [],
        i = [],
        r = new b(n)
      t.push(r)
      let e = (...s) => r.getLanguageServiceWorker(...s)
      function o() {
        let { languageId: s, modeConfiguration: u } = n
        en(i),
          u.completionItems &&
            i.push(d.languages.registerCompletionItemProvider(s, new re(e))),
          u.hovers && i.push(d.languages.registerHoverProvider(s, new D(e))),
          u.documentHighlights &&
            i.push(d.languages.registerDocumentHighlightProvider(s, new S(e))),
          u.links && i.push(d.languages.registerLinkProvider(s, new A(e))),
          u.documentSymbols &&
            i.push(d.languages.registerDocumentSymbolProvider(s, new M(e))),
          u.rename && i.push(d.languages.registerRenameProvider(s, new F(e))),
          u.foldingRanges &&
            i.push(d.languages.registerFoldingRangeProvider(s, new U(e))),
          u.selectionRanges &&
            i.push(d.languages.registerSelectionRangeProvider(s, new j(e))),
          u.documentFormattingEdits &&
            i.push(
              d.languages.registerDocumentFormattingEditProvider(s, new H(e))
            ),
          u.documentRangeFormattingEdits &&
            i.push(
              d.languages.registerDocumentRangeFormattingEditProvider(
                s,
                new K(e)
              )
            )
      }
      return o(), t.push(Ze(i)), Ze(t)
    }
    function Ze(n) {
      return { dispose: () => en(n) }
    }
    function en(n) {
      for (; n.length; ) n.pop().dispose()
    }
    return cn(Rn)
  })()
  return moduleExports
})
