import { Box, Text, Flex, Button, Menu, MenuButton, MenuList, MenuItem, Icon } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import React from 'react'
import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import userService from '../services/userService.js';

function Nav() {


  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const jwtToken = localStorage.getItem("jwtToken");

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');

    navigate('/');
    window.location.reload();
  };

  const handleProfile = () => {
    navigate(`/profile/${user._id}`);
  };


  useEffect(() => {
    if (jwtToken) {
      console.log("Inside user_details", jwtToken);
      userService.user_details(jwtToken)
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          setUser(null);
        });

    } else {
      setUser(null);
    }
  }, [jwtToken]);


  return (
    <Box bgColor={'#222831'} h={"fit-content"}>
      <Flex h={'full'} alignItems={'center'} mx={5}>
        <Flex justifyContent={'space-between'} w={'full'}>
          <Flex gap={5} p={5}>
            <Text color={'white'} fontSize={{ base: "1.5rem", md: "2rem" }} onClick={() => { navigate('/') }} cursor={'pointer'}>MyCity</Text>
            {user && user.city !== '-' && <Text bgColor={'#76ABAE'} alignSelf={'center'} py={1} px={3} rounded={'3rem'} fontSize={{ base: "0.75rem", sm: "1rem", md: "1.25rem" }} >
              {user.city}
            </Text>}
          </Flex>

          {user && (
            <Menu>
              <MenuButton color={'#222831'} fontWeight={'500'} borderRadius={'100'} fontSize={'xl'} bg="#76ABAE" h={'fit-content'} my={'auto'} px={5} py={3}>
                {user.firstName} {user.lastName}<ChevronDownIcon />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Nav