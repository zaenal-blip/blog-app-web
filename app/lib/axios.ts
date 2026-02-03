import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://doablefold-us.backendless.app",
});

export const axiosInstance2 = axios.create({
  baseURL: "http://localhost:8000",
});