import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL + '/api/users';

function register(user) {
  return axios.post(`${API_URL}/register`, user);
}

function isGoogleAccount(email) {
  return axios.get(`${API_URL}/google-account/${email}`);

}

function login(credentials) {
  return axios.post(`${API_URL}/login`,{username:credentials.email,password:credentials.password});
}

function logout() {
  return axios.get(`${API_URL}/logout`,{withCredentials:true});
}

function user_details() {
  return axios.get(`${API_URL}/user-details`,{withCredentials:true});
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
  isGoogleAccount
};
export default userService;