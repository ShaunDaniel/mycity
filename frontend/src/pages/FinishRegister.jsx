import React from 'react'
import { Box, Button, FormControl, FormLabel, Select, FormErrorMessage, Heading } from '@chakra-ui/react'
import userService from '../services/userService'
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';





function FinishRegister(props) {
    const location = useLocation();
    const [user, setUser] = useState(location.state.user)
    const [cities, setCities] = React.useState([]);
    const [selectedStateCities, setselectedStateCities] = React.useState([]);
    const [cityError, setCityError] = React.useState(false);
    const [stateError, setStateError] = React.useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            userService.user_details().then((res) => {
                setUser({ ...user, state: res.data.state })
            }
            ).catch((err) => {
                console.log(err)
            })
        }
        userService.fetchCities().then((res) => {
            setCities(res.data.states)
        }).catch((err) => {
            console.log(err)
        })
    }, []);


    const updateCityList = (e) => {
        if (!e.target.value) {
        } else {
            setUser({ ...user, [e.target.id]: e.target.value });
            const selectedState = cities.filter((city) => city.state === e.target.value)
            setselectedStateCities(selectedState[0].districts)
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!user.state) {
            setStateError(true);
        } else {
            setStateError(false);
        }

        if (!user.city) {
            setCityError(true);
        } else {
            setCityError(false);
        }


        if (user.state && user.city) {
            setStateError(false);
            setCityError(false);
            userService.register(user).then(
                (response) => {
                    navigate('/login')
                }
            ).catch((err) => {
                console.log(err)
            })
        }

    }


    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
        });
    };

    return (
        <div>
            <Box maxW={{ base: "80vw", xl: "md" }} mx="auto" my={8} p={{ base: "7rem", xl: "3rem" }} borderWidth={1} borderRadius="md" boxShadow="md">
                <Heading textAlign={'center'} >Where are you from?</Heading>

                <FormControl id="state" mb={4} isInvalid={stateError}>
                    <FormLabel fontSize={{ base: 'xx-large', lg: 'md' }}>State</FormLabel>
                    <Select value={user.state} onChange={updateCityList} fontSize={{ base: 'x-large', lg: 'md' }} placeholder='Select your state' required>
                        {cities.map((city, key) => { return <option key={key} value={city.state.id}>{city.state}</option> })}
                    </Select>
                    {stateError && (
                        <FormErrorMessage>Please select your state</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl id="city" mb={4} isInvalid={cityError}>
                    <FormLabel fontSize={{ base: 'xx-large', lg: 'md' }}>City</FormLabel>
                    <Select value={user.city} onChange={handleChange} fontSize={{ base: 'x-large', lg: 'md' }} placeholder='Select your city' required>
                        {selectedStateCities.length > 0 && selectedStateCities.map((city, key) => { return <option key={key} value={city}>{city}</option> })}

                    </Select>
                    {cityError && (
                        <FormErrorMessage>Please select your city</FormErrorMessage>
                    )}
                </FormControl>

                <Button colorScheme="blue" fontSize={{ base: 'xx-large', lg: 'md' }} py={{ base: '2rem', lg: '1rem' }} type="submit" width="full" onClick={handleFormSubmit}>
                    Submit
                </Button>
            </Box>
        </div>
    )
}

export default FinishRegister