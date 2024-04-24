import React, { useEffect, useState, useContext,useRef } from "react";
import axios from "axios";
import {
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  List,
  ListItem,
  FormLabel,
  Input,
  Select,
  Textarea,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  useToast,
  Flex

} from "@chakra-ui/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverBody } from "@chakra-ui/react";

import UserContext from "./UserContext";
import postService from "../services/postService";

const NewPostModal = ({ onClose, onPostAdded }) => {
  const issues = [
    "Road-Related",
    "Water-Related",
    "Waste Management",
    "Electricity-Related",
    "Public Infrastructure",
    "Environmental",
    "Public Health and Safety",
    "Public Transportation",
    "Education and Social Infrastructure",
    "Emergency and Disaster-Related",
  ];

  const toast = useToast();
  const [isFormEmpty, setIsFormEmpty] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [areas, setAreas] = useState([]);
  const [search, setSearch] = useState("");

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/posts/area`)
      .then((response) => {
        console.log("Inside newpostmodal areas ", response.data);
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching areas", error);
      });
  }, []);

  
  const filteredAreas = areas.filter((area) => area.name.toLowerCase().includes(search.toLowerCase()));

  const handleNewPostChange = (event) => {
    setNewPost((prevPost) => ({
      ...prevPost,
      [event.target.name]: event.target.value,
    }));

    setIsFormEmpty(!event.target.value);
  };

  const handleFileChange = (e) => {
    if (!e.target.files.length) return;
    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // size in MB
    const maxFileSize = 2; // 2MB

    if (fileSize > maxFileSize) {
      setFileError("File size exceeds 2MB");
    } else {
      setSelectedFile(file);
      setFileError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData();
    Object.keys(newPost).forEach((key) => formData.append(key, newPost[key]));
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    formData.append("area",search.toLowerCase());
    formData.append("city", user.city);
    formData.append("user", user._id);
    console.log(formData);

    postService
      .createPost(formData)
      .then(async (response) => {
        console.log(response.data);
        // Clear the form
        setNewPost({});
        setSelectedFile(null);
        setIsSubmitting(false);
        // Close the modal
        onClose();
        // Refresh posts
        onPostAdded();
        toast({
          title: "Post created successfully.",
          description: "Your post has been added successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Post creation failed!",
          description: "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      });
  };

  return (
    <ModalContent>

      <ModalHeader>Add a new post</ModalHeader>
      <ModalCloseButton />

      <ModalBody as="form" onSubmit={handleSubmit} p={5} borderWidth="1px">
        <FormControl isRequired>
          <FormLabel>Area</FormLabel>
  
          <Popover isOpen={search.length!==0 && !areas.some(area => area.name.toLowerCase() === search.toLowerCase())} placement="bottom-start" shouldWrapChildren>
            <PopoverTrigger>
              <Input
                type="text"
                placeholder="Search area"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </PopoverTrigger>
            <PopoverContent w="100%">
              <PopoverBody>
                <List>
                  {filteredAreas.map((area, index) => (
                    <ListItem
                      key={index}
                      py={2}
                      px={3}
                      onClick={() => setSearch(area.name)}
                      cursor="pointer"
                    >
                      {area.name}
                    </ListItem>
                  ))}
                </List>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </FormControl>
        <FormControl mt={4} isRequired>

          <FormLabel>Category</FormLabel>
          <Select name="category" value={newPost.category} onChange={handleNewPostChange}>
            <option value="">Select Category</option>
            {issues.map((category, index) => {
              return (
                <option key={index} value={category}>
                  {category}
                </option>
              );
            })}
          </Select>
        </FormControl>

        <FormControl mt={4} isRequired>
          <FormLabel m={0}>Post Title</FormLabel>
          <Flex>
          <Input name="title" value={newPost.title} mt={2} onChange={handleNewPostChange} maxLength={150} placeholder="Enter post title" />
          </Flex>
        </FormControl>

        <FormControl mt={4} isRequired>
          <FormLabel>Post Description</FormLabel>
          <Textarea name="description" value={newPost.description} onChange={handleNewPostChange} placeholder="Enter post description" />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Attach Image</FormLabel>
          <InputGroup>
            <Input type="text" value={selectedFile ? selectedFile.name : ""} placeholder={selectedFile ? selectedFile.name : "No file chosen"} isReadOnly />
            <InputRightElement width="auto">
              <label>
                <Input type="file" accept="image/*" onChange={handleFileChange} hidden />
                <Button as="span">Browse</Button>
              </label>
            </InputRightElement>
          </InputGroup>
          {fileError && <Text color="red.500">{fileError}</Text>}
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="teal" mr={3} type="submit" onClick={handleSubmit} isLoading={isSubmitting} loadingText="Submitting" isDisabled={isFormEmpty || isSubmitting}>
          Submit
        </Button>

        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default NewPostModal;
