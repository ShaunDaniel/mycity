import React, { useEffect, useState } from 'react';
import { Image, Flex, Card, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, Avatar, Text, Tag, Skeleton, Heading, Button, Collapse } from "@chakra-ui/react";
import { ChatIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import postService from '../services/postService'; // Import your postService
import UserVoteComponent from './UserVoteComponent';
import userService from '../services/userService';
import { formatDistanceToNow } from 'date-fns';

const Post = () => {
    const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure();
    const { isOpen: isCommentOpen, onToggle: onCommentToggle } = useDisclosure();
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL
    const [post, setPost] = useState(null); // Initialize state for the post
    const [cityPosts, setCityPosts] = useState(null);

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
            const cityPostsData = await postService.getPostsByCity(fetchedPost.data.city);
            setCityPosts(cityPostsData.data.posts);
            setIsLoading(false);
        };

        fetchPost();
    }, [id]); // Rerun the effect if the ID changes


    const displayPost = (loading) => {
        if (post) {
            return (
                <Flex w={"100%"}>
                    <Flex h={'fit-content'} w={'80%'} mx={'5rem'}>
                        <Flex direction={'column'} w={"100%"} p={'-2rem'} h={'fit-content'} >
                            {/* Post Details & Image */}
                            <Flex direction={'column'} px={10} py={5}>
                                <Flex justifyContent={'space-between'}>
                                    <Flex>
                                        <Avatar size={'sm'} my={2} />
                                        <Flex direction={'column'} alignContent={'center'} my={'auto'}>
                                            <Text fontSize={'xs'} ml={2}>{`${fetchedUser.firstName} ${fetchedUser.lastName} `}</Text>
                                            <Text fontSize={'2xs'} fontStyle={'italic'} ml={2}>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</Text>
                                        </Flex>
                                    </Flex>
                                    <Flex gap={5}>

                                        <Tag size={"md"} variant='solid' colorScheme='cyan' h={'fit-content'} alignSelf={'center'}>📌&nbsp;{post.area}</Tag>
                                        <Tag size={"md"} variant='solid' h={'fit-content'} alignSelf={'center'}>
                                            {post.resolved ? "✅ Resolved" : "❌ Unresolved"}
                                        </Tag>
                                    </Flex>
                                </Flex>
                                <Skeleton isLoaded={loading}>
                                    <Heading mt={2} fontSize="2xl">{post.title}</Heading>
                                    <Tag size={"sm"} mt={2} variant='solid' colorScheme='teal' h={'fit-content'} alignSelf={'center'}>{post.category}</Tag>
                                </Skeleton>
                                {post.image && 
                                <Skeleton isLoaded={loading} mt={4}>
                                    <Image src={post.image} alt="Post" w={"md"} onClick={onImageOpen} />
                                    <Modal isOpen={isImageOpen} onClose={onImageClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalCloseButton color={'white'} backgroundColor={'teal'} />
                                            <Image src={post.image} w={'full'} alt="Post" />
                                        </ModalContent>
                                    </Modal>
                                </Skeleton>
                                }
                                <Skeleton isLoaded={loading} mt={5} w={['full']}>
                                    <Text fontSize={'sm'}>{post.description}</Text>
                                </Skeleton>
                            </Flex>

                            <Flex ml={10} mb={5} mt={5}>
                                <UserVoteComponent post={post} loading={loading} />
                                <Skeleton isLoaded={loading} ml={5}>
                                    <Button leftIcon={<ChatIcon />} variant="outline" mr={10} onClick={onCommentToggle}>
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
                    </Flex>
                    <Flex backgroundColor={'gray.50'} w={"30%"} direction={'column'}>
                        <Text fontWeight={400} h={'fit-content'} p={5} fontSize={'xl'}>
                            {`Posts in ${post.city}`}
                        </Text>

                        <Flex direction={'column'} mx={5} gap={5}>
                            {cityPosts && cityPosts
                                .filter(cityPost => cityPost._id !== post._id)
                                .map((cityPost) => (
                                    <Card
                                        w={'80%'}
                                        p={2}
                                        cursor={'pointer'}
                                        _hover={{ transform: "scale(1.02)" }}
                                        transition="transform 0.2s"
                                        onClick={() => { navigate(`/post/${cityPost._id}`) }}
                                    >
                                        <Text as="b" ml={5}>
                                            {cityPost.title.length > 30 ? cityPost.title.substring(0, 30) + "..." : cityPost.title}
                                        </Text>

                                    </Card>
                                ))}
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