// src/lib/api.ts
import { useAuth } from "@/contexts/AuthContext";

export const useAuthorizedFetch = () => {
  const { token } = useAuth();

  return (url: string, options: RequestInit = {}) => {
    return fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
};
