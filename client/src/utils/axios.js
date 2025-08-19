// src/utils/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-gaec.onrender.com/api", // ✅ your backend URL
});

// Add token to all requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default API;
