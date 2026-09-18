import { Router } from "express";
import { loginValidation } from "../validation/auth-validation.js";
import { login } from "../controllers/auth-controller.js";

const authRouter = Router();

// Route login dengan validasi Zod sebelum masuk ke controller
authRouter.post("/login", loginValidation, login);

export default authRouter;
