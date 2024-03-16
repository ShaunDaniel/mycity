import { Box, Text, Flex } from '@chakra-ui/react'
import React from 'react'

function Nav() {
    return (
        <Box bgColor={'#222831'} h={"10vh"}>
            <Flex h={'full'} alignItems={'center'} mx={{ base: 5, md: 7, xl: 10 }}>
                <Flex gap={5} p={5}>
                    <Text color={'white'} fontSize={{base:'0.5rem',sm:'4rem',lg:'1.5rem',xl:'2rem'}} >MyCity</Text>
                    <Text bgColor={'#76ABAE'} alignSelf={'center'} py={1} px={3} rounded={'1rem'} fontSize={{base:'0.25rem',sm:'3rem',lg:'1.25rem',xl:'1rem'}} >Raipur</Text>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Nav