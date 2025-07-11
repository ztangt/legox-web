'use strict'
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define('vs/basic-languages/flow9/flow9', ['require', 'require'], (require) => {
  var moduleExports = (() => {
    var s = Object.defineProperty
    var r = Object.getOwnPropertyDescriptor
    var a = Object.getOwnPropertyNames
    var l = Object.prototype.hasOwnProperty
    var c = (o, e) => {
        for (var t in e) s(o, t, { get: e[t], enumerable: !0 })
      },
      m = (o, e, t, i) => {
        if ((e && typeof e == 'object') || typeof e == 'function')
          for (let n of a(e))
            !l.call(o, n) &&
              n !== t &&
              s(o, n, {
                get: () => e[n],
                enumerable: !(i = r(e, n)) || i.enumerable,
              })
        return o
      }
    var p = (o) => m(s({}, '__esModule', { value: !0 }), o)
    var u = {}
    c(u, { conf: () => g, language: () => f })
    var g = {
        comments: { blockComment: ['/*', '*/'], lineComment: '//' },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
        autoClosingPairs: [
          { open: '{', close: '}', notIn: ['string'] },
          { open: '[', close: ']', notIn: ['string'] },
          { open: '(', close: ')', notIn: ['string'] },
          { open: '"', close: '"', notIn: ['string'] },
          { open: "'", close: "'", notIn: ['string'] },
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '<', close: '>' },
        ],
      },
      f = {
        defaultToken: '',
        tokenPostfix: '.flow',
        keywords: [
          'import',
          'require',
          'export',
          'forbid',
          'native',
          'if',
          'else',
          'cast',
          'unsafe',
          'switch',
          'default',
        ],
        types: [
          'io',
          'mutable',
          'bool',
          'int',
          'double',
          'string',
          'flow',
          'void',
          'ref',
          'true',
          'false',
          'with',
        ],
        operators: [
          '=',
          '>',
          '<',
          '<=',
          '>=',
          '==',
          '!',
          '!=',
          ':=',
          '::=',
          '&&',
          '||',
          '+',
          '-',
          '*',
          '/',
          '@',
          '&',
          '%',
          ':',
          '->',
          '\\',
          '$',
          '??',
          '^',
        ],
        symbols: /[@$=><!~?:&|+\-*\\\/\^%]+/,
        escapes:
          /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        tokenizer: {
          root: [
            [
              /[a-zA-Z_]\w*/,
              {
                cases: {
                  '@keywords': 'keyword',
                  '@types': 'type',
                  '@default': 'identifier',
                },
              },
            ],
            { include: '@whitespace' },
            [/[{}()\[\]]/, 'delimiter'],
            [/[<>](?!@symbols)/, 'delimiter'],
            [
              /@symbols/,
              { cases: { '@operators': 'delimiter', '@default': '' } },
            ],
            [
              /((0(x|X)[0-9a-fA-F]*)|(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)/,
              'number',
            ],
            [/[;,.]/, 'delimiter'],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string'],
          ],
          whitespace: [
            [/[ \t\r\n]+/, ''],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],
          comment: [
            [/[^\/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[\/*]/, 'comment'],
          ],
          string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop'],
          ],
        },
      }
    return p(u)
  })()
  return moduleExports
})
