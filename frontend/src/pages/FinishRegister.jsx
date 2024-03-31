import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Select,
    FormErrorMessage,
    Heading,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import userService from "../services/userService";
import UserContext from "../components/UserContext";

function FinishRegister(props) {
    const { user, setUser } = useContext(UserContext);
    const [registerUser, setRegisterUser] = useState({});
    const location = useLocation();

    const [userFromRegister, setUserFromRegister] = useState(location.state ? location.state.user : null);


    useEffect(() => {
        userService.fetchCities().then((res) => {
            setCities(res.data.states);
        }).catch((err) => {
            console.log(err);
        })


            if (userFromRegister.email.length>0) {

                setRegisterUser(userFromRegister);
            } else if (user) {
                setRegisterUser(user);
            }
    }, [user]);


    const [cities, setCities] = useState([]);
    const [selectedStateCities, setselectedStateCities] = useState([]);

    const [cityError, setCityError] = useState(false);
    const [stateError, setStateError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const updateCityList = (e) => {
        if (!e.target.value) {
            return;
        } else {
            setRegisterUser(prevState => ({ 
                ...prevState, 
                [e.target.id]: e.target.value,
                city: "-"
            }));
            const selectedState = cities.filter(
                (city) => city.state === e.target.value
            );
            setselectedStateCities(selectedState[0].districts);
    }
    };

    
    const handleFormSubmit = (e) => {
        console.log("Inside handleFormSubmit");
        setIsLoading(true);
    
        
    
        // Check if state_name is selected, if not set the state error
        const isStateSelected = registerUser.state_name !== "-";
        setStateError(!isStateSelected);
    
        // Check if city is selected, if not set the city error
        const isCitySelected = registerUser.city !== "-";
        setCityError(!isCitySelected);
    
        // If both state and city are selected, proceed with user registration
        if (isStateSelected && isCitySelected) {
            
            userService.register(registerUser).then((res) => { 
                if(res.data.jwtToken){
                    localStorage.setItem("jwtToken", res.data.jwtToken);
                    setUser(registerUser);
                    setIsLoading(false);
                    navigate("/");
                }
                else{
                    setIsLoading(false);
                    if (res.data.message) {
                        alert(res.data.message);
                    }
                }

            }
            ).catch((err) => {
                console.log(err);
                setIsLoading(false);
            });

        }
    };
        const handleChange = (e) => {
            
            setRegisterUser({
                ...registerUser,
                [e.target.id]: e.target.value,
            });
        };

        
return(
    <>
            <Box maxW={{ base: "80vw", xl: "md" }} mx="auto" my={8} p={{ base: "7rem", xl: "3rem" }} borderWidth={1} borderRadius="md" boxShadow="md">
                        <Heading textAlign={'center'} >Where are you from?</Heading>
        
                        <FormControl id="state_name" mb={4} isInvalid={stateError}>
                            <FormLabel fontSize={{ base: 'xx-large', lg: 'md' }}>State</FormLabel>
                            <Select value={user ? user.state_name: ''} onChange={updateCityList} fontSize={{ base: 'x-large', lg: 'md' }} placeholder={registerUser.state_name==='-' ? 'Select your state' : registerUser.state_name} required>
                            {cities.map((city, key) => { 
                                return city.state ? <option key={key} value={city.state.id}>{city.state}</option> : null;
                            })}
                            </Select>
                            {stateError && (
                                <FormErrorMessage>Please select your state</FormErrorMessage>
                            )}
                        </FormControl>
        
                        <FormControl id="city" mb={4} isInvalid={cityError}>
                            <FormLabel fontSize={{ base: 'xx-large', lg: 'md' }}>City</FormLabel>
                            <Select value={user ? user.city : ''} onChange={handleChange} fontSize={{ base: 'x-large', lg: 'md' }} placeholder={registerUser.city==='-' ? 'Select your city' : registerUser.city} required>
                                {selectedStateCities.length > 0 && selectedStateCities.map((city, key) => { return <option key={key} value={city}>{city}</option> })}
        
                            </Select>
                            {cityError && (
                                <FormErrorMessage>Please select your city</FormErrorMessage>
                            )}
                        </FormControl>
                        <Button 
                            colorScheme="blue" 
                            fontSize={{ base: 'xx-large', lg: 'md' }} 
                            py={{ base: '2rem', lg: '1rem' }} 
                            type="submit" 
                            width="full" 
                            onClick={handleFormSubmit}
                            isLoading={isLoading}
                            loadingText="Submitting"
                        >
                            Submit
                        </Button>
                    </Box>
        
    </>
)
}

        


            export default FinishRegister;