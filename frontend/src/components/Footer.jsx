import { Box, Text } from "@chakra-ui/react";

function Footer() {
    return (
        <Box bg="gray.200" py={4} textAlign="center">
            <Text>
                Made with ♥ by{" "}
                <a href="https://github.com/ShaunDaniel" target="_blank" rel="noopener noreferrer">
                    GitHub.com/ShaunDaniel
                </a>
            </Text>
        </Box>
    );
}

export default Footer;