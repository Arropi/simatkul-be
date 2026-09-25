import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export function authMiddleware(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        const error = new Error("Token needed");
        error.statusCode = 403;
        return next(error);
    }
    try {
        const secretToken = JWT_SECRET || process.env.JWT_SECRET;
        const token = authorization.split(" ")[1];
        const jwtDecode = jwt.verify(token, secretToken);
        req.user = jwtDecode;
    } catch (error) {
        const err = new Error("Authorize failed");
        err.statusCode = 401;
        return next(err);
    }

    if (req.user.role !== "admin") {
        const error = new Error("Forbidden, you dont have access");
        error.statusCode = 403;
        return next(error);
    }
    next();
}

export default function roleMiddleware(req, res, next) {
    try {
        const { role } = req.user || {};
        if (role !== "admin") {
            const error = new Error("Forbidden, you dont have access");
            error.statusCode = 403;
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
}