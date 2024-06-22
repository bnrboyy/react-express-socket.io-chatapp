async function logout(req, res) {
  try {
    const cookieOptions = {
      http: true,
      secure: true,
      expires: new Date(0)
    };

    return res.cookie("token", "", cookieOptions).status(200).json({
      message: "Logout success",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
}

export { logout };
