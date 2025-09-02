import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";
import { toaster } from "./utils";
// Shared state for token refresh logic
let isRefreshing = false;
let failedRequestsQueue: Array<(token: string) => void> = [];
let hasLoggedOut = false;

/**
 * Navigates to the specified path using the browser's history API.
 * @param path The path to navigate to.
 */
export function navigateToPath(path: string) {
  if (typeof window !== "undefined" && path) {
    window.location.assign(path);
  }
}

// Universal request interceptor
const createRequestInterceptor = () => {
  return (config: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  };
};

// Universal response interceptor with token refresh logic
const createResponseInterceptor = (instance: AxiosInstance) => {
  const onFulfilled = (response: AxiosResponse) => response;

  const onRejected = async (error: AxiosError) => {
    const status = error.response ? error.response.status : null;
    const errorMessage = (error.response?.data as any)?.message;

    // Check for authentication errors
    const authErrors = [
      "invalid token",
      "jwt expired",
      "jwt malformed",
      "Not authorized",
      "Not authorized, token failed",
      "Not authorized as an admin",
    ];

    if (authErrors.includes(errorMessage)) {
      const refreshToken = Cookies.get("refreshToken");

      if (!refreshToken) {
        if (!hasLoggedOut) {
          hasLoggedOut = true;

        //   navigateToPath("/auth/login");
          toaster({
            message: "Your session has expired. Please log in again.",
            icon: "error",
            className: "bg-red-50",
            title: "Session Expired",
          });
        }
        return Promise.reject("Unauthorized: No refresh token available.");
      }

      // Handle token refresh
      if (!isRefreshing) {
        isRefreshing = true;
        Cookies.remove("accessToken");

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );

          const { token: newAccessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Store new tokens
          Cookies.set("accessToken", newAccessToken, { secure: true });
          Cookies.set("refreshToken", newRefreshToken, { secure: true });

          // Retry all failed requests
          failedRequestsQueue.forEach((cb) => cb(newAccessToken));
          failedRequestsQueue = [];
          isRefreshing = false;

          // Retry the original request
          if (error.config && error.config.headers) {
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return instance(error.config!);
        } catch (refreshError: any) {
          navigateToPath("/auth/login");

          if (refreshError.response?.data?.statusCode === 403) {
            Cookies.remove("refreshToken");
          }

          toaster({
            message:
              refreshError?.response?.data?.errors?.message ||
              "Session expired, please login again",
            icon: "error",
            className: "bg-red-50",
            title: "Session Expired",
          });

          failedRequestsQueue = [];
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } else {
        // Queue the request while refreshing
        return new Promise((resolve) => {
          failedRequestsQueue.push((token: string) => {
            if (error.config && error.config.headers) {
              error.config.headers.Authorization = `Bearer ${token}`;
            }
            resolve(instance(error.config!));
          });
        });
      }
    }

    if (status === 403) {
      Cookies.remove("refreshToken");
      toaster({
        message: "Refresh token is invalid or expired. Please log in again.",
        icon: "error",
        className: "bg-red-50",
        title: "Session Expired",
      });

      return Promise.reject("Forbidden: Invalid refresh token.");
    }

    return Promise.reject(error);
  };

  return { onFulfilled, onRejected };
};

// Function to apply interceptors to any axios instance
const applyInterceptors = (instance: AxiosInstance) => {
  // Apply request interceptor
  instance.interceptors.request.use(createRequestInterceptor(), (error) =>
    Promise.reject(error)
  );

  // Apply response interceptor
  const { onFulfilled, onRejected } = createResponseInterceptor(instance);
  instance.interceptors.response.use(onFulfilled, onRejected);
  return instance;
};

// Create axios instances
export const makeRequest: AxiosInstance = applyInterceptors(
  axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  })
);
