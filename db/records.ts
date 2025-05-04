import type { MedicalRecord } from "@/lib/types"

// Mock data for medical records
export const records: MedicalRecord[] = [
  {
    id: "rec_1",
    patient_name: "John Smith",
    doctor_name: "Dr. Sarah Johnson",
    diagnosis: "Hypertension",
    notes:
      "Patient presents with elevated blood pressure readings over the past 3 months. Prescribed lisinopril 10mg daily. Follow-up in 4 weeks.",
    created_at: "2023-11-15T09:30:00Z",
    files:[],
  },
  {
    id: "rec_2",
    patient_name: "Emily Davis",
    doctor_name: "Dr. Sarah Johnson",
    diagnosis: "Type 2 Diabetes",
    notes:
      "Initial diagnosis. HbA1c: 7.8%. Started on metformin 500mg twice daily. Dietary and exercise counseling provided. Schedule follow-up in 3 months.",
    created_at: "2023-12-03T14:15:00Z",
    files:[],
  },
  {
    id: "rec_3",
    patient_name: "Michael Chen",
    doctor_name: "Dr. Robert Williams",
    diagnosis: "Seasonal Allergies",
    notes:
      "Patient experiencing nasal congestion, sneezing, and itchy eyes. Prescribed loratadine 10mg daily as needed. Recommended avoiding known allergens.",
    created_at: "2024-01-20T11:45:00Z",
    files:[],
  },
  {
    id: "rec_4",
    patient_name: "Sophia Rodriguez",
    doctor_name: "Dr. Robert Williams",
    diagnosis: "Migraine",
    notes:
      "Recurring migraines with aura, 2-3 times per month. Prescribed sumatriptan for acute attacks and discussed preventive options. Keeping headache diary.",
    created_at: "2024-02-08T16:20:00Z",
    files:[],
  },
  {
    id: "rec_5",
    patient_name: "James Wilson",
    doctor_name: "Dr. Sarah Johnson",
    diagnosis: "Lower Back Pain",
    notes:
      "Chronic lower back pain exacerbated by prolonged sitting. Physical therapy referral made. Prescribed naproxen for pain management. Discussed ergonomic improvements for workspace.",
    created_at: "2024-03-12T10:00:00Z",
    files:[],
  },
  {
    id: "rec_6",
    patient_name: "Olivia Taylor",
    doctor_name: "Dr. Robert Williams",
    diagnosis: "Anxiety Disorder",
    notes:
      "Patient reporting increased anxiety and occasional panic attacks. Started on sertraline 50mg daily. Referred to cognitive behavioral therapy. Follow-up in 4 weeks to assess medication response.",
    created_at: "2024-04-05T13:30:00Z",
    files:[],
  },
]
