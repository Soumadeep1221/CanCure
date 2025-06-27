"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Users,
  Brain,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Stethoscope,
  Activity,
  Shield,
  Target,
  Globe,
  CheckCircle,
  Send,
  Clock,
  MessageSquare,
  HelpCircle,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function HomePage() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [userType, setUserType] = useState<"patient" | "doctor">("patient")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    medicalLicense: "",
  })
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    userType: "patient",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.userType === "doctor" || user.user_type === "doctor") {
        router.push("/doctor-dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Try Supabase first
      const { data, error: supabaseError } = await supabase
        .from("users")
        .select("*")
        .eq("email", formData.email)
        .eq("user_type", userType)
        .single()

      if (supabaseError || !data) {
        // Fallback to localStorage
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
        const user = allUsers.find(
          (u: any) => u.email === formData.email && u.password === formData.password && u.userType === userType,
        )

        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user))
          if (userType === "doctor") {
            router.push("/doctor-dashboard")
          } else {
            router.push("/dashboard")
          }
        } else {
          setError("Invalid credentials or user type")
        }
      } else {
        // Verify password (in real app, this would be hashed)
        if (data.password === formData.password) {
          localStorage.setItem("currentUser", JSON.stringify(data))
          if (userType === "doctor") {
            router.push("/doctor-dashboard")
          } else {
            router.push("/dashboard")
          }
        } else {
          setError("Invalid credentials")
        }
      }
    } catch (err) {
      setError("Sign in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        user_type: userType,
        ...(userType === "doctor" && {
          specialization: formData.specialization,
          medical_license: formData.medicalLicense,
          is_verified: true,
        }),
      }

      // Try to insert into Supabase
      const { data, error: supabaseError } = await supabase.from("users").insert([newUser]).select().single()

      if (supabaseError) {
        // Check if user already exists
        if (supabaseError.code === "23505") {
          setError("User with this email already exists")
          setIsLoading(false)
          return
        }

        // Fallback to localStorage
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
        const existingUser = allUsers.find((u: any) => u.email === formData.email)

        if (existingUser) {
          setError("User with this email already exists")
          setIsLoading(false)
          return
        }

        const localUser = {
          id: Date.now().toString(),
          ...newUser,
          userType: userType, // Keep compatibility with localStorage format
          createdAt: new Date().toISOString(),
          notifications: [],
        }

        allUsers.push(localUser)
        localStorage.setItem("allUsers", JSON.stringify(allUsers))
        localStorage.setItem("currentUser", JSON.stringify(localUser))
      } else {
        localStorage.setItem("currentUser", JSON.stringify(data))
      }

      if (userType === "doctor") {
        router.push("/doctor-dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Sign up failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitted(true)
    setIsSubmitting(false)
    setContactData({
      name: "",
      email: "",
      subject: "",
      message: "",
      userType: "patient",
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      specialization: "",
      medicalLicense: "",
    })
    setError("")
  }

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Cancer Survivor",
      content:
        "CancerCare AI helped me understand my risk factors and connected me with the right specialists. The early detection saved my life.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Dr. Michael Chen",
      role: "Oncologist",
      content:
        "This platform streamlines patient assessment and helps me provide better care. The AI insights are remarkably accurate.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      content:
        "The community support and personalized diet plans made my journey so much easier. I felt supported every step of the way.",
      rating: 5,
      avatar: "ER",
    },
  ]

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessment",
      description: "Advanced algorithms analyze your health data to provide accurate cancer risk predictions.",
    },
    {
      icon: Stethoscope,
      title: "Expert Consultations",
      description: "Connect with certified oncologists and specialists for personalized medical advice.",
    },
    {
      icon: Users,
      title: "Supportive Community",
      description: "Join a caring community of patients, survivors, and families sharing their journeys.",
    },
    {
      icon: Activity,
      title: "Health Monitoring",
      description: "Track your progress with personalized diet plans and wellness recommendations.",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We believe every patient deserves empathetic, personalized healthcare support.",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your health data is protected with enterprise-grade security and encryption.",
    },
    {
      icon: Brain,
      title: "Innovation",
      description: "Leveraging cutting-edge AI technology to advance cancer detection and prevention.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building supportive networks that connect patients, families, and healthcare providers.",
    },
  ]

  const team = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Medical Officer",
      specialization: "Oncology",
      experience: "15+ years",
      avatar: "SM",
    },
    {
      name: "Dr. James Chen",
      role: "Head of AI Research",
      specialization: "Medical AI",
      experience: "12+ years",
      avatar: "JC",
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Clinical Director",
      specialization: "Preventive Medicine",
      experience: "18+ years",
      avatar: "MR",
    },
    {
      name: "Dr. David Kim",
      role: "Technology Director",
      specialization: "Health Informatics",
      experience: "10+ years",
      avatar: "DK",
    },
  ]

  const achievements = [
    { number: "95%", label: "Accuracy Rate" },
    { number: "10,000+", label: "Patients Served" },
    { number: "500+", label: "Healthcare Partners" },
    { number: "50+", label: "Research Publications" },
  ]

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      details: "+1 (555) 123-4567",
      description: "Available 24/7 for urgent medical inquiries",
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@cancercareai.com",
      description: "We respond within 2-4 hours during business days",
    },
    {
      icon: MapPin,
      title: "Office Location",
      details: "123 Healthcare Ave, Medical City, MC 12345",
      description: "Visit us for in-person consultations",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM",
      description: "Extended hours for patient support",
    },
  ]

  const supportTypes = [
    {
      icon: MessageSquare,
      title: "General Inquiries",
      description: "Questions about our platform and services",
    },
    {
      icon: Stethoscope,
      title: "Medical Support",
      description: "Clinical questions and appointment assistance",
    },
    {
      icon: HelpCircle,
      title: "Technical Help",
      description: "Platform navigation and technical issues",
    },
    {
      icon: Users,
      title: "Partnership",
      description: "Healthcare provider partnerships and collaborations",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CancerCare AI</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                Testimonials
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsSignInOpen(true)}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setIsSignUpOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-600/30">
              AI-Powered Cancer Care Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Early Detection
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Saves Lives
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Harness the power of artificial intelligence for cancer risk assessment, connect with expert oncologists,
              and join a supportive community on your wellness journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => setIsSignUpOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
              >
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsSignInOpen(true)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-3"
              >
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-gray-400">Assessments Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400">Medical Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-400">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Cancer Care Platform</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need for cancer prevention, early detection, and ongoing support in one integrated
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg w-fit mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real stories from patients and healthcare professionals who trust CancerCare AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-600/30">About CancerCare AI</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Revolutionizing Cancer Care
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Through AI
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              CancerCare AI is dedicated to transforming cancer prevention and early detection through advanced
              artificial intelligence, connecting patients with expert care, and building supportive communities for
              better health outcomes.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-400" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  To democratize access to advanced cancer screening and prevention tools by leveraging artificial
                  intelligence, enabling early detection that saves lives, and providing comprehensive support
                  throughout the patient journey.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-6 w-6 text-purple-400" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  A world where cancer is detected early, treated effectively, and prevented proactively through the
                  power of AI-driven healthcare, accessible to everyone regardless of their location or economic status.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Our Core Values</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The principles that guide everything we do in our mission to improve cancer care worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700 text-center">
                  <CardContent className="p-6">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg w-fit mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-3">{value.title}</h4>
                    <p className="text-gray-400 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Our Impact</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Numbers that reflect our commitment to advancing cancer care and supporting patients worldwide.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700 text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-white mb-2">{achievement.number}</div>
                    <div className="text-gray-400">{achievement.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Meet Our Team</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Leading experts in oncology, artificial intelligence, and healthcare technology working together to
                revolutionize cancer care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                      {member.avatar}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">{member.name}</h4>
                    <p className="text-blue-400 text-sm mb-2">{member.role}</p>
                    <p className="text-gray-400 text-sm mb-1">{member.specialization}</p>
                    <p className="text-gray-500 text-xs">{member.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-400" />
                Our Technology
              </CardTitle>
              <CardDescription>Advanced AI algorithms powering better healthcare outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium">Machine Learning Models</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Advanced neural networks trained on millions of medical records for accurate risk assessment.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium">Predictive Analytics</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Real-time analysis of patient data to identify early warning signs and risk factors.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium">Secure Infrastructure</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    HIPAA-compliant cloud infrastructure ensuring the highest levels of data security and privacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-600/30">Contact Us</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              We're Here to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Help</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions about CancerCare AI? Need technical support? Want to partner with us? Our dedicated team is
              ready to assist you with personalized care and attention.
            </p>
          </div>

          {/* Success Message */}
          {submitted && (
            <Alert className="mb-8 bg-green-900/20 border-green-700/50 max-w-2xl mx-auto">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-200">
                Thank you for contacting us! We've received your message and will respond within 24 hours.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Send className="h-6 w-6 text-blue-400" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-white">I am a:</Label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={contactData.userType === "patient" ? "default" : "outline"}
                        onClick={() => setContactData({ ...contactData, userType: "patient" })}
                        className="flex-1"
                      >
                        Patient
                      </Button>
                      <Button
                        type="button"
                        variant={contactData.userType === "doctor" ? "default" : "outline"}
                        onClick={() => setContactData({ ...contactData, userType: "doctor" })}
                        className="flex-1"
                      >
                        Healthcare Provider
                      </Button>
                      <Button
                        type="button"
                        variant={contactData.userType === "other" ? "default" : "outline"}
                        onClick={() => setContactData({ ...contactData, userType: "other" })}
                        className="flex-1"
                      >
                        Other
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name" className="text-white">
                        Full Name *
                      </Label>
                      <Input
                        id="contact-name"
                        type="text"
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        className="bg-gray-900 border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="text-white">
                        Email Address *
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        className="bg-gray-900 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-subject" className="text-white">
                      Subject *
                    </Label>
                    <Input
                      id="contact-subject"
                      type="text"
                      value={contactData.subject}
                      onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                      className="bg-gray-900 border-gray-600 text-white"
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message" className="text-white">
                      Message *
                    </Label>
                    <Textarea
                      id="contact-message"
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      className="bg-gray-900 border-gray-600 text-white min-h-[120px]"
                      placeholder="Please provide details about your inquiry, question, or how we can help you..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Get in Touch</CardTitle>
                  <CardDescription>Multiple ways to reach our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                        <info.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{info.title}</h4>
                        <p className="text-blue-400 mb-1">{info.details}</p>
                        <p className="text-gray-400 text-sm">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Support Types */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">How Can We Help?</CardTitle>
                  <CardDescription>Choose the type of support you need</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportTypes.map((type, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50">
                      <type.icon className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-white mb-1">{type.title}</h5>
                        <p className="text-gray-400 text-sm">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Emergency Notice */}
          <Card className="bg-red-900/20 border-red-700/50 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-600 rounded-lg">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Medical Emergency?</h3>
                  <p className="text-gray-300 mb-4">
                    If you are experiencing a medical emergency, please call 911 immediately or go to your nearest
                    emergency room. CancerCare AI is not a substitute for emergency medical care.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                    >
                      Call 911
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                    >
                      Find Emergency Room
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">CancerCare AI</span>
              </div>
              <p className="text-gray-400">
                Empowering early cancer detection through AI-powered assessments and connecting patients with expert
                care.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Cancer Risk Assessment</li>
                <li className="text-gray-400">Expert Consultations</li>
                <li className="text-gray-400">Community Support</li>
                <li className="text-gray-400">Personalized Diet Plans</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>support@cancercareai.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>123 Healthcare Ave, Medical City, MC 12345</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 CancerCare AI. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Sign In</CardTitle>
              <CardDescription>Access your CancerCare AI account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={userType === "patient" ? "default" : "outline"}
                    onClick={() => setUserType("patient")}
                    className="flex-1"
                  >
                    Patient
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "doctor" ? "default" : "outline"}
                    onClick={() => setUserType("doctor")}
                    className="flex-1"
                  >
                    Doctor
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                {error && <div className="text-red-400 text-sm">{error}</div>}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsSignInOpen(false)
                      resetForm()
                    }}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sign Up Modal */}
      {isSignUpOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">Create Account</CardTitle>
              <CardDescription>Join CancerCare AI today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={userType === "patient" ? "default" : "outline"}
                    onClick={() => setUserType("patient")}
                    className="flex-1"
                  >
                    Patient
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "doctor" ? "default" : "outline"}
                    onClick={() => setUserType("doctor")}
                    className="flex-1"
                  >
                    Doctor
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                {userType === "doctor" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="text-white">
                        Specialization
                      </Label>
                      <Input
                        id="specialization"
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="e.g., Oncology, Radiology"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license" className="text-white">
                        Medical License Number
                      </Label>
                      <Input
                        id="license"
                        type="text"
                        value={formData.medicalLicense}
                        onChange={(e) => setFormData({ ...formData, medicalLicense: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </>
                )}

                {error && <div className="text-red-400 text-sm">{error}</div>}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsSignUpOpen(false)
                      resetForm()
                    }}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    {isLoading ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
