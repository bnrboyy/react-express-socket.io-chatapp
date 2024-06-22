import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profile_pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dpcrhvlzq/image/upload/v1625520840/default_profile_img_2_u0y17l.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("users", userSchema);

export default User;
