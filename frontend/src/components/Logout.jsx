import React from 'react';
import { Icon,Link } from '@chakra-ui/react'; 
import { MdLogout } from 'react-icons/md'; 
import { useNavigate } from 'react-router-dom';

function Logout() { 

    const navigate = useNavigate();


    const handleLogout = () => {
        // Clear the JWT token from the cookie
        document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Navigate to the home page and reload
        navigate('/');
        window.location.reload();
    };

    return(
        <Icon as={MdLogout} color={'white'} boxSize={6} alignSelf={'center'} cursor={'pointer'} onClick={()=>{handleLogout()}}></Icon>
    )
}

export default Logout;
