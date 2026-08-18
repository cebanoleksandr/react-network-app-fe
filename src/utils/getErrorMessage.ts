import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string | string[];
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message[0] ?? fallback;
    if (typeof message === "string") return message;
  }
  return fallback;
};
