"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Home, LogIn, LogOut, MessageSquare, User } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { clearTokens, getTokens, getUserFromToken } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const tokens = getTokens();
    if (!tokens) {
      setIsLoggedIn(false);
      return;
    }

    const user = getUserFromToken(tokens.accessToken);
    if (user) {
      setUserName(user.username);
      setIsLoggedIn(true);
    } else {
      // For mock data, we'll set a default user name if token decoding fails
      setUserName("John Doe");
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    clearTokens();
    setIsLoggedIn(false);
    setUserName(null);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4 flex flex-col">
        <div className="text-2xl font-bold mb-8">
          <Link href="/">Twitter Clone</Link>
        </div>

        <nav className="space-y-2 flex-1">
          <Link
            href="/"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          {isLoggedIn && (
            <>
              <Link
                href="/notifications"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary"
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </Link>
              <Link
                href="/messages"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </>
          )}
        </nav>

        {isLoggedIn ? (
          <>
            <Button className="w-full mb-4">Tweet</Button>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{userName}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-auto space-y-2">
            <Button
              className="w-full"
              onClick={() => router.push("/auth/login")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/auth/register")}
            >
              Register
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Home</h1>
          <ThemeToggle />
        </header>

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
