import {  Stack, Image, Flex, Text, Heading, Button } from '@chakra-ui/react'
import HomepageFeatureTab from '../components/HomepageFeatureTab'
import { useNavigate } from 'react-router-dom';

function Homepage() {

  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <Flex direction={'column'} height={'90vh'} overflow={'auto'}>
      <Stack direction={{ base: "column", lg: "row" }} w={"100%"} h={'fit-content'} justifyContent={'space-between'} bgColor={"#76ABAE"}>
        
        <Flex w={{ base: "80%", lg: "50%" }} justifyContent={'center'} gap={5} mx={{ base: '1rem', xl: '5rem' }} my={{ base: '1rem' }} direction={'column'} h={{ base: "30vh", lg: "50vh" }}>
          <Heading fontSize={{ base: '0.5rem', sm: '4rem', lg: '1.5rem', xl: '2rem' }}>
            Empowering Citizens, <br />
            Enabling Smart Governance
          </Heading>
          <Text fontSize={{ base: '3rem', sm: '2rem', lg: '1rem' }} fontWeight={300}>
            Report civic issues, track progress, & collaborate with authorities to improve your city.
          </Text>
          <Button w={'fit-content'} fontSize={{ base: '2rem', lg: '1rem' }} onClick={handleGetStarted}>Get Started</Button>
        </Flex>

        <Flex w={'fit-content'} justifyContent={'end'}>
          <Image src='./images/hero.png' w={{ base: '50%', sm: '80%', lg: '70%' }} objectFit={'contain'} alignSelf={'flex-end'} />
        </Flex>

      </Stack>
      
      <Stack w={"100%"} h={"fit-content"} justifyContent={'space-around'} >
        <Text fontSize={{ base: '0.5rem', sm: '4rem', lg: '1.5rem', xl: '2rem' }} py={7} px={10}>
          Why <strong>MyCity?</strong>
        </Text>

        <Stack justifyContent={"space-around"} direction={{ base: "column", lg: "row" }} alignItems={'center'} gap={10}>
          <HomepageFeatureTab text="Report Civic Issues with Ease" />
          <HomepageFeatureTab text="View & Track Civic Problems in Your Area" />
          <HomepageFeatureTab text="Get Resolution Updates from Government Officials" />
        </Stack>
      
      </Stack>
    </Flex>
  )
}

export default Homepage