declare namespace Api {
  interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
  }
}