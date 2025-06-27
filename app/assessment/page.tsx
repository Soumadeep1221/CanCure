"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, AlertCircle, CheckCircle } from "lucide-react"
import Navigation from "@/components/navigation"

interface AssessmentData {
  age: string
  gender: string
  familyHistory: boolean
  smokingHistory: string
  alcoholConsumption: string
  physicalActivity: string
  diet: string
  symptoms: string[]
  medicalHistory: string[]
  currentStep: number
}

const symptoms = [
  "Persistent cough",
  "Unexplained weight loss",
  "Fatigue",
  "Changes in bowel habits",
  "Unusual bleeding",
  "Persistent pain",
  "Changes in skin moles",
  "Difficulty swallowing",
]

const medicalConditions = [
  "Diabetes",
  "High blood pressure",
  "Heart disease",
  "Previous cancer",
  "Autoimmune disorders",
  "Chronic infections",
]

export default function Assessment() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    age: "",
    gender: "",
    familyHistory: false,
    smokingHistory: "",
    alcoholConsumption: "",
    physicalActivity: "",
    diet: "",
    symptoms: [],
    medicalHistory: [],
    currentStep: 1,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/")
    }
  }, [router])

  const totalSteps = 4
  const progress = (assessmentData.currentStep / totalSteps) * 100

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setAssessmentData((prev) => ({
      ...prev,
      symptoms: checked ? [...prev.symptoms, symptom] : prev.symptoms.filter((s) => s !== symptom),
    }))
  }

  const handleMedicalHistoryChange = (condition: string, checked: boolean) => {
    setAssessmentData((prev) => ({
      ...prev,
      medicalHistory: checked
        ? [...prev.medicalHistory, condition]
        : prev.medicalHistory.filter((c) => c !== condition),
    }))
  }

  const calculateRisk = () => {
    let riskScore = 0

    // Age factor
    const age = Number.parseInt(assessmentData.age)
    if (age > 65) riskScore += 3
    else if (age > 50) riskScore += 2
    else if (age > 35) riskScore += 1

    // Family history
    if (assessmentData.familyHistory) riskScore += 2

    // Smoking
    if (assessmentData.smokingHistory === "current") riskScore += 3
    else if (assessmentData.smokingHistory === "former") riskScore += 2

    // Alcohol
    if (assessmentData.alcoholConsumption === "heavy") riskScore += 2
    else if (assessmentData.alcoholConsumption === "moderate") riskScore += 1

    // Physical activity
    if (assessmentData.physicalActivity === "sedentary") riskScore += 2
    else if (assessmentData.physicalActivity === "light") riskScore += 1

    // Diet
    if (assessmentData.diet === "poor") riskScore += 2
    else if (assessmentData.diet === "average") riskScore += 1

    // Symptoms
    riskScore += assessmentData.symptoms.length

    // Medical history
    riskScore += assessmentData.medicalHistory.length

    // Determine risk level
    let riskLevel = "Low"
    let riskPercentage = 15

    if (riskScore >= 12) {
      riskLevel = "High"
      riskPercentage = 75
    } else if (riskScore >= 8) {
      riskLevel = "Moderate"
      riskPercentage = 45
    } else if (riskScore >= 4) {
      riskLevel = "Low-Moderate"
      riskPercentage = 25
    }

    return { riskLevel, riskPercentage, riskScore }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const riskAssessment = calculateRisk()

    // Update user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const user = JSON.parse(userData)
      user.assessmentCompleted = true
      user.riskLevel = riskAssessment.riskLevel
      user.lastAssessment = new Date().toISOString()
      localStorage.setItem("currentUser", JSON.stringify(user))
    }

    setResults(riskAssessment)
    setIsSubmitting(false)
  }

  const nextStep = () => {
    setAssessmentData((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }))
  }

  const prevStep = () => {
    setAssessmentData((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }))
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-gray-900 border-gray-800 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-600 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Assessment Complete</CardTitle>
              <CardDescription>Your cancer risk assessment results are ready</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{results.riskPercentage}%</div>
                <div
                  className={`text-lg font-semibold mb-4 ${
                    results.riskLevel === "High"
                      ? "text-red-400"
                      : results.riskLevel === "Moderate"
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  {results.riskLevel} Risk
                </div>
                <Progress value={results.riskPercentage} className="h-3" />
              </div>

              <Alert className="bg-gray-800 border-gray-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-gray-300">
                  This assessment is for informational purposes only and should not replace professional medical advice.
                  Please consult with a healthcare provider for proper diagnosis and treatment.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-white font-semibold">Recommendations:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Schedule regular check-ups with your healthcare provider</li>
                  <li>• Maintain a healthy diet rich in fruits and vegetables</li>
                  <li>• Exercise regularly and maintain a healthy weight</li>
                  <li>• Avoid tobacco and limit alcohol consumption</li>
                  <li>• Stay up to date with recommended cancer screenings</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => router.push("/dashboard")} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Return to Dashboard
                </Button>
                <Button
                  onClick={() => router.push("/diet-plan")}
                  variant="outline"
                  className="flex-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                >
                  Get Diet Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Cancer Risk Assessment
            </h1>
            <p className="text-gray-400">
              Complete this comprehensive assessment to understand your cancer risk factors
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">
                Step {assessmentData.currentStep} of {totalSteps}
              </span>
              <span className="text-white">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              {assessmentData.currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Basic Information</h2>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={assessmentData.age}
                      onChange={(e) => setAssessmentData((prev) => ({ ...prev, age: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Gender</Label>
                    <RadioGroup
                      value={assessmentData.gender}
                      onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, gender: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="text-white">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="text-white">
                          Female
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="text-white">
                          Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="familyHistory"
                      checked={assessmentData.familyHistory}
                      onCheckedChange={(checked) =>
                        setAssessmentData((prev) => ({ ...prev, familyHistory: checked as boolean }))
                      }
                    />
                    <Label htmlFor="familyHistory" className="text-white">
                      Family history of cancer
                    </Label>
                  </div>
                </div>
              )}

              {assessmentData.currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Lifestyle Factors</h2>

                  <div className="space-y-3">
                    <Label className="text-white">Smoking History</Label>
                    <RadioGroup
                      value={assessmentData.smokingHistory}
                      onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, smokingHistory: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="never" id="never-smoked" />
                        <Label htmlFor="never-smoked" className="text-white">
                          Never smoked
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="former" id="former-smoker" />
                        <Label htmlFor="former-smoker" className="text-white">
                          Former smoker
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="current" id="current-smoker" />
                        <Label htmlFor="current-smoker" className="text-white">
                          Current smoker
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Alcohol Consumption</Label>
                    <RadioGroup
                      value={assessmentData.alcoholConsumption}
                      onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, alcoholConsumption: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="no-alcohol" />
                        <Label htmlFor="no-alcohol" className="text-white">
                          None
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light-alcohol" />
                        <Label htmlFor="light-alcohol" className="text-white">
                          Light (1-2 drinks/week)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate-alcohol" />
                        <Label htmlFor="moderate-alcohol" className="text-white">
                          Moderate (3-7 drinks/week)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="heavy" id="heavy-alcohol" />
                        <Label htmlFor="heavy-alcohol" className="text-white">
                          Heavy (8+ drinks/week)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Physical Activity Level</Label>
                    <RadioGroup
                      value={assessmentData.physicalActivity}
                      onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, physicalActivity: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sedentary" id="sedentary" />
                        <Label htmlFor="sedentary" className="text-white">
                          Sedentary
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light-activity" />
                        <Label htmlFor="light-activity" className="text-white">
                          Light activity
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate-activity" />
                        <Label htmlFor="moderate-activity" className="text-white">
                          Moderate activity
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="very-active" />
                        <Label htmlFor="very-active" className="text-white">
                          Very active
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {assessmentData.currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Current Symptoms</h2>
                  <p className="text-gray-400">Select any symptoms you are currently experiencing:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {symptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={assessmentData.symptoms.includes(symptom)}
                          onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                        />
                        <Label htmlFor={symptom} className="text-white text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Diet Quality</Label>
                    <RadioGroup
                      value={assessmentData.diet}
                      onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, diet: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id="excellent-diet" />
                        <Label htmlFor="excellent-diet" className="text-white">
                          Excellent (lots of fruits/vegetables)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="good-diet" />
                        <Label htmlFor="good-diet" className="text-white">
                          Good (balanced diet)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="average" id="average-diet" />
                        <Label htmlFor="average-diet" className="text-white">
                          Average
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id="poor-diet" />
                        <Label htmlFor="poor-diet" className="text-white">
                          Poor (processed foods, low fruits/vegetables)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {assessmentData.currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Medical History</h2>
                  <p className="text-gray-400">Select any conditions you have or have had:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicalConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={assessmentData.medicalHistory.includes(condition)}
                          onCheckedChange={(checked) => handleMedicalHistoryChange(condition, checked as boolean)}
                        />
                        <Label htmlFor={condition} className="text-white text-sm">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <Alert className="bg-gray-800 border-gray-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-gray-300">
                      This assessment will analyze your responses using AI to provide a personalized risk evaluation.
                      Results are for informational purposes only.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  disabled={assessmentData.currentStep === 1}
                  variant="outline"
                  className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                >
                  Previous
                </Button>

                {assessmentData.currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    disabled={
                      (assessmentData.currentStep === 1 && (!assessmentData.age || !assessmentData.gender)) ||
                      (assessmentData.currentStep === 2 &&
                        (!assessmentData.smokingHistory ||
                          !assessmentData.alcoholConsumption ||
                          !assessmentData.physicalActivity)) ||
                      (assessmentData.currentStep === 3 && !assessmentData.diet)
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                    {isSubmitting ? "Analyzing..." : "Complete Assessment"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
