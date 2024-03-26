import { Box, Text, Flex } from '@chakra-ui/react'
import React from 'react'
import Logout from './Logout.jsx'
import userService from '../services/userService.js'
import { useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function Nav() {
    const [user_data, setUserData] = useState({});
    const location = useLocation();
    const navigate = useNavigate();



    useEffect(() => {
        const userDataLoad = async () => {
            if(sessionStorage.getItem('user-data') === null){
                try {
                    const data = await userService.user_details();
                    if(data.status !== 404){
                        console.log("Inisde userDataLoad")
                        console.log(data.data)
                        return data.data;
                    }
                    else{
                        console.log("User not found")
                    }
                }catch (error) {
                    if (error.code === 'ECONNABORTED') {
                    } else {
                    }
                }
            }
            else{
                setUserData(JSON.parse(sessionStorage.getItem('user-data')));
                console.log(user_data)
            }
        }
        if (location.pathname === '/register/2' || location.pathname === '/register/1' || location.pathname === '/login'){
        } else {
            if (sessionStorage.getItem('user-data') === null) {
                try {
                    userDataLoad().then((data) => {
                        setUserData(data);
                    }).catch((err) => {
                        setUserData({city:'-'})
                                        })
                } catch (err) {
                    setUserData({city:'-'})
                }
            }
            setUserData(JSON.parse(sessionStorage.getItem('user-data')));
        }
    },[]);

    console.log(user_data)


    
    return (
        <Box bgColor={'#222831'} h={"10vh"}>
            <Flex h={'full'} alignItems={'center'} mx={{ base: 5, md: 7, xl: 10 }}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex  gap={5} p={5}>
                    <Text color={'white'} fontSize={{base:'0.5rem',sm:'4rem',lg:'1.5rem',xl:'2rem'}} onClick={()=>{navigate('/')}} cursor={'pointer'}>MyCity</Text>
                    {user_data && user_data.city!=='-' && <Text bgColor={'#76ABAE'} alignSelf={'center'} py={1} px={3} rounded={'3rem'} fontSize={{base:'0.25rem',sm:'3rem',lg:'1.25rem',xl:'1rem'}} >
                                        {user_data.city==='-' ? "Select City" : user_data.city}
                                        </Text>}
                    </Flex>
                    {user_data && user_data.city!=='-' && user_data.city && <Logout/>}
                </Flex>
            </Flex>
        </Box>
    )
}

export default Nav