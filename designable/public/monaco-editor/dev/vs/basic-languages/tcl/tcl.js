'use strict'
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define('vs/basic-languages/tcl/tcl', ['require'], (require) => {
  var moduleExports = (() => {
    var __defProp = Object.defineProperty
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor
    var __getOwnPropNames = Object.getOwnPropertyNames
    var __hasOwnProp = Object.prototype.hasOwnProperty
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true })
    }
    var __copyProps = (to, from, except, desc) => {
      if ((from && typeof from === 'object') || typeof from === 'function') {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, {
              get: () => from[key],
              enumerable:
                !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
            })
      }
      return to
    }
    var __toCommonJS = (mod) =>
      __copyProps(__defProp({}, '__esModule', { value: true }), mod)

    // src/basic-languages/tcl/tcl.ts
    var tcl_exports = {}
    __export(tcl_exports, {
      conf: () => conf,
      language: () => language,
    })
    var conf = {
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
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    }
    var language = {
      tokenPostfix: '.tcl',
      specialFunctions: [
        'set',
        'unset',
        'rename',
        'variable',
        'proc',
        'coroutine',
        'foreach',
        'incr',
        'append',
        'lappend',
        'linsert',
        'lreplace',
      ],
      mainFunctions: [
        'if',
        'then',
        'elseif',
        'else',
        'case',
        'switch',
        'while',
        'for',
        'break',
        'continue',
        'return',
        'package',
        'namespace',
        'catch',
        'exit',
        'eval',
        'expr',
        'uplevel',
        'upvar',
      ],
      builtinFunctions: [
        'file',
        'info',
        'concat',
        'join',
        'lindex',
        'list',
        'llength',
        'lrange',
        'lsearch',
        'lsort',
        'split',
        'array',
        'parray',
        'binary',
        'format',
        'regexp',
        'regsub',
        'scan',
        'string',
        'subst',
        'dict',
        'cd',
        'clock',
        'exec',
        'glob',
        'pid',
        'pwd',
        'close',
        'eof',
        'fblocked',
        'fconfigure',
        'fcopy',
        'fileevent',
        'flush',
        'gets',
        'open',
        'puts',
        'read',
        'seek',
        'socket',
        'tell',
        'interp',
        'after',
        'auto_execok',
        'auto_load',
        'auto_mkindex',
        'auto_reset',
        'bgerror',
        'error',
        'global',
        'history',
        'load',
        'source',
        'time',
        'trace',
        'unknown',
        'unset',
        'update',
        'vwait',
        'winfo',
        'wm',
        'bind',
        'event',
        'pack',
        'place',
        'grid',
        'font',
        'bell',
        'clipboard',
        'destroy',
        'focus',
        'grab',
        'lower',
        'option',
        'raise',
        'selection',
        'send',
        'tk',
        'tkwait',
        'tk_bisque',
        'tk_focusNext',
        'tk_focusPrev',
        'tk_focusFollowsMouse',
        'tk_popup',
        'tk_setPalette',
      ],
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
      brackets: [
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.square' },
      ],
      escapes:
        /\\(?:[abfnrtv\\"'\[\]\{\};\$]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      variables: /(?:\$+(?:(?:\:\:?)?[a-zA-Z_]\w*)+)/,
      tokenizer: {
        root: [
          [
            /[a-zA-Z_]\w*/,
            {
              cases: {
                '@specialFunctions': {
                  token: 'keyword.flow',
                  next: '@specialFunc',
                },
                '@mainFunctions': 'keyword',
                '@builtinFunctions': 'variable',
                '@default': 'operator.scss',
              },
            },
          ],
          [/\s+\-+(?!\d|\.)\w*|{\*}/, 'metatag'],
          { include: '@whitespace' },
          [/[{}()\[\]]/, '@brackets'],
          [/@symbols/, 'operator'],
          [/\$+(?:\:\:)?\{/, { token: 'identifier', next: '@nestedVariable' }],
          [/@variables/, 'type.identifier'],
          [/\.(?!\d|\.)[\w\-]*/, 'operator.sql'],
          [/\d+(\.\d+)?/, 'number'],
          [/\d+/, 'number'],
          [/;/, 'delimiter'],
          [/"/, { token: 'string.quote', bracket: '@open', next: '@dstring' }],
          [/'/, { token: 'string.quote', bracket: '@open', next: '@sstring' }],
        ],
        dstring: [
          [/\[/, { token: '@brackets', next: '@nestedCall' }],
          [/\$+(?:\:\:)?\{/, { token: 'identifier', next: '@nestedVariable' }],
          [/@variables/, 'type.identifier'],
          [/[^\\$\[\]"]+/, 'string'],
          [/@escapes/, 'string.escape'],
          [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
        ],
        sstring: [
          [/\[/, { token: '@brackets', next: '@nestedCall' }],
          [/\$+(?:\:\:)?\{/, { token: 'identifier', next: '@nestedVariable' }],
          [/@variables/, 'type.identifier'],
          [/[^\\$\[\]']+/, 'string'],
          [/@escapes/, 'string.escape'],
          [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
        ],
        whitespace: [
          [/[ \t\r\n]+/, 'white'],
          [/#.*\\$/, { token: 'comment', next: '@newlineComment' }],
          [/#.*(?!\\)$/, 'comment'],
        ],
        newlineComment: [
          [/.*\\$/, 'comment'],
          [/.*(?!\\)$/, { token: 'comment', next: '@pop' }],
        ],
        nestedVariable: [
          [/[^\{\}\$]+/, 'type.identifier'],
          [/\}/, { token: 'identifier', next: '@pop' }],
        ],
        nestedCall: [
          [/\[/, { token: '@brackets', next: '@nestedCall' }],
          [/\]/, { token: '@brackets', next: '@pop' }],
          { include: 'root' },
        ],
        specialFunc: [
          [/"/, { token: 'string', next: '@dstring' }],
          [/'/, { token: 'string', next: '@sstring' }],
          [/\S+/, { token: 'type', next: '@pop' }],
        ],
      },
    }
    return __toCommonJS(tcl_exports)
  })()
  return moduleExports
})
