import React from 'react'
import { Box, Button, FormControl, FormLabel, Input, Select,FormErrorMessage } from '@chakra-ui/react'
import userService from '../services/userService'

function Register() {
  const [user, setUser] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    city: ''
  });

  
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [lastNameError, setLastNameError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [cityError, setCityError] = React.useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value
    });
  };

  const formSubmitHandler = (e) => {
    userService.register(user).then(
      (response) => {
        console.log(response);
      }
    )
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'firstName':
        setFirstNameError(value === '');
        break;
      case 'lastName':
        setLastNameError(value === '');
        break;
      case 'email':
        setEmailError(value === '');
        break;
      case 'password':
        setPasswordError(value === '');
        break;
      case 'city':
        setCityError(value === '');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Box maxW="sm" mx="auto" my={8} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <FormControl id="firstName" mb={4} isInvalid={firstNameError}>
          <FormLabel>First Name</FormLabel>
          <Input type="text" value={user.firstName} onChange={handleChange} onBlur={handleBlur} placeholder='Rahul' isRequired/>
          {firstNameError && (
            <FormErrorMessage>Please enter your first name</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="lastName" mb={4} isInvalid={lastNameError}>
          <FormLabel>Last Name</FormLabel>
          <Input type="text" value={user.lastName} onChange={handleChange} onBlur={handleBlur} placeholder='Singh' required/>
          {lastNameError && (
            <FormErrorMessage>Please enter your last name</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="email" mb={4} isInvalid={emailError}>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" value={user.email} onChange={handleChange} onBlur={handleBlur} required/>
          {emailError && (
            <FormErrorMessage>Please enter your email address</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="password" mb={4} isInvalid={passwordError}>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={user.password} onChange={handleChange} onBlur={handleBlur} required/>
          {passwordError && (
            <FormErrorMessage>Please enter your password</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="city" mb={4} isInvalid={cityError}>
          <FormLabel>City</FormLabel>
          <Select value={user.city} onChange={handleChange} onBlur={handleBlur} required>
            <option value="city1">City 1</option>
            <option value="city2">City 2</option>
            <option value="city3">City 3</option>
          </Select>
          {cityError && (
            <FormErrorMessage>Please select your city</FormErrorMessage>
          )}
        </FormControl>
        <Button colorScheme="blue" type="submit" width="full" onClick={formSubmitHandler}>
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default Register