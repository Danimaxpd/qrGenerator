import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'light' ? 'gray.50' : 'gray.900',
        color: props.colorMode === 'light' ? 'gray.800' : 'white',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        // Primary actions (Create, Submit, Save)
        solid: (props: { colorMode: string }) => ({
          bg: props.colorMode === 'light' ? 'gray.800' : 'white',
          color: props.colorMode === 'light' ? 'white' : 'gray.800',
          _hover: {
            bg: props.colorMode === 'light' ? 'gray.700' : 'gray.100',
          },
        }),
        // Secondary actions (Edit, Update)
        outline: (props: { colorMode: string }) => ({
          borderColor: props.colorMode === 'light' ? 'gray.200' : 'gray.600',
          color: props.colorMode === 'light' ? 'gray.800' : 'white',
          _hover: {
            bg: props.colorMode === 'light' ? 'gray.100' : 'gray.700',
          },
        }),
        // Dangerous actions (Delete)
        danger: {
          bg: 'red.500',
          color: 'white',
          _hover: {
            bg: 'red.600',
          },
        },
        // Subtle actions (Cancel, Back)
        ghost: (props: { colorMode: string }) => ({
          color: props.colorMode === 'light' ? 'gray.600' : 'gray.400',
          _hover: {
            bg: props.colorMode === 'light' ? 'gray.100' : 'gray.700',
          },
        }),
      },
      defaultProps: {
        variant: 'solid',
        size: 'md',
      },
    },
  },
});

export default theme;
