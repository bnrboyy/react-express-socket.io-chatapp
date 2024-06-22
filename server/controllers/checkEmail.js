import User from "../models/UserModel.js";

async function checkEmail(req, res) {
  try {
    const { email } = req.body;
    const checkEmail = await User.findOne({ email }).select("-password"); // select ทั้งหมดยกเว้น password

    if (!checkEmail) {
      return res.status(404).json({
        message: "User does not exist",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Email is verify",
      status: true,
      data: checkEmail,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
}

export { checkEmail };
