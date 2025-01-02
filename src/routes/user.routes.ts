import { Router } from "express";
import {
  signUP,
  sendOTPCode,
  verifyOTPCode,
  updateUser,
  signIn,
} from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken.middleware";
// import { verifyUser } from "../middleware/verifyUser.middleware";

const router = Router();

// Define routes
// router.post('/', registerUser);
// router.post('/updateuser', updateUser);       // POST /users
router.post("/sign-up", signUP);
router.post("/send-otp", verifyToken, sendOTPCode);
router.post("/verifyOTP", verifyToken, verifyOTPCode);
router.post("/updateuser", verifyToken, updateUser);
router.post("/login", signIn);

export default router;
