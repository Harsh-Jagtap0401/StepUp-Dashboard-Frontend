import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Change the base URL as per your backend.
});

export default instance;
