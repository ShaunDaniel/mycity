import React, { useState,useEffect, useContext } from 'react'
import { useNavigate} from 'react-router-dom';
import { Box, Stack, FormControl, FormLabel, FormErrorMessage,Input, Spinner, Button, Text, Heading } from '@chakra-ui/react';
import userService from '../services/userService';
import UserContext from './UserContext';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFormError, setIsFormError] = useState(false);
  const [googleAccountError, setGoogleAccountError] = useState(false);
  const [formIsEmpty, setFormIsEmpty] = useState(false);
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
      setFormIsEmpty(true);
      setTimeout(() => {
        setFormIsEmpty(false);
      }, 5000)
      return;
    }

    userService.isGoogleAccount(credentials.email).then((res) => {
      if(res.data.exists){
        setGoogleAccountError(true);
        setIsLoading(false);
        return;
      }
      else{
        setGoogleAccountError(false);
        userService.login(credentials, { withCredentials: true }).then((res) => {

          if (res.status !== 401 && res.status !== 500) {
            navigate('/');
            window.location.reload();
            localStorage.setItem('jwtToken', `${res.data.jwtToken}`);
            
            setIsFormError(false);
          } else{
            setIsLoading(false);
            setIsFormError(true);
          }
        }).catch((err) => {
          setIsLoading(false);
          setIsFormError(true);
        });
      }
    }).catch((err) => {}  );
    
    

  }


  return (
    <Box maxW={{ base: 'lg', md: "md", lg: 'sm' }} h={'fit-content'} mx="auto" mt={8} p={4}>
      <Stack spacing={4}>
        <Heading>Login</Heading>
        <FormControl isInvalid={isFormError || formIsEmpty || googleAccountError }>
          {isFormError && <FormErrorMessage>Invalid Credentials</FormErrorMessage>}
          {formIsEmpty && <FormErrorMessage>Fill all the details before submitting</FormErrorMessage>}
          {googleAccountError && <FormErrorMessage>Account already connected with Google!<br/> Please Login using Google</FormErrorMessage>}

        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input id='email' type="email" placeholder="Enter your email" onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input id="password" type="password" placeholder="Enter your password" onChange={handleChange} />
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
        <Button colorScheme="red" size="lg"onClick={() => { window.location.href = `${process.env.REACT_APP_API_URL}v1/auth/google` }}>
          Sign in with Google
        </Button>
        <Text textAlign="center">New user? <a href="/register/1">Register here</a></Text>
      </Stack>
    </Box>
  )
}

export default Login