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

// Local storage helpers
function getLocal<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setLocal<T>(key: string, value: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// CRUD for each model
export const userStorageKey = 'users';
export function getUsers(): User[] {
  return getLocal<User>(userStorageKey);
}
export function saveUsers(users: User[]): void {
  setLocal<User>(userStorageKey, users);
}

export const appointmentStorageKey = 'appointments';
export function getAppointments(): Appointment[] {
  return getLocal<Appointment>(appointmentStorageKey);
}
export function saveAppointments(appointments: Appointment[]): void {
  setLocal<Appointment>(appointmentStorageKey, appointments);
}

export const notificationStorageKey = 'notifications';
export function getNotifications(): Notification[] {
  return getLocal<Notification>(notificationStorageKey);
}
export function saveNotifications(notifications: Notification[]): void {
  setLocal<Notification>(notificationStorageKey, notifications);
}

export const assessmentStorageKey = 'assessments';
export function getAssessments(): Assessment[] {
  return getLocal<Assessment>(assessmentStorageKey);
}
export function saveAssessments(assessments: Assessment[]): void {
  setLocal<Assessment>(assessmentStorageKey, assessments);
}

export const emotionalGoalStorageKey = 'emotionalGoals';
export function getEmotionalGoals(): EmotionalGoal[] {
  return getLocal<EmotionalGoal>(emotionalGoalStorageKey);
}
export function saveEmotionalGoals(goals: EmotionalGoal[]): void {
  setLocal<EmotionalGoal>(emotionalGoalStorageKey, goals);
}

export const prescriptionStorageKey = 'prescriptions';
export function getPrescriptions(): Prescription[] {
  return getLocal<Prescription>(prescriptionStorageKey);
}
export function savePrescriptions(prescriptions: Prescription[]): void {
  setLocal<Prescription>(prescriptionStorageKey, prescriptions);
}

// Helper functions for common queries
export function getAppointmentsByDoctor(doctorId: string): Appointment[] {
  return getAppointments().filter(apt => apt.doctor_id === doctorId);
}

export function getPatientsByDoctor(doctorId: string): User[] {
  const appointments = getAppointmentsByDoctor(doctorId);
  const patientIds = [...new Set(appointments.map(apt => apt.patient_id))];
  return getUsers().filter(user => user.user_type === "patient" && patientIds.includes(user.id));
}

export function getAssessmentsByUser(userId: string): Assessment[] {
  return getAssessments().filter(assessment => assessment.user_id === userId);
}

export function getEmotionalGoalsByUser(userId: string): EmotionalGoal[] {
  return getEmotionalGoals().filter(goal => goal.user_id === userId);
}

export function getNotificationsByUser(userId: string): Notification[] {
  return getNotifications().filter(notification => notification.user_id === userId);
}

// Initialize sample data for testing
export function initializeSampleData() {
  if (typeof window === 'undefined') return;
  
  // Check if data already exists
  if (getUsers().length > 0) {
    console.log("Sample data already exists, skipping initialization")
    return;
  }
  
  console.log("Initializing sample data...")
  
  const sampleUsers: User[] = [
    {
      id: "1",
      name: "John Patient",
      email: "patient@test.com",
      password: "password123",
      user_type: "patient",
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2", 
      name: "Dr. Sarah Smith",
      email: "doctor@test.com",
      password: "password123",
      user_type: "doctor",
      specialization: "Oncology",
      medical_license: "MD12345",
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
  
  saveUsers(sampleUsers);
  console.log("Sample data initialized:", sampleUsers)
}

// Update user data and ensure persistence
export function updateUserData(userId: string, updates: Partial<User>) {
  const allUsers = getUsers()
  const userIndex = allUsers.findIndex(user => user.id === userId)
  
  if (userIndex !== -1) {
    allUsers[userIndex] = { ...allUsers[userIndex], ...updates }
    saveUsers(allUsers)
    
    // Also update currentUser if it's the same user
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const parsedCurrentUser = JSON.parse(currentUser)
      if (parsedCurrentUser.id === userId) {
        localStorage.setItem("currentUser", JSON.stringify(allUsers[userIndex]))
      }
    }
    
    return allUsers[userIndex]
  }
  
  return null
}

// Get user by ID with latest data
export function getUserById(userId: string): User | null {
  const allUsers = getUsers()
  return allUsers.find(user => user.id === userId) || null
} 