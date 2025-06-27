import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface User {
  id: string
  name: string
  email: string
  password: string
  user_type: "patient" | "doctor"
  specialization?: string
  medical_license?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  doctor_name: string
  doctor_specialization: string
  appointment_date: string
  appointment_time: string
  reason: string
  status: "scheduled" | "completed" | "cancelled" | "accepted"
  notes?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  related_id?: string
  created_at: string
}

export interface Assessment {
  id: string
  user_id: string
  age: number
  risk_score: number
  risk_level: string
  symptoms: any
  lifestyle: string
  assessment_data: any
  created_at: string
}

export interface EmotionalGoal {
  id: string
  user_id: string
  goal: string
  target_date: string
  progress: number
  status: "active" | "completed" | "paused"
  created_at: string
  updated_at: string
}

export interface Prescription {
  id: string
  patient_id: string
  doctor_id: string
  doctor_name: string
  doctor_specialization: string
  medications: any
  diagnosis: string
  instructions: string
  date_issued: string
  valid_until: string
  status: "active" | "expired" | "cancelled"
  notes?: string
  created_at: string
}
