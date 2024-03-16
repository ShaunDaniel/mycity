import { Text } from '@chakra-ui/react'
import React from 'react'
function HomepageFeatureTab(props) {
  return (
    <Text p={5} h={'fit-content'} bgColor={"#B2D7D9"} rounded={'15'} fontSize={{base:'3xl',lg:'medium'}} cursor={'pointer'}>
        {props.text}
    </Text>
  )
}
 
export default HomepageFeatureTab