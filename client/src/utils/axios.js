import axios from 'axios';
import { VITE_API_URL } from '../constants/loader';

const instance = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
