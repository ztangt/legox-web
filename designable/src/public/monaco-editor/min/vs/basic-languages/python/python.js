'use strict'
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define('vs/basic-languages/python/python', ['require', 'require'], (
  require
) => {
  var moduleExports = (() => {
    var d = Object.create
    var i = Object.defineProperty
    var m = Object.getOwnPropertyDescriptor
    var _ = Object.getOwnPropertyNames
    var u = Object.getPrototypeOf,
      f = Object.prototype.hasOwnProperty
    var b = ((e) =>
      typeof require != 'undefined'
        ? require
        : typeof Proxy != 'undefined'
        ? new Proxy(e, {
            get: (n, t) => (typeof require != 'undefined' ? require : n)[t],
          })
        : e)(function (e) {
      if (typeof require != 'undefined') return require.apply(this, arguments)
      throw new Error('Dynamic require of "' + e + '" is not supported')
    })
    var h = (e, n) => () => (
        n || e((n = { exports: {} }).exports, n), n.exports
      ),
      y = (e, n) => {
        for (var t in n) i(e, t, { get: n[t], enumerable: !0 })
      },
      o = (e, n, t, a) => {
        if ((n && typeof n == 'object') || typeof n == 'function')
          for (let r of _(n))
            !f.call(e, r) &&
              r !== t &&
              i(e, r, {
                get: () => n[r],
                enumerable: !(a = m(n, r)) || a.enumerable,
              })
        return e
      },
      l = (e, n, t) => (o(e, n, 'default'), t && o(t, n, 'default')),
      c = (e, n, t) => (
        (t = e != null ? d(u(e)) : {}),
        o(
          n || !e || !e.__esModule
            ? i(t, 'default', { value: e, enumerable: !0 })
            : t,
          e
        )
      ),
      x = (e) => o(i({}, '__esModule', { value: !0 }), e)
    var g = h((v, p) => {
      var w = c(b('vs/editor/editor.api'))
      p.exports = w
    })
    var D = {}
    y(D, { conf: () => k, language: () => $ })
    var s = {}
    l(s, c(g()))
    var k = {
        comments: { lineComment: '#', blockComment: ["'''", "'''"] },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"', notIn: ['string'] },
          { open: "'", close: "'", notIn: ['string', 'comment'] },
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
        onEnterRules: [
          {
            beforeText: new RegExp(
              '^\\s*(?:def|class|for|if|elif|else|while|try|with|finally|except|async|match|case).*?:\\s*$'
            ),
            action: { indentAction: s.languages.IndentAction.Indent },
          },
        ],
        folding: {
          offSide: !0,
          markers: {
            start: new RegExp('^\\s*#region\\b'),
            end: new RegExp('^\\s*#endregion\\b'),
          },
        },
      },
      $ = {
        defaultToken: '',
        tokenPostfix: '.python',
        keywords: [
          'False',
          'None',
          'True',
          '_',
          'and',
          'as',
          'assert',
          'async',
          'await',
          'break',
          'case',
          'class',
          'continue',
          'def',
          'del',
          'elif',
          'else',
          'except',
          'exec',
          'finally',
          'for',
          'from',
          'global',
          'if',
          'import',
          'in',
          'is',
          'lambda',
          'match',
          'nonlocal',
          'not',
          'or',
          'pass',
          'print',
          'raise',
          'return',
          'try',
          'while',
          'with',
          'yield',
          'int',
          'float',
          'long',
          'complex',
          'hex',
          'abs',
          'all',
          'any',
          'apply',
          'basestring',
          'bin',
          'bool',
          'buffer',
          'bytearray',
          'callable',
          'chr',
          'classmethod',
          'cmp',
          'coerce',
          'compile',
          'complex',
          'delattr',
          'dict',
          'dir',
          'divmod',
          'enumerate',
          'eval',
          'execfile',
          'file',
          'filter',
          'format',
          'frozenset',
          'getattr',
          'globals',
          'hasattr',
          'hash',
          'help',
          'id',
          'input',
          'intern',
          'isinstance',
          'issubclass',
          'iter',
          'len',
          'locals',
          'list',
          'map',
          'max',
          'memoryview',
          'min',
          'next',
          'object',
          'oct',
          'open',
          'ord',
          'pow',
          'print',
          'property',
          'reversed',
          'range',
          'raw_input',
          'reduce',
          'reload',
          'repr',
          'reversed',
          'round',
          'self',
          'set',
          'setattr',
          'slice',
          'sorted',
          'staticmethod',
          'str',
          'sum',
          'super',
          'tuple',
          'type',
          'unichr',
          'unicode',
          'vars',
          'xrange',
          'zip',
          '__dict__',
          '__methods__',
          '__members__',
          '__class__',
          '__bases__',
          '__name__',
          '__mro__',
          '__subclasses__',
          '__init__',
          '__import__',
        ],
        brackets: [
          { open: '{', close: '}', token: 'delimiter.curly' },
          { open: '[', close: ']', token: 'delimiter.bracket' },
          { open: '(', close: ')', token: 'delimiter.parenthesis' },
        ],
        tokenizer: {
          root: [
            { include: '@whitespace' },
            { include: '@numbers' },
            { include: '@strings' },
            [/[,:;]/, 'delimiter'],
            [/[{}\[\]()]/, '@brackets'],
            [/@[a-zA-Z_]\w*/, 'tag'],
            [
              /[a-zA-Z_]\w*/,
              { cases: { '@keywords': 'keyword', '@default': 'identifier' } },
            ],
          ],
          whitespace: [
            [/\s+/, 'white'],
            [/(^#.*$)/, 'comment'],
            [/'''/, 'string', '@endDocString'],
            [/"""/, 'string', '@endDblDocString'],
          ],
          endDocString: [
            [/[^']+/, 'string'],
            [/\\'/, 'string'],
            [/'''/, 'string', '@popall'],
            [/'/, 'string'],
          ],
          endDblDocString: [
            [/[^"]+/, 'string'],
            [/\\"/, 'string'],
            [/"""/, 'string', '@popall'],
            [/"/, 'string'],
          ],
          numbers: [
            [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
            [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, 'number'],
          ],
          strings: [
            [/'$/, 'string.escape', '@popall'],
            [/'/, 'string.escape', '@stringBody'],
            [/"$/, 'string.escape', '@popall'],
            [/"/, 'string.escape', '@dblStringBody'],
          ],
          stringBody: [
            [/[^\\']+$/, 'string', '@popall'],
            [/[^\\']+/, 'string'],
            [/\\./, 'string'],
            [/'/, 'string.escape', '@popall'],
            [/\\$/, 'string'],
          ],
          dblStringBody: [
            [/[^\\"]+$/, 'string', '@popall'],
            [/[^\\"]+/, 'string'],
            [/\\./, 'string'],
            [/"/, 'string.escape', '@popall'],
            [/\\$/, 'string'],
          ],
        },
      }
    return x(D)
  })()
  return moduleExports
})
