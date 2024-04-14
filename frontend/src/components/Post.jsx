import React, { useEffect, useState } from 'react';
import { Image, Flex, Card, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, Avatar, Text, Tag, Skeleton, Heading, Button, Collapse } from "@chakra-ui/react";
import {ChatIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router-dom';
import postService from '../services/postService'; // Import your postService
import UserVoteComponent from './UserVoteComponent';
import userService from '../services/userService';
import { formatDistanceToNow } from 'date-fns';

const Post = () => {
    const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure();
    const { isOpen: isCommentOpen, onToggle: onCommentToggle } = useDisclosure();

    const { id } = useParams(); // Get the ID from the URL
    const [post, setPost] = useState(null); // Initialize state for the post
    const [fetchedUser, setUser] = useState(null);
    // eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(true); // Initialize loading state

    useEffect(() => {
        // Fetch the post details when the component mounts
        const fetchPost = async () => {
            setIsLoading(true);
            console.log("fetching post", id)
            const fetchedPost = await postService.getPost(id); // Replace with your actual API call
            const fetchedUserfromService = await userService.getUser(fetchedPost.data.user)
            console.log("fetched post", fetchedPost.data)
            setPost(fetchedPost.data);
            setUser(fetchedUserfromService.data);
            setIsLoading(false);
        };

        fetchPost();
    }, [id]); // Rerun the effect if the ID changes


    const displayPost = (loading) => {
        if (post) {
            return (
                <Flex w={"100%"}>
                    <Flex h={'fit-content'} w={'80%'} mx={'5rem'}>
                        <Card m={10} dropShadow={'xl'} >
                            <Flex direction={'column'} p={'-2rem'} h={'fit-content'} >
                                {/* Post Details & Image */}
                                <Flex direction={'column'} px={10} py={5}>
                                    <Flex justifyContent={'space-between'}>
                                        <Flex>
                                            <Avatar size={'sm'} my={2} />
                                            <Flex direction={'column'}>
                                                <Text fontSize={'xs'} ml={2}>{`${fetchedUser.firstName} ${fetchedUser.lastName} `}</Text>
                                                <Text fontSize={'2xs'} fontStyle={'italic'} ml={2}>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</Text>
                                            </Flex>
                                        </Flex>
                                        <Tag size={"md"} variant='solid' colorScheme='teal' h={'fit-content'} alignSelf={'center'}>Shanti Nagar</Tag>
                                    </Flex>
                                    <Skeleton isLoaded={loading}>
                                        <Heading fontSize="2xl">{post.title}</Heading>
                                    </Skeleton>
                                    <Skeleton isLoaded={loading} mt={4} w={"sm"}>
                                        <Image src={post.image} alt="Post" onClick={onImageOpen} />
                                        <Modal isOpen={isImageOpen} onClose={onImageClose}>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalCloseButton color={'white'} backgroundColor={'teal'} />
                                                <Image src={post.image} alt="Post" />
                                            </ModalContent>
                                        </Modal>
                                    </Skeleton>
                                    <Skeleton isLoaded={loading} mt={5} w={['full']}>
                                        <Text fontSize={'sm'}>{post.description}</Text>
                                    </Skeleton>
                                </Flex>

                                <Flex ml={10} mb={5} mt={5}>
                                    <UserVoteComponent post={post} loading={loading} />
                                    <Skeleton isLoaded={loading} ml={5}>
                                        <Button leftIcon={<ChatIcon />} variant="outline" ml={5} onClick={onCommentToggle}>
                                            Comment
                                        </Button>
                                    </Skeleton>
                                </Flex>

                                <Collapse in={isCommentOpen} animateOpacity>
                                    <Card w={'80%'} h={'fit-content'} p={2} mx={10} dropShadow={'xl'} my={5}>
                                        Comments coming soon! (working on it lol)
                                    </Card>
                                </Collapse>
                            </Flex>
                        </Card>
                    </Flex>
                    <Flex backgroundColor={'gray.50'} w={"30%"} direction={'column'}>
                        <Text fontWeight={400} h={'fit-content'} p={5} fontSize={'xl'}>
                            {`Posts in ${post.city}`}
                        </Text>
                        <Flex direction={'column'} mx={5} gap={5}>
                            <Card w={'80%'} p={2}>
                                Post 1
                            </Card>
                            <Card w={'80%'} p={2}>
                                Post 2
                            </Card>
                            <Card w={'80%'} p={2}>
                                Post 3
                            </Card>
                            <Card w={'80%'} p={2}>
                                Post 4
                            </Card>
                            <Card w={'80%'} p={2}>
                                Post 5
                            </Card>
                        </Flex>
                    </Flex>
                </Flex>
            )
        }

    }


    if (post != null) {
        return (
            displayPost(true)

        )
    }
    else {
        return (
            displayPost(false)
        );
    };
}

export default Post;