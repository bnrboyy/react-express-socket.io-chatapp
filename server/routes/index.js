import { Router } from "express";
import { register } from "../controllers/registerUser.js";
import { checkEmail } from "../controllers/checkEmail.js";
import { checkPassword } from "../controllers/checkPassword.js";
import { useDetails } from "../controllers/userDetails.js";
import { logout } from "../controllers/logout.js";
import { updateUserDetails } from "../controllers/updateUserDetails.js";
import { searchUser } from "../controllers/searchUser.js";

const router = Router();

router.post("/register", register);
//check user email
router.post("/email", checkEmail);
//check user password
router.post("/password", checkPassword);
//login user details
router.get("/user-details", useDetails);
//logout
router.get("/logout", logout);
//update user details
router.post("/user-update", updateUserDetails);
//logout
router.get("/logout", logout);
//search user
router.post("/search-user", searchUser);

export const userRouter = router;
