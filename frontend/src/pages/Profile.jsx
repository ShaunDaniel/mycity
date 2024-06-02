import { Box, Text, Flex, Skeleton, Avatar, Heading, Button, Divider, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, SkeletonCircle } from '@chakra-ui/react'
import React, { useState, useEffect, useContext } from 'react'
import CityPosts from '../components/CityPost.jsx'
import userService from '../services/userService'
import { useParams } from 'react-router-dom'
import UserContext from '../components/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService.js'
import { set } from 'lodash'

function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfileData, setUserProfileData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [cities, setCities] = useState([]);
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [userVotes, setUserVotes] = useState(null);
    const [states, setStates] = useState([]);



    useEffect(() => {
        setIsLoading(true);
        userService.getUser(id).then((fetchedUser) => {
            setUserProfileData(fetchedUser.data);
            userService.fetchCities().then((fetchedCities) => {
                const userStateCities = fetchedCities.data.states.find(state => state.state === fetchedUser.data.state_name).districts;
                setCities(userStateCities);
                const allStates = fetchedCities.data.states.map(state => state.state);
                setStates(allStates);
            });

            postService.getPostsByUser(id).then((fetchedPosts) => {
                setUserPosts(fetchedPosts);
                console.log(userPosts)
                setIsLoading(false);
            }
            ).catch((error) => {
                console.error(error);
                navigate('/404');
            }
            );

        }).catch((error) => {
            console.error(error);
            navigate('/404');
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);


    const handleInputChange = (e) => {
        setUserProfileData({ ...userProfileData, [e.target.name]: e.target.value });
        console.log(userProfileData);
    };

    // Update handleStateChange to update cities when state changes
    const handleStateChange = (e) => {
        setUserProfileData({ ...userProfileData, state_name: e.target.value });
        userService.fetchCities().then((fetchedCities) => {
            const selectedStateCities = fetchedCities.data.states.find(state => state.state === e.target.value).districts;
            setCities(selectedStateCities);
        });
    };


    if (isLoading) {
        return (

            <Box backgroundColor={'teal'} h={"fit-content"}>
                <Flex w={"70%"} h={'full'} backgroundColor={'white'} mx={'auto'} direction={'column'}>
                    <Flex h={'15rem'} backgroundColor={'white'} w={'full'} justifyContent={'space-around'}>
                        <Flex h={"full"}>
                            <SkeletonCircle my={'auto'} size={'5rem'}></SkeletonCircle>
                            <Flex direction={'column'} my={'auto'} mx={10} gap={5}>
                                <Skeleton w={'20rem'} h={'5rem'}></Skeleton>
                                <Skeleton></Skeleton>
                            </Flex>
                        </Flex>
                        <Flex>
                            <Skeleton w={'5rem'} h={'2rem'} my={'auto'}></Skeleton>
                        </Flex>
                    </Flex>
                    <Divider></Divider>
                    <Flex w={'70%'} h={'fit-content'} mx={'auto'} direction={'column'}>
                        <Skeleton w={"50%"} mx={5} my={10} p={0}>Shaun's Post's</Skeleton>
                        <Skeleton h={"25rem"} my={10}></Skeleton>
                    </Flex>


                </Flex>


            </Box>


        )
    }
    else{
    return (
        <Box backgroundColor={'teal'} h={"fit-content"}>
            <Flex w={"70%"} h={'full'} backgroundColor={'white'} mx={'auto'} direction={'column'}>
                <Flex h={'15rem'} backgroundColor={'white'} w={'full'} justifyContent={'space-around'}>
                    <Flex h={"full"}>
                        <Avatar my={'auto'} size={'xl'}></Avatar>
                        <Flex direction={'column'} my={'auto'} mx={10}>
                            <Heading >{userProfileData.firstName} {userProfileData.lastName}</Heading>
                            <Text>{userProfileData.city}, {userProfileData.state_name}</Text>
                        </Flex>
                    </Flex>
                    <Flex my={'auto'}>
                        <Button colorScheme='teal' size={'sm'} onClick={onOpen}>Edit Profile</Button>
                    </Flex>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Edit Profile</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl id="firstName">
                                    <FormLabel>First Name</FormLabel>
                                    <Input type="text" name="firstName" value={userProfileData.firstName} onChange={handleInputChange} />
                                </FormControl>
                                <FormControl id="lastName">
                                    <FormLabel>Last Name</FormLabel>
                                    <Input type="text" name="lastName" value={userProfileData.lastName} onChange={handleInputChange} />
                                </FormControl>
                                <FormControl id="state_name">
                                    <FormLabel>State</FormLabel>
                                    <Select name="state_name" value={userProfileData.state_name} onChange={handleStateChange}>
                                        {states.map((state, index) => {
                                            return (
                                                <option key={index} value={state}>{state}</option>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl id="city">
                                    <FormLabel>City</FormLabel>
                                    <Select name="city" value={userProfileData.city} onChange={handleInputChange}>
                                        {cities.map((city, index) => {
                                            return (
                                                <option key={index} value={city}>{city}</option>
                                            );
                                        })}
                                    </Select>
                                </FormControl>

                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} >
                                    Update
                                </Button>
                                <Button variant='ghost' onClick={onClose}>Close</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
                <Divider></Divider>
                <Flex w={'70%'} h={'fit-content'} mx={'auto'} direction={'column'}>
                    <Heading fontSize={'1.5rem'} mx={5} my={10} p={0}>{userProfileData.firstName}'s Post's</Heading>
                    {userPosts && userPosts.length === 0 ? (
                                <Text py={5} mx={10} fontSize="xl">
                                    {`No posts to display!`}
                                </Text>
                            ) : (
                                userPosts.map((post, index) => {
                                    if (user && user.votes && post && post.description) {
                                        return (
                                            <>
                                                <CityPosts
                                                    post={post}
                                                    key={index}
                                                    userVotes={userVotes}
                                                    user={user}
                                                    loading={isLoading}
                                                />
                                            </>
                                        );
                                    }
                                })
                            )}
                </Flex>


            </Flex>


        </Box>
    )
}
}

export default Profile