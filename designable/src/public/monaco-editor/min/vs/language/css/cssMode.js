'use strict'
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define('vs/language/css/cssMode', ['require', 'require'], (require) => {
  var moduleExports = (() => {
    var en = Object.create
    var Y = Object.defineProperty
    var nn = Object.getOwnPropertyDescriptor
    var tn = Object.getOwnPropertyNames
    var rn = Object.getPrototypeOf,
      on = Object.prototype.hasOwnProperty
    var sn = ((n) =>
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
    var an = (n, t) => () => (
        t || n((t = { exports: {} }).exports, t), t.exports
      ),
      un = (n, t) => {
        for (var i in t) Y(n, i, { get: t[i], enumerable: !0 })
      },
      J = (n, t, i, r) => {
        if ((t && typeof t == 'object') || typeof t == 'function')
          for (let e of tn(t))
            !on.call(n, e) &&
              e !== i &&
              Y(n, e, {
                get: () => t[e],
                enumerable: !(r = nn(t, e)) || r.enumerable,
              })
        return n
      },
      pe = (n, t, i) => (J(n, t, 'default'), i && J(i, t, 'default')),
      he = (n, t, i) => (
        (i = n != null ? en(rn(n)) : {}),
        J(
          t || !n || !n.__esModule
            ? Y(i, 'default', { value: n, enumerable: !0 })
            : i,
          n
        )
      ),
      dn = (n) => J(Y({}, '__esModule', { value: !0 }), n)
    var ve = an((Pn, me) => {
      var cn = he(sn('vs/editor/editor.api'))
      me.exports = cn
    })
    var En = {}
    un(En, {
      CompletionAdapter: () => H,
      DefinitionAdapter: () => O,
      DiagnosticsAdapter: () => K,
      DocumentColorAdapter: () => $,
      DocumentFormattingEditProvider: () => X,
      DocumentHighlightAdapter: () => j,
      DocumentLinkAdapter: () => le,
      DocumentRangeFormattingEditProvider: () => B,
      DocumentSymbolAdapter: () => z,
      FoldingRangeAdapter: () => q,
      HoverAdapter: () => U,
      ReferenceAdapter: () => N,
      RenameAdapter: () => V,
      SelectionRangeAdapter: () => Q,
      WorkerManager: () => E,
      fromPosition: () => _,
      fromRange: () => ge,
      setupMode: () => wn,
      toRange: () => T,
      toTextEdit: () => W,
    })
    var d = {}
    pe(d, he(ve()))
    var ln = 2 * 60 * 1e3,
      E = class {
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
          Date.now() - this._lastUsedTime > ln && this._stopWorker()
        }
        _getClient() {
          return (
            (this._lastUsedTime = Date.now()),
            this._client ||
              ((this._worker = d.editor.createWebWorker({
                moduleId: 'vs/language/css/cssWorker',
                label: this._defaults.languageId,
                createData: {
                  options: this._defaults.options,
                  languageId: this._defaults.languageId,
                },
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
    var ee
    ;(function (n) {
      ;(n.MIN_VALUE = 0), (n.MAX_VALUE = 2147483647)
    })(ee || (ee = {}))
    var x
    ;(function (n) {
      function t(r, e) {
        return (
          r === Number.MAX_VALUE && (r = ee.MAX_VALUE),
          e === Number.MAX_VALUE && (e = ee.MAX_VALUE),
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
    var se
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
    })(se || (se = {}))
    var Te
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
    })(Te || (Te = {}))
    var ae
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
    })(ae || (ae = {}))
    var xe
    ;(function (n) {
      function t(r, e) {
        return { range: r, color: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return v.is(e.range) && ae.is(e.color)
      }
      n.is = i
    })(xe || (xe = {}))
    var ke
    ;(function (n) {
      function t(r, e, o) {
        return { label: r, textEdit: e, additionalTextEdits: o }
      }
      n.create = t
      function i(r) {
        var e = r
        return (
          a.string(e.label) &&
          (a.undefined(e.textEdit) || C.is(e)) &&
          (a.undefined(e.additionalTextEdits) ||
            a.typedArray(e.additionalTextEdits, C.is))
        )
      }
      n.is = i
    })(ke || (ke = {}))
    var P
    ;(function (n) {
      ;(n.Comment = 'comment'), (n.Imports = 'imports'), (n.Region = 'region')
    })(P || (P = {}))
    var Ie
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
    })(Ie || (Ie = {}))
    var ue
    ;(function (n) {
      function t(r, e) {
        return { location: r, message: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return a.defined(e) && se.is(e.location) && a.string(e.message)
      }
      n.is = i
    })(ue || (ue = {}))
    var b
    ;(function (n) {
      ;(n.Error = 1), (n.Warning = 2), (n.Information = 3), (n.Hint = 4)
    })(b || (b = {}))
    var Ce
    ;(function (n) {
      ;(n.Unnecessary = 1), (n.Deprecated = 2)
    })(Ce || (Ce = {}))
    var _e
    ;(function (n) {
      function t(i) {
        var r = i
        return r != null && a.string(r.href)
      }
      n.is = t
    })(_e || (_e = {}))
    var ne
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
            a.typedArray(o.relatedInformation, ue.is))
        )
      }
      n.is = i
    })(ne || (ne = {}))
    var D
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
    })(D || (D = {}))
    var C
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
    })(C || (C = {}))
    var R
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
    })(R || (R = {}))
    var y
    ;(function (n) {
      function t(i) {
        var r = i
        return typeof r == 'string'
      }
      n.is = t
    })(y || (y = {}))
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
        return C.is(s) && (R.is(s.annotationId) || y.is(s.annotationId))
      }
      n.is = e
    })(I || (I = {}))
    var te
    ;(function (n) {
      function t(r, e) {
        return { textDocument: r, edits: e }
      }
      n.create = t
      function i(r) {
        var e = r
        return a.defined(e) && re.is(e.textDocument) && Array.isArray(e.edits)
      }
      n.is = i
    })(te || (te = {}))
    var L
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
          (e.annotationId === void 0 || y.is(e.annotationId))
        )
      }
      n.is = i
    })(L || (L = {}))
    var F
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
          (e.annotationId === void 0 || y.is(e.annotationId))
        )
      }
      n.is = i
    })(F || (F = {}))
    var M
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
          (e.annotationId === void 0 || y.is(e.annotationId))
        )
      }
      n.is = i
    })(M || (M = {}))
    var de
    ;(function (n) {
      function t(i) {
        var r = i
        return (
          r &&
          (r.changes !== void 0 || r.documentChanges !== void 0) &&
          (r.documentChanges === void 0 ||
            r.documentChanges.every(function (e) {
              return a.string(e.kind) ? L.is(e) || F.is(e) || M.is(e) : te.is(e)
            }))
        )
      }
      n.is = t
    })(de || (de = {}))
    var Z = (function () {
        function n(t, i) {
          ;(this.edits = t), (this.changeAnnotations = i)
        }
        return (
          (n.prototype.insert = function (t, i, r) {
            var e, o
            if (
              (r === void 0
                ? (e = C.insert(t, i))
                : y.is(r)
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
                ? (e = C.replace(t, i))
                : y.is(r)
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
                ? (r = C.del(t))
                : y.is(i)
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
      be = (function () {
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
              (y.is(t) ? (r = t) : ((r = this.nextId()), (i = t)),
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
      Mn = (function () {
        function n(t) {
          var i = this
          ;(this._textEditChanges = Object.create(null)),
            t !== void 0
              ? ((this._workspaceEdit = t),
                t.documentChanges
                  ? ((this._changeAnnotations = new be(t.changeAnnotations)),
                    (t.changeAnnotations = this._changeAnnotations.all()),
                    t.documentChanges.forEach(function (r) {
                      if (te.is(r)) {
                        var e = new Z(r.edits, i._changeAnnotations)
                        i._textEditChanges[r.textDocument.uri] = e
                      }
                    }))
                  : t.changes &&
                    Object.keys(t.changes).forEach(function (r) {
                      var e = new Z(t.changes[r])
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
            if (re.is(t)) {
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
                  (r = new Z(e, this._changeAnnotations)),
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
                  (r = new Z(e)),
                  (this._textEditChanges[t] = r)
              }
              return r
            }
          }),
          (n.prototype.initDocumentChanges = function () {
            this._workspaceEdit.documentChanges === void 0 &&
              this._workspaceEdit.changes === void 0 &&
              ((this._changeAnnotations = new be()),
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
            R.is(i) || y.is(i) ? (e = i) : (r = i)
            var o, s
            if (
              (e === void 0
                ? (o = L.create(t, r))
                : ((s = y.is(e) ? e : this._changeAnnotations.manage(e)),
                  (o = L.create(t, r, s))),
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
            R.is(r) || y.is(r) ? (o = r) : (e = r)
            var s, u
            if (
              (o === void 0
                ? (s = F.create(t, i, e))
                : ((u = y.is(o) ? o : this._changeAnnotations.manage(o)),
                  (s = F.create(t, i, e, u))),
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
            R.is(i) || y.is(i) ? (e = i) : (r = i)
            var o, s
            if (
              (e === void 0
                ? (o = M.create(t, r))
                : ((s = y.is(e) ? e : this._changeAnnotations.manage(e)),
                  (o = M.create(t, r, s))),
              this._workspaceEdit.documentChanges.push(o),
              s !== void 0)
            )
              return s
          }),
          n
        )
      })()
    var we
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
    })(we || (we = {}))
    var Ee
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
    })(Ee || (Ee = {}))
    var re
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
    })(re || (re = {}))
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
    var A
    ;(function (n) {
      ;(n.PlainText = 'plaintext'), (n.Markdown = 'markdown')
    })(A || (A = {}))
    ;(function (n) {
      function t(i) {
        var r = i
        return r === n.PlainText || r === n.Markdown
      }
      n.is = t
    })(A || (A = {}))
    var ce
    ;(function (n) {
      function t(i) {
        var r = i
        return a.objectLiteral(i) && A.is(r.kind) && a.string(r.value)
      }
      n.is = t
    })(ce || (ce = {}))
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
    var ie
    ;(function (n) {
      ;(n.PlainText = 1), (n.Snippet = 2)
    })(ie || (ie = {}))
    var Pe
    ;(function (n) {
      n.Deprecated = 1
    })(Pe || (Pe = {}))
    var Se
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
    })(Se || (Se = {}))
    var We
    ;(function (n) {
      ;(n.asIs = 1), (n.adjustIndentation = 2)
    })(We || (We = {}))
    var De
    ;(function (n) {
      function t(i) {
        return { label: i }
      }
      n.create = t
    })(De || (De = {}))
    var Le
    ;(function (n) {
      function t(i, r) {
        return { items: i || [], isIncomplete: !!r }
      }
      n.create = t
    })(Le || (Le = {}))
    var oe
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
    })(oe || (oe = {}))
    var Fe
    ;(function (n) {
      function t(i) {
        var r = i
        return (
          !!r &&
          a.objectLiteral(r) &&
          (ce.is(r.contents) ||
            oe.is(r.contents) ||
            a.typedArray(r.contents, oe.is)) &&
          (i.range === void 0 || v.is(i.range))
        )
      }
      n.is = t
    })(Fe || (Fe = {}))
    var Me
    ;(function (n) {
      function t(i, r) {
        return r ? { label: i, documentation: r } : { label: i }
      }
      n.create = t
    })(Me || (Me = {}))
    var Ae
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
    })(Ae || (Ae = {}))
    var S
    ;(function (n) {
      ;(n.Text = 1), (n.Read = 2), (n.Write = 3)
    })(S || (S = {}))
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
    var He
    ;(function (n) {
      n.Deprecated = 1
    })(He || (He = {}))
    var Ue
    ;(function (n) {
      function t(i, r, e, o, s) {
        var u = { name: i, kind: r, location: { uri: o, range: e } }
        return s && (u.containerName = s), u
      }
      n.create = t
    })(Ue || (Ue = {}))
    var je
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
    })(je || (je = {}))
    var Oe
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
    })(Oe || (Oe = {}))
    var Ne
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
          a.typedArray(e.diagnostics, ne.is) &&
          (e.only === void 0 || a.typedArray(e.only, a.string))
        )
      }
      n.is = i
    })(Ne || (Ne = {}))
    var Ve
    ;(function (n) {
      function t(r, e, o) {
        var s = { title: r },
          u = !0
        return (
          typeof e == 'string'
            ? ((u = !1), (s.kind = e))
            : D.is(e)
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
          (e.diagnostics === void 0 || a.typedArray(e.diagnostics, ne.is)) &&
          (e.kind === void 0 || a.string(e.kind)) &&
          (e.edit !== void 0 || e.command !== void 0) &&
          (e.command === void 0 || D.is(e.command)) &&
          (e.isPreferred === void 0 || a.boolean(e.isPreferred)) &&
          (e.edit === void 0 || de.is(e.edit))
        )
      }
      n.is = i
    })(Ve || (Ve = {}))
    var ze
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
          (a.undefined(e.command) || D.is(e.command))
        )
      }
      n.is = i
    })(ze || (ze = {}))
    var Xe
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
    })(Xe || (Xe = {}))
    var Be
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
    })(Be || (Be = {}))
    var $e
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
    })($e || ($e = {}))
    var qe
    ;(function (n) {
      function t(o, s, u, l) {
        return new gn(o, s, u, l)
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
            l = e(s, function (w, G) {
              var fe = w.range.start.line - G.range.start.line
              return fe === 0
                ? w.range.start.character - G.range.start.character
                : fe
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
    })(qe || (qe = {}))
    var gn = (function () {
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
      function u(c, w, G) {
        return t.call(c) === '[object Number]' && w <= c && c <= G
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
      function k(c, w) {
        return Array.isArray(c) && c.every(w)
      }
      n.typedArray = k
    })(a || (a = {}))
    var K = class {
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
            let e = r.map((s) => hn(t, s)),
              o = d.editor.getModel(t)
            o && o.getLanguageId() === i && d.editor.setModelMarkers(o, i, e)
          })
          .then(void 0, (r) => {
            console.error(r)
          })
      }
    }
    function pn(n) {
      switch (n) {
        case b.Error:
          return d.MarkerSeverity.Error
        case b.Warning:
          return d.MarkerSeverity.Warning
        case b.Information:
          return d.MarkerSeverity.Info
        case b.Hint:
          return d.MarkerSeverity.Hint
        default:
          return d.MarkerSeverity.Info
      }
    }
    function hn(n, t) {
      let i = typeof t.code == 'number' ? String(t.code) : t.code
      return {
        severity: pn(t.severity),
        startLineNumber: t.range.start.line + 1,
        startColumn: t.range.start.character + 1,
        endLineNumber: t.range.end.line + 1,
        endColumn: t.range.end.character + 1,
        message: t.message,
        code: i,
        source: t.source,
      }
    }
    var H = class {
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
          .then((s) => s.doComplete(o.toString(), _(i)))
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
                  kind: vn(g.kind),
                }
                return (
                  g.textEdit &&
                    (mn(g.textEdit)
                      ? (m.range = {
                          insert: T(g.textEdit.insert),
                          replace: T(g.textEdit.replace),
                        })
                      : (m.range = T(g.textEdit.range)),
                    (m.insertText = g.textEdit.newText)),
                  g.additionalTextEdits &&
                    (m.additionalTextEdits = g.additionalTextEdits.map(W)),
                  g.insertTextFormat === ie.Snippet &&
                    (m.insertTextRules =
                      d.languages.CompletionItemInsertTextRule.InsertAsSnippet),
                  m
                )
              })
            return { isIncomplete: s.isIncomplete, suggestions: f }
          })
      }
    }
    function _(n) {
      if (!!n) return { character: n.column - 1, line: n.lineNumber - 1 }
    }
    function ge(n) {
      if (!!n)
        return {
          start: { line: n.startLineNumber - 1, character: n.startColumn - 1 },
          end: { line: n.endLineNumber - 1, character: n.endColumn - 1 },
        }
    }
    function T(n) {
      if (!!n)
        return new d.Range(
          n.start.line + 1,
          n.start.character + 1,
          n.end.line + 1,
          n.end.character + 1
        )
    }
    function mn(n) {
      return typeof n.insert < 'u' && typeof n.replace < 'u'
    }
    function vn(n) {
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
    function W(n) {
      if (!!n) return { range: T(n.range), text: n.newText }
    }
    function yn(n) {
      return n && n.command === 'editor.action.triggerSuggest'
        ? { id: n.command, title: n.title, arguments: n.arguments }
        : void 0
    }
    var U = class {
      constructor(t) {
        this._worker = t
      }
      provideHover(t, i, r) {
        let e = t.uri
        return this._worker(e)
          .then((o) => o.doHover(e.toString(), _(i)))
          .then((o) => {
            if (!!o) return { range: T(o.range), contents: xn(o.contents) }
          })
      }
    }
    function Tn(n) {
      return n && typeof n == 'object' && typeof n.kind == 'string'
    }
    function Qe(n) {
      return typeof n == 'string'
        ? { value: n }
        : Tn(n)
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
    function xn(n) {
      if (!!n) return Array.isArray(n) ? n.map(Qe) : [Qe(n)]
    }
    var j = class {
      constructor(t) {
        this._worker = t
      }
      provideDocumentHighlights(t, i, r) {
        let e = t.uri
        return this._worker(e)
          .then((o) => o.findDocumentHighlights(e.toString(), _(i)))
          .then((o) => {
            if (!!o)
              return o.map((s) => ({ range: T(s.range), kind: kn(s.kind) }))
          })
      }
    }
    function kn(n) {
      switch (n) {
        case S.Read:
          return d.languages.DocumentHighlightKind.Read
        case S.Write:
          return d.languages.DocumentHighlightKind.Write
        case S.Text:
          return d.languages.DocumentHighlightKind.Text
      }
      return d.languages.DocumentHighlightKind.Text
    }
    var O = class {
      constructor(t) {
        this._worker = t
      }
      provideDefinition(t, i, r) {
        let e = t.uri
        return this._worker(e)
          .then((o) => o.findDefinition(e.toString(), _(i)))
          .then((o) => {
            if (!!o) return [Ge(o)]
          })
      }
    }
    function Ge(n) {
      return { uri: d.Uri.parse(n.uri), range: T(n.range) }
    }
    var N = class {
        constructor(t) {
          this._worker = t
        }
        provideReferences(t, i, r, e) {
          let o = t.uri
          return this._worker(o)
            .then((s) => s.findReferences(o.toString(), _(i)))
            .then((s) => {
              if (!!s) return s.map(Ge)
            })
        }
      },
      V = class {
        constructor(t) {
          this._worker = t
        }
        provideRenameEdits(t, i, r, e) {
          let o = t.uri
          return this._worker(o)
            .then((s) => s.doRename(o.toString(), _(i), r))
            .then((s) => In(s))
        }
      }
    function In(n) {
      if (!n || !n.changes) return
      let t = []
      for (let i in n.changes) {
        let r = d.Uri.parse(i)
        for (let e of n.changes[i])
          t.push({
            resource: r,
            versionId: void 0,
            textEdit: { range: T(e.range), text: e.newText },
          })
      }
      return { edits: t }
    }
    var z = class {
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
                range: T(o.location.range),
                selectionRange: T(o.location.range),
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
    var le = class {
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
                  links: e.map((o) => ({ range: T(o.range), url: o.target })),
                }
            })
        }
      },
      X = class {
        constructor(t) {
          this._worker = t
        }
        provideDocumentFormattingEdits(t, i, r) {
          let e = t.uri
          return this._worker(e).then((o) =>
            o.format(e.toString(), null, Je(i)).then((s) => {
              if (!(!s || s.length === 0)) return s.map(W)
            })
          )
        }
      },
      B = class {
        constructor(t) {
          this._worker = t
        }
        provideDocumentRangeFormattingEdits(t, i, r, e) {
          let o = t.uri
          return this._worker(o).then((s) =>
            s.format(o.toString(), ge(i), Je(r)).then((u) => {
              if (!(!u || u.length === 0)) return u.map(W)
            })
          )
        }
      }
    function Je(n) {
      return { tabSize: n.tabSize, insertSpaces: n.insertSpaces }
    }
    var $ = class {
        constructor(t) {
          this._worker = t
        }
        provideDocumentColors(t, i) {
          let r = t.uri
          return this._worker(r)
            .then((e) => e.findDocumentColors(r.toString()))
            .then((e) => {
              if (!!e)
                return e.map((o) => ({ color: o.color, range: T(o.range) }))
            })
        }
        provideColorPresentations(t, i, r) {
          let e = t.uri
          return this._worker(e)
            .then((o) =>
              o.getColorPresentations(e.toString(), i.color, ge(i.range))
            )
            .then((o) => {
              if (!!o)
                return o.map((s) => {
                  let u = { label: s.label }
                  return (
                    s.textEdit && (u.textEdit = W(s.textEdit)),
                    s.additionalTextEdits &&
                      (u.additionalTextEdits = s.additionalTextEdits.map(W)),
                    u
                  )
                })
            })
        }
      },
      q = class {
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
                  return typeof s.kind < 'u' && (u.kind = _n(s.kind)), u
                })
            })
        }
      }
    function _n(n) {
      switch (n) {
        case P.Comment:
          return d.languages.FoldingRangeKind.Comment
        case P.Imports:
          return d.languages.FoldingRangeKind.Imports
        case P.Region:
          return d.languages.FoldingRangeKind.Region
      }
    }
    var Q = class {
      constructor(t) {
        this._worker = t
      }
      provideSelectionRanges(t, i, r) {
        let e = t.uri
        return this._worker(e)
          .then((o) => o.getSelectionRanges(e.toString(), i.map(_)))
          .then((o) => {
            if (!!o)
              return o.map((s) => {
                let u = []
                for (; s; ) u.push({ range: T(s.range) }), (s = s.parent)
                return u
              })
          })
      }
    }
    function wn(n) {
      let t = [],
        i = [],
        r = new E(n)
      t.push(r)
      let e = (...s) => r.getLanguageServiceWorker(...s)
      function o() {
        let { languageId: s, modeConfiguration: u } = n
        Ze(i),
          u.completionItems &&
            i.push(
              d.languages.registerCompletionItemProvider(
                s,
                new H(e, ['/', '-', ':'])
              )
            ),
          u.hovers && i.push(d.languages.registerHoverProvider(s, new U(e))),
          u.documentHighlights &&
            i.push(d.languages.registerDocumentHighlightProvider(s, new j(e))),
          u.definitions &&
            i.push(d.languages.registerDefinitionProvider(s, new O(e))),
          u.references &&
            i.push(d.languages.registerReferenceProvider(s, new N(e))),
          u.documentSymbols &&
            i.push(d.languages.registerDocumentSymbolProvider(s, new z(e))),
          u.rename && i.push(d.languages.registerRenameProvider(s, new V(e))),
          u.colors && i.push(d.languages.registerColorProvider(s, new $(e))),
          u.foldingRanges &&
            i.push(d.languages.registerFoldingRangeProvider(s, new q(e))),
          u.diagnostics && i.push(new K(s, e, n.onDidChange)),
          u.selectionRanges &&
            i.push(d.languages.registerSelectionRangeProvider(s, new Q(e))),
          u.documentFormattingEdits &&
            i.push(
              d.languages.registerDocumentFormattingEditProvider(s, new X(e))
            ),
          u.documentRangeFormattingEdits &&
            i.push(
              d.languages.registerDocumentRangeFormattingEditProvider(
                s,
                new B(e)
              )
            )
      }
      return o(), t.push(Ye(i)), Ye(t)
    }
    function Ye(n) {
      return { dispose: () => Ze(n) }
    }
    function Ze(n) {
      for (; n.length; ) n.pop().dispose()
    }
    return dn(En)
  })()
  return moduleExports
})
