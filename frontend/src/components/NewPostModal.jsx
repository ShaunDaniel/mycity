// NewPostModal.jsx
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    InputGroup,
    InputRightElement,
    Button,
    Text,
    useDisclosure,

} from '@chakra-ui/react';


import UserContext from './UserContext';
import { useContext } from 'react';
import postService from '../services/postService';



const NewPostModal = ({city,setPosts}) => {
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


    const [isFormEmpty, setIsFormEmpty] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newPost, setNewPost] = useState({ title: "", description: "", category: "" });

    const [fileError, setFileError] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useContext(UserContext);

    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        if (!selectedFile) {
          setFileError("Please select a file");
          setIsSubmitting(false);
          return;
        }
    
        const formData = new FormData();
        Object.keys(newPost).forEach((key) => formData.append(key, newPost[key]));
        formData.append("image", selectedFile);
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
            // Reload the posts
            const res = await postService.getPostsByCity(city);
            setPosts(res.data.posts);
          })
          .catch((error) => {
            console.error("Error creating post", error);
            setIsSubmitting(false);
          });
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
      const handleNewPostChange = (event) => {
        setNewPost(prevPost => ({
            ...prevPost,
            [event.target.name]: event.target.value
        }));
    
        setIsFormEmpty(!event.target.value);
    };
  return (
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
                  value={newPost.category}
                  onChange={handleNewPostChange}>
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
                    value={selectedFile ? selectedFile.name : ""}
                    placeholder={
                      selectedFile ? selectedFile.name : "No file chosen"
                    }
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
              <Button
                colorScheme="teal"
                mr={3}
                type="submit"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Submitting"
                isDisabled={isFormEmpty || isSubmitting}
                >
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