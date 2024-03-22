import axios from 'axios';
const API_URL = 'http://localhost:3001/api/users';

function register(user) {
  return axios.post(`${API_URL}/register`, user);
}

function login(credentials) {
  console.log({username:credentials.email,password:credentials.password})
  return axios.post(`${API_URL}/login`,{username:credentials.email,password:credentials.password});
}

function logout() {
  return axios.get(`${API_URL}/logout`,{withCredentials:true});
}

function user_details() {
  return axios.get(`${API_URL}/user_details`,{withCredentials:true});
}


function userExists(email) {
  return axios.get(`${API_URL}/email-exists/${email}`);
}


function updateUser(id, user) {
  return axios.put(`${API_URL}/${id}`, user);
}


function deleteUser(id) {
  return axios.delete(`${API_URL}/${id}`);
}

function  fetchCities(){
  return axios.get(`${API_URL}/cities`);
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

};
export default userService;