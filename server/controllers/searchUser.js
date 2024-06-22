import User from "../models/UserModel.js";

async function searchUser(req, res) {
  try {
    const { search } = req.body;

    const query = new RegExp(search, "i", "g");
    const user = await User.find({
      $or: [
        {
          name: query,
        },
        {
          email: query,
        },
      ],
    }).select("-password");

    return res.status(200).json({
        status: true,
        data: user,
        message: "Get users from search success",
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
}

export { searchUser };
