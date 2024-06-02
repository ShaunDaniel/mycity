import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Stack, FormControl, FormLabel, FormErrorMessage, Input, Button, Text, Heading } from '@chakra-ui/react';
import userService from '../services/userService';
import UserContext from '../components/UserContext';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  }

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
    if (credentials.email.trim() === '' || credentials.password.trim() === '') {
      setIsLoading(false);
      setFormError('Please fill all the details before submitting!');
      setTimeout(() => {
        setFormError('')
      }, 5000)
      return;
    }

    userService.userExists(credentials.email).then((res) => {
      if (!res.data.exists) {
        setIsLoading(false);
        setFormError('User not registered!');
      }
      else{
        userService.isGoogleAccount(credentials.email).then((res) => {
          if (res.data.exists) {
            setFormError('Account already connected with Google! Please Login using Google');
            setIsLoading(false);
            return;
          }
          else {
            setFormError('');
            userService.login(credentials, { withCredentials: true }).then((res) => {

              if (res.status !== 401 && res.status !== 500) {
                navigate('/');
                window.location.reload();
                localStorage.setItem('jwtToken', `${res.data.jwtToken}`);
                setFormError('');
                } else {
                setIsLoading(false);
                setFormError('Invalid Credentials');
              }
            }).catch((err) => {
              setIsLoading(false);
              setFormError('Invalid Credentials');
            });
          }
        }).catch((err) => { })
        };
      }); 

    



  
    }


  return (
    <Box maxW={{ base: '3xl', md: "2xl", lg: 'md' }} mx="auto" mt={8} p={4}>
      <Stack spacing={4} fontSize={{base: '3xl', md: "2rem", lg: 'md'}}>
        <Heading fontSize={{base: '3rem', md: "3rem", lg: '2rem'}}>Login</Heading>
        <FormControl isInvalid={formError.length>0}>
          {
            <FormControl isInvalid={!!formError}>
              {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
            </FormControl>
}
        </FormControl>

        <FormControl>
          <FormLabel fontSize={{base: '2rem', md: "2rem", lg: 'md'}}>Email</FormLabel>
          <Input id='email' type="email" placeholder="Enter your email" fontSize={{base: '2rem', md: "2rem", lg: '1rem'}} p={{base:'2rem',md:'2rem',xl:'1rem'}} borderWidth={'medium'} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel fontSize={{base: '2rem', md: "2rem", lg: 'md'}}>Password</FormLabel>
          <Input id="password" type="password" placeholder="Enter your password" onChange={handleChange} fontSize={{base: '2rem', md: "2rem", lg: '1rem'}} p={{base:'2rem',md:'2rem',xl:'1rem'}} borderWidth={'medium'}/>
        </FormControl>
        <Button
          colorScheme="blue"
          fontSize={{ base: "xx-large", lg: "md" }}
          py={{ base: "2rem", lg: "1rem" }}
          type="submit"
          width="full"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Logging in"
        >
          Login
        </Button>
        <Text textAlign="center">Or sign in with</Text>
        <Button colorScheme="red" size="lg" onClick={() => { window.location.href = `${process.env.REACT_APP_API_URL}v1/auth/google` }}>
          Sign in with Google
        </Button>
        <Text textAlign="center">New user? <strong style={{ cursor: 'pointer' }} onClick={() => { navigate('/register/1') }}>Register here</strong></Text>
      </Stack>
    </Box>
  )
}

export default Login