import React from 'react'
import { Box, Stack, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react';

function Login() {
  return (
    <Box maxW={{base:'lg',md:"md",lg:'sm'}} h={'fit-content'} mx="auto" mt={8} p={4}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Enter your password" />
        </FormControl>
        <Button colorScheme="blue" size="lg" isFullWidth>
          Sign in
        </Button>
        <Text textAlign="center">Or sign in with</Text>
        <Button colorScheme="red" size="lg" isFullWidth onClick={() => { window.location.href = 'http://localhost:3001/login/federated/google' }}>
          Sign in with Google
        </Button>
        <Text textAlign="center">New user? <a href="/register">Register here</a></Text>
      </Stack>
    </Box>
  )
}

export default Login