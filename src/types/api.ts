export type ApiResponse<T = any> = {
  error: boolean;
  message: string;
  data: T | null;
};

