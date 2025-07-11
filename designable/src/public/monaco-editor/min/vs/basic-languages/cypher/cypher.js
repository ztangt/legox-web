'use strict'
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define('vs/basic-languages/cypher/cypher', ['require', 'require'], (
  require
) => {
  var moduleExports = (() => {
    var s = Object.defineProperty
    var r = Object.getOwnPropertyDescriptor
    var a = Object.getOwnPropertyNames
    var l = Object.prototype.hasOwnProperty
    var c = (i, e) => {
        for (var n in e) s(i, n, { get: e[n], enumerable: !0 })
      },
      g = (i, e, n, o) => {
        if ((e && typeof e == 'object') || typeof e == 'function')
          for (let t of a(e))
            !l.call(i, t) &&
              t !== n &&
              s(i, t, {
                get: () => e[t],
                enumerable: !(o = r(e, t)) || o.enumerable,
              })
        return i
      }
    var p = (i) => g(s({}, '__esModule', { value: !0 }), i)
    var u = {}
    c(u, { conf: () => d, language: () => m })
    var d = {
        comments: { lineComment: '//', blockComment: ['/*', '*/'] },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '`', close: '`' },
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '`', close: '`' },
        ],
      },
      m = {
        defaultToken: '',
        tokenPostfix: '.cypher',
        ignoreCase: !0,
        brackets: [
          { open: '{', close: '}', token: 'delimiter.curly' },
          { open: '[', close: ']', token: 'delimiter.bracket' },
          { open: '(', close: ')', token: 'delimiter.parenthesis' },
        ],
        keywords: [
          'ALL',
          'AND',
          'AS',
          'ASC',
          'ASCENDING',
          'BY',
          'CALL',
          'CASE',
          'CONTAINS',
          'CREATE',
          'DELETE',
          'DESC',
          'DESCENDING',
          'DETACH',
          'DISTINCT',
          'ELSE',
          'END',
          'ENDS',
          'EXISTS',
          'IN',
          'IS',
          'LIMIT',
          'MANDATORY',
          'MATCH',
          'MERGE',
          'NOT',
          'ON',
          'ON',
          'OPTIONAL',
          'OR',
          'ORDER',
          'REMOVE',
          'RETURN',
          'SET',
          'SKIP',
          'STARTS',
          'THEN',
          'UNION',
          'UNWIND',
          'WHEN',
          'WHERE',
          'WITH',
          'XOR',
          'YIELD',
        ],
        builtinLiterals: ['true', 'TRUE', 'false', 'FALSE', 'null', 'NULL'],
        builtinFunctions: [
          'abs',
          'acos',
          'asin',
          'atan',
          'atan2',
          'avg',
          'ceil',
          'coalesce',
          'collect',
          'cos',
          'cot',
          'count',
          'degrees',
          'e',
          'endNode',
          'exists',
          'exp',
          'floor',
          'head',
          'id',
          'keys',
          'labels',
          'last',
          'left',
          'length',
          'log',
          'log10',
          'lTrim',
          'max',
          'min',
          'nodes',
          'percentileCont',
          'percentileDisc',
          'pi',
          'properties',
          'radians',
          'rand',
          'range',
          'relationships',
          'replace',
          'reverse',
          'right',
          'round',
          'rTrim',
          'sign',
          'sin',
          'size',
          'split',
          'sqrt',
          'startNode',
          'stDev',
          'stDevP',
          'substring',
          'sum',
          'tail',
          'tan',
          'timestamp',
          'toBoolean',
          'toFloat',
          'toInteger',
          'toLower',
          'toString',
          'toUpper',
          'trim',
          'type',
        ],
        operators: [
          '+',
          '-',
          '*',
          '/',
          '%',
          '^',
          '=',
          '<>',
          '<',
          '>',
          '<=',
          '>=',
          '->',
          '<-',
          '-->',
          '<--',
        ],
        escapes: /\\(?:[tbnrf\\"'`]|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        digits: /\d+/,
        octaldigits: /[0-7]+/,
        hexdigits: /[0-9a-fA-F]+/,
        tokenizer: {
          root: [[/[{}[\]()]/, '@brackets'], { include: 'common' }],
          common: [
            { include: '@whitespace' },
            { include: '@numbers' },
            { include: '@strings' },
            [/:[a-zA-Z_][\w]*/, 'type.identifier'],
            [
              /[a-zA-Z_][\w]*(?=\()/,
              { cases: { '@builtinFunctions': 'predefined.function' } },
            ],
            [
              /[a-zA-Z_$][\w$]*/,
              {
                cases: {
                  '@keywords': 'keyword',
                  '@builtinLiterals': 'predefined.literal',
                  '@default': 'identifier',
                },
              },
            ],
            [/`/, 'identifier.escape', '@identifierBacktick'],
            [/[;,.:|]/, 'delimiter'],
            [
              /[<>=%+\-*/^]+/,
              { cases: { '@operators': 'delimiter', '@default': '' } },
            ],
          ],
          numbers: [
            [/-?(@digits)[eE](-?(@digits))?/, 'number.float'],
            [/-?(@digits)?\.(@digits)([eE]-?(@digits))?/, 'number.float'],
            [/-?0x(@hexdigits)/, 'number.hex'],
            [/-?0(@octaldigits)/, 'number.octal'],
            [/-?(@digits)/, 'number'],
          ],
          strings: [
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/'([^'\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@stringDouble'],
            [/'/, 'string', '@stringSingle'],
          ],
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],
          comment: [
            [/\/\/.*/, 'comment'],
            [/[^/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[/*]/, 'comment'],
          ],
          stringDouble: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string'],
            [/\\./, 'string.invalid'],
            [/"/, 'string', '@pop'],
          ],
          stringSingle: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string'],
            [/\\./, 'string.invalid'],
            [/'/, 'string', '@pop'],
          ],
          identifierBacktick: [
            [/[^\\`]+/, 'identifier.escape'],
            [/@escapes/, 'identifier.escape'],
            [/\\./, 'identifier.escape.invalid'],
            [/`/, 'identifier.escape', '@pop'],
          ],
        },
      }
    return p(u)
  })()
  return moduleExports
})
