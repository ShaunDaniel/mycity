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

    const jwtToken = localStorage.getItem("jwtToken");

    useEffect(() => {
      if (jwtToken) {
        console.log("Inside user_details",jwtToken);
          userService.user_details(jwtToken)
          .then((res) => {
            setUser(res.data.user);
          })
          .catch(() => {
            setUser(null);
          });
     
    } else {
      setUser(null);
    } }, [jwtToken]);
  
    
    return (
        <Box bgColor={'#222831'} h={"fit-content"}>
            <Flex h={'full'} alignItems={'center'} mx={5}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex  gap={5} p={5}>
                    <Text color={'white'} fontSize={{ base: "1.5rem", md: "2rem" }} onClick={()=>{navigate('/')}} cursor={'pointer'}>MyCity</Text>
                    {user && user.city!=='-' && <Text bgColor={'#76ABAE'} alignSelf={'center'} py={1} px={3} rounded={'3rem'} fontSize={{ base: "0.75rem", sm: "1rem", md: "1.25rem" }} >
                                        {user.city}
                                        </Text>}
                    </Flex>
                    {user && user.city!=='-' && user.city && <Logout/>}
                </Flex>
            </Flex>
        </Box>
    )
}

export default Nav