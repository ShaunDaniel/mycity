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
        w={{base:"90%",xl:"90%"}}
        mx={10}
        my={5}
        shadow="md"
        minH={"xs"}
        borderWidth="1px"
        justifyContent={"space-between"}>
        <Flex direction={"column"} h={"full"}>
          <Flex w={"full"} justifyContent={"space-between"}>
            <Heading fontSize="xl" cursor={'pointer'} maxW={'50%'} onClick={() => { navigate(`/post/${post._id.toString()}`) }}>{post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title}</Heading>
            <Flex gap={5}>
            <Tag
              fontSize={'x-small'}
              px={3}
              py={2}
              w={"fit-content"}
              variant="solid"
              h={"10%"}
              colorScheme="teal">
              {post.category}
            </Tag>
            <Tag
              fontSize={'x-small'}
              px={3}
              py={2}
              w={"fit-content"}
              variant="solid"
              h={"10%"}
              colorScheme="cyan">
               📌&nbsp;{post.area}
            </Tag>
            </Flex>
          </Flex>
          <Text fontSize={"xs"}>
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </Text>
          <Text mt={4}>  {post.description.length > 100 ? `${post.description.substring(0, 100)}...` : post.description}</Text>
          <Flex w={'full'} justifyContent={'end'} >
            <Box boxShadow={'xl'} my={5} borderRadius={'2rem'} maxW={'3xs'} cursor={'pointer'} _hover={{ filter: "brightness(0.8)" }} onClick={() => { console.log('Post opened') }}>
              <Image src={post.image} borderRadius={'2rem'} />
            </Box>
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} mt={5}>
        <UserVoteComponent post={post} key={post._id} loading={!loading} />
        <Tag w={'fit-content'} my={2} px={4} fontSize={'small'} py={2}>
              {post.resolved ? "✅ Resolved" : "❌ Unresolved"}
            </Tag>  
      </Flex>

      </Card>

    </>
  );
};

export default CityPosts;





