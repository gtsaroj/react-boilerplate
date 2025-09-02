import axios from "axios";
import { ApiError } from "./error/api.errorHandler";

export const asyncHandler = <T, K, L>(
  fn: (params?: K, secParams?: L) => Promise<T>
): ((params?: K, secondParams?: L) => Promise<T>) => {
  return async (params?: K, secParams?: L): Promise<T> => {
    try {
      return await fn(params, secParams);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        if (
          (error as any).code === "ENOTFOUND" ||
          (error as any).code === "ECONNREFUSED" ||
          (error as any).code === "ERR_NETWORK"
        ) {
          throw new ApiError(
            503,
            "Network connection error. Please check your internet."
          );
        }
        throw new ApiError(status, message, error.response?.data);
      }

      if (error instanceof Error) {
        if (
          (error as any).code === "ENOTFOUND" ||
          (error as any).code === "ECONNREFUSED" ||
          (error as any).code === "Network Error"
        ) {
          throw new ApiError(
            503,
            "Network connection error. Please check your internet."
          );
        }

        if (error.message.includes("Network Error")) {
          throw new ApiError(503, "Network Error. Please try again later.");
        }

        throw new ApiError(500, error.message);
      }

      throw new ApiError(500, "An unknown error occurred.");
    }
  };
};
