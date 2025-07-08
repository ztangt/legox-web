import { loader } from '@monaco-editor/react'

const Registry = {
  cdn: '//cdn.jsdelivr.net/npm',
}

export const setNpmCDNRegistry = (registry: string) => {
  Registry.cdn = registry
  loader.config({
    paths: {
      vs: `${registry}/monaco-editor/min/vs`,
    },
  })
}

export const getNpmCDNRegistry = () => String(Registry.cdn).replace(/\/$/, '')
