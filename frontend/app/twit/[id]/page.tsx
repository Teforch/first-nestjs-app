"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LogIn } from "lucide-react";

import { MainLayout } from "@/components/main-layout";
import { TwitCard } from "@/components/twit-card";
import { Button } from "@/components/ui/button";
import { type Comment, type Twit, createComment, getTwit } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { getUserFromToken, getTokens } from "@/lib/auth";

export default function TwitPage() {
  const params = useParams();
  const router = useRouter();
  const [twit, setTwit] = useState<Twit | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log(comments);

  const tokens = getTokens();
  const user = tokens ? getUserFromToken(tokens.accessToken) : null;

  const twitId = params?.id as string;

  useEffect(() => {
    setIsLoggedIn(!!tokens);
  }, [tokens]);

  const fetchTwit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTwit(twitId);
      setTwit(data);
      // Set comments from the API response
      setComments(data.comments || []);
    } catch (err) {
      setError("Failed to load tweet. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (twitId) {
      fetchTwit();
    }
  }, [twitId]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !twitId) return;

    setIsSubmitting(true);
    try {
      const newComment = await createComment(twitId, commentText);
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      // Refresh the twit to get updated comment count
      fetchTwit();
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse">Loading tweet...</div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-destructive">
          {error}
          <button
            onClick={fetchTwit}
            className="block mx-auto mt-2 text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      ) : twit ? (
        <div>
          <TwitCard twit={twit} />

          {isLoggedIn ? (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold">Add a comment</h3>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {user?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Textarea
                    placeholder="Write a comment..."
                    className="flex-1 resize-none"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isSubmitting}
                >
                  Comment
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Join the conversation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to add your comment
                </p>
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In to Comment
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comments</h3>

            {comments.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="mb-4">
                  <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar>
                        <AvatarFallback>
                          {comment.user.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {comment.user.username}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{comment.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : null}
    </MainLayout>
  );
}
