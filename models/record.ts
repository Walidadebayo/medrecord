import mongoose, { Schema, type Document } from "mongoose"

export interface IRecord extends Document {
  patient_name: string
  doctor_name: string
  diagnosis: string
  notes: string
  files: Array<{
    name: string
    url: string
    contentType: string
    size: number
  }>
  created_at: Date
  updated_at: Date
}

const RecordSchema = new Schema<IRecord>(
  {
    patient_name: { type: String, required: true, index: true },
    doctor_name: { type: String, required: true, index: true },
    diagnosis: { type: String, required: true, index: true },
    notes: { type: String, required: true },
    files: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        contentType: { type: String, required: true },
        size: { type: Number, required: true },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
)

// Add text index for advanced search
RecordSchema.index({
  patient_name: "text",
  doctor_name: "text",
  diagnosis: "text",
  notes: "text",
})

export default mongoose.models.Record || mongoose.model<IRecord>("Record", RecordSchema)
