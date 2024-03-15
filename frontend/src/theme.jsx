import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    fonts: {
      heading: `'DM Sans Variable', sans-serif`,
      body: `'Open Sans Variable', sans-serif`,
    },
    initialColorMode: 'light',
    useSystemColorMode: false,
})

export default theme