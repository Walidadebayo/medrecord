import type { MedicalRecord } from "@/lib/types"
import RecordModel, { type IRecord } from "@/models/record"
import dbConnect from "@/lib/db"

// Convert MongoDB document to MedicalRecord type
function convertToMedicalRecord(record: IRecord): MedicalRecord {
  return {
    id: (record._id as { toString(): string }).toString(),
    patient_name: record.patient_name,
    doctor_name: record.doctor_name,
    diagnosis: record.diagnosis,
    notes: record.notes,
    files: record.files || [],
    created_at: record.created_at.toISOString(),
    updated_at: record.updated_at.toISOString(),
  }
}

// Get all records
export async function getAllRecords(): Promise<MedicalRecord[]> {
  await dbConnect()

  const records = await RecordModel.find().sort({ created_at: -1 })

  return records.map(convertToMedicalRecord)
}

// Get records filtered by role
export async function getRecordsByRole(role: string, userName: string): Promise<MedicalRecord[]> {
  await dbConnect()

  let query = {}

  switch (role) {
    case "admin":
      // Admin sees all records
      break
    case "doctor":
      // Doctor sees records where they are the assigned doctor
      query = { doctor_name: userName }
      break
    case "patient":
      // Patient sees records where they are the patient
      query = { patient_name: userName }
      break
    default:
      return []
  }

  const records = await RecordModel.find(query).sort({ created_at: -1 })

  return records.map(convertToMedicalRecord)
}

// Advanced search with filters
export async function searchRecords(
  searchTerm: string,
  filters: {
    role: string
    userName: string
    dateRange?: { start?: string; end?: string }
    doctorName?: string
    patientName?: string
  },
): Promise<MedicalRecord[]> {
  await dbConnect()

  // Base query based on role
  const query: any = {}

  switch (filters.role) {
    case "admin":
      // Admin sees all records
      break
    case "doctor":
      // Doctor sees records where they are the assigned doctor
      query.doctor_name = filters.userName
      break
    case "patient":
      // Patient sees records where they are the patient
      query.patient_name = filters.userName
      break
    default:
      return []
  }

  // Add text search if provided
  if (searchTerm) {
    query.$text = { $search: searchTerm }
  }

  // Add date range filter if provided
  if (filters.dateRange) {
    query.created_at = {}

    if (filters.dateRange.start) {
      query.created_at.$gte = new Date(filters.dateRange.start)
    }

    if (filters.dateRange.end) {
      query.created_at.$lte = new Date(filters.dateRange.end)
    }
  }

  // Add doctor filter if provided (for admin only)
  if (filters.role === "admin" && filters.doctorName) {
    query.doctor_name = filters.doctorName
  }

  // Add patient filter if provided (for admin and doctor)
  if (filters.role !== "patient" && filters.patientName) {
    query.patient_name = filters.patientName
  }

  // Execute query with sorting
  const records = await RecordModel.find(query).sort({ created_at: -1 })

  return records.map(convertToMedicalRecord)
}

// Get a single record by ID
export async function getRecordById(id: string): Promise<MedicalRecord | null> {
  await dbConnect()

  try {
    const record = await RecordModel.findById(id)

    if (!record) {
      return null
    }

    return convertToMedicalRecord(record)
  } catch (error) {
    console.error("Error fetching record:", error)
    return null
  }
}

// Create a new record
export async function createRecord(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
  await dbConnect()

  const newRecord = await RecordModel.create({
    patient_name: data.patient_name,
    doctor_name: data.doctor_name,
    diagnosis: data.diagnosis,
    notes: data.notes,
    files: data.files || [],
  })

  return convertToMedicalRecord(newRecord)
}

// Update an existing record
export async function updateRecord(id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord | null> {
  await dbConnect()

  try {
    const updatedRecord = await RecordModel.findByIdAndUpdate(
      id,
      {
        $set: {
          patient_name: data.patient_name,
          doctor_name: data.doctor_name,
          diagnosis: data.diagnosis,
          notes: data.notes,
          ...(data.files && { files: data.files }),
        },
      },
      { new: true },
    )

    if (!updatedRecord) {
      return null
    }

    return convertToMedicalRecord(updatedRecord)
  } catch (error) {
    console.error("Error updating record:", error)
    return null
  }
}

// Delete a record
export async function deleteRecord(id: string): Promise<boolean> {
  await dbConnect()

  try {
    const result = await RecordModel.findByIdAndDelete(id)
    return !!result
  } catch (error) {
    console.error("Error deleting record:", error)
    return false
  }
}

// Initialize database with sample records if empty
export async function initializeRecords() {
  await dbConnect()

  const count = await RecordModel.countDocuments()

  if (count === 0) {
    // Create sample records
    await RecordModel.create([
      {
        patient_name: "John Smith",
        doctor_name: "Dr. Sarah Johnson",
        diagnosis: "Hypertension",
        notes:
          "Patient presents with elevated blood pressure readings over the past 3 months. Prescribed lisinopril 10mg daily. Follow-up in 4 weeks.",
        files: [],
      },
      {
        patient_name: "Emily Davis",
        doctor_name: "Dr. Sarah Johnson",
        diagnosis: "Type 2 Diabetes",
        notes:
          "Initial diagnosis. HbA1c: 7.8%. Started on metformin 500mg twice daily. Dietary and exercise counseling provided. Schedule follow-up in 3 months.",
        files: [],
      },
      {
        patient_name: "Michael Chen",
        doctor_name: "Dr. Robert Williams",
        diagnosis: "Seasonal Allergies",
        notes:
          "Patient experiencing nasal congestion, sneezing, and itchy eyes. Prescribed loratadine 10mg daily as needed. Recommended avoiding known allergens.",
        files: [],
      },
      {
        patient_name: "Sophia Rodriguez",
        doctor_name: "Dr. Robert Williams",
        diagnosis: "Migraine",
        notes:
          "Recurring migraines with aura, 2-3 times per month. Prescribed sumatriptan for acute attacks and discussed preventive options. Keeping headache diary.",
        files: [],
      },
      {
        patient_name: "James Wilson",
        doctor_name: "Dr. Sarah Johnson",
        diagnosis: "Lower Back Pain",
        notes:
          "Chronic lower back pain exacerbated by prolonged sitting. Physical therapy referral made. Prescribed naproxen for pain management. Discussed ergonomic improvements for workspace.",
        files: [],
      },
      {
        patient_name: "Olivia Taylor",
        doctor_name: "Dr. Robert Williams",
        diagnosis: "Anxiety Disorder",
        notes:
          "Patient reporting increased anxiety and occasional panic attacks. Started on sertraline 50mg daily. Referred to cognitive behavioral therapy. Follow-up in 4 weeks to assess medication response.",
        files: [],
      },
    ])

    console.log("Sample records created")
  }
}
