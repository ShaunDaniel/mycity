import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, FormControl, FormLabel, FormErrorMessage, Input, Button, Text, Heading } from '@chakra-ui/react';
import userService from '../services/userService';
import UserContext from './UserContext';

const STATUS_UNAUTHORIZED = 401;
const STATUS_SERVER_ERROR = 500;

function FormField({ id, type, placeholder, onChange }) {
  return (
    <FormControl>
      <FormLabel>{placeholder}</FormLabel>
      <Input id={id} type={type} placeholder={placeholder} onChange={onChange} />
    </FormControl>
  );
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    //Check if all fields are filled
    if (credentials.email.trim() === '' || credentials.password.trim() === '') {
      setIsLoading(false);
      setError('Fill all the details before submitting');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {

      //Check if account is connected with Google
      const res = await userService.isGoogleAccount(credentials.email);
      if (res.data.exists) {
        setIsLoading(false);
        setError('Account already connected with Google! Please Login using Google');
        return;
      }

      const loginRes = await userService.login(credentials, { withCredentials: true });
      //If login is successful, redirect to home page with jwtToken
      if (loginRes.status !== STATUS_UNAUTHORIZED && loginRes.status !== STATUS_SERVER_ERROR) {
        navigate('/');
        window.location.reload();
        localStorage.setItem('jwtToken', `${loginRes.data.jwtToken}`);
      } else {
        setIsLoading(false);
        setError('Invalid Credentials');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Invalid Credentials');
    }
  };

  return (
    <Box maxW={{ base: 'lg', md: 'md', lg: 'sm' }} h='fit-content' mx='auto' mt={8} p={4}>
      <Stack spacing={4}>
        <Heading>Login</Heading>
        <FormControl isInvalid={!!error}>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
        <FormField id='email' type='email' placeholder='Enter your email' onChange={handleChange} />
        <FormField id='password' type='password' placeholder='Enter your password' onChange={handleChange} />
        <Button
          colorScheme='blue'
          fontSize={{ base: 'xx-large', lg: 'md' }}
          py={{ base: '2rem', lg: '1rem' }}
          type='submit'
          width='full'
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText='Logging in'
        >
          Login
        </Button>
        <Text textAlign='center'>Or sign in with</Text>
        <Button colorScheme='red' size='lg' onClick={() => { window.location.href = `${process.env.REACT_APP_API_URL}v1/auth/google`; }}>
          Sign in with Google
        </Button>
        <Text textAlign='center'>New user? <strong style={{ cursor: 'pointer' }} onClick={() => { navigate('/register/1'); }}>Register here</strong></Text>
      </Stack>
    </Box>
  );
}

export default Login;