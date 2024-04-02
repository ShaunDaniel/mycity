import React from 'react';
import { useEffect } from 'react';
import { Card, Flex, Heading, Tag, Text, Button } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon, ChatIcon } from '@chakra-ui/icons';
import postService from '../services/postService';
import UserContext from './UserContext';
import { useState } from 'react';

const CityPosts = ({ post,vote,index,voteCount,user,setVotesUpdated,votesUpdated}) => {
    const [postVoteCount, setPostVoteCount] = useState(voteCount);
    const [userVote, setUserVote] = useState(post.votes.find(vote => vote.userId === user._id));
   
      
    console.log("Inside CityPost",post)
    console.log("Current User",user)
    console.log("User Vote",userVote)
    const handleUpvote = (postId) => {
        postService.upvotePost(postId, user._id).then((res) => {
          console.log("upvoted post", res.data);
          if(res.status === 304){
            console.log("User already voted this way on this post. No modification made.");
          }
          else{
            
            setUserVote(res.data.votes.find(vote => vote.userId === user._id));
            setPostVoteCount(postVoteCount + 1);

          }
        }).catch((err) => {
            if(err.response.status === 304){
                console.log("User already voted this way on this post. No modification made.");
              }
              else{
                  console.error(err);
  
              }
        });
      };
      
      const handleDownvote = (postId) => {
        postService.downvotePost(postId, user._id).then((res) => {
          console.log("downvoted post", res.data);
          if(res.status === 304){
            console.log("User already voted this way on this post. No modification made.");
          }
          else{
            setUserVote(res.data.votes.find(vote => vote.userId === user._id));
            setPostVoteCount(postVoteCount - 1);
          }
        }).catch((err) => {
            if(err.response.status === 304){
              console.log("User already voted this way on this post. No modification made.");
            }
            else{
                console.error(err);

            }
        });
      };

  
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
          <Heading fontSize="xl">{post.title}</Heading>
          <Tag
            size={["xxs", "xs", "sm"]}
            w={"fit-content"}
            variant="solid"
            colorScheme="teal">
            {post.category}
          </Tag>
        </Flex>
        <Text fontSize={"xs"}>
          {new Date(post.created_at).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text mt={4}>{post.description}</Text>
      </Flex>
      <Flex mt={2}>
        <Button
          leftIcon={<ArrowUpIcon />}
          _hover={{transform: 'scale(1.05)', transition: 'transform 0.2s',transitionBehavior: 'smooth'}}
          variant={userVote && userVote.type === 1 ? 'solid' : 'outline'}
          id={post._id}
          onClick={(e) => {
            handleUpvote(post._id);
          }}>
            Upvote
        </Button>
        <Text alignSelf={'center'} mx={5}>{postVoteCount}</Text>
        <Button
          leftIcon={<ArrowDownIcon />}
          _hover={{transform: 'scale(1.05)', transition: 'transform 0.2s',transitionBehavior: 'smooth'}}

          variant={userVote && userVote.type === 0 ? 'solid' : 'outline'}
          id={post._id}
          onClick={(e) => {
            handleDownvote(post._id);
          }}>
            Downvote
        </Button>
        <Button leftIcon={<ChatIcon />} variant="outline" ml={2}>
          Comment
        </Button>
      </Flex>
            </Card>
 
    </>
  );
};

export default CityPosts;





