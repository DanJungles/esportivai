import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.esportivai.com/api',
});

export default api;
