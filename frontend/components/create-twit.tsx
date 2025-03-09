"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createTwit } from "@/lib/api"
import { getUserFromToken, getTokens } from "@/lib/auth"

interface CreateTwitProps {
  onTwitCreated: () => void
}

export function CreateTwit({ onTwitCreated }: CreateTwitProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const tokens = getTokens()
    if (tokens) {
      const userData = getUserFromToken(tokens.accessToken)
      setUser(userData)
    }
  }, [])

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await createTwit(content)
      setContent("")
      onTwitCreated()
    } catch (error) {
      console.error("Failed to create twit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What's happening?"
            className="flex-1 resize-none border-0 focus-visible:ring-0 p-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end">
        <Button onClick={handleSubmit} disabled={!content.trim() || isSubmitting}>
          Tweet
        </Button>
      </CardFooter>
    </Card>
  )
}

