import React from 'react';
import { Icon } from '@chakra-ui/react'; 
import { MdLogout } from 'react-icons/md'; 
import { useNavigate } from 'react-router-dom';

function Logout() { 

    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        
        navigate('/');
        window.location.reload();
    };

    return(
        <Icon as={MdLogout} color={'white'} boxSize={6} alignSelf={'center'} cursor={'pointer'} onClick={handleLogout}></Icon>
    )
}

export default Logout;
