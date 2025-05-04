import { permit } from "@/lib/permit";
import mongoose, { Schema, type Document } from "mongoose";

export interface IRecord extends Document {
  patient_name: string;
  doctor_name: string;
  diagnosis: string;
  notes: string;
  files: Array<{
    name: string;
    url: string;
    contentType: string;
    size: number;
  }>;
  created_at: Date;
  updated_at: Date;
}

const FileSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false } 
);

const RecordSchema = new Schema<IRecord>(
  {
    patient_name: { type: String, required: true, index: true },
    doctor_name: { type: String, required: true, index: true },
    diagnosis: { type: String, required: true, index: true },
    notes: { type: String, required: true },
    files: [FileSchema],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Add text index for advanced search
RecordSchema.index({
  patient_name: "text",
  doctor_name: "text",
  diagnosis: "text",
  notes: "text",
});

RecordSchema.post(
  "save",
  async function (record: IRecord & { _id: mongoose.Types.ObjectId }) {
    try {
      try {
        await permit.api.resourceInstances.create({
          key: record._id.toString(),
          resource: "medical_record",
          attributes: {
            patient_name: record.patient_name,
            doctor_name: record.doctor_name,
          },
        });
        console.log("Registered record in Permit:", record._id.toString());
      } catch (permitError) {
        console.error("Error creating resource in Permit:", permitError);
      }
    } catch (error) {
      console.error("Failed to register record in Permit:", error);
    }
  }
);

export default mongoose.models.Record ||
  mongoose.model<IRecord>("Record", RecordSchema);
