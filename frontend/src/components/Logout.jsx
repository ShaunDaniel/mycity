import React from 'react'; // Import React
import { Icon } from '@chakra-ui/react'; // Import Icon component from Chakra UI
import { MdLogout } from 'react-icons/md'; // Import MdLogout icon from react-icons/md
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import userService from '../services/userService';

function Logout() { 

    const navigate = useNavigate();


    const handleLogout = () => {
        sessionStorage.clear();
        userService.logout().then(() => {
            
            navigate('/');
            window.location.reload();
        }).catch((err) => {
            console.error(err);
        });
    }


    return(
        <Icon as={MdLogout} color={'white'} boxSize={6} alignSelf={'center'} cursor={'pointer'} onClick={handleLogout}></Icon>
    )
}

export default Logout;
