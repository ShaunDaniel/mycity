import React, { useEffect, useState } from 'react'
import postService from '../services/postService';
import SingleComment from './SingleComment';
import { Flex, Button, VStack, Textarea, Divider,useToast } from "@chakra-ui/react";

function Comments({ userId,postId }) {

  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const toast = useToast()

  const handleAddComment = () => {
    setIsSubmitting(true);
    toast.promise(
      postService.addComment(postId, userId, newComment)
        .then((result) => {
          console.log("result", result.data);
          setComments(result.data.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          setNewComment("");
          setIsSubmitting(false);
        })
        .catch((err) => {
          console.log(err);
          setIsSubmitting(false);

        }), 
      {
        loading: { title: "Loading", description: "Submitting comment...", icon: "⌛"},
        success: { title: "Success", description: "Comment submitted!", icon: "👏",duration:"3000"},
        error: { title: "Error", description: "Error submitting comment", icon: "😞",duration:"3000"},
      }
    );
  };

  useEffect(() => {
    postService.getPostComments(postId).then((result) => {
      //sort by latest
      result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log("fetched comments", result.data)
      setComments(result.data);

    }).catch((err) => {
      console.log(err)
    });

  }, [postId])
  return (
    <>
      <Flex w={"full"} direction={'column'}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          mb={2}
        />
        <Button onClick={handleAddComment}  isLoading={isSubmitting} loadingText="Submitting..." colorScheme="blue" w={'fit-content'} alignSelf={'end'}>
          Submit
        </Button>
      </Flex>
      <VStack align="start" spacing={4} my={5}>

        {comments.map((comment) => (
          <>
            <SingleComment key={comment._id} comment={comment} replies={comment.replies} isReply={false} />
            <Divider w={"xs"} mx={5} border={'5'} />
          </>
        ))}

      </VStack>
    </>
  )
}

export default Comments