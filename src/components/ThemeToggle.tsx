'use client';

import { IconButton, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

export const ThemeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <IconButton
            aria-label="Toggle theme"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            position="fixed"
            top={4}
            right={4}
            zIndex={999}
        />
    );
};