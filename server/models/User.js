import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    profilePicture: {
      type: String,
      default: "",
    },
    addresses: [
      {
        title: { type: String, required: true },
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { 
          type: String, 
          required: [true, "State is required"],
          validate: {
            validator: function(v) {
              return v && v.trim() !== "Choose a state" && v.trim().toLowerCase() !== "select state";
            },
            message: "Please select a valid state"
          }
        },
        zipCode: { type: String, required: true },
        phone: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
