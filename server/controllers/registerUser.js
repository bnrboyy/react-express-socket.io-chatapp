import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";

async function register(req, res) {
  try {
    const { name, email, password, profile_pic, profile_bg } = req.body;
    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      return res.status(400).json({
        status: false,
        message: "Email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const payload = {
      name,
      email,
      profile_pic,
      profile_bg,
      password: hashedPassword,
    };
    const user = await User.create(payload);

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
}

export { register };
