import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.middleware";
import { signUP } from "../controllers/signUP.controller";
import { signIN } from "../controllers/signIN.controller";
import { sendOTPCode } from "../controllers/sendOTPCode.controller";
import { verifyOTPCode } from "../controllers/verifyOTPCode.controller";
import { updateUser } from "../controllers/updateUser.controller";
const router = Router();

// Define routes

router.post("/sign-up", signUP);
router.post("/send-otp", verifyToken, sendOTPCode);
router.post("/verifyOTP", verifyToken, verifyOTPCode);
router.post("/updateuser", verifyToken, updateUser);
router.post("/login", signIN);

export default router;
