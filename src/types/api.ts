export type ApiResponse<T = unknown> = {
  code: string;
  data?: T | null;
  message: string;
  success: boolean;
};
