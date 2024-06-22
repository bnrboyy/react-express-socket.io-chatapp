import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";

async function useDetails(req, res) {
  try {
    const token = req.cookies.token || "";

    const user = await getUserDetailsFromToken(token);
    return res.status(200).json({
      message: "User details",
      status: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
}

export { useDetails };
