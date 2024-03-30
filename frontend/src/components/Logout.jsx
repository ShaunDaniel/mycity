import React from 'react';
import { Icon,Link } from '@chakra-ui/react'; 
import { MdLogout } from 'react-icons/md'; 
import { useNavigate } from 'react-router-dom';

function Logout() { 

    const navigate = useNavigate();


    const handleLogout = () => {
        // Clear the JWT token from the local storage
        localStorage.removeItem('jwtToken');
        navigate('/');
        window.location.reload();
    };

    return(
        <Icon as={MdLogout} color={'white'} boxSize={6} alignSelf={'center'} cursor={'pointer'} onClick={()=>{handleLogout()}}></Icon>
    )
}

export default Logout;
