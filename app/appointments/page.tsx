"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, Stethoscope, X } from "lucide-react"
import Navigation from "@/components/navigation"

interface Appointment {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  doctorSpecialization: string
  date: string
  time: string
  reason: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  createdAt: string
}

interface Doctor {
  id: string
  name: string
  specialization: string
  email: string
  isVerified: boolean
}

interface User {
  id: string
  name: string
  email: string
  userType: "patient" | "doctor"
  notifications?: Notification[]
}

interface Notification {
  id: string
  type: "appointment_accepted" | "appointment_rejected" | "appointment_request" | "prescription_received"
  title: string
  message: string
  timestamp: string
  read: boolean
  relatedId?: string
}

export default function Appointments() {
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [showBooking, setShowBooking] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadAppointments(parsedUser.id)
    loadDoctors()
  }, [router])

  const loadAppointments = (userId: string) => {
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const userAppointments = allAppointments.filter((apt: Appointment) => apt.patientId === userId)
    setAppointments(userAppointments)
  }

  const loadDoctors = () => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const doctorUsers = allUsers
      .filter((user: any) => user.userType === "doctor")
      .map((doctor: any) => ({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization || "General Medicine",
        email: doctor.email,
        isVerified: true,
      }))
    setDoctors(doctorUsers)
  }

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!newAppointment.doctorId || !newAppointment.date || !newAppointment.time || !newAppointment.reason.trim()) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    const selectedDoctor = doctors.find((d) => d.id === newAppointment.doctorId)
    if (!selectedDoctor) {
      setError("Selected doctor not found")
      setIsLoading(false)
      return
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      patientId: user!.id,
      doctorId: newAppointment.doctorId,
      doctorName: selectedDoctor.name,
      doctorSpecialization: selectedDoctor.specialization,
      date: newAppointment.date,
      time: newAppointment.time,
      reason: newAppointment.reason.trim(),
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    // Save appointment to localStorage
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    allAppointments.push(appointment)
    localStorage.setItem("appointments", JSON.stringify(allAppointments))

    // Create notification for doctor
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const doctorIndex = allUsers.findIndex((u: any) => u.id === newAppointment.doctorId)

    if (doctorIndex !== -1) {
      const notification: Notification = {
        id: Date.now().toString(),
        type: "appointment_request",
        title: "New Appointment Request",
        message: `${user!.name} has requested an appointment on ${new Date(newAppointment.date).toLocaleDateString()} at ${newAppointment.time}`,
        timestamp: new Date().toISOString(),
        read: false,
        relatedId: appointment.id,
      }

      if (!allUsers[doctorIndex].notifications) {
        allUsers[doctorIndex].notifications = []
      }
      allUsers[doctorIndex].notifications.push(notification)
      localStorage.setItem("allUsers", JSON.stringify(allUsers))
    }

    setAppointments([...appointments, appointment])
    setSuccess("Appointment request sent successfully! The doctor will review and respond soon.")
    setShowBooking(false)
    resetForm()
    setIsLoading(false)
  }

  const resetForm = () => {
    setNewAppointment({
      doctorId: "",
      date: "",
      time: "",
      reason: "",
    })
  }

  const cancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: "cancelled" as const } : apt,
    )
    setAppointments(updatedAppointments)

    // Update localStorage
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const updatedAllAppointments = allAppointments.map((apt: Appointment) =>
      apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt,
    )
    localStorage.setItem("appointments", JSON.stringify(updatedAllAppointments))

    setSuccess("Appointment cancelled successfully.")
    setTimeout(() => setSuccess(""), 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-blue-400 bg-blue-900/20"
      case "completed":
        return "text-green-400 bg-green-900/20"
      case "cancelled":
        return "text-red-400 bg-red-900/20"
      default:
        return "text-gray-400 bg-gray-900/20"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) >= new Date() && apt.status !== "cancelled",
  )
  const pastAppointments = appointments.filter((apt) => new Date(apt.date) < new Date() || apt.status === "completed")

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              Doctor Appointments
            </h1>
            <p className="text-gray-400">Schedule and manage your medical appointments</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <Alert className="mb-6 bg-green-900/20 border-green-700/50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 bg-red-900/20 border-red-700/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{upcomingAppointments.length}</p>
                    <p className="text-gray-400 text-sm">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-600 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      {appointments.filter((a) => a.status === "scheduled").length}
                    </p>
                    <p className="text-gray-400 text-sm">Scheduled</p>
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
                    <p className="text-xl font-bold text-white">
                      {appointments.filter((a) => a.status === "completed").length}
                    </p>
                    <p className="text-gray-400 text-sm">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{appointments.length}</p>
                    <p className="text-gray-400 text-sm">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book New Appointment */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Your Appointments</CardTitle>
                <Button onClick={() => setShowBooking(!showBooking)} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </CardHeader>

            {showBooking && (
              <CardContent className="border-t border-gray-800 pt-6">
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor" className="text-white">
                      Select Doctor
                    </Label>
                    <select
                      id="doctor"
                      value={newAppointment.doctorId}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, doctorId: e.target.value }))}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-white">
                        Preferred Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment((prev) => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split("T")[0]}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-white">
                        Preferred Time
                      </Label>
                      <select
                        id="time"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment((prev) => ({ ...prev, time: e.target.value }))}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select time...</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-white">
                      Reason for Visit
                    </Label>
                    <Textarea
                      id="reason"
                      value={newAppointment.reason}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, reason: e.target.value }))}
                      placeholder="Describe your symptoms or reason for the appointment..."
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                      {isLoading ? "Booking..." : "Book Appointment"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowBooking(false)}
                      variant="outline"
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-indigo-600 text-white">
                              {appointment.doctorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-white">Dr. {appointment.doctorName}</h3>
                            <p className="text-gray-400 text-sm">{appointment.doctorSpecialization}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-gray-400 text-sm flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(appointment.date)}
                              </span>
                              <span className="text-gray-400 text-sm flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {appointment.time}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mt-2">{appointment.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1`}>
                            {appointment.status}
                          </Badge>
                          {appointment.status === "scheduled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelAppointment(appointment.id)}
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Past Appointments</h2>
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-gray-900 border-gray-800 opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gray-600 text-white">
                              {appointment.doctorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-white">Dr. {appointment.doctorName}</h3>
                            <p className="text-gray-400 text-sm">{appointment.doctorSpecialization}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-gray-400 text-sm flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(appointment.date)}
                              </span>
                              <span className="text-gray-400 text-sm flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {appointment.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1`}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {appointments.length === 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No Appointments Yet</h3>
                <p className="text-gray-400 mb-4">Book your first appointment with one of our specialists</p>
                <Button onClick={() => setShowBooking(true)} className="bg-in digo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
