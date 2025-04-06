import type { ThemedToken } from '@shikijs/core'
import { createContext } from 'react'

export interface HighlighterContextType {
  initialize: () => Promise<void>
  tokenize: (code: string, options: { lang: string}) => ThemedToken[][]
  dispose: () => void
}

export const HighlighterContext = createContext<HighlighterContextType | null>(null)