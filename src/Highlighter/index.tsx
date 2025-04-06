import type { ThemedToken } from '@shikijs/core'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { isNativeEngineAvailable } from 'react-native-shiki-engine'
import { TokenDisplay } from './TokenDisplay'
import { HighlighterProvider } from './contexts/highlighter'
import { useHighlighter } from './hooks/useHighlighter'
import { styles } from './style'
import languageMap from './hooks/languageMap'

export const FALLBACK_LANG = 'txt';

interface HighlighterProps {
  code: string
  lang: string
}


const Highlighter: React.FC<HighlighterProps> = ({ code, lang = 'markdown' }) => {

  const language = lang.toLowerCase();

  const matchedLanguage = useMemo(
    () => (languageMap.includes(language as any) ? language : FALLBACK_LANG),
    [language],
  );


  const [tokens, setTokens] = useState<ThemedToken[][]>([])
  const highlighter = useHighlighter()
  

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const available = isNativeEngineAvailable()

        if (!available)
          throw new Error('Native engine not available.')

        await highlighter.initialize()

        const tokenized = highlighter.tokenize(code, {
          lang: matchedLanguage,
        })

        setTokens(tokenized)
      }
      catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Tokenization error:', err)
        }
        else {
          console.error('Unknown error:', err)
        }
      }
    }

    initializeApp()

    return () => {
      highlighter.dispose()
    }
  }, [highlighter])

  return (
    <View>
      <Text style={styles.languageTag}>{matchedLanguage}</Text>
      <TokenDisplay tokens={tokens} />
    </View>
  )
}

export default ({ code, lang }: HighlighterProps) => {
  return (
    <HighlighterProvider>
      <Highlighter code={code} lang={lang} />
    </HighlighterProvider>
  )
}