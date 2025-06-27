"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Plus, Target, Calendar, TrendingUp, CheckCircle, Pause, Play, Trash2 } from 'lucide-react'
import Navigation from "@/components/navigation"
import { updateUserData } from "@/lib/local-storage"

interface User {
  id: string
  name: string
  emotionalGoals: EmotionalGoal[]
}

interface EmotionalGoal {
  id: string
  goal: string
  description?: string
  targetDate: string
  progress: number
  status: "active" | "completed" | "paused"
  createdDate: string
  category: string
}

const goalCategories = [
  "Anxiety Management",
  "Sleep Quality",
  "Stress Reduction",
  "Social Connection",
  "Self-Care",
  "Mindfulness",
  "Physical Activity",
  "Emotional Resilience",
]

export default function EmotionalGoals() {
  const [user, setUser] = useState<User | null>(null)
  const [goals, setGoals] = useState<EmotionalGoal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    goal: "",
    description: "",
    targetDate: "",
    category: "Anxiety Management",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== "patient" && parsedUser.user_type !== "patient") {
      router.push("/")
      return
    }

    setUser(parsedUser)
    setGoals(parsedUser.emotionalGoals || [])
  }, [router])

  const handleAddGoal = () => {
    if (!newGoal.goal.trim() || !newGoal.targetDate) return

    const goal: EmotionalGoal = {
      id: Date.now().toString(),
      goal: newGoal.goal,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      progress: 0,
      status: "active",
      createdDate: new Date().toISOString(),
      category: newGoal.category,
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)

    // Update user data using persistent function
    if (user) {
      const updatedUser = updateUserData(user.id, {
        emotionalGoals: updatedGoals
      })
      
      if (updatedUser) {
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
    }

    // Reset form
    setNewGoal({
      goal: "",
      description: "",
      targetDate: "",
      category: "Anxiety Management",
    })
    setShowAddGoal(false)
  }

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            progress: newProgress,
            status: newProgress >= 100 ? "completed" : goal.status,
          }
        : goal,
    )
    setGoals(updatedGoals)

    // Update user data using persistent function
    if (user) {
      const updatedUser = updateUserData(user.id, {
        emotionalGoals: updatedGoals
      })
      
      if (updatedUser) {
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
    }
  }

  const toggleGoalStatus = (goalId: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            status: goal.status === "active" ? "paused" : "active",
          }
        : goal,
    )
    setGoals(updatedGoals)

    // Update user data using persistent function
    if (user) {
      const updatedUser = updateUserData(user.id, {
        emotionalGoals: updatedGoals
      })
      
      if (updatedUser) {
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
    }
  }

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId)
    setGoals(updatedGoals)

    // Update user data using persistent function
    if (user) {
      const updatedUser = updateUserData(user.id, {
        emotionalGoals: updatedGoals
      })
      
      if (updatedUser) {
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600"
      case "active":
        return "bg-blue-600"
      case "paused":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = [
      "bg-purple-600",
      "bg-pink-600",
      "bg-orange-600",
      "bg-teal-600",
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-rose-600",
      "bg-cyan-600",
    ]
    return colors[goalCategories.indexOf(category) % colors.length]
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const activeGoals = goals.filter((g) => g.status === "active")
  const completedGoals = goals.filter((g) => g.status === "completed")
  const averageProgress = goals.length > 0 ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length : 0

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Heart className="h-8 w-8" />
              Emotional Wellness Goals
            </h1>
            <p className="text-gray-400">Track your mental health journey and build positive habits</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{activeGoals.length}</p>
                    <p className="text-gray-400 text-sm">Active Goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{completedGoals.length}</p>
                    <p className="text-gray-400 text-sm">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{Math.round(averageProgress)}%</p>
                    <p className="text-gray-400 text-sm">Avg Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{goals.length}</p>
                    <p className="text-gray-400 text-sm">Total Goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Goal */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Your Emotional Goals</CardTitle>
                <Button onClick={() => setShowAddGoal(!showAddGoal)} className="bg-pink-600 hover:bg-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>

            {showAddGoal && (
              <CardContent className="border-t border-gray-800 pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal" className="text-white">
                        Goal
                      </Label>
                      <Input
                        id="goal"
                        value={newGoal.goal}
                        onChange={(e) => setNewGoal((prev) => ({ ...prev, goal: e.target.value }))}
                        placeholder="e.g., Practice meditation daily"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">
                        Category
                      </Label>
                      <select
                        id="category"
                        value={newGoal.category}
                        onChange={(e) => setNewGoal((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                      >
                        {goalCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your goal and why it's important to you..."
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetDate" className="text-white">
                      Target Date
                    </Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddGoal}
                      disabled={!newGoal.goal.trim() || !newGoal.targetDate}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      Add Goal
                    </Button>
                    <Button
                      onClick={() => setShowAddGoal(false)}
                      variant="outline"
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Goals List */}
          <div className="space-y-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">{goal.goal}</h3>
                          <Badge className={`${getStatusColor(goal.status)} text-white text-xs`}>{goal.status}</Badge>
                          <Badge className={`${getCategoryColor(goal.category)} text-white text-xs`}>
                            {goal.category}
                          </Badge>
                        </div>
                        {goal.description && <p className="text-gray-400 text-sm mb-3">{goal.description}</p>}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Created: {new Date(goal.createdDate).toLocaleDateString()}</span>
                          <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleGoalStatus(goal.id)}
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          {goal.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteGoal(goal.id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-gray-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Progress</span>
                        <span className="text-white text-sm">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                      <div className="flex gap-2 mt-2">
                        {[0, 25, 50, 75, 100].map((value) => (
                          <Button
                            key={value}
                            size="sm"
                            variant={goal.progress === value ? "default" : "outline"}
                            onClick={() => updateGoalProgress(goal.id, value)}
                            className={`text-xs ${
                              goal.progress === value
                                ? "bg-pink-600 text-white"
                                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {value}%
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {goals.length === 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No Goals Yet</h3>
                  <p className="text-gray-400 mb-4">Start your emotional wellness journey by setting your first goal</p>
                  <Button onClick={() => setShowAddGoal(true)} className="bg-pink-600 hover:bg-pink-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
