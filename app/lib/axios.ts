// import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
// import { useAuth } from "../stores/useAuth";

// export const axiosInstance = axios.create({
//   baseURL: "https://doablefold-us.backendless.app",
// });

// export const axiosInstance2 = axios.create({
//   baseURL: "http://localhost:8000",
//   withCredentials: true,
// });

// export const refreshInstance = axios.create({
//   baseURL: "http://localhost:8000",
//   withCredentials: true,
// });

// axiosInstance2.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         await refreshInstance.post("/auth/refresh");
//         return axiosInstance2(originalRequest);
//       } catch (error) {
//         useAuth.getState().logout();
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

import axios from "axios";
import { useAuth } from "~/stores/useAuth";

export const axiosInstance = axios.create({
  baseURL: "https://doablefold-us.backendless.app",
});

export const axiosInstance2 = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API || "http://localhost:8000",
  withCredentials: true,
});

export const refreshInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API || "http://localhost:8000",
  withCredentials: true,
});

axiosInstance2.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token expired" &&
      !originalRequest._retry
    ) {
      try {
        await refreshInstance.post("/auth/refresh");
        return axiosInstance2(originalRequest);
      } catch (error) {
        useAuth.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);