import { loginService } from "../services/auth-service.js";

/**
 * Controller untuk menangani request login user
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function login(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const error = new Error("Bad Request: No data provided");
      error.statusCode = 400;
      throw error;
    }

    const { username, password } = req.body;

    // Validasi input lanjutan di controller
    if (typeof username !== "string" || typeof password !== "string") {
      const error = new Error("Username and password must be strings");
      error.statusCode = 400;
      throw error;
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      const error = new Error("Username and password cannot be empty or contain only whitespace");
      error.statusCode = 400;
      throw error;
    }

    const { status = 200, ...result } = await loginService(trimmedUsername, trimmedPassword);

    res.status(status).json({
      message: "Login successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}