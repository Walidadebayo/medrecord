import mongoose, { Schema, type Document } from "mongoose";
import bcrypt from "bcryptjs";
import { createPermitUser } from "@/lib/permit";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "patient";
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      required: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function(next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    const user = {
      id: this._id.toString(),
      username: this.username,
      name: this.name,
      email: this.email,
      role: this.role,
    };
    console.log("Registering user in Permit:", user);
    
    await createPermitUser(user);

    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
