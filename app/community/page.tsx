"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageCircle, Heart, Share2, Plus, TrendingUp, Smile, Frown, Meh } from "lucide-react"
import Navigation from "@/components/navigation"

interface Post {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
  comments: number
  mood: "happy" | "neutral" | "sad"
  category: string
}

interface User {
  id: string
  name: string
  communityPosts: number
  userType: string
}

export default function Community() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [selectedMood, setSelectedMood] = useState<"happy" | "neutral" | "sad">("neutral")
  const [selectedCategory, setSelectedCategory] = useState("General")
  const [showNewPost, setShowNewPost] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== "patient") {
      router.push("/")
      return
    }

    setUser(parsedUser)
    loadCommunityPosts()
    setIsLoading(false)
  }, [router])

  const loadCommunityPosts = () => {
    // Load posts from localStorage or start with empty array
    const savedPosts = localStorage.getItem("communityPosts")
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      setPosts([])
    }
  }

  const handleCreatePost = () => {
    if (!newPost.trim() || !user) return

    const post: Post = {
      id: Date.now().toString(),
      author: user.name,
      content: newPost,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      mood: selectedMood,
      category: selectedCategory,
    }

    const updatedPosts = [post, ...posts]
    setPosts(updatedPosts)

    // Save posts to localStorage
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))

    // Update user's post count
    const updatedUser = { ...user, communityPosts: user.communityPosts + 1 }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Update in allUsers as well
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const userIndex = allUsers.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser
      localStorage.setItem("allUsers", JSON.stringify(allUsers))
    }

    // Reset form
    setNewPost("")
    setSelectedMood("neutral")
    setSelectedCategory("General")
    setShowNewPost(false)
  }

  const handleLike = (postId: string) => {
    const updatedPosts = posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post))
    setPosts(updatedPosts)
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "happy":
        return <Smile className="h-4 w-4 text-green-400" />
      case "sad":
        return <Frown className="h-4 w-4 text-red-400" />
      default:
        return <Meh className="h-4 w-4 text-yellow-400" />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "bg-green-600"
      case "sad":
        return "bg-red-600"
      default:
        return "bg-yellow-600"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading community...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Access denied. Please sign in as a patient.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Users className="h-8 w-8" />
              Patient Community
            </h1>
            <p className="text-gray-400">Connect with others on similar journeys for support and encouragement</p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">1,247</p>
                    <p className="text-gray-400 text-sm">Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{posts.length}</p>
                    <p className="text-gray-400 text-sm">Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      {posts.reduce((total, post) => total + post.likes, 0)}
                    </p>
                    <p className="text-gray-400 text-sm">Support Given</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{user.communityPosts}</p>
                    <p className="text-gray-400 text-sm">Your Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create Post */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Share with the Community</CardTitle>
                <Button onClick={() => setShowNewPost(!showNewPost)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>
            </CardHeader>

            {showNewPost && (
              <CardContent className="space-y-4">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts, experiences, or ask for support..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />

                <div className="flex flex-wrap gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">How are you feeling?</label>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedMood === "happy" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMood("happy")}
                        className={
                          selectedMood === "happy"
                            ? "bg-green-600"
                            : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        }
                      >
                        <Smile className="h-4 w-4 mr-1" />
                        Good
                      </Button>
                      <Button
                        variant={selectedMood === "neutral" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMood("neutral")}
                        className={
                          selectedMood === "neutral"
                            ? "bg-yellow-600"
                            : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        }
                      >
                        <Meh className="h-4 w-4 mr-1" />
                        Okay
                      </Button>
                      <Button
                        variant={selectedMood === "sad" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMood("sad")}
                        className={
                          selectedMood === "sad"
                            ? "bg-red-600"
                            : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        }
                      >
                        <Frown className="h-4 w-4 mr-1" />
                        Tough
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-1 text-sm"
                    >
                      <option value="General">General</option>
                      <option value="Treatment Journey">Treatment Journey</option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Milestones">Milestones</option>
                      <option value="Side Effects">Side Effects</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewPost(false)}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Share Post
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No Posts Yet</h3>
                  <p className="text-gray-400 mb-4">Be the first to share with the community</p>
                  <Button onClick={() => setShowNewPost(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{post.author}</h3>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-400 text-sm">{post.timestamp}</span>
                          <Badge variant="secondary" className={`${getMoodColor(post.mood)} text-white text-xs`}>
                            {getMoodIcon(post.mood)}
                            <span className="ml-1">{post.mood}</span>
                          </Badge>
                          <Badge variant="outline" className="bg-gray-800 border-gray-700 text-gray-300 text-xs">
                            {post.category}
                          </Badge>
                        </div>

                        <p className="text-gray-300 leading-relaxed">{post.content}</p>

                        <div className="flex items-center gap-6 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className="text-gray-400 hover:text-red-400 hover:bg-gray-800"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-blue-400 hover:bg-gray-800"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-green-400 hover:bg-gray-800"
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Load More */}
          {posts.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                Load More Posts
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
