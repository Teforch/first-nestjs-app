import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
}

export async function login(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

export async function refreshToken(token: string): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/api/auth/login/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Token refresh failed");
  }

  return response.json();
}

export function getUserFromToken(token: string): User | null {
  try {
    return jwtDecode<User>(token);
  } catch (error) {
    return null;
  }
}

export function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
}

export function getTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

export function clearTokens(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
