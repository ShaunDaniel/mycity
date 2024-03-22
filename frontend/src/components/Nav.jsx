import { Box, Text, Flex, Icon } from '@chakra-ui/react'
import React from 'react'
import Logout from './Logout.jsx'

function Nav() {
    const user_data = JSON.parse(sessionStorage.getItem('data'));
    
    console.log(user_data)
    return (
        <Box bgColor={'#222831'} h={"10vh"}>
            <Flex h={'full'} alignItems={'center'} mx={{ base: 5, md: 7, xl: 10 }}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex  gap={5} p={5}>
                    <Text color={'white'} fontSize={{base:'0.5rem',sm:'4rem',lg:'1.5rem',xl:'2rem'}} >MyCity</Text>
                    {user_data && <Text bgColor={'#76ABAE'} alignSelf={'center'} py={1} px={3} rounded={'1rem'} fontSize={{base:'0.25rem',sm:'3rem',lg:'1.25rem',xl:'1rem'}} >{user_data.city}</Text>}
                    </Flex>
                    {user_data && <Logout/>}

                </Flex>
            </Flex>
        </Box>
    )
}

export default Nav