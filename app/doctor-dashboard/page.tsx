"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  X,
  Check,
  TrendingUp,
  Heart,
  Brain,
  Pill,
  LogOut,
  ArrowLeft,
} from "lucide-react"
import { 
  getUsers, 
  getAppointments, 
  saveAppointments, 
  getAssessments, 
  getEmotionalGoals,
  getAppointmentsByDoctor,
  getPatientsByDoctor,
  getAssessmentsByUser,
  getEmotionalGoalsByUser,
  saveUsers,
  updateUserData,
  type User, 
  type Appointment, 
  type Assessment, 
  type EmotionalGoal 
} from "@/lib/local-storage"

interface Doctor extends User {
  user_type: "doctor"
}

interface Patient extends User {
  user_type: "patient"
  age?: number
  riskLevel?: string
  lastAssessment?: string
  emotionalGoals?: EmotionalGoal[]
  assessmentData?: Assessment
  communityActivity?: number
  dietPlanActive?: boolean
  appointments?: Appointment[]
  prescriptions?: any[]
}

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedPatientForRx, setSelectedPatientForRx] = useState<Patient | null>(null)
  const [generatingPrescription, setGeneratingPrescription] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== "doctor" && parsedUser.user_type !== "doctor") {
      router.push("/")
      return
    }

    setDoctor(parsedUser)
    loadDoctorData(parsedUser)
    setIsLoading(false)
  }, [router])

  const loadDoctorData = async (doctorData: Doctor) => {
    try {
      // Load appointments from local storage
      const doctorAppointments = getAppointmentsByDoctor(doctorData.id)
      setAppointments(doctorAppointments)

      // Load patients from local storage
      const patientUsers = getUsers().filter((user: User) => user.user_type === "patient")
      
      // Get patients who have appointments with this doctor
      const doctorPatients = patientUsers.filter((patient: User) =>
        doctorAppointments.some((apt: Appointment) => apt.patient_id === patient.id),
      )

      // Load additional data for each patient
      const patientsWithData = doctorPatients.map((patient) => {
        // Load assessments
        const assessmentData = getAssessmentsByUser(patient.id)
        const assessment = assessmentData[0] // Get the latest assessment

        // Load emotional goals
        const goalsData = getEmotionalGoalsByUser(patient.id)

        return {
          ...patient,
          age: assessment?.age,
          riskLevel: assessment?.risk_level,
          lastAssessment: assessment?.created_at,
          assessmentData: assessment,
          emotionalGoals: goalsData || [],
          communityActivity: Math.floor(Math.random() * 20), // Mock data
          dietPlanActive: Math.random() > 0.5, // Mock data
        }
      })

      setPatients(patientsWithData)
    } catch (error) {
      console.error("Error loading doctor data:", error)
      // Fallback to localStorage
      const doctorAppointments = getAppointmentsByDoctor(doctorData.id)
      setAppointments(doctorAppointments)

      const patientUsers = getUsers().filter((user: User) => user.user_type === "patient")
      setPatients(patientUsers)
    }
  }

  const handleAppointmentAction = async (appointmentId: string, action: "accept" | "reject") => {
    const appointment = appointments.find((apt) => apt.id === appointmentId)
    if (!appointment) return

    const newStatus = action === "accept" ? "accepted" : "cancelled"

    try {
      // Update local state
      const updatedAppointments = appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt,
      )
      setAppointments(updatedAppointments)

      // Create notification for patient
      await createNotificationForPatient(appointment, action)
    } catch (error) {
      console.error("Error handling appointment action:", error)
      // Fallback to localStorage
      updateAppointmentInLocalStorage(appointmentId, newStatus)
    }

    setSuccess(action === "accept" ? "Appointment accepted successfully!" : "Appointment declined.")
    setTimeout(() => setSuccess(""), 3000)
  }

  const updateAppointmentInLocalStorage = (appointmentId: string, status: string) => {
    const updatedAppointments = appointments.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
    setAppointments(updatedAppointments)

    saveAppointments(updatedAppointments)
  }

  const createNotificationForPatient = async (appointment: Appointment, action: "accept" | "reject") => {
    const notification = {
      user_id: appointment.patient_id,
      type: action === "accept" ? "appointment_accepted" : "appointment_rejected",
      title: action === "accept" ? "Appointment Confirmed" : "Appointment Declined",
      message:
        action === "accept"
          ? `Dr. ${doctor?.name} has confirmed your appointment on ${new Date(appointment.appointment_date).toLocaleDateString()} at ${appointment.appointment_time}`
          : `Dr. ${doctor?.name} has declined your appointment request. Please book a different time slot.`,
      related_id: appointment.id,
    }

    try {
      // Create notification in local storage
      createNotificationInLocalStorage(appointment, action)
    } catch (error) {
      console.error("Error creating notification:", error)
      createNotificationInLocalStorage(appointment, action)
    }
  }

  const createNotificationInLocalStorage = (appointment: Appointment, action: "accept" | "reject") => {
    const allUsers = getUsers()
    const patientIndex = allUsers.findIndex((user: any) => user.id === appointment.patient_id)

    if (patientIndex !== -1) {
      const notification = {
        id: Date.now().toString(),
        type: action === "accept" ? "appointment_accepted" : "appointment_rejected",
        title: action === "accept" ? "Appointment Confirmed" : "Appointment Declined",
        message:
          action === "accept"
            ? `Dr. ${doctor?.name} has confirmed your appointment on ${new Date(appointment.appointment_date).toLocaleDateString()} at ${appointment.appointment_time}`
            : `Dr. ${doctor?.name} has declined your appointment request. Please book a different time slot.`,
        timestamp: new Date().toISOString(),
        read: false,
        relatedId: appointment.id,
      }

      if (!allUsers[patientIndex].notifications) {
        allUsers[patientIndex].notifications = []
      }
      allUsers[patientIndex].notifications.push(notification)
      saveUsers(allUsers)
    }
  }

  const generateAIPrescription = async (patient: Patient) => {
    if (!doctor) return

    setGeneratingPrescription(true)

    // Simulate AI generation based on patient data
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const aiPrescription = {
      patient_id: patient.id,
      doctor_id: doctor.id,
      doctor_name: doctor.name,
      doctor_specialization: doctor.specialization || "General Medicine",
      medications: [
        {
          name: "Vitamin D3",
          dosage: "2000 IU",
          frequency: "Once daily",
          duration: "3 months",
          instructions: "Take with food, preferably in the morning",
        },
        {
          name: "Omega-3 Fish Oil",
          dosage: "1000mg",
          frequency: "Twice daily",
          duration: "3 months",
          instructions: "Take with meals to reduce stomach upset",
        },
      ],
      diagnosis: `${patient.riskLevel || "Moderate"} Cancer Risk - Preventive Care`,
      instructions: "Continue with healthy lifestyle. Monitor symptoms and report any changes immediately.",
      date_issued: new Date().toISOString().split("T")[0],
      valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active",
      notes: `Based on assessment results. These supplements support immune function and overall wellness.`,
    }

    try {
      // Save prescription to local storage
      savePrescriptionToLocalStorage(patient, aiPrescription)

      // Create notification for patient
      await createPrescriptionNotification(patient)
    } catch (error) {
      console.error("Error generating prescription:", error)
      savePrescriptionToLocalStorage(patient, aiPrescription)
    }

    setGeneratingPrescription(false)
    setShowPrescriptionModal(false)
    setSelectedPatientForRx(null)
    setSuccess(`Prescription successfully generated and sent to ${patient.name}`)
    setTimeout(() => setSuccess(""), 3000)
  }

  const savePrescriptionToLocalStorage = (patient: Patient, prescription: any) => {
    const allUsers = getUsers()
    const patientIndex = allUsers.findIndex((user: any) => user.id === patient.id)

    if (patientIndex !== -1) {
      if (!allUsers[patientIndex].prescriptions) {
        allUsers[patientIndex].prescriptions = []
      }
      allUsers[patientIndex].prescriptions.push({
        ...prescription,
        id: `rx${Date.now()}`,
      })
      saveUsers(allUsers)
    }
  }

  const createPrescriptionNotification = async (patient: Patient) => {
    const notification = {
      id: Date.now().toString(),
      type: "prescription_received",
      title: "New Prescription Available",
      message: `Dr. ${doctor?.name} has issued a new prescription for you. Check your prescriptions page for details.`,
      timestamp: new Date().toISOString(),
      read: false,
      relatedId: `rx${Date.now()}`,
    }

    try {
      // Create notification in local storage
      const allUsers = getUsers()
      const patientIndex = allUsers.findIndex((user: any) => user.id === patient.id)

      if (patientIndex !== -1) {
        if (!allUsers[patientIndex].notifications) {
          allUsers[patientIndex].notifications = []
        }
        allUsers[patientIndex].notifications.push(notification)
        saveUsers(allUsers)
      }
    } catch (error) {
      console.error("Error creating prescription notification:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-600"
      case "accepted":
        return "bg-green-600"
      case "completed":
        return "bg-blue-600"
      case "cancelled":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "text-red-400"
      case "Moderate":
        return "text-yellow-400"
      case "Low-Moderate":
        return "text-orange-400"
      case "Low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const sendClinicalReport = async (patient: Patient) => {
    const notification = {
      id: Date.now().toString(),
      type: "clinical_report",
      title: "Clinical Report Received",
      message: `Dr. ${doctor?.name} has sent you a clinical report. Please review it in your dashboard.`,
      timestamp: new Date().toISOString(),
      read: false,
      relatedId: `report${Date.now()}`,
    }

    try {
      // Create notification in local storage
      const allUsers = getUsers()
      const patientIndex = allUsers.findIndex((user: any) => user.id === patient.id)

      if (patientIndex !== -1) {
        if (!allUsers[patientIndex].notifications) {
          allUsers[patientIndex].notifications = []
        }
        allUsers[patientIndex].notifications.push(notification)
        saveUsers(allUsers)
      }
    } catch (error) {
      console.error("Error sending clinical report:", error)
    }

    setSuccess(`Clinical report sent to ${patient.name} (${patient.email})`)
    setTimeout(() => setSuccess(""), 3000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading your dashboard...</div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Access denied. Please sign in as a doctor.</div>
      </div>
    )
  }

  const todayAppointments = appointments.filter(
    (apt) => apt.appointment_date === new Date().toISOString().split("T")[0],
  )
  const pendingAppointments = appointments.filter((apt) => apt.status === "scheduled")
  const acceptedAppointments = appointments.filter((apt) => apt.status === "accepted")

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header with logout */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="h-6 w-px bg-gray-700" />
            <div>
              <h1 className="text-xl font-bold text-white">Doctor Dashboard</h1>
              <p className="text-sm text-gray-400">Welcome, Dr. {doctor.name}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {success && (
          <Alert className="mb-6 bg-green-900/20 border-green-700/50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-200">{success}</AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, Dr. {doctor.name}</h1>
          <p className="text-gray-400">
            {doctor.specialization} • License: {doctor.medical_license}
          </p>
          {!doctor.is_verified && <Badge className="bg-yellow-600 text-white mt-2">Pending Verification</Badge>}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{todayAppointments.length}</p>
                  <p className="text-gray-400 text-sm">Today's Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-600 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{pendingAppointments.length}</p>
                  <p className="text-gray-400 text-sm">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{acceptedAppointments.length}</p>
                  <p className="text-gray-400 text-sm">Accepted Appointments</p>
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
                  <p className="text-2xl font-bold text-white">{patients.length}</p>
                  <p className="text-gray-400 text-sm">Total Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-blue-600">
              Appointments ({appointments.length})
            </TabsTrigger>
            <TabsTrigger value="patients" className="data-[state=active]:bg-green-600">
              Patient Reports ({patients.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Patient Appointments
                </CardTitle>
                <CardDescription>Manage appointment requests from patients</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">No Appointments Yet</h3>
                    <p className="text-gray-400">
                      Patients will be able to book appointments with you once they sign up
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => {
                      const patient = patients.find((p) => p.id === appointment.patient_id)
                      return (
                        <Card key={appointment.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarFallback className="bg-blue-600 text-white">
                                    {patient?.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("") || "P"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-white">{patient?.name || "Unknown Patient"}</h3>
                                  <p className="text-gray-400 text-sm">{appointment.reason}</p>
                                  <p className="text-gray-400 text-sm">
                                    {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                                    {appointment.appointment_time}
                                  </p>
                                  {patient?.riskLevel && (
                                    <p className={`text-sm ${getRiskColor(patient.riskLevel)}`}>
                                      Risk Level: {patient.riskLevel}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                                  {appointment.status}
                                </Badge>
                                {appointment.status === "scheduled" && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleAppointmentAction(appointment.id, "accept")}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAppointmentAction(appointment.id, "reject")}
                                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Decline
                                    </Button>
                                  </div>
                                )}
                                {appointment.status === "accepted" && (
                                  <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="text-sm font-medium">Accepted</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient List */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Patients ({patients.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patients.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">No Patients Yet</h3>
                      <p className="text-gray-400 text-sm">
                        Patients will appear here after they book appointments with you
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {patients.map((patient) => (
                        <Card
                          key={patient.id}
                          className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${
                            selectedPatient?.id === patient.id ? "ring-2 ring-blue-600" : "hover:bg-gray-750"
                          }`}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-purple-600 text-white text-sm">
                                  {patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium text-white text-sm">{patient.name}</h4>
                                <p className={`text-xs ${getRiskColor(patient.riskLevel || "N/A")}`}>
                                  {patient.riskLevel || "No Assessment"} Risk
                                </p>
                              </div>
                              {patient.emotionalGoals && patient.emotionalGoals.length > 0 && (
                                <Badge variant="secondary" className="bg-orange-600 text-white text-xs">
                                  {patient.emotionalGoals.length} Goals
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Patient Report */}
              <div className="lg:col-span-2">
                {selectedPatient ? (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Patient Progress - {selectedPatient.name}
                      </CardTitle>
                      <CardDescription>Comprehensive patient health overview and daily progress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Patient Information</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-300">Email: {selectedPatient.email}</p>
                            <p className="text-gray-300">Age: {selectedPatient.age || "N/A"} years</p>
                            {selectedPatient.lastAssessment && (
                              <p className="text-gray-300">
                                Last Assessment: {new Date(selectedPatient.lastAssessment).toLocaleDateString()}
                              </p>
                            )}
                            <p className={`${getRiskColor(selectedPatient.riskLevel || "N/A")}`}>
                              Risk Level: {selectedPatient.riskLevel || "No Assessment Completed"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-2">Activity Summary</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-300">Community Posts: {selectedPatient.communityActivity || 0}</p>
                            <p className="text-gray-300">
                              Diet Plan: {selectedPatient.dietPlanActive ? "Active" : "Inactive"}
                            </p>
                            <p className="text-gray-300">
                              Emotional Goals: {selectedPatient.emotionalGoals?.length || 0}
                            </p>
                            <p className="text-gray-300">Appointments: {selectedPatient.appointments?.length || 0}</p>
                          </div>
                        </div>
                      </div>

                      {/* Daily Progress Tracking */}
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Daily Progress & Routine
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Heart className="h-4 w-4 text-red-400" />
                                <span className="text-white text-sm font-medium">Emotional Goals</span>
                              </div>
                              <p className="text-2xl font-bold text-white">
                                {selectedPatient.emotionalGoals?.filter((g) => g.status === "active").length || 0}
                              </p>
                              <p className="text-gray-400 text-xs">Active goals</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className="h-4 w-4 text-blue-400" />
                                <span className="text-white text-sm font-medium">Diet Compliance</span>
                              </div>
                              <p className="text-2xl font-bold text-white">
                                {selectedPatient.dietPlanActive ? "85%" : "0%"}
                              </p>
                              <p className="text-gray-400 text-xs">Weekly average</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-green-400" />
                                <span className="text-white text-sm font-medium">Community Activity</span>
                              </div>
                              <p className="text-2xl font-bold text-white">{selectedPatient.communityActivity || 0}</p>
                              <p className="text-gray-400 text-xs">Posts this month</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Assessment Data */}
                      {selectedPatient.assessmentData ? (
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Assessment Results
                          </h4>
                          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-400 text-sm">Age</p>
                                <p className="text-white">{selectedPatient.assessmentData.age} years</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Risk Score</p>
                                <p className="text-white">{selectedPatient.assessmentData.risk_score}/20</p>
                              </div>
                            </div>
                            {selectedPatient.assessmentData.symptoms && (
                              <div>
                                <p className="text-gray-400 text-sm mb-1">Reported Symptoms</p>
                                <div className="flex flex-wrap gap-2">
                                  {(Array.isArray(selectedPatient.assessmentData.symptoms)
                                    ? selectedPatient.assessmentData.symptoms
                                    : []
                                  ).map((symptom: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="bg-red-600 text-white text-xs">
                                      {symptom}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedPatient.assessmentData.lifestyle && (
                              <div>
                                <p className="text-gray-400 text-sm">Lifestyle</p>
                                <p className="text-white text-sm">{selectedPatient.assessmentData.lifestyle}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <AlertCircle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                          <p className="text-white font-medium">No Assessment Completed</p>
                          <p className="text-gray-400 text-sm">Patient has not completed their health assessment yet</p>
                        </div>
                      )}

                      {/* Emotional Goals Progress */}
                      {selectedPatient.emotionalGoals && selectedPatient.emotionalGoals.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Emotional Goals Progress
                          </h4>
                          <div className="space-y-3">
                            {selectedPatient.emotionalGoals.slice(0, 3).map((goal) => (
                              <div key={goal.id} className="bg-gray-800 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white text-sm font-medium">{goal.goal}</span>
                                  <Badge
                                    className={`text-xs ${
                                      goal.status === "completed"
                                        ? "bg-green-600"
                                        : goal.status === "active"
                                          ? "bg-blue-600"
                                          : "bg-gray-600"
                                    }`}
                                  >
                                    {goal.status}
                                  </Badge>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${goal.progress}%` }}
                                  ></div>
                                </div>
                                <p className="text-gray-400 text-xs mt-1">{goal.progress}% complete</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clinical Report Actions */}
                      <div className="flex gap-3 mt-6">
                        <Button
                          onClick={() => {
                            setSelectedPatientForRx(selectedPatient)
                            setShowPrescriptionModal(true)
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Pill className="h-4 w-4 mr-2" />
                          Generate Prescription
                        </Button>
                        <Button
                          onClick={() => sendClinicalReport(selectedPatient)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Send Clinical Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">Select a Patient</h3>
                      <p className="text-gray-400">Choose a patient from the list to view their progress and reports</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Prescription Modal */}
        {showPrescriptionModal && selectedPatientForRx && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-white">Generate AI Prescription</CardTitle>
                <CardDescription>Creating personalized prescription for {selectedPatientForRx.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {generatingPrescription ? (
                    <div className="space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                      <p className="text-gray-300">AI is analyzing patient data...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        Generate an AI-powered prescription based on the patient's assessment and risk level.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => generateAIPrescription(selectedPatientForRx)}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          Generate Prescription
                        </Button>
                        <Button
                          onClick={() => {
                            setShowPrescriptionModal(false)
                            setSelectedPatientForRx(null)
                          }}
                          variant="outline"
                          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
