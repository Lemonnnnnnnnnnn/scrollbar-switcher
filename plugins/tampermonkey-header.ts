import type { Plugin } from 'vite'

// Tampermonkey 用户脚本配置
export const TAMPERMONKEY_CONFIG = {
  name: 'Scrollbar Switcher',
  namespace: 'http://tampermonkey.net/',
  version: '1.0.0',
  description: 'Toggle webpage scrollbar visibility with a floating button',
  author: 'Your Name',
  match: ['*://*/*'],
  grant: 'none',
  runAt: 'document-end'
} as const

// 生成 Tampermonkey 脚本头部
export const generateTampermonkeyHeader = (): string => {
  const config = TAMPERMONKEY_CONFIG
  return `// ==UserScript==
// @name         ${config.name}
// @namespace    ${config.namespace}
// @version      ${config.version}
// @description  ${config.description}
// @author       ${config.author}
${config.match.map(match => `// @match        ${match}`).join('\n')}
// @grant        ${config.grant}
// @run-at       ${config.runAt}
// ==/UserScript==

`
}

export function tampermonkeyHeaderPlugin(): Plugin {
  return {
    name: 'tampermonkey-header',
    generateBundle(options, bundle) {
      // 删除 CSS 文件
      Object.keys(bundle).forEach(key => {
        if (key.endsWith('.css')) {
          delete bundle[key]
        }
      })
      
      // 找到主要的 JS 文件并添加头部
      const jsFile = Object.keys(bundle).find(key => key.endsWith('.js'))
      if (jsFile && bundle[jsFile] && bundle[jsFile].type === 'chunk') {
        const chunk = bundle[jsFile] as any
        // 在 JS 文件开头添加 tampermonkey 头部
        const header = generateTampermonkeyHeader()
        const wrapperStart = `(function() {
    'use strict';
    
`
        const wrapperEnd = `
})();`
        
        chunk.code = header + wrapperStart + chunk.code + wrapperEnd
      }
    }
  }
} 