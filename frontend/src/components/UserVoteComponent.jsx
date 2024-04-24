import React, { useContext } from 'react';
import { Flex, Button, Text, Skeleton,Collapse,useDisclosure,Box } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon, ChatIcon } from '@chakra-ui/icons';
import postService from '../services/postService';
import { useEffect, useState } from 'react';
import UserContext from './UserContext';

const UserVoteComponent = ({ post, loading }) => {
    console.log("iNSIDE UserVoteComponent",post)
    const { user, setUser } = useContext(UserContext);
    const [postVoteCount, setPostVoteCount] = useState(post.voteCount);
    const [userVote, setUserVote] = useState(post.votes.find(vote => vote.userId === user._id));

    useEffect(() => {
        console.log('postVoteCount has changed', postVoteCount);
        // Perform your side effect here
    }, [postVoteCount, userVote]);

    const handleUpvote = (postId) => {

        postService.upvotePost(postId, user._id).then((res) => {
            console.log("upvoted post", res.data);
            if (res.data && res.data.postVotes) {
                setUserVote(res.data.postVotes.find(vote => vote.userId === user._id))
            }
            else {
                setUserVote(null)
            }
            setPostVoteCount(res.data.voteCount)
        }).catch((err) => {
            console.log(err)
        });
    };

    const handleDownvote = (postId) => {
        postService.downvotePost(postId, user._id).then((res) => {
            console.log("downvoted post", res.data);
            if (res.data && res.data.postVotes) {
                setUserVote(res.data.postVotes.find(vote => vote.userId === user._id))
            }
            else {
                setUserVote(null)
            }
            setPostVoteCount(res.data.voteCount)

        }).catch((err) => {
            console.log(err)
        });
    };
    return (
        <>
        <Flex alignItems={'center'}>
            <Skeleton isLoaded={loading}>
                <Button
                    leftIcon={<ArrowUpIcon />}
                    _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s', transitionBehavior: 'smooth' }}
                    variant={userVote && userVote.type === 1 ? 'solid' : 'outline'}
                    id={post._id}
                    onClick={(e) => {
                        handleUpvote(post._id);
                    }}>
                    {userVote && userVote.type === 1 ? 'Upvoted' : 'Upvote'}
                </Button>
            </Skeleton>
            <Skeleton alignContent={'center'} isLoaded={loading} mx={5} h={'fit-content'} alignSelf={'center'}>
                <Text >{postVoteCount}</Text>
            </Skeleton>
            <Skeleton isLoaded={loading}>
                <Button
                    leftIcon={<ArrowDownIcon />}
                    _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s', transitionBehavior: 'smooth' }}
                    variant={userVote && userVote.type === 0 ? 'solid' : 'outline'}
                    id={post._id}
                    onClick={(e) => {
                        handleDownvote(post._id);
                    }}>
                    {userVote && userVote.type === 0 ? 'Downvoted' : 'Downvote'}
                </Button>
            </Skeleton>
            
        </Flex>
        
        </>
    );
};

export default UserVoteComponent;