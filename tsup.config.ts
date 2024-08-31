import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'quake-fragment', // Replace it with your extension name
  entry: ['src/index.ts', 'src/index.js'],
  target: ['esnext'],
  format: ['iife'],
  outDir: 'dist',
  banner: {
    // Replace it with your extension's metadata
    js: `// Name: QuakeFragment
// ID: quakefragment
// Description: A better way to load fragment shaders for Gandi IDE.
// By: Fath11
// Original: Fath11
// License: MPL-2.0
`
  },
  platform: 'browser',
  clean: true
})
