import { isValidObjectId } from "mongoose"
import HttpError from "../models/httpError.js"
import User from "../models/user.js"

import jwt from "jsonwebtoken"
// import bcrypt from "bcryptjs"

export const getUserById = async (req, res, next) => {
    const id = req.params.uid
    if (!isValidObjectId(id)) return next(new HttpError("invalid id", 400))
    let user
    try {
        user = await User.findById(id, "-password") // dont want to display passwords
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!user)
        return next(new HttpError("no such user", 404))
    res.json({ user })
}

export const signup = async (req, res, next) => {
    const { username, password } = req.body
    let user = new User({ username, password, lists: [] })
    try {
        await user.save()
    } catch (error) {
        if (error.message.includes("duplicate key error"))
            return next(new HttpError("user already exists", 422))
        return next(new HttpError(error.message, 500))
    }

    // TODO : adding password encryption == bcrypt is installed

    let token
    try {
        token = jwt.sign(
            { userId: user.id },
            process.env.PRIVATE_KEY,
            { expiresIn: "1h" }
        )
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.status(201).json({ userId: user.id, token })
}

export const login = async (req, res, next) => {
    const { username, password } = req.body

    let user
    try {
        user = await User.findOne({ username })
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
    if (!user) return next(new HttpError("no user associated with given username", 404))

    // TODO : if added encryption, must decrypt here
    if (user.password != password) return next(new HttpError("invalid credentials", 403))
    // 401: non-authorized  403: no permission (non-authenticated)

    let token
    try {
        token = jwt.sign(
            { userId: user.id },
            process.env.PRIVATE_KEY,
            { expiresIn: "1h" }
        )
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

    res.json({ userId: user.id, token })
}
