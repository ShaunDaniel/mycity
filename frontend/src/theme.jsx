import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    fonts: {
      heading: `'Geologica', sans-serif`,
      body: `'Geologica', sans-serif`,
    },
    initialColorMode: 'light',
    useSystemColorMode: false,
})

export default theme