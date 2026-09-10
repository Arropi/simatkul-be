import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
    const {authorization} = req.headers
    if(!authorization){
        const error = new Error("Token needed");
        error.statusCode = 403;
        throw error;
    }
    try {
        const secretToken = process.env.JWT_SECRET
        const token = authorization.split(' ')[1]
        const jwtDecode = jwt.verify(token, secretToken)
        req.user = jwtDecode
        next()
    } catch (error) {
        const err = new Error("Authorize failed");
        err.statusCode = 401;
        next(err)
    }
}