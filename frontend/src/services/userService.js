import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL + 'api/users';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


function register(user) {
  return api.post(`${API_URL}/register`, user);
}

function isGoogleAccount(email) {
  return api.get(`${API_URL}/google-account/${email}`);

}

function login(credentials) {
  return api.post(`${API_URL}/login`,{username:credentials.email,password:credentials.password});
}

function logout() {
  return api.get(`${API_URL}/logout`,{withCredentials:true});
}

function user_details(jwtToken) {

  return api.get(`${API_URL}/user-details`,{
    headers: {
      Authorization: `${jwtToken}`,
    },
  });

}


function userExists(email) {
  return api.get(`${API_URL}/email-exists/${email}`);
}


function updateUser(id, user) {
  return api.put(`${API_URL}/${id}`, user);
}

function getUserVotes(id) {
  return api.get(`${API_URL}/${id}/votes`);
}

function addToUpvotedPosts(id, postId) {
  return api.put(`${API_URL}/${id}/upvotes`, { postId });
}

function deleteUser(id) {
  return api.delete(`${API_URL}/${id}`);
}

function  fetchCities(){
  return api.get(`${API_URL}/cities`);
}

const userService = {
  register,
  login,
  userExists,
  updateUser,
  deleteUser,
  fetchCities,
  user_details,
  logout,
  isGoogleAccount,
  getUserVotes,
  addToUpvotedPosts
};
export default userService;