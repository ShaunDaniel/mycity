import React from 'react'
import { Flex } from "@chakra-ui/react";


function CommentVotingComponent({icon}) {
  return (
    <Flex cursor={'pointer'}  alignSelf={'center'} borderRadius={'full'}   h={'fit-content'} p={1} transition={'background-color 0.1s'} _hover={{backgroundColor:'teal.300'}}>
        {icon} 
    </Flex>
  )
}

export default CommentVotingComponent