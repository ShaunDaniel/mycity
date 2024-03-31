import { Box, Text, Flex } from '@chakra-ui/react'
import React from 'react'
import Logout from './Logout.jsx'
import { useEffect,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import userService from '../services/userService.js';

function Nav() {

    
    const {user,setUser} = useContext(UserContext);
    const navigate = useNavigate();

    
    return (
        <Box bgColor={'#222831'} h={"10vh"}>
            <Flex h={'full'} alignItems={'center'} mx={{ base: 5, md: 7, xl: 10 }}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex  gap={5} p={5}>
                    <Text color={'white'} fontSize={{base:'0.5rem',sm:'4rem',lg:'1.5rem',xl:'2rem'}} onClick={()=>{navigate('/')}} cursor={'pointer'}>MyCity</Text>
                    {user && user.city!=='-' && <Text bgColor={'#76ABAE'} alignSelf={'center'} py={1} px={3} rounded={'3rem'} fontSize={{base:'0.25rem',sm:'3rem',lg:'1.25rem',xl:'1rem'}} >
                                        {user.city==='-' ? "Select City" : user.city}
                                        </Text>}
                    </Flex>
                    {user && user.city!=='-' && user.city && <Logout/>}
                </Flex>
            </Flex>
        </Box>
    )
}

export default Nav