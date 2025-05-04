export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "patient"
}

export interface FileAttachment {
  name: string
  url: string
  contentType: string
  size: number
}

export interface MedicalRecord {
  id: string
  patient_name: string
  doctor_name: string
  diagnosis: string
  notes: string
  files: FileAttachment[]
  isPermitted?: boolean
  created_at: string
  updated_at?: string
}

export interface Session {
  user: User
}

export interface SearchFilters {
  dateRange?: {
    start?: string
    end?: string
  }
  doctorName?: string
  patientName?: string
}
