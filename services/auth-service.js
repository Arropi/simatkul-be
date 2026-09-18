import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import { loginUser } from "../repositories/auth-repository.js";

/**
 * Service untuk memproses autentikasi user / login
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{ status: number, token: string, user: { username: string, role: string } }>}
 */
export async function loginService(username, password) {
  const user = await loginUser(username, password);

  if (!user) {
    const error = new Error("Invalid username or password");
    error.statusCode = 401;
    throw error;
  }

  const secretKey = JWT_SECRET
  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
    },
    secretKey,
    {
      expiresIn: JWT_EXPIRES_IN || "1d",
    }
  );

  return {
    status: 200,
    token,
    user: {
      username: user.username,
      role: user.role,
    },
  };
}
