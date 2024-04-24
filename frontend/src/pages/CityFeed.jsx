import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { Box, Heading, Text, Flex, Button, Skeleton, Modal, ModalOverlay, useDisclosure, SimpleGrid, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import CityFilters from "../components/CityFilters";
import { AddIcon } from "@chakra-ui/icons";

import postService from "../services/postService"; // import the service that fetches posts
import userService from "../services/userService";

import NewPostModal from "../components/NewPostModal";
import CityPosts from "../components/CityPost";


function CityFeed({ user }) {
  const { city } = useParams();

  const [posts, setPosts] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const { isOpen: isAddPostOpen, onOpen: onAddPostOpen, onClose: onAddPostClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const [filteredPosts, setFilteredPosts] = useState([{}]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  const refreshPosts = async () => {
    try {
      const filteredPosts = await getPostsByCity(city, filters);
      setFilteredPosts(filteredPosts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  async function getPostsByCity(city, filters) {
    let posts = await postService.getPostsByCity(city);
    if (!posts.data.posts) {
      return [];
    }

    posts = posts.data.posts;

    if (filters.resolved) {
      filters.resolved === "resolved" ? posts = posts.filter((post) => post.resolved) : posts = posts.filter((post) => !post.resolved);
    }

    if (filters.category) {
      posts = posts.filter((post) => post.category === filters.category);
    }

    if (filters.date) {
      posts.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return filters.date === "newest" ? dateB - dateA : dateA - dateB;
      });
    }

    if (filters.upvotes) {
      posts.sort((a, b) => {
        const aNetVotes = a.votes.reduce((acc, vote) => acc + vote.type, 0);
        const bNetVotes = b.votes.reduce((acc, vote) => acc + vote.type, 0);
        return filters.upvotes === "most" ? bNetVotes - aNetVotes : aNetVotes - bNetVotes;
      });
    }

    return posts;
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const filteredPosts = await getPostsByCity(city, filters);
        setFilteredPosts(filteredPosts);
        if (user && user._id) {
          const res = await userService.getUserVotes(user._id);
          setUserVotes(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [city, user, filters]);

  return (
    <Box>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Flex direction={'column'} mx={10}>
        <Heading as="h2" pt={5}  size="xl" textTransform={"capitalize"}>
          {city}
        </Heading>

        <Menu >
          <MenuButton as={Button} rightIcon={<FiFilter />} onClick={onFilterOpen} mt={5}>
            Filter
          </MenuButton>
          <MenuList>
            <CityFilters filters={filters} setFilters={setFilters} />
          </MenuList>
        </Menu>
        </Flex>
        <Button
          leftIcon={<AddIcon />}
          mx={10}
          py={5}
          colorScheme="teal"
          boxSize={6}
          w={"fit-content"}
          onClick={onAddPostOpen}>
          Add post
        </Button>
        <Modal isOpen={isAddPostOpen} onClose={onAddPostClose} size={"2xl"}>
          <ModalOverlay />
          <NewPostModal setPosts={setPosts} onPostAdded={refreshPosts} onClose={onAddPostClose} city={city} />
        </Modal>
      </Flex>
      {isLoading && (
        <>
          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={2}>
          <Skeleton h={"xs"} w={"xl"} p={5} mx={10} my={5} />
          <Skeleton h={"xs"} w={"xl"} p={5} mx={10} my={5} />
          <Skeleton h={"xs"} w={"xl"} p={5} mx={10} my={5} />
          <Skeleton h={"xs"} w={"xl"} p={5} mx={10} my={5} />
          </SimpleGrid>
        </>
      )}
      {user && filteredPosts.length === 0 ? (
        <Text py={5} mx={10} fontSize="xl">
          {`No posts in ${user.city}, You can create one `}
          <Text
            as="span"
            onClick={onAddPostOpen}
            color="blue.800"
            cursor="pointer"
            fontWeight={600}>
            here
          </Text>
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {filteredPosts.map((post, index) => {
            if (user && user.votes && post && post.description) {
              return (
                <>
                <CityPosts
                  post={post}
                  key={index}
                  userVotes={userVotes}
                  user={user}
                  loading={isLoading}
                />  
              </>
              );
            }
          })}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default CityFeed;
