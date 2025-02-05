import axios from "axios";

const fallbackURL = "https://web-production-dd1d.up.railway.app/api";
//UPDATE
//const API_URL = import.meta.env.VITE_API_URL;
const API_URL = fallbackURL;

export const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status !== 400) {
      console.error("API Error:", error.response || error.message);
    }
    return Promise.reject(error);
  }
);
