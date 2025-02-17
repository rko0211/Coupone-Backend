import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.middleware";
import { signUP } from "../controllers/signUP.controller";
import { signIN } from "../controllers/signIN.controller";
import { sendOTPCode } from "../controllers/sendOTPCode.controller";
import { verifyOTPCode } from "../controllers/verifyOTPCode.controller";
import { updateUser } from "../controllers/updateUser.controller";
import { upload } from "../middleware/multer.middleware";
import uploadCartItems from "../controllers/uploadCartIems.controller";
import sendCartItems from "../controllers/sendCartItems.controller";
import uploadProducts from "../controllers/uploadProducts.controller";
import sendFilterProducts from "../controllers/sendFilterProducts.controller";
const router = Router();

// Define User routes

router.post("/sign-up", signUP);
router.post("/send-otp", verifyToken, sendOTPCode);
router.post("/verifyOTP", verifyToken, verifyOTPCode);
router.post("/updateuser", verifyToken, updateUser);
router.post("/login", signIN);

router.get("/delivery", sendCartItems);
router.get("/filterproducts", sendFilterProducts);

// Admin Routes
router.post(
  "/uploadCartProduct",
  upload.fields([
    { name: "companyImage", maxCount: 1 },
    { name: "discountImage", maxCount: 1 },
  ]),
  uploadCartItems
);

router.post(
  "/uploadFilterProduct",
  upload.single("companyImage"),
  uploadProducts
);

export default router;
