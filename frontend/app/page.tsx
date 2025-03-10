"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { CreateTwit } from "@/components/create-twit";
import { TwitCard } from "@/components/twit-card";
import { type Twit, getTwits } from "@/lib/api";
import { getTokens } from "@/lib/auth";

export default function HomePage() {
  console.log("Hi");
  const router = useRouter();
  const [twits, setTwits] = useState<Twit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const tokens = getTokens();
    setIsLoggedIn(!!tokens);
  }, []);

  const fetchTwits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTwits();
      setTwits(data);
    } catch (err) {
      setError("Failed to load tweets. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTwits();
  }, []);

  return (
    <MainLayout>
      {isLoggedIn && <CreateTwit onTwitCreated={fetchTwits} />}

      {!isLoggedIn && (
        <div className="bg-muted/30 rounded-lg p-4 mb-6 text-center">
          <h2 className="text-lg font-medium mb-2">Join the conversation</h2>
          <p className="text-muted-foreground mb-4">
            Sign in to post tweets and join the conversation.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/auth/login")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse">Loading tweets...</div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-destructive">
          {error}
          <button
            onClick={fetchTwits}
            className="block mx-auto mt-2 text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      ) : twits.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No tweets yet. Be the first to tweet!
        </div>
      ) : (
        <div>
          {twits.map((twit) => (
            <TwitCard key={twit.id} twit={twit} />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
