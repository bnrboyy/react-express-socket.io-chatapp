import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id).select("-password");

  return user;
};

export default getUserDetailsFromToken;
