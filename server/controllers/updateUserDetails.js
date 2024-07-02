import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import User from "../models/UserModel.js";

async function updateUserDetails(req, res) {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);

    const { name, profile_pic } = req.body;

    const updateUser = await User.updateOne(
      { _id: user._id },
      { name, profile_pic }
    );

    const userInfomation = await User.findById(user._id).select("-password");

    return res.status(200).json({
      message: "User update success",
      status: true,
      data: userInfomation,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
}

export { updateUserDetails };
