'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import theme from '@/theme';
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
} 