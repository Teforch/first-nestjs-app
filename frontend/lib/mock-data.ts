import type { User, AuthTokens } from "./auth"
import type { Twit, Comment } from "./api"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    createdAt: "2023-02-20T14:30:00Z",
  },
  {
    id: "3",
    email: "bob@example.com",
    name: "Bob Johnson",
    createdAt: "2023-03-10T09:15:00Z",
  },
]

// Mock Tweets
export const mockTwits: Twit[] = [
  {
    id: "1",
    content: "Just setting up my Twitter clone! #FirstTweet",
    userId: "1",
    userName: "John Doe",
    createdAt: "2023-04-01T12:00:00Z",
    updatedAt: "2023-04-01T12:00:00Z",
    commentsCount: 2,
  },
  {
    id: "2",
    content: "This is a really cool Twitter clone built with Next.js and Tailwind CSS! 🚀",
    userId: "2",
    userName: "Jane Smith",
    createdAt: "2023-04-02T10:30:00Z",
    updatedAt: "2023-04-02T10:30:00Z",
    commentsCount: 1,
  },
  {
    id: "3",
    content:
      "Learning React and Next.js has been an amazing journey. Highly recommend it to anyone interested in web development!",
    userId: "3",
    userName: "Bob Johnson",
    createdAt: "2023-04-03T15:45:00Z",
    updatedAt: "2023-04-03T15:45:00Z",
    commentsCount: 3,
  },
  {
    id: "4",
    content: "Just deployed my first project to Vercel. The experience was seamless! 👏",
    userId: "1",
    userName: "John Doe",
    createdAt: "2023-04-04T09:20:00Z",
    updatedAt: "2023-04-04T09:20:00Z",
    commentsCount: 0,
  },
  {
    id: "5",
    content: "Tailwind CSS makes styling so much faster. I'm never going back to traditional CSS!",
    userId: "2",
    userName: "Jane Smith",
    createdAt: "2023-04-05T11:10:00Z",
    updatedAt: "2023-04-05T11:10:00Z",
    commentsCount: 2,
  },
]

// Mock Comments
export const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "101",
      content: "Welcome to the Twitter clone!",
      userId: "2",
      userName: "Jane Smith",
      twitId: "1",
      createdAt: "2023-04-01T12:30:00Z",
      updatedAt: "2023-04-01T12:30:00Z",
    },
    {
      id: "102",
      content: "Great first tweet!",
      userId: "3",
      userName: "Bob Johnson",
      twitId: "1",
      createdAt: "2023-04-01T13:15:00Z",
      updatedAt: "2023-04-01T13:15:00Z",
    },
  ],
  "2": [
    {
      id: "103",
      content: "I agree, this is awesome!",
      userId: "1",
      userName: "John Doe",
      twitId: "2",
      createdAt: "2023-04-02T11:00:00Z",
      updatedAt: "2023-04-02T11:00:00Z",
    },
  ],
  "3": [
    {
      id: "104",
      content: "React is my favorite framework too!",
      userId: "1",
      userName: "John Doe",
      twitId: "3",
      createdAt: "2023-04-03T16:00:00Z",
      updatedAt: "2023-04-03T16:00:00Z",
    },
    {
      id: "105",
      content: "Have you tried Vue.js as well?",
      userId: "2",
      userName: "Jane Smith",
      twitId: "3",
      createdAt: "2023-04-03T16:30:00Z",
      updatedAt: "2023-04-03T16:30:00Z",
    },
    {
      id: "106",
      content: "Next.js is a game changer for sure!",
      userId: "3",
      userName: "Bob Johnson",
      twitId: "3",
      createdAt: "2023-04-03T17:00:00Z",
      updatedAt: "2023-04-03T17:00:00Z",
    },
  ],
  "5": [
    {
      id: "107",
      content: "Tailwind has changed my workflow completely!",
      userId: "1",
      userName: "John Doe",
      twitId: "5",
      createdAt: "2023-04-05T11:30:00Z",
      updatedAt: "2023-04-05T11:30:00Z",
    },
    {
      id: "108",
      content: "Do you use any Tailwind plugins?",
      userId: "3",
      userName: "Bob Johnson",
      twitId: "5",
      createdAt: "2023-04-05T12:00:00Z",
      updatedAt: "2023-04-05T12:00:00Z",
    },
  ],
}

// Mock Auth Tokens
export const mockAuthTokens: AuthTokens = {
  accessToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJjcmVhdGVkQXQiOiIyMDIzLTAxLTE1VDEwOjAwOjAwWiIsImlhdCI6MTYxNjE1MTYxNiwiZXhwIjoxNjE2MTU1MjE2fQ.signature",
  refreshToken: "mock-refresh-token",
}

