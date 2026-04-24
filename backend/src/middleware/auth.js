import HttpError from "../models/httpError.js"
import jwt from 'jsonwebtoken'

const auth = (req, _, next) => {
    if (req.method === 'OPTIONS') return next() // CORS preflight request
    let token
    try {
        token = req.headers.authorization.split(" ")[1] // { Authorization: "Bearer <TOKEN>"}
        if (!token) return next(new HttpError("authentication failed", 403))
        const tokenDecoded = jwt.verify(token, process.env.PRIVATE_KEY)
        req.userData = { userId: tokenDecoded.userId } // "logged" user
        next()
    } catch (error) {
        return next(new HttpError("authentication failed", 403))
    }
}

export default auth