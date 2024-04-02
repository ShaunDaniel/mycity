import axios from 'axios';


const baseURL = `${process.env.REACT_APP_API_URL}api/posts`; // replace with your API base URL


const postService = {

  // get posts by city
  getPostsByCity: async (city) => {
    return await axios.get(`${baseURL}/${encodeURIComponent(city)}`);
  },

  // get post by id
  getPostById: async (id) => {
    return await axios.get(`${baseURL}/${id}`);
  },

  // create a post
  createPost: async (data) => {
    return await axios.post(baseURL, data);
  },

  // update a post
  updatePost: async (id, data) => {
    return await axios.put(`${baseURL}/${id}`, data);
  },

  // delete a post
  deletePost: async (id) => {
    return await axios.delete(`${baseURL}/${id}`);
  },

  upvotePost: async (postId,userId) => {
    return await axios.put(`${baseURL}/vote`,{postId:postId,userId:userId,voteType:1});
  },

  downvotePost: async (postId,userId) => {
    return await axios.put(`${baseURL}/vote`,{postId:postId,userId:userId,voteType:0});
  },
};

export default postService;