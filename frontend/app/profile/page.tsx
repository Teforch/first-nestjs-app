"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { TwitCard } from "@/components/twit-card"
import { type Twit, deleteTwit, getTwits } from "@/lib/api"
import { getUserFromToken, getTokens } from "@/lib/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [twits, setTwits] = useState<Twit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const tokens = getTokens()
  const user = tokens ? getUserFromToken(tokens.accessToken) : null

  useEffect(() => {
    // Check if user is logged in
    if (!tokens) {
      router.push("/auth/login")
      return
    }

    setIsLoggedIn(true)
    fetchTwits()
  }, [router])

  const fetchTwits = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getTwits()
      // Filter to only show the current user's twits
      // For mock data, we'll use user ID "1" as the default logged-in user
      const userTwits = data.filter((twit) => twit.userId === (user?.id || "1"))
      setTwits(userTwits)
    } catch (err) {
      setError("Failed to load tweets. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTwit = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tweet?")) return

    try {
      await deleteTwit(id)
      setTwits(twits.filter((twit) => twit.id !== id))
    } catch (error) {
      console.error("Failed to delete tweet:", error)
    }
  }

  if (!isLoggedIn) {
    return null // Will redirect in useEffect
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="h-32 bg-primary/10 rounded-lg mb-4"></div>
        <div className="flex justify-between items-end px-4">
          <Avatar className="w-24 h-24 border-4 border-background -mt-12">
            <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <Button>Edit profile</Button>
        </div>

        <div className="mt-4 px-4">
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-muted-foreground">@{user?.name?.toLowerCase().replace(/\s+/g, "")}</p>

          <p className="mt-4">Twitter clone user</p>

          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div>
              <span className="font-bold">120</span> <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold">25</span> <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b mb-4">
        <h3 className="font-semibold px-4 pb-2">Tweets</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse">Loading tweets...</div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-destructive">
          {error}
          <button onClick={fetchTwits} className="block mx-auto mt-2 text-primary hover:underline">
            Try again
          </button>
        </div>
      ) : twits.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          You haven&apos;t tweeted yet. Create your first tweet!
        </div>
      ) : (
        <div>
          {twits.map((twit) => (
            <TwitCard key={twit.id} twit={twit} onDelete={handleDeleteTwit} />
          ))}
        </div>
      )}
    </MainLayout>
  )
}

