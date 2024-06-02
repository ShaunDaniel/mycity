import axios from 'axios';

const baseURL = `${process.env.REACT_APP_API_URL}api/posts`; // replace with your API base URL


const postService = {

  // get posts by city
  getPostsByCity: async (city) => {
    return await axios.get(`${baseURL}/city/${encodeURIComponent(city)}`);
  },

  // get post by id
  getPost: async (id) => {
    try {
      const postData = await axios.get(`${baseURL}/${id}`);
      return postData;
    }
    catch (error) {
      return error.response;
    }

  },

    // get post by id
    getPostsByUser: async (user_id) => {
      try {
        const postData = await axios.get(`${baseURL}/user/${user_id}`);
        return postData.data;
      }
      catch (error) {
        return error.response;
      }
  
    },
  

  // create a post
  createPost: async (formData) => {
    console.log("inside create post")
    console.log("form data",formData);  
    return await axios.post(baseURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

  getPostComments: async (postId) => {
    return await axios.get(`${baseURL}/comments/${postId}`);
  },

  addComment: async (postId, userId, comment) => {
    return await axios.post(`${baseURL}/comments/${postId}`, { userId, text: comment });
  },

  addReply: async (postId, userId, commentId,text) => {
    return await axios.post(`${baseURL}/comments/${postId}/${commentId}`, { userId:userId, text: text});
    
  },
};

export default postService;