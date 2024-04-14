import React from 'react';
import { Card, Flex, Heading, Tag, Text, Image, Box, } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import UserVoteComponent from './UserVoteComponent.jsx';
import { formatDistanceToNow } from 'date-fns';


const CityPosts = ({ post, index, loading }) => {


  const navigate = useNavigate()

  return (
    <>
      <Card
        key={index}
        p={5}
        w={"xl"}
        mx={10}
        my={5}
        shadow="md"
        minH={"xs"}
        borderWidth="1px"
        justifyContent={"space-between"}>
        <Flex direction={"column"} h={"full"}>
          <Flex w={"full"} justifyContent={"space-between"}>
            <Heading fontSize="xl" cursor={'pointer'} onClick={() => { navigate(`/post/${post._id.toString()}`) }}>{post.title}</Heading>
            <Tag
              size={["xxs", "xs", "sm"]}
              w={"fit-content"}
              variant="solid"
              colorScheme="teal">
              {post.category}
            </Tag>
          </Flex>
          <Text fontSize={"xs"}>
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </Text>
          <Text mt={4}>  {post.description.length > 100 ? `${post.description.substring(0, 100)}...` : post.description}</Text>
          <Flex w={'full'} justifyContent={'end'} >
            <Box boxShadow={'xl'} borderRadius={'2rem'} maxW={'3xs'} cursor={'pointer'} _hover={{ filter: "brightness(0.8)" }} onClick={() => { console.log('Post opened') }}>
              <Image src={post.image} borderRadius={'2rem'} />
            </Box>
          </Flex>
        </Flex>
        <UserVoteComponent post={post} loading={!loading} />
      </Card>

    </>
  );
};

export default CityPosts;





