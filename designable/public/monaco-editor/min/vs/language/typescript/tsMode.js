'use strict'
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define('vs/language/typescript/tsMode', ['require', 'require'], (require) => {
  var moduleExports = (() => {
    var Z = Object.create
    var I = Object.defineProperty
    var ee = Object.getOwnPropertyDescriptor
    var te = Object.getOwnPropertyNames
    var ie = Object.getPrototypeOf,
      re = Object.prototype.hasOwnProperty
    var se = (s, e, t) =>
      e in s
        ? I(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
        : (s[e] = t)
    var $ = ((s) =>
      typeof require != 'undefined'
        ? require
        : typeof Proxy != 'undefined'
        ? new Proxy(s, {
            get: (e, t) => (typeof require != 'undefined' ? require : e)[t],
          })
        : s)(function (s) {
      if (typeof require != 'undefined') return require.apply(this, arguments)
      throw new Error('Dynamic require of "' + s + '" is not supported')
    })
    var ne = (s, e) => () => (
        e || s((e = { exports: {} }).exports, e), e.exports
      ),
      oe = (s, e) => {
        for (var t in e) I(s, t, { get: e[t], enumerable: !0 })
      },
      V = (s, e, t, i) => {
        if ((e && typeof e == 'object') || typeof e == 'function')
          for (let o of te(e))
            !re.call(s, o) &&
              o !== t &&
              I(s, o, {
                get: () => e[o],
                enumerable: !(i = ee(e, o)) || i.enumerable,
              })
        return s
      },
      z = (s, e, t) => (V(s, e, 'default'), t && V(t, e, 'default')),
      J = (s, e, t) => (
        (t = s != null ? Z(ie(s)) : {}),
        V(
          e || !s || !s.__esModule
            ? I(t, 'default', { value: s, enumerable: !0 })
            : t,
          s
        )
      ),
      ae = (s) => V(I({}, '__esModule', { value: !0 }), s)
    var b = (s, e, t) => (se(s, typeof e != 'symbol' ? e + '' : e, t), t)
    var q = ne((be, G) => {
      var le = J($('vs/editor/editor.api'))
      G.exports = le
    })
    var me = {}
    oe(me, {
      Adapter: () => S,
      CodeActionAdaptor: () => N,
      DefinitionAdapter: () => M,
      DiagnosticsAdapter: () => D,
      FormatAdapter: () => R,
      FormatHelper: () => w,
      FormatOnTypeAdapter: () => E,
      InlayHintsAdapter: () => H,
      Kind: () => l,
      LibFiles: () => P,
      OccurrencesAdapter: () => L,
      OutlineAdapter: () => O,
      QuickInfoAdapter: () => F,
      ReferenceAdapter: () => A,
      RenameAdapter: () => W,
      SignatureHelpAdapter: () => _,
      SuggestAdapter: () => v,
      WorkerManager: () => T,
      flattenDiagnosticMessageText: () => K,
      getJavaScriptWorker: () => pe,
      getTypeScriptWorker: () => de,
      setupJavaScript: () => ge,
      setupTypeScript: () => ue,
    })
    var r = {}
    z(r, J(q()))
    var T = class {
      constructor(e, t) {
        this._modeId = e
        this._defaults = t
        ;(this._worker = null),
          (this._client = null),
          (this._configChangeListener = this._defaults.onDidChange(() =>
            this._stopWorker()
          )),
          (this._updateExtraLibsToken = 0),
          (this._extraLibsChangeListener = this._defaults.onDidExtraLibsChange(
            () => this._updateExtraLibs()
          ))
      }
      _configChangeListener
      _updateExtraLibsToken
      _extraLibsChangeListener
      _worker
      _client
      dispose() {
        this._configChangeListener.dispose(),
          this._extraLibsChangeListener.dispose(),
          this._stopWorker()
      }
      _stopWorker() {
        this._worker && (this._worker.dispose(), (this._worker = null)),
          (this._client = null)
      }
      async _updateExtraLibs() {
        if (!this._worker) return
        let e = ++this._updateExtraLibsToken,
          t = await this._worker.getProxy()
        this._updateExtraLibsToken === e &&
          t.updateExtraLibs(this._defaults.getExtraLibs())
      }
      _getClient() {
        return (
          this._client ||
            (this._client = (async () => (
              (this._worker = r.editor.createWebWorker({
                moduleId: 'vs/language/typescript/tsWorker',
                label: this._modeId,
                keepIdleModels: !0,
                createData: {
                  compilerOptions: this._defaults.getCompilerOptions(),
                  extraLibs: this._defaults.getExtraLibs(),
                  customWorkerPath:
                    this._defaults.workerOptions.customWorkerPath,
                  inlayHintsOptions: this._defaults.inlayHintsOptions,
                },
              })),
              this._defaults.getEagerModelSync()
                ? await this._worker.withSyncedResources(
                    r.editor
                      .getModels()
                      .filter((e) => e.getLanguageId() === this._modeId)
                      .map((e) => e.uri)
                  )
                : await this._worker.getProxy()
            ))()),
          this._client
        )
      }
      async getLanguageServiceWorker(...e) {
        let t = await this._getClient()
        return this._worker && (await this._worker.withSyncedResources(e)), t
      }
    }
    var Q = $('./monaco.contribution')
    var a = {}
    a['lib.d.ts'] = !0
    a['lib.dom.d.ts'] = !0
    a['lib.dom.iterable.d.ts'] = !0
    a['lib.es2015.collection.d.ts'] = !0
    a['lib.es2015.core.d.ts'] = !0
    a['lib.es2015.d.ts'] = !0
    a['lib.es2015.generator.d.ts'] = !0
    a['lib.es2015.iterable.d.ts'] = !0
    a['lib.es2015.promise.d.ts'] = !0
    a['lib.es2015.proxy.d.ts'] = !0
    a['lib.es2015.reflect.d.ts'] = !0
    a['lib.es2015.symbol.d.ts'] = !0
    a['lib.es2015.symbol.wellknown.d.ts'] = !0
    a['lib.es2016.array.include.d.ts'] = !0
    a['lib.es2016.d.ts'] = !0
    a['lib.es2016.full.d.ts'] = !0
    a['lib.es2017.d.ts'] = !0
    a['lib.es2017.full.d.ts'] = !0
    a['lib.es2017.intl.d.ts'] = !0
    a['lib.es2017.object.d.ts'] = !0
    a['lib.es2017.sharedmemory.d.ts'] = !0
    a['lib.es2017.string.d.ts'] = !0
    a['lib.es2017.typedarrays.d.ts'] = !0
    a['lib.es2018.asyncgenerator.d.ts'] = !0
    a['lib.es2018.asynciterable.d.ts'] = !0
    a['lib.es2018.d.ts'] = !0
    a['lib.es2018.full.d.ts'] = !0
    a['lib.es2018.intl.d.ts'] = !0
    a['lib.es2018.promise.d.ts'] = !0
    a['lib.es2018.regexp.d.ts'] = !0
    a['lib.es2019.array.d.ts'] = !0
    a['lib.es2019.d.ts'] = !0
    a['lib.es2019.full.d.ts'] = !0
    a['lib.es2019.object.d.ts'] = !0
    a['lib.es2019.string.d.ts'] = !0
    a['lib.es2019.symbol.d.ts'] = !0
    a['lib.es2020.bigint.d.ts'] = !0
    a['lib.es2020.d.ts'] = !0
    a['lib.es2020.full.d.ts'] = !0
    a['lib.es2020.intl.d.ts'] = !0
    a['lib.es2020.promise.d.ts'] = !0
    a['lib.es2020.sharedmemory.d.ts'] = !0
    a['lib.es2020.string.d.ts'] = !0
    a['lib.es2020.symbol.wellknown.d.ts'] = !0
    a['lib.es2021.d.ts'] = !0
    a['lib.es2021.full.d.ts'] = !0
    a['lib.es2021.intl.d.ts'] = !0
    a['lib.es2021.promise.d.ts'] = !0
    a['lib.es2021.string.d.ts'] = !0
    a['lib.es2021.weakref.d.ts'] = !0
    a['lib.es5.d.ts'] = !0
    a['lib.es6.d.ts'] = !0
    a['lib.esnext.d.ts'] = !0
    a['lib.esnext.full.d.ts'] = !0
    a['lib.esnext.intl.d.ts'] = !0
    a['lib.esnext.promise.d.ts'] = !0
    a['lib.esnext.string.d.ts'] = !0
    a['lib.esnext.weakref.d.ts'] = !0
    a['lib.scripthost.d.ts'] = !0
    a['lib.webworker.d.ts'] = !0
    a['lib.webworker.importscripts.d.ts'] = !0
    a['lib.webworker.iterable.d.ts'] = !0
    function K(s, e, t = 0) {
      if (typeof s == 'string') return s
      if (s === void 0) return ''
      let i = ''
      if (t) {
        i += e
        for (let o = 0; o < t; o++) i += '  '
      }
      if (((i += s.messageText), t++, s.next))
        for (let o of s.next) i += K(o, e, t)
      return i
    }
    function x(s) {
      return s ? s.map((e) => e.text).join('') : ''
    }
    var S = class {
        constructor(e) {
          this._worker = e
        }
        _textSpanToRange(e, t) {
          let i = e.getPositionAt(t.start),
            o = e.getPositionAt(t.start + t.length),
            { lineNumber: m, column: p } = i,
            { lineNumber: g, column: u } = o
          return {
            startLineNumber: m,
            startColumn: p,
            endLineNumber: g,
            endColumn: u,
          }
        }
      },
      P = class {
        constructor(e) {
          this._worker = e
          ;(this._libFiles = {}),
            (this._hasFetchedLibFiles = !1),
            (this._fetchLibFilesPromise = null)
        }
        _libFiles
        _hasFetchedLibFiles
        _fetchLibFilesPromise
        isLibFile(e) {
          return e && e.path.indexOf('/lib.') === 0 ? !!a[e.path.slice(1)] : !1
        }
        getOrCreateModel(e) {
          let t = r.Uri.parse(e),
            i = r.editor.getModel(t)
          if (i) return i
          if (this.isLibFile(t) && this._hasFetchedLibFiles)
            return r.editor.createModel(
              this._libFiles[t.path.slice(1)],
              'typescript',
              t
            )
          let o = Q.typescriptDefaults.getExtraLibs()[e]
          return o ? r.editor.createModel(o.content, 'typescript', t) : null
        }
        _containsLibFile(e) {
          for (let t of e) if (this.isLibFile(t)) return !0
          return !1
        }
        async fetchLibFilesIfNecessary(e) {
          !this._containsLibFile(e) || (await this._fetchLibFiles())
        }
        _fetchLibFiles() {
          return (
            this._fetchLibFilesPromise ||
              (this._fetchLibFilesPromise = this._worker()
                .then((e) => e.getLibFiles())
                .then((e) => {
                  ;(this._hasFetchedLibFiles = !0), (this._libFiles = e)
                })),
            this._fetchLibFilesPromise
          )
        }
      }
    var D = class extends S {
        constructor(t, i, o, m) {
          super(m)
          this._libFiles = t
          this._defaults = i
          this._selector = o
          let p = (n) => {
              if (n.getLanguageId() !== o) return
              let d = () => {
                  let { onlyVisible: y } =
                    this._defaults.getDiagnosticsOptions()
                  y
                    ? n.isAttachedToEditor() && this._doValidate(n)
                    : this._doValidate(n)
                },
                c,
                f = n.onDidChangeContent(() => {
                  clearTimeout(c), (c = window.setTimeout(d, 500))
                }),
                h = n.onDidChangeAttached(() => {
                  let { onlyVisible: y } =
                    this._defaults.getDiagnosticsOptions()
                  y &&
                    (n.isAttachedToEditor()
                      ? d()
                      : r.editor.setModelMarkers(n, this._selector, []))
                })
              ;(this._listener[n.uri.toString()] = {
                dispose() {
                  f.dispose(), h.dispose(), clearTimeout(c)
                },
              }),
                d()
            },
            g = (n) => {
              r.editor.setModelMarkers(n, this._selector, [])
              let d = n.uri.toString()
              this._listener[d] &&
                (this._listener[d].dispose(), delete this._listener[d])
            }
          this._disposables.push(r.editor.onDidCreateModel((n) => p(n))),
            this._disposables.push(r.editor.onWillDisposeModel(g)),
            this._disposables.push(
              r.editor.onDidChangeModelLanguage((n) => {
                g(n.model), p(n.model)
              })
            ),
            this._disposables.push({
              dispose() {
                for (let n of r.editor.getModels()) g(n)
              },
            })
          let u = () => {
            for (let n of r.editor.getModels()) g(n), p(n)
          }
          this._disposables.push(this._defaults.onDidChange(u)),
            this._disposables.push(this._defaults.onDidExtraLibsChange(u)),
            r.editor.getModels().forEach((n) => p(n))
        }
        _disposables = []
        _listener = Object.create(null)
        dispose() {
          this._disposables.forEach((t) => t && t.dispose()),
            (this._disposables = [])
        }
        async _doValidate(t) {
          let i = await this._worker(t.uri)
          if (t.isDisposed()) return
          let o = [],
            {
              noSyntaxValidation: m,
              noSemanticValidation: p,
              noSuggestionDiagnostics: g,
            } = this._defaults.getDiagnosticsOptions()
          m || o.push(i.getSyntacticDiagnostics(t.uri.toString())),
            p || o.push(i.getSemanticDiagnostics(t.uri.toString())),
            g || o.push(i.getSuggestionDiagnostics(t.uri.toString()))
          let u = await Promise.all(o)
          if (!u || t.isDisposed()) return
          let n = u
              .reduce((c, f) => f.concat(c), [])
              .filter(
                (c) =>
                  (
                    this._defaults.getDiagnosticsOptions()
                      .diagnosticCodesToIgnore || []
                  ).indexOf(c.code) === -1
              ),
            d = n
              .map((c) => c.relatedInformation || [])
              .reduce((c, f) => f.concat(c), [])
              .map((c) => (c.file ? r.Uri.parse(c.file.fileName) : null))
          await this._libFiles.fetchLibFilesIfNecessary(d),
            !t.isDisposed() &&
              r.editor.setModelMarkers(
                t,
                this._selector,
                n.map((c) => this._convertDiagnostics(t, c))
              )
        }
        _convertDiagnostics(t, i) {
          let o = i.start || 0,
            m = i.length || 1,
            { lineNumber: p, column: g } = t.getPositionAt(o),
            { lineNumber: u, column: n } = t.getPositionAt(o + m),
            d = []
          return (
            i.reportsUnnecessary && d.push(r.MarkerTag.Unnecessary),
            i.reportsDeprecated && d.push(r.MarkerTag.Deprecated),
            {
              severity: this._tsDiagnosticCategoryToMarkerSeverity(i.category),
              startLineNumber: p,
              startColumn: g,
              endLineNumber: u,
              endColumn: n,
              message: K(
                i.messageText,
                `
`
              ),
              code: i.code.toString(),
              tags: d,
              relatedInformation: this._convertRelatedInformation(
                t,
                i.relatedInformation
              ),
            }
          )
        }
        _convertRelatedInformation(t, i) {
          if (!i) return []
          let o = []
          return (
            i.forEach((m) => {
              let p = t
              if (
                (m.file &&
                  (p = this._libFiles.getOrCreateModel(m.file.fileName)),
                !p)
              )
                return
              let g = m.start || 0,
                u = m.length || 1,
                { lineNumber: n, column: d } = p.getPositionAt(g),
                { lineNumber: c, column: f } = p.getPositionAt(g + u)
              o.push({
                resource: p.uri,
                startLineNumber: n,
                startColumn: d,
                endLineNumber: c,
                endColumn: f,
                message: K(
                  m.messageText,
                  `
`
                ),
              })
            }),
            o
          )
        }
        _tsDiagnosticCategoryToMarkerSeverity(t) {
          switch (t) {
            case 1:
              return r.MarkerSeverity.Error
            case 3:
              return r.MarkerSeverity.Info
            case 0:
              return r.MarkerSeverity.Warning
            case 2:
              return r.MarkerSeverity.Hint
          }
          return r.MarkerSeverity.Info
        }
      },
      v = class extends S {
        get triggerCharacters() {
          return ['.']
        }
        async provideCompletionItems(e, t, i, o) {
          let m = e.getWordUntilPosition(t),
            p = new r.Range(
              t.lineNumber,
              m.startColumn,
              t.lineNumber,
              m.endColumn
            ),
            g = e.uri,
            u = e.getOffsetAt(t),
            n = await this._worker(g)
          if (e.isDisposed()) return
          let d = await n.getCompletionsAtPosition(g.toString(), u)
          return !d || e.isDisposed()
            ? void 0
            : {
                suggestions: d.entries.map((f) => {
                  let h = p
                  if (f.replacementSpan) {
                    let C = e.getPositionAt(f.replacementSpan.start),
                      U = e.getPositionAt(
                        f.replacementSpan.start + f.replacementSpan.length
                      )
                    h = new r.Range(
                      C.lineNumber,
                      C.column,
                      U.lineNumber,
                      U.column
                    )
                  }
                  let y = []
                  return (
                    f.kindModifiers?.indexOf('deprecated') !== -1 &&
                      y.push(r.languages.CompletionItemTag.Deprecated),
                    {
                      uri: g,
                      position: t,
                      offset: u,
                      range: h,
                      label: f.name,
                      insertText: f.name,
                      sortText: f.sortText,
                      kind: v.convertKind(f.kind),
                      tags: y,
                    }
                  )
                }),
              }
        }
        async resolveCompletionItem(e, t) {
          let i = e,
            o = i.uri,
            m = i.position,
            p = i.offset,
            u = await (
              await this._worker(o)
            ).getCompletionEntryDetails(o.toString(), p, i.label)
          return u
            ? {
                uri: o,
                position: m,
                label: u.name,
                kind: v.convertKind(u.kind),
                detail: x(u.displayParts),
                documentation: { value: v.createDocumentationString(u) },
              }
            : i
        }
        static convertKind(e) {
          switch (e) {
            case l.primitiveType:
            case l.keyword:
              return r.languages.CompletionItemKind.Keyword
            case l.variable:
            case l.localVariable:
              return r.languages.CompletionItemKind.Variable
            case l.memberVariable:
            case l.memberGetAccessor:
            case l.memberSetAccessor:
              return r.languages.CompletionItemKind.Field
            case l.function:
            case l.memberFunction:
            case l.constructSignature:
            case l.callSignature:
            case l.indexSignature:
              return r.languages.CompletionItemKind.Function
            case l.enum:
              return r.languages.CompletionItemKind.Enum
            case l.module:
              return r.languages.CompletionItemKind.Module
            case l.class:
              return r.languages.CompletionItemKind.Class
            case l.interface:
              return r.languages.CompletionItemKind.Interface
            case l.warning:
              return r.languages.CompletionItemKind.File
          }
          return r.languages.CompletionItemKind.Property
        }
        static createDocumentationString(e) {
          let t = x(e.documentation)
          if (e.tags)
            for (let i of e.tags)
              t += `

${X(i)}`
          return t
        }
      }
    function X(s) {
      let e = `*@${s.name}*`
      if (s.name === 'param' && s.text) {
        let [t, ...i] = s.text
        ;(e += `\`${t.text}\``),
          i.length > 0 && (e += ` \u2014 ${i.map((o) => o.text).join(' ')}`)
      } else
        Array.isArray(s.text)
          ? (e += ` \u2014 ${s.text.map((t) => t.text).join(' ')}`)
          : s.text && (e += ` \u2014 ${s.text}`)
      return e
    }
    var _ = class extends S {
        signatureHelpTriggerCharacters = ['(', ',']
        static _toSignatureHelpTriggerReason(e) {
          switch (e.triggerKind) {
            case r.languages.SignatureHelpTriggerKind.TriggerCharacter:
              return e.triggerCharacter
                ? e.isRetrigger
                  ? { kind: 'retrigger', triggerCharacter: e.triggerCharacter }
                  : {
                      kind: 'characterTyped',
                      triggerCharacter: e.triggerCharacter,
                    }
                : { kind: 'invoked' }
            case r.languages.SignatureHelpTriggerKind.ContentChange:
              return e.isRetrigger ? { kind: 'retrigger' } : { kind: 'invoked' }
            case r.languages.SignatureHelpTriggerKind.Invoke:
            default:
              return { kind: 'invoked' }
          }
        }
        async provideSignatureHelp(e, t, i, o) {
          let m = e.uri,
            p = e.getOffsetAt(t),
            g = await this._worker(m)
          if (e.isDisposed()) return
          let u = await g.getSignatureHelpItems(m.toString(), p, {
            triggerReason: _._toSignatureHelpTriggerReason(o),
          })
          if (!u || e.isDisposed()) return
          let n = {
            activeSignature: u.selectedItemIndex,
            activeParameter: u.argumentIndex,
            signatures: [],
          }
          return (
            u.items.forEach((d) => {
              let c = { label: '', parameters: [] }
              ;(c.documentation = { value: x(d.documentation) }),
                (c.label += x(d.prefixDisplayParts)),
                d.parameters.forEach((f, h, y) => {
                  let C = x(f.displayParts),
                    U = {
                      label: C,
                      documentation: { value: x(f.documentation) },
                    }
                  ;(c.label += C),
                    c.parameters.push(U),
                    h < y.length - 1 && (c.label += x(d.separatorDisplayParts))
                }),
                (c.label += x(d.suffixDisplayParts)),
                n.signatures.push(c)
            }),
            { value: n, dispose() {} }
          )
        }
      },
      F = class extends S {
        async provideHover(e, t, i) {
          let o = e.uri,
            m = e.getOffsetAt(t),
            p = await this._worker(o)
          if (e.isDisposed()) return
          let g = await p.getQuickInfoAtPosition(o.toString(), m)
          if (!g || e.isDisposed()) return
          let u = x(g.documentation),
            n = g.tags
              ? g.tags.map((c) => X(c)).join(`  

`)
              : '',
            d = x(g.displayParts)
          return {
            range: this._textSpanToRange(e, g.textSpan),
            contents: [
              { value: '```typescript\n' + d + '\n```\n' },
              {
                value:
                  u +
                  (n
                    ? `

` + n
                    : ''),
              },
            ],
          }
        }
      },
      L = class extends S {
        async provideDocumentHighlights(e, t, i) {
          let o = e.uri,
            m = e.getOffsetAt(t),
            p = await this._worker(o)
          if (e.isDisposed()) return
          let g = await p.getOccurrencesAtPosition(o.toString(), m)
          if (!(!g || e.isDisposed()))
            return g.map((u) => ({
              range: this._textSpanToRange(e, u.textSpan),
              kind: u.isWriteAccess
                ? r.languages.DocumentHighlightKind.Write
                : r.languages.DocumentHighlightKind.Text,
            }))
        }
      },
      M = class extends S {
        constructor(t, i) {
          super(i)
          this._libFiles = t
        }
        async provideDefinition(t, i, o) {
          let m = t.uri,
            p = t.getOffsetAt(i),
            g = await this._worker(m)
          if (t.isDisposed()) return
          let u = await g.getDefinitionAtPosition(m.toString(), p)
          if (
            !u ||
            t.isDisposed() ||
            (await this._libFiles.fetchLibFilesIfNecessary(
              u.map((d) => r.Uri.parse(d.fileName))
            ),
            t.isDisposed())
          )
            return
          let n = []
          for (let d of u) {
            let c = this._libFiles.getOrCreateModel(d.fileName)
            c &&
              n.push({
                uri: c.uri,
                range: this._textSpanToRange(c, d.textSpan),
              })
          }
          return n
        }
      },
      A = class extends S {
        constructor(t, i) {
          super(i)
          this._libFiles = t
        }
        async provideReferences(t, i, o, m) {
          let p = t.uri,
            g = t.getOffsetAt(i),
            u = await this._worker(p)
          if (t.isDisposed()) return
          let n = await u.getReferencesAtPosition(p.toString(), g)
          if (
            !n ||
            t.isDisposed() ||
            (await this._libFiles.fetchLibFilesIfNecessary(
              n.map((c) => r.Uri.parse(c.fileName))
            ),
            t.isDisposed())
          )
            return
          let d = []
          for (let c of n) {
            let f = this._libFiles.getOrCreateModel(c.fileName)
            f &&
              d.push({
                uri: f.uri,
                range: this._textSpanToRange(f, c.textSpan),
              })
          }
          return d
        }
      },
      O = class extends S {
        async provideDocumentSymbols(e, t) {
          let i = e.uri,
            o = await this._worker(i)
          if (e.isDisposed()) return
          let m = await o.getNavigationBarItems(i.toString())
          if (!m || e.isDisposed()) return
          let p = (u, n, d) => {
              let c = {
                name: n.text,
                detail: '',
                kind: k[n.kind] || r.languages.SymbolKind.Variable,
                range: this._textSpanToRange(e, n.spans[0]),
                selectionRange: this._textSpanToRange(e, n.spans[0]),
                tags: [],
              }
              if (
                (d && (c.containerName = d),
                n.childItems && n.childItems.length > 0)
              )
                for (let f of n.childItems) p(u, f, c.name)
              u.push(c)
            },
            g = []
          return m.forEach((u) => p(g, u)), g
        }
      },
      l = class {}
    b(l, 'unknown', ''),
      b(l, 'keyword', 'keyword'),
      b(l, 'script', 'script'),
      b(l, 'module', 'module'),
      b(l, 'class', 'class'),
      b(l, 'interface', 'interface'),
      b(l, 'type', 'type'),
      b(l, 'enum', 'enum'),
      b(l, 'variable', 'var'),
      b(l, 'localVariable', 'local var'),
      b(l, 'function', 'function'),
      b(l, 'localFunction', 'local function'),
      b(l, 'memberFunction', 'method'),
      b(l, 'memberGetAccessor', 'getter'),
      b(l, 'memberSetAccessor', 'setter'),
      b(l, 'memberVariable', 'property'),
      b(l, 'constructorImplementation', 'constructor'),
      b(l, 'callSignature', 'call'),
      b(l, 'indexSignature', 'index'),
      b(l, 'constructSignature', 'construct'),
      b(l, 'parameter', 'parameter'),
      b(l, 'typeParameter', 'type parameter'),
      b(l, 'primitiveType', 'primitive type'),
      b(l, 'label', 'label'),
      b(l, 'alias', 'alias'),
      b(l, 'const', 'const'),
      b(l, 'let', 'let'),
      b(l, 'warning', 'warning')
    var k = Object.create(null)
    k[l.module] = r.languages.SymbolKind.Module
    k[l.class] = r.languages.SymbolKind.Class
    k[l.enum] = r.languages.SymbolKind.Enum
    k[l.interface] = r.languages.SymbolKind.Interface
    k[l.memberFunction] = r.languages.SymbolKind.Method
    k[l.memberVariable] = r.languages.SymbolKind.Property
    k[l.memberGetAccessor] = r.languages.SymbolKind.Property
    k[l.memberSetAccessor] = r.languages.SymbolKind.Property
    k[l.variable] = r.languages.SymbolKind.Variable
    k[l.const] = r.languages.SymbolKind.Variable
    k[l.localVariable] = r.languages.SymbolKind.Variable
    k[l.variable] = r.languages.SymbolKind.Variable
    k[l.function] = r.languages.SymbolKind.Function
    k[l.localFunction] = r.languages.SymbolKind.Function
    var w = class extends S {
        static _convertOptions(e) {
          return {
            ConvertTabsToSpaces: e.insertSpaces,
            TabSize: e.tabSize,
            IndentSize: e.tabSize,
            IndentStyle: 2,
            NewLineCharacter: `
`,
            InsertSpaceAfterCommaDelimiter: !0,
            InsertSpaceAfterSemicolonInForStatements: !0,
            InsertSpaceBeforeAndAfterBinaryOperators: !0,
            InsertSpaceAfterKeywordsInControlFlowStatements: !0,
            InsertSpaceAfterFunctionKeywordForAnonymousFunctions: !0,
            InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: !1,
            InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: !1,
            InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: !1,
            PlaceOpenBraceOnNewLineForControlBlocks: !1,
            PlaceOpenBraceOnNewLineForFunctions: !1,
          }
        }
        _convertTextChanges(e, t) {
          return { text: t.newText, range: this._textSpanToRange(e, t.span) }
        }
      },
      R = class extends w {
        async provideDocumentRangeFormattingEdits(e, t, i, o) {
          let m = e.uri,
            p = e.getOffsetAt({
              lineNumber: t.startLineNumber,
              column: t.startColumn,
            }),
            g = e.getOffsetAt({
              lineNumber: t.endLineNumber,
              column: t.endColumn,
            }),
            u = await this._worker(m)
          if (e.isDisposed()) return
          let n = await u.getFormattingEditsForRange(
            m.toString(),
            p,
            g,
            w._convertOptions(i)
          )
          if (!(!n || e.isDisposed()))
            return n.map((d) => this._convertTextChanges(e, d))
        }
      },
      E = class extends w {
        get autoFormatTriggerCharacters() {
          return [
            ';',
            '}',
            `
`,
          ]
        }
        async provideOnTypeFormattingEdits(e, t, i, o, m) {
          let p = e.uri,
            g = e.getOffsetAt(t),
            u = await this._worker(p)
          if (e.isDisposed()) return
          let n = await u.getFormattingEditsAfterKeystroke(
            p.toString(),
            g,
            i,
            w._convertOptions(o)
          )
          if (!(!n || e.isDisposed()))
            return n.map((d) => this._convertTextChanges(e, d))
        }
      },
      N = class extends w {
        async provideCodeActions(e, t, i, o) {
          let m = e.uri,
            p = e.getOffsetAt({
              lineNumber: t.startLineNumber,
              column: t.startColumn,
            }),
            g = e.getOffsetAt({
              lineNumber: t.endLineNumber,
              column: t.endColumn,
            }),
            u = w._convertOptions(e.getOptions()),
            n = i.markers
              .filter((h) => h.code)
              .map((h) => h.code)
              .map(Number),
            d = await this._worker(m)
          if (e.isDisposed()) return
          let c = await d.getCodeFixesAtPosition(m.toString(), p, g, n, u)
          return !c || e.isDisposed()
            ? { actions: [], dispose: () => {} }
            : {
                actions: c
                  .filter(
                    (h) => h.changes.filter((y) => y.isNewFile).length === 0
                  )
                  .map((h) => this._tsCodeFixActionToMonacoCodeAction(e, i, h)),
                dispose: () => {},
              }
        }
        _tsCodeFixActionToMonacoCodeAction(e, t, i) {
          let o = []
          for (let p of i.changes)
            for (let g of p.textChanges)
              o.push({
                resource: e.uri,
                versionId: void 0,
                textEdit: {
                  range: this._textSpanToRange(e, g.span),
                  text: g.newText,
                },
              })
          return {
            title: i.description,
            edit: { edits: o },
            diagnostics: t.markers,
            kind: 'quickfix',
          }
        }
      },
      W = class extends S {
        constructor(t, i) {
          super(i)
          this._libFiles = t
        }
        async provideRenameEdits(t, i, o, m) {
          let p = t.uri,
            g = p.toString(),
            u = t.getOffsetAt(i),
            n = await this._worker(p)
          if (t.isDisposed()) return
          let d = await n.getRenameInfo(g, u, { allowRenameOfImportPath: !1 })
          if (d.canRename === !1)
            return { edits: [], rejectReason: d.localizedErrorMessage }
          if (d.fileToRename !== void 0)
            throw new Error('Renaming files is not supported.')
          let c = await n.findRenameLocations(g, u, !1, !1, !1)
          if (!c || t.isDisposed()) return
          let f = []
          for (let h of c) {
            let y = this._libFiles.getOrCreateModel(h.fileName)
            if (y)
              f.push({
                resource: y.uri,
                versionId: void 0,
                textEdit: {
                  range: this._textSpanToRange(y, h.textSpan),
                  text: o,
                },
              })
            else throw new Error(`Unknown file ${h.fileName}.`)
          }
          return { edits: f }
        }
      },
      H = class extends S {
        async provideInlayHints(e, t, i) {
          let o = e.uri,
            m = o.toString(),
            p = e.getOffsetAt({
              lineNumber: t.startLineNumber,
              column: t.startColumn,
            }),
            g = e.getOffsetAt({
              lineNumber: t.endLineNumber,
              column: t.endColumn,
            }),
            u = await this._worker(o)
          return e.isDisposed()
            ? null
            : {
                hints: (await u.provideInlayHints(m, p, g)).map((c) => ({
                  ...c,
                  label: c.text,
                  position: e.getPositionAt(c.position),
                  kind: this._convertHintKind(c.kind),
                })),
                dispose: () => {},
              }
        }
        _convertHintKind(e) {
          switch (e) {
            case 'Parameter':
              return r.languages.InlayHintKind.Parameter
            case 'Type':
              return r.languages.InlayHintKind.Type
            default:
              return r.languages.InlayHintKind.Type
          }
        }
      }
    var B, j
    function ue(s) {
      j = Y(s, 'typescript')
    }
    function ge(s) {
      B = Y(s, 'javascript')
    }
    function pe() {
      return new Promise((s, e) => {
        if (!B) return e('JavaScript not registered!')
        s(B)
      })
    }
    function de() {
      return new Promise((s, e) => {
        if (!j) return e('TypeScript not registered!')
        s(j)
      })
    }
    function Y(s, e) {
      let t = new T(e, s),
        i = (...m) => t.getLanguageServiceWorker(...m),
        o = new P(i)
      return (
        r.languages.registerCompletionItemProvider(e, new v(i)),
        r.languages.registerSignatureHelpProvider(e, new _(i)),
        r.languages.registerHoverProvider(e, new F(i)),
        r.languages.registerDocumentHighlightProvider(e, new L(i)),
        r.languages.registerDefinitionProvider(e, new M(o, i)),
        r.languages.registerReferenceProvider(e, new A(o, i)),
        r.languages.registerDocumentSymbolProvider(e, new O(i)),
        r.languages.registerDocumentRangeFormattingEditProvider(e, new R(i)),
        r.languages.registerOnTypeFormattingEditProvider(e, new E(i)),
        r.languages.registerCodeActionProvider(e, new N(i)),
        r.languages.registerRenameProvider(e, new W(o, i)),
        r.languages.registerInlayHintsProvider(e, new H(i)),
        new D(o, s, e, i),
        i
      )
    }
    return ae(me)
  })()
  return moduleExports
})
