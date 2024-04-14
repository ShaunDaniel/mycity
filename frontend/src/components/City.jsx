import { Box, Heading, Text, Flex, Button,Skeleton } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import postService from "../services/postService"; // import the service that fetches posts
import CityPosts from "./CityPosts";
import { AddIcon } from "@chakra-ui/icons";
import userService from "../services/userService";
import { useContext } from "react";
import FilterContext from "./FilterContext";
import NewPostModal from "./NewPostModal";
import { useDisclosure } from "@chakra-ui/react";

function City({ user }) {
  const { city } = useParams();
  const { filters } = useContext(FilterContext);

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [fileError, setFileError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredPosts, setFilteredPosts] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);

  //TODO : FIX THIS MESS

  async function getPostsByCity(city, filters) {
    // Fetch posts
    console.log("inside getPostsByCity");
    console.log("city", city);
    console.log("filters", filters);
    let posts = await postService.getPostsByCity(city);
    if (posts.data.posts) {
      posts = posts.data.posts;
      console.log(posts)
      // Apply filters
      console.log("category",filters)
      if (filters.category) {
        posts = posts.filter((post) => post.category === filters.category);
      }
      if (filters.resolved) {
        // posts = posts.filter(
        //   (post) => post.resolved === (filters.resolved === "resolved")
        // );
      }
      if (filters.date === "newest") {
        posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (filters.date === "oldest") {
        posts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }

      if (filters.upvotes === "most") {
        posts.sort((a, b) => {
          const aNetVotes = a.votes.reduce((acc, vote) => acc + vote.type, 0);
          const bNetVotes = b.votes.reduce((acc, vote) => acc + vote.type, 0);
          return bNetVotes - aNetVotes;
        });
      } else if (filters.upvotes === "least") {
        posts.sort((a, b) => {
          const aNetVotes = a.votes.reduce((acc, vote) => acc + vote.type, 0);
          const bNetVotes = b.votes.reduce((acc, vote) => acc + vote.type, 0);
          return aNetVotes - bNetVotes;
        });
      }
      
      return posts;
    } else {
      return [];
    }
  }

  useEffect(() => {
    setIsLoading(true);
    
    getPostsByCity(city, filters)
      .then((filteredPosts) => {
        // setPosts(filteredPosts);
        console.log("inside useffect");
        console.log("filtered posts", filteredPosts);
        setFilteredPosts(filteredPosts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });

    if (user && user._id) {
      userService
        .getUserVotes(user._id)
        .then((res) => {
          console.log(res.data);
          setUserVotes(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [city, user, filters]); // Add filters to the dependency array



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
        <NewPostModal setPosts={setPosts} city={city} />
        </Modal>
      </Flex>
      {isLoading && (
        <>
          <Skeleton h={"xs"} w={"xl"} p={5} mx={10} my={5} />
          <Skeleton h={"xs"} w={"xl"} p={5} mx={10} my={5} />
        </>
      )}
      {user &&  filteredPosts.length === 0 ? (
        <Text py={5} mx={10} fontSize="xl">
          {`No posts in ${user.city}, You can create one `}
          <Text
            as="span"
            onClick={onOpen}
            color="blue.800"
            cursor="pointer"
            fontWeight={600}>
            here
          </Text>
        </Text>
      ) : (
        filteredPosts.map((post, index) => {
          if (user && user.votes && post && post.description) {
            return (
              <CityPosts
                post={post}
                key={index}
                userVotes={userVotes}
                user={user}
                loading={isLoading}
              />
            );
          }
        })
      )}
    </Box>
  );
}

export default City;
