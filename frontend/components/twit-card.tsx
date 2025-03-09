"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Repeat,
  Share,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Twit } from "@/lib/api";
import { getTokens } from "@/lib/auth";
import { useEffect, useState } from "react";

interface TwitCardProps {
  twit: Twit;
  onDelete?: (id: string) => void;
}

export function TwitCard({ twit, onDelete }: TwitCardProps) {
  const formattedDate = formatDistanceToNow(new Date(twit.createdAt), {
    addSuffix: true,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const tokens = getTokens();
    setIsLoggedIn(!!tokens);
  }, []);

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
        <div className="flex items-start gap-3 flex-1">
          <Avatar>
            <AvatarFallback>{twit.user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{twit.user.username}</div>
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
        {isLoggedIn && onDelete && (
          <Button variant="ghost" size="icon" onClick={() => onDelete(twit.id)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{twit.content}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Link href={`/twit/${twit.id}`}>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{twit.commentsCount}</span>
          </Button>
        </Link>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Repeat className="h-4 w-4" />
          <span>0</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>0</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
