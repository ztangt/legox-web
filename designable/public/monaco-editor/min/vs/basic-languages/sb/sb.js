'use strict'
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define('vs/basic-languages/sb/sb', ['require', 'require'], (require) => {
  var moduleExports = (() => {
    var r = Object.defineProperty
    var i = Object.getOwnPropertyDescriptor
    var a = Object.getOwnPropertyNames
    var l = Object.prototype.hasOwnProperty
    var d = (o, e) => {
        for (var t in e) r(o, t, { get: e[t], enumerable: !0 })
      },
      c = (o, e, t, s) => {
        if ((e && typeof e == 'object') || typeof e == 'function')
          for (let n of a(e))
            !l.call(o, n) &&
              n !== t &&
              r(o, n, {
                get: () => e[n],
                enumerable: !(s = i(e, n)) || s.enumerable,
              })
        return o
      }
    var g = (o) => c(r({}, '__esModule', { value: !0 }), o)
    var m = {}
    d(m, { conf: () => p, language: () => f })
    var p = {
        comments: { lineComment: "'" },
        brackets: [
          ['(', ')'],
          ['[', ']'],
          ['If', 'EndIf'],
          ['While', 'EndWhile'],
          ['For', 'EndFor'],
          ['Sub', 'EndSub'],
        ],
        autoClosingPairs: [
          { open: '"', close: '"', notIn: ['string', 'comment'] },
          { open: '(', close: ')', notIn: ['string', 'comment'] },
          { open: '[', close: ']', notIn: ['string', 'comment'] },
        ],
      },
      f = {
        defaultToken: '',
        tokenPostfix: '.sb',
        ignoreCase: !0,
        brackets: [
          { token: 'delimiter.array', open: '[', close: ']' },
          { token: 'delimiter.parenthesis', open: '(', close: ')' },
          { token: 'keyword.tag-if', open: 'If', close: 'EndIf' },
          { token: 'keyword.tag-while', open: 'While', close: 'EndWhile' },
          { token: 'keyword.tag-for', open: 'For', close: 'EndFor' },
          { token: 'keyword.tag-sub', open: 'Sub', close: 'EndSub' },
        ],
        keywords: [
          'Else',
          'ElseIf',
          'EndFor',
          'EndIf',
          'EndSub',
          'EndWhile',
          'For',
          'Goto',
          'If',
          'Step',
          'Sub',
          'Then',
          'To',
          'While',
        ],
        tagwords: ['If', 'Sub', 'While', 'For'],
        operators: [
          '>',
          '<',
          '<>',
          '<=',
          '>=',
          'And',
          'Or',
          '+',
          '-',
          '*',
          '/',
          '=',
        ],
        identifier: /[a-zA-Z_][\w]*/,
        symbols: /[=><:+\-*\/%\.,]+/,
        escapes:
          /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        tokenizer: {
          root: [
            { include: '@whitespace' },
            [/(@identifier)(?=[.])/, 'type'],
            [
              /@identifier/,
              {
                cases: {
                  '@keywords': { token: 'keyword.$0' },
                  '@operators': 'operator',
                  '@default': 'variable.name',
                },
              },
            ],
            [
              /([.])(@identifier)/,
              { cases: { $2: ['delimiter', 'type.member'], '@default': '' } },
            ],
            [/\d*\.\d+/, 'number.float'],
            [/\d+/, 'number'],
            [/[()\[\]]/, '@brackets'],
            [
              /@symbols/,
              { cases: { '@operators': 'operator', '@default': 'delimiter' } },
            ],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string'],
          ],
          whitespace: [
            [/[ \t\r\n]+/, ''],
            [/(\').*$/, 'comment'],
          ],
          string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"C?/, 'string', '@pop'],
          ],
        },
      }
    return g(m)
  })()
  return moduleExports
})
