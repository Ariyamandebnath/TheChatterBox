import { Router } from "express";
import { registerUser } from "controllers/auth/user.controller";
import {
    verifyJWT,
    verifyPermission,
} from "../../middlewares/auth.middleware";


const router = Router();

router.route("/register").post(registerUser);
export default router;