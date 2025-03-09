import { getTokens, refreshToken, saveTokens, User } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Twit {
  id: string;
  content: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  commentsCount: number;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  user: User;
  twitId: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const tokens = getTokens();

  if (!tokens) {
    throw new Error("No authentication tokens found");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${tokens.accessToken}`,
  };

  let response = await fetch(url, { ...options, headers });

  // If unauthorized, try to refresh the token
  if (response.status === 401) {
    try {
      const newTokens = await refreshToken(tokens.refreshToken);
      saveTokens(newTokens);

      // Retry with new token
      headers.Authorization = `Bearer ${newTokens.accessToken}`;
      response = await fetch(url, { ...options, headers });
    } catch (error) {
      throw new Error("Session expired. Please login again.");
    }
  }

  return response;
}

// Twits API
export async function getTwits(): Promise<Twit[]> {
  const response = await fetch(`${API_URL}/api/twits`);

  if (!response.ok) {
    throw new Error("Failed to fetch twits");
  }

  return response.json();
}

export async function getTwit(id: string): Promise<Twit> {
  const response = await fetch(`${API_URL}/api/twits/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch twit");
  }

  return response.json();
}

export async function createTwit(content: string): Promise<Twit> {
  console.log(content);
  const response = await fetchWithAuth(`${API_URL}/api/twits/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to create twit");
  }

  return response.json();
}

export async function updateTwit(id: string, content: string): Promise<Twit> {
  const response = await fetchWithAuth(`${API_URL}/api/twits/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Failed to update twit");
  }

  return response.json();
}

export async function deleteTwit(id: string): Promise<void> {
  const response = await fetchWithAuth(`${API_URL}/api/twits/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete twit");
  }
}

// Comments API
export async function createComment(
  twitId: string,
  content: string,
): Promise<Comment> {
  const response = await fetchWithAuth(
    `${API_URL}/api/comments/new/${twitId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
}

export async function updateComment(
  id: string,
  content: string,
): Promise<Comment> {
  const response = await fetchWithAuth(`${API_URL}/api/comments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Failed to update comment");
  }

  return response.json();
}

export async function deleteComment(id: string): Promise<void> {
  const response = await fetchWithAuth(`${API_URL}/api/comments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }
}
