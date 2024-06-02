import React, { useState,useContext  } from 'react'
import { useParams } from 'react-router-dom';
import {  Flex, Text, Textarea, Button, Collapse, Avatar,Skeleton,useToast,} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon, ChatIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import CommentVotingComponent from './CommentVotingComponent';
import { formatDistanceToNow } from 'date-fns';
import postService from '../services/postService';
import UserContext from './UserContext';

function SingleComment({ comment, replies, isReply }) {
  
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState("");
  const { user, setUser} = useContext(UserContext);
  const handleToggle = () => setShowReplies(!showReplies);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postId = useParams().id;

  const handleUpvote = (commentId) => () => {
  }

  const handleDownvote = (commentId) => () => {

  }


  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleAddReply = () => {
    setIsSubmitting(true);
    postService.addReply(postId, user._id, comment._id, newReply)
      .then((result) => {
        toast({
          title: 'Success!',
          description: "Reply added successfully!",
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        console.log("result", result.data);
        setNewReply("");
        replies.push(result.data);
        setShowReplyInput(true)
        setShowReplies(true)
        handleReplyClick()
      })
      .catch((err) => {
        toast({
          title: 'Error!',
          description: "Reply not added. Please try again later",
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      });
  };
  const toast = useToast()

  return (
    <Flex key={comment._id} ml={isReply ? '10' : '0'}  pb={3} direction={'column'} w={"fit-content"}>
      <Flex  w={"sm"} h={'fit-content'} >
        <Avatar size={'sm'} src='https://bit.ly/broken-link' />
        <Flex fontSize={'xs'} alignItems={'start'}  gap={2}>
        <Text ml={2} fontWeight="bold" >{`${comment.firstName} ${comment.lastName}`}</Text>
        <Text>•</Text>
        <Text as={"i"} fontSize="xs" color="gray.500">
          {comment.createdAt ? formatDistanceToNow(comment.createdAt, { addSuffix: true }) : "Just now"}
        </Text>
        </Flex>
      </Flex>
      <Text mx={10} >{comment.text}</Text>
      <Flex direction={'column'} justifyContent={'space-between'}>

        <Flex gap={5} mt={2} w={'50%'}>
          <Flex gap={2} >
            <CommentVotingComponent icon={<ArrowUpIcon />} onClick={handleUpvote("69")} />
            <CommentVotingComponent icon={<ArrowDownIcon />} onClick={handleUpvote("69")} />
          </Flex>
          <Button size="sm" leftIcon={<ChatIcon/>} onClick={handleReplyClick} >Reply</Button>
        </Flex>
        <Collapse in={showReplyInput}>
          <Textarea mt={5} mb={2} placeholder="Write a reply..." onChange={(e) => setNewReply(e.target.value)}/>
          <Button size={"xs"} px={3} py={4} onClick={()=>{handleAddReply()}} isLoading={isSubmitting} loadingText="Submitting...">Submit</Button>
        </Collapse>
        <Flex direction={'column'}>
          {
            replies && replies.length > 0 && (
              <Text onClick={handleToggle} fontSize="sm" m={2} cursor={'pointer'} _hover={{ textDecoration: 'underline' }} w={'fit-content'}>
                {"Replies"}
                {showReplies ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />}
              </Text>
            )
          }
          <Collapse in={showReplies}>
            {replies && replies.map((reply) => (
              <>
              <Text mx={'2'} color={'grey'} cursor={'pointer'} onClick={()=>{setShowReplies(!setShowReplies);}}>|</Text>
                <SingleComment key={reply._id} comment={reply} replies={reply.replies} isReply={true}/>
              </>
            ))}
          </Collapse>
        </Flex>

      </Flex>
    </Flex>
  )
}

export default SingleComment