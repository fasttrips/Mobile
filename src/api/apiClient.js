// src/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "https://apis.trasgo.life/api/v1/", // Ganti dengan API Anda
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk request (misalnya, menambahkan token jika ada)
api.interceptors.request.use(
  async (config) => {
    const token = AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk response (misalnya, menangani error global)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
