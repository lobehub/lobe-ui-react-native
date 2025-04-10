import type { HighlighterContextType } from './context'
import { createHighlighterCore, type HighlighterCore } from '@shikijs/core'
import React, { useMemo } from 'react'
import { createNativeEngine, isNativeEngineAvailable } from 'react-native-shiki-engine'
import rust from '@shikijs/langs/rust'
import javascript from '@shikijs/langs/javascript'
import markdown from '@shikijs/langs/markdown'
import bash from '@shikijs/langs/bash'
import mermaid from '@shikijs/langs/mermaid'
import html from '@shikijs/langs/html'
import css from '@shikijs/langs/css'

import { HighlighterContext } from './context'
import { themeConfig } from '../../theme'

let highlighterInstance: HighlighterCore | null = null
let initializationPromise: Promise<void> | null = null

const isDarkMode = true;

export function HighlighterProvider({ children }: { children: React.ReactNode }) {

  const theme = useMemo(() => themeConfig(isDarkMode), [isDarkMode]);
  
  const value = React.useMemo<HighlighterContextType>(
    () => ({
      initialize: async () => {
        if (!initializationPromise) {
          initializationPromise = (async () => {
            const available = isNativeEngineAvailable()
            if (!available)
              throw new Error('Native engine not available.')

            highlighterInstance = await createHighlighterCore({
              langs: [rust, javascript, markdown, bash, mermaid, html, css],
              themes: [theme],
              engine: createNativeEngine(),
            })
          })()
        }

        await initializationPromise
      },

      tokenize: (code: string, options: { lang: string}) => {
        if (!highlighterInstance) {
          throw new Error('Highlighter not initialized. Call initialize() first.')
        }
        return highlighterInstance.codeToTokensBase(code, options)
      },

      dispose: () => {
        if (highlighterInstance) {
          highlighterInstance.dispose()
          highlighterInstance = null
          initializationPromise = null
        }
      },
    }),
    [],
  )

  return <HighlighterContext.Provider value={value}>{children}</HighlighterContext.Provider>
}