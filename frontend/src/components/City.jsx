import { Box, Heading, Text, Card, Tag, Flex, Button } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  InputGroup,
  InputRightElement,
  Skeleton
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import postService from "../services/postService"; // import the service that fetches posts
import UserContext from "./UserContext";
import CityPosts from "./CityPosts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChatIcon,
  AddIcon,
} from "@chakra-ui/icons";
import userService from "../services/userService";

function City() {
  const issues = [
    "Road-Related Issues",
    "Water-Related Issues",
    "Waste Management Issues",
    "Electricity-Related Issues",
    "Public Infrastructure Issues",
    "Environmental Issues",
    "Public Health and Safety Issues",
    "Public Transportation Issues",
    "Education and Social Infrastructure Issues",
    "Emergency and Disaster-Related Issues"
  ];

  const { city } = useParams();

  const {user,setUser} = useContext(UserContext)
  const { votesUpdated, setVotesUpdated } = useState(false);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  // const { user, setUser } = useContext(UserContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [fileError, setFileError] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    setIsLoading(true);
    postService.getPostsByCity(city).then((res) => {
      console.log("Loading posts...",res.data.posts);
      setPosts(res.data.posts);
      setIsLoading(false);
    }).catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
    if(user && user._id){
    userService.getUserVotes(user._id).then((res) => {
      console.log(res.data);
      setUserVotes(res.data);
    }).catch((err) => {
      console.error(err);
    }
    );
  }}, [city,votesUpdated]);





  const handleNewPostChange = (e) => {
    setNewPost({
      ...newPost,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // size in MB
    const maxFileSize = 2; // 2MB

    if (fileSize > maxFileSize) {
      setFileError('File size exceeds 2MB');
    } else {
      setSelectedFile(file);
      setFileError('');

    }
  };


  return (
    <Box>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Heading as="h2" py={5} mx={10} size="xl" textTransform={"capitalize"}>
          {city}
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          mx={10}
          py={5}
          colorScheme="teal"
          boxSize={6}
          w={"fit-content"}
          onClick={onOpen}>
          Add post{" "}
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add a new post</ModalHeader>
            <ModalCloseButton />
            <ModalBody
              as="form"
              onSubmit={handleSubmit}
              p={5}
              borderWidth="1px">
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  placeholder="Select category"
                  value={newPost.category}
                  onChange={handleNewPostChange}>
                  {issues.map((category, index) => {
                    return <option key={index} value={category}>{category}</option>;
                  })}
                </Select>
              </FormControl>
              <FormControl mt={4} isRequired>
                <FormLabel>Post Title</FormLabel>
                <Input
                  name="title"
                  value={newPost.title}
                  onChange={handleNewPostChange}
                  placeholder="Enter post title"
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Post Description</FormLabel>
                <Textarea
                  name="description"
                  value={newPost.description}
                  onChange={handleNewPostChange}
                  placeholder="Enter post description"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Attach Image</FormLabel>
                <InputGroup>
                  <Input
                    type="text"
                    value={selectedFile ? selectedFile.name : ''}
                    placeholder={selectedFile ? selectedFile.name : "No file chosen"}
                    isReadOnly
                  />
                  <InputRightElement width="auto">
                    <label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                      />
                      <Button as="span">Browse</Button>
                    </label>
                  </InputRightElement>
                </InputGroup>
                {fileError && <Text color="red.500">{fileError}</Text>}
              </FormControl>

            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Submit
              </Button>

              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      {posts.map((post, index) => {
        if(user && user.votes){
          return (
            <CityPosts post={post} key={index} userVotes={userVotes} user={user}/>
            )
        }
      })}
    </Box>
  );
  }


export default City;
