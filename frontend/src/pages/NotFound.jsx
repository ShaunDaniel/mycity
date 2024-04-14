import { Box, Button, Center,Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
    return (
    <Center h="100vh">
      <Box textAlign="center">
        <Image src='./images/404.webp' w={"xl"}></Image>
        <Button my={5} colorScheme='blue' onClick={()=>{navigate('/')}}>Go Home</Button>
      </Box>
    </Center>
  );
}

export default NotFound;