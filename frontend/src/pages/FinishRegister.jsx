import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Select,
    FormErrorMessage,
    Heading,
    Spinner
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import userService from "../services/userService";
import UserContext from "../components/UserContext";

function FinishRegister(props) {
    const { user, setUser } = useContext(UserContext);
    const [registerUser, setRegisterUser] = useState({});
    const location = useLocation();

    const [userFromRegister, setUserFromRegister] = useState(location.state ? location.state.user : {});


    useEffect(() => {
        userService.fetchCities().then((res) => {
            setCities(res.data.states);
        }).catch((err) => {
            console.log(err);
        })
        if (!registerUser.firstName && !registerUser.lastName && !registerUser.email && !registerUser.password) {
            
            if (userFromRegister) {
                setRegisterUser(userFromRegister);
            } else if (user) {
                setRegisterUser(user);
            }
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
    
        if (user) {
            setRegisterUser({...registerUser, state_name: user.state_name, city: user.city});
        }
        if (registerUser.state_name === "-") {
            setStateError(true);
        } else {
            setStateError(false);
        }
    
        if (registerUser.city === "-") {
            setCityError(true);
        } else {
            setCityError(false);
        }
    
        if (registerUser.state_name !== "-" && registerUser.city !== "-") {
            
            setStateError(false);
            setCityError(false);
            userService.register(registerUser).then((response) => {
                if (response.status === 201 || response.status === 200) {
                    console.log("User registered successfully")
                    
                    console.log(response.data)
                    userService.isGoogleAccount(response.data.email).then((response) => {
                        console.log("IsGoogleAccount",response.data);
                        if(response.data.exists){
                            setIsLoading(false);
                            setUser(registerUser);
                            navigate("/");
                        }
                        else{
                            setIsLoading(false);
                            setUser({})
                            navigate("/login");
                            window.location.reload();
                        }
                    }).catch((err) => {console.log(err);});

                }
            }).catch((err) => {console.log(err);});
        }
    }


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