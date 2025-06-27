"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Brain, Users, FileText, TrendingUp, Calendar, Target, Award, Heart, Pill, RefreshCw } from "lucide-react"
import Navigation from "@/components/navigation"
import { getUserById } from "@/lib/local-storage"

interface User {
  id: string
  name: string
  email: string
  age: number
  phone: string
  joinDate: string
  assessmentCompleted: boolean
  communityPosts: number
  dietPlanGenerated: boolean
  riskLevel?: string
  lastAssessment?: string
  emotionalGoals: EmotionalGoal[]
  appointments: Appointment[]
  prescriptions: Prescription[]
}

interface EmotionalGoal {
  id: string
  goal: string
  targetDate: string
  progress: number
  status: "active" | "completed" | "paused"
  createdDate: string
}

interface Appointment {
  id: string
  doctorName: string
  date: string
  time: string
  type: string
  status: "requested" | "confirmed" | "completed"
  notes?: string
}

interface Prescription {
  id: string
  doctorName: string
  medications: any[]
  dateIssued: string
  status: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [overallProgress, setOverallProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
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

    // Get the latest user data from storage
    const latestUser = getUserById(parsedUser.id)
    if (latestUser) {
      setUser(latestUser)
      localStorage.setItem("currentUser", JSON.stringify(latestUser))
    } else {
      setUser(parsedUser)
    }
    
    setIsLoading(false)

    // Calculate overall progress
    let progress = 0
    if (latestUser?.assessmentCompleted || parsedUser.assessmentCompleted) progress += 40
    if ((latestUser?.communityPosts || parsedUser.communityPosts || 0) > 0) progress += 30
    if (latestUser?.dietPlanGenerated || parsedUser.dietPlanGenerated) progress += 30

    setOverallProgress(progress)
  }, [router])

  const handleStartAssessment = () => {
    router.push("/assessment")
  }

  const handleViewCommunity = () => {
    router.push("/community")
  }

  const handleGenerateDietPlan = () => {
    router.push("/diet-plan")
  }

  const refreshDashboard = () => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      const latestUser = getUserById(parsedUser.id)
      if (latestUser) {
        setUser(latestUser)
        localStorage.setItem("currentUser", JSON.stringify(latestUser))
        
        // Recalculate progress with safe fallbacks
        let progress = 0
        if (latestUser.assessmentCompleted) progress += 40
        if ((latestUser.communityPosts || 0) > 0) progress += 30
        if (latestUser.dietPlanGenerated) progress += 30
        setOverallProgress(progress)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading your dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">User not found. Please sign in again.</div>
      </div>
    )
  }

  // Calculate join days with fallback
  const joinDate = user.joinDate || user.created_at || new Date().toISOString()
  const joinDays = Math.floor((new Date().getTime() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24)) || 0

  // Ensure all numerical values have fallbacks
  const communityPosts = user.communityPosts || 0
  const assessmentCompleted = user.assessmentCompleted || false
  const dietPlanGenerated = user.dietPlanGenerated || false
  const riskLevel = user.riskLevel || "N/A"
  
  // Safe calculations for arrays
  const emotionalGoals = user.emotionalGoals || []
  const appointments = user.appointments || []
  const prescriptions = user.prescriptions || []
  
  const activeGoals = emotionalGoals.filter((g) => g.status === "active").length || 0
  const completedGoals = emotionalGoals.filter((g) => g.status === "completed").length || 0
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed").length || 0
  const pendingAppointments = appointments.filter((a) => a.status === "requested").length || 0
  const activePrescriptions = prescriptions.filter((p) => p.status === "active").length || 0
  const totalMedications = prescriptions.reduce((total, p) => total + (p.medications?.length || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
            <p className="text-gray-400">Track your health journey and connect with our supportive community</p>
          </div>
          <Button
            variant="outline"
            onClick={refreshDashboard}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription>Complete all activities to maximize your health insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Overall Completion</span>
                  <span className="text-white">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${assessmentCompleted ? "bg-green-600" : "bg-gray-700"}`}>
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Assessment</p>
                    <p className="text-gray-400 text-xs">{assessmentCompleted ? "Completed" : "Not started"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${communityPosts > 0 ? "bg-green-600" : "bg-gray-700"}`}>
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Community</p>
                    <p className="text-gray-400 text-xs">{communityPosts} posts</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${dietPlanGenerated ? "bg-green-600" : "bg-gray-700"}`}>
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Diet Plan</p>
                    <p className="text-gray-400 text-xs">{dietPlanGenerated ? "Generated" : "Not created"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{joinDays}</p>
                  <p className="text-gray-400 text-sm">Days Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{riskLevel}</p>
                  <p className="text-gray-400 text-sm">Risk Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{communityPosts}</p>
                  <p className="text-gray-400 text-sm">Community Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{overallProgress}%</p>
                  <p className="text-gray-400 text-sm">Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Health Assessment
              </CardTitle>
              <CardDescription>
                {assessmentCompleted
                  ? "View your latest assessment results"
                  : "Complete your cancer risk assessment"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessmentCompleted ? (
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      Completed
                    </Badge>
                    {riskLevel !== "N/A" && (
                      <p className="text-sm text-gray-400">
                        Risk Level: <span className="text-white">{riskLevel}</span>
                      </p>
                    )}
                    {user.lastAssessment && (
                      <p className="text-sm text-gray-400">
                        Last: {new Date(user.lastAssessment).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Start your health journey by completing the assessment</p>
                )}
                <Button onClick={handleStartAssessment} className="w-full bg-blue-600 hover:bg-blue-700">
                  {assessmentCompleted ? "Retake Assessment" : "Start Assessment"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Patient Community
              </CardTitle>
              <CardDescription>Connect with others for mental health support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Your posts: <span className="text-white">{communityPosts}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Community members: <span className="text-white">1,247</span>
                  </p>
                </div>
                <Button onClick={handleViewCommunity} className="w-full bg-purple-600 hover:bg-purple-700">
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Diet Plan
              </CardTitle>
              <CardDescription>Get personalized nutrition recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dietPlanGenerated ? (
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    Plan Generated
                  </Badge>
                ) : (
                  <p className="text-sm text-gray-400">
                    Generate a personalized diet plan based on your health profile
                  </p>
                )}
                <Button onClick={handleGenerateDietPlan} className="w-full bg-orange-600 hover:bg-orange-700">
                  {dietPlanGenerated ? "View Diet Plan" : "Generate Plan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Action Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Emotional Wellness Goals
              </CardTitle>
              <CardDescription>Track your mental health and emotional progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Active goals:{" "}
                    <span className="text-white">
                      {activeGoals}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Completed:{" "}
                    <span className="text-white">
                      {completedGoals}
                    </span>
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/emotional-goals")}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  Manage Goals
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Doctor Appointments
              </CardTitle>
              <CardDescription>Schedule and manage your medical appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Upcoming:{" "}
                    <span className="text-white">
                      {confirmedAppointments}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Pending:{" "}
                    <span className="text-white">
                      {pendingAppointments}
                    </span>
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/appointments")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Pill className="h-5 w-5" />
                My Prescriptions
              </CardTitle>
              <CardDescription>View and manage your medical prescriptions from doctors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Active prescriptions:{" "}
                    <span className="text-white">
                      {activePrescriptions}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Total medications:{" "}
                    <span className="text-white">
                      {totalMedications}
                    </span>
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/prescriptions")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  View Prescriptions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
