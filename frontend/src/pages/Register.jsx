import React from 'react'
import { Box, Heading, Button,Text} from '@chakra-ui/react'
import userService from '../services/userService'
import RegisterFormComponent from '../components/RegisterFormComponent';
import { useNavigate } from 'react-router-dom';


function Register() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    city: '-',
    state_name:'-'
  });
  const navigate = useNavigate();

  const [firstNameError, setFirstNameError] = React.useState(false);
  const [lastNameError, setLastNameError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);

  const passwordValidator = (password) => {
    if (password.length < 8) {
      setPasswordError('Password should be at least 8 characters long');
    } else if (!/[a-z]/.test(password)) {
      setPasswordError('Password should contain at least one lowercase letter');
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Password should contain at least one uppercase letter');
    } else if (!/[0-9]/.test(password)) {
      setPasswordError('Password should contain at least one number');
    } else {
      setPasswordError('');
    }
  }

  const handleChange = (e) => {
    if (e.target.id === 'password'){
      passwordValidator(e.target.value);
    }

    if (e.target.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(e.target.value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
    

    

    setUser({
      ...user,
      [e.target.id]: e.target.value
    });
  };


  const formSubmitHandler = (e) => {
    setIsLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      alert('Please fill all the fields');
      setIsLoading(false);
      return;
    }

    if (firstNameError || lastNameError || emailError || passwordError) {
      alert('Please correct the errors before submitting');
      setIsLoading(false);
      return;
    }
    if (!emailRegex.test(user.email)) {
      setEmailError('Please enter a valid email address');
      setIsLoading(false);
      return
    }


    
    else{
      setUser({...user,email:user.email.toLowerCase()})
      userService.userExists(user.email).then((res)=>{
        if(res.data.exists){
          console.log("email exists")
          setEmailError('Email already exists');
          setIsLoading(false);
          return;
        }
        else{
          navigate('/register/2', { state: { user } }); // navigate to FinishRegister and pass the user state
          setEmailError(false);
          setIsLoading(false);
        }
      })
    }
    
    
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
      default:
        break;
    }
  };

  return (
    <div>
      <Box maxW={{ base: "80vw", xl: "md" }} mx="auto" my={8} p={{ base: "7rem", xl: "3rem" }} borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading mb={5} >Register</Heading>
        <RegisterFormComponent
          id="firstName"
          label="First Name"
          type="text"
          value={user.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='Rahul'
          error={firstNameError}
          isRequired
        />
        <RegisterFormComponent
          id="lastName"
          label="Last Name"
          type="text"
          value={user.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='Singh'
          error={lastNameError}
          isRequired
        />

        <RegisterFormComponent
          id="email"
          label="Email"
          type="text"
          value={user.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='ramesh@example.com'
          error={emailError}
          isRequired
        />

        <RegisterFormComponent
          id="password"
          label="Password"
          type="password"
          value={user.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='**********'
          error={passwordError}
          isRequired
        />
        <Text cursor={'pointer'} _hover={{textDecoration:'underline'}} onClick={()=>{navigate('/login')}} mb={5}>Already have an account?</Text>
        

        <Button
        colorScheme="blue"
        fontSize={{ base: "xx-large", lg: "md" }}
        py={{ base: "2rem", lg: "1rem" }}
        type="submit"
        width="full"
        onClick={formSubmitHandler}
        isLoading={isLoading}
        loadingText="Moving on..."
        >
            Register
        </Button>
          </Box>
    </div>
  );
}

export default Register