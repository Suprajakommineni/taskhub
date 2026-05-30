import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type Usertype = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true , unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);

// ✅ Pre-save hook for password hashing
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// ✅ Index on email for fast lookups


const User = mongoose.model<Usertype>("User", userSchema);
export default User;
