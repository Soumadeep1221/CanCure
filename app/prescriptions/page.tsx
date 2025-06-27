"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Pill, Calendar, Clock, FileText } from "lucide-react"
import Navigation from "@/components/navigation"

interface Prescription {
  id: string
  doctorName: string
  doctorSpecialization: string
  patientName: string
  medications: Medication[]
  diagnosis: string
  instructions: string
  dateIssued: string
  validUntil: string
  status: "active" | "completed" | "expired"
  notes?: string
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface User {
  id: string
  name: string
  prescriptions: Prescription[]
  userType: string
}

export default function Prescriptions() {
  const [user, setUser] = useState<User | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
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
    setPrescriptions(parsedUser.prescriptions || [])
    setIsLoading(false)
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "completed":
        return "bg-blue-600"
      case "expired":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading prescriptions...</div>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Pill className="h-8 w-8" />
              My Prescriptions
            </h1>
            <p className="text-gray-400">View and manage your medical prescriptions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <Pill className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {prescriptions.filter((p) => p.status === "active").length}
                    </p>
                    <p className="text-gray-400 text-sm">Active Prescriptions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{prescriptions.length}</p>
                    <p className="text-gray-400 text-sm">Total Prescriptions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {prescriptions.reduce((total, p) => total + p.medications.length, 0)}
                    </p>
                    <p className="text-gray-400 text-sm">Total Medications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prescriptions List */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Prescriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {prescriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <Pill className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">No Prescriptions Yet</h3>
                      <p className="text-gray-400 text-sm">Your prescriptions from doctors will appear here</p>
                    </div>
                  ) : (
                    prescriptions.map((prescription) => (
                      <Card
                        key={prescription.id}
                        className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:bg-gray-750 ${
                          selectedPrescription?.id === prescription.id ? "ring-2 ring-blue-600" : ""
                        }`}
                        onClick={() => setSelectedPrescription(prescription)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-white text-sm">{prescription.doctorName}</h4>
                              <p className="text-gray-400 text-xs">{prescription.doctorSpecialization}</p>
                            </div>
                            <Badge className={`${getStatusColor(prescription.status)} text-white text-xs`}>
                              {prescription.status}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-xs mb-2">{prescription.diagnosis}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(prescription.dateIssued).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Prescription Details */}
            <div className="lg:col-span-2">
              {selectedPrescription ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="border-b border-gray-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Prescription Details
                        </CardTitle>
                        <p className="text-gray-400 text-sm mt-1">Prescription ID: {selectedPrescription.id}</p>
                      </div>
                      <Badge className={`${getStatusColor(selectedPrescription.status)} text-white`}>
                        {selectedPrescription.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-green-600 text-white">
                          {selectedPrescription.doctorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{selectedPrescription.doctorName}</h3>
                        <p className="text-gray-400 text-sm">{selectedPrescription.doctorSpecialization}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Issued: {new Date(selectedPrescription.dateIssued).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Valid until: {new Date(selectedPrescription.validUntil).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Diagnosis</h4>
                      <p className="text-gray-300 bg-gray-800 p-3 rounded-lg">{selectedPrescription.diagnosis}</p>
                    </div>

                    {/* Medications */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Prescribed Medications</h4>
                      <div className="space-y-3">
                        {selectedPrescription.medications.map((medication, index) => (
                          <div key={index} className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-white">{medication.name}</h5>
                              <Badge variant="outline" className="bg-blue-600 text-white border-blue-600 text-xs">
                                {medication.dosage}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Frequency:</span>
                                <span className="text-white ml-2">{medication.frequency}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Duration:</span>
                                <span className="text-white ml-2">{medication.duration}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-gray-400 text-sm">Instructions:</span>
                              <p className="text-gray-300 text-sm mt-1">{medication.instructions}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* General Instructions */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">General Instructions</h4>
                      <p className="text-gray-300 bg-gray-800 p-3 rounded-lg">{selectedPrescription.instructions}</p>
                    </div>

                    {/* Doctor's Notes */}
                    {selectedPrescription.notes && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Doctor's Notes</h4>
                        <p className="text-gray-300 bg-gray-800 p-3 rounded-lg italic">{selectedPrescription.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-8 text-center">
                    <Pill className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Select a Prescription</h3>
                    <p className="text-gray-400">Choose a prescription from the list to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
