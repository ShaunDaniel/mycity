import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Stack, FormControl, FormLabel, FormErrorMessage, Alert, AlertIcon, AlertTitle, AlertDescription, Input, Spinner, Button, Text, Heading } from '@chakra-ui/react';
import userService from '../services/userService';
import axios from 'axios';

function Login() {

  const [isLoading, setIsLoading] = useState(false);
  const [isFormError, setIsFormError] = useState(false);
  const [formIsEmpty, setFormIsEmpty] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  }

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
    console.log(credentials)
    if (credentials.email.trim() === '' || credentials.password.trim() === '') {
      setIsLoading(false);
      setFormIsEmpty(true);
      setTimeout(() => {
        setFormIsEmpty(false);
      }, 5000)
      return;
    }

    userService.login(credentials, { withCredentials: true }).then((res) => {
      if (res.status === 200) {
        navigate('/');
        window.location.reload();
        sessionStorage.setItem('data', JSON.stringify(res.data));
        setIsLoading(false);
        setIsFormError(false);

      } else {
        setIsLoading(false);
        setIsFormError(true);
      }
    }).catch((err) => {
      setIsLoading(false);
      setIsFormError(true);
    });
  }


  return (
    <Box maxW={{ base: 'lg', md: "md", lg: 'sm' }} h={'fit-content'} mx="auto" mt={8} p={4}>
      <Stack spacing={4}>
        <Heading>Login</Heading>
        <FormControl isInvalid={isFormError || formIsEmpty}>
          {isFormError && <FormErrorMessage>Invalid Credentials</FormErrorMessage>}
          {formIsEmpty && <FormErrorMessage>Fill all the details before submitting</FormErrorMessage>}

        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input id='email' type="email" placeholder="Enter your email" onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input id="password" type="password" placeholder="Enter your password" onChange={handleChange} />
        </FormControl>
        <Button colorScheme="blue" size="lg" isFullWidth onClick={handleSubmit}>
          {isLoading ? <Spinner /> : 'Sign in'}
        </Button>
        <Text textAlign="center">Or sign in with</Text>
        <Button colorScheme="red" size="lg" isFullWidth onClick={() => { window.location.href = 'http://localhost:3001/login/federated/google' }}>
          Sign in with Google
        </Button>
        <Text textAlign="center">New user? <a href="/register/1">Register here</a></Text>
      </Stack>
    </Box>
  )
}

export default Login