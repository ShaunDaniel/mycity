import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users';

function register(user) {
  return axios.post(`${API_URL}/register`, user);
}

function login(credentials) {
  return axios.post(`${API_URL}/login`, credentials);
}


function getUser(id) {
  return axios.get(`${API_URL}/${id}`);
}


function updateUser(id, user) {
  return axios.put(`${API_URL}/${id}`, user);
}


function deleteUser(id) {
  return axios.delete(`${API_URL}/${id}`);
}

const userService = {
  register,
  login,
  getUser,
  updateUser,
  deleteUser
};
export default userService;