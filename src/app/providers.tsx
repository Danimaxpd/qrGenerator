'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { QRProvider } from '@/context/qr-context'
import theme from '@/theme';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                <QRProvider>
                    {children}
                </QRProvider>
            </ChakraProvider>
        </CacheProvider>
    )
} 